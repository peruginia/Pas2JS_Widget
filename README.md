# Web Component Library (WCL)

RAD widgetset for Lazarus/pas2js — compile Object Pascal to JavaScript with LCL-compatible components.

### Live Demo
🔗 [**peruginia.github.io/Pas2JS_Widget/project1.html**](https://peruginia.github.io/Pas2JS_Widget/project1.html) — all components demo (DataGrid with progressive loading, filtering, sorting)

### Requirements
- Lazarus 2.1+
- pas2js 2.0+

### Install
1. Open `widgets/wcl.lpk` in Lazarus (let the IDE know the runtime package)
2. Install `design/package/wcldsgn.lpk` (design-time package for the component palette)
3. Create a new _Web GUI Application_ and use components from the **WCL** tab

---

### Components (31)

#### Visual
| Component | HTML element | Description |
|---|---|---|
| **TWButton** | `<button>` | Push button with hover/active/disabled CSS, `ModalResult` |
| **TWEdit** | `<input type="text">` | Single-line text input with `TextHint`, `SelStart`/`SelLength` |
| **TWMemo** | `<textarea>` | Multi-line text input |
| **TWComboBox** | `<select>` | Dropdown selector with `Items`, `ItemIndex`, `DropDownCount`, `ItemHeight` |
| **TWListBox** | `<select multiple>` | Multi-select list, `ItemHeight` |
| **TWCheckbox** | `<input type="checkbox">` | Boolean toggle with `Checked` |
| **TWRadioButton** | `<input type="radio">` | Radio selection with `Checked` |
| **TWLabel** | `<div>` | Text label with `FocusControl`, `AutoSize` |
| **TWImage** | `<img>` | Image display with `Stretch`, `Proportional`, `ZoomEnabled` |
| **TWPanel** | `<div>` | Container with `BevelOuter`/`BevelInner` |
| **TWGroupBox** | `<fieldset>` +`<legend>` | Group container, `Caption` as legend |
| **TWScrollBox** | `<div>` | Scrollable container (`overflow: auto`) |
| **TWPageControl** | custom tabs | Multi-page tabs, `AddTabSheet`, `OnShowPage` |
| **TWFloatEdit** | `<input type="text">` | Float numeric with `DecimalPlaces`, `MinValue`/`MaxValue`, `Value: Double` |
| **TWIntegerEdit** | `<input type="text">` | Integer numeric with `MinValue`/`MaxValue`, `Value: NativeInt` |
| **TWDateEditBox** | `<input type="date">` | Native date picker |
| **TWTimeEditBox** | `<input type="time">` | Native time picker |
| **TWFileButton** | `<input type="file">` | File selection |
| **TWDataGrid** | `<table>` / cards | Sorting, `FilterBox`, `DataJSon`/`Data`/`DataTable`, column formatting, responsive cards, `ExportToCSV`, `InfiniteScroll`, keyboard navigation (arrows, PageUp/Down, Home/End) |
| **TWStringGrid** | `<table>` | Custom string grid |
| **TWPagination** | page nav | Page navigation with `CurrentPage` |
| **TWTrackBar** | `<input type="range">` | Slider with `Min`/`Max`/`Position`/`Frequency`/`Orientation` |
| **TWProgressBar** | `<progress>` | Progress bar with `Min`/`Max`/`Value` |
| **TWColorPicker** | `<input type="color">` | Native color picker with `Color`, `OnChange` |
| **TWSplitter** | `<div>` | Draggable splitter: `Align`, `MinSize`, `ResizeStyle`, `AutoSnap`, `Beveled`, `OnMoved` |
| **TWForm** | form overlay | Application form, `ModalResult`, `AlphaBlend` |
| **TWFrame** | frame container | Embeddable frame |

#### Data / Non-visual
| Component | Description |
|---|---|
| **TWWebDBConnection** | Database connection: `Backend` (wbMemory / wbLocal / wbSession / wbIndexedDB / wbWeb), `Get`/`Put`/`Delete`/`GetPage` async |
| **TWWebDBTable** | Dataset table: binds to a `TWWebDBConnection`, `Load`/`Save`/`LoadNextPage`/`LoadAll` async, `Progressive` loading, `AutoLoad`, exposes `DataJson: TLocalJSONDataset` |
| **TWTimer** | JS timer | Interval timer, `OnTimer` |
| **TWWebSocketClient** | WebSocket client, `Url`, `OnMessage`, `OnBinaryMessage` |
| **TWDataModule** | Non-visual data container |

### New: WebDB — storage abstraction

The `TWWebDBConnection` + `TWWebDBTable` pair provides a unified interface to multiple storage backends:

| Backend | Where data lives | Notes |
|---|---|---|
| `wbMemory` | JS object (RAM) | Volatile, per-session |
| `wbLocal` | `window.localStorage` | Persistent, ~5-10 MB |
| `wbSession` | `window.sessionStorage` | Per-tab, cleared on close |
| `wbIndexedDB` | IndexedDB | Persistent, large capacity, auto-migration from localStorage |
| `wbWeb` | HTTP API (PHP, etc.) | Progressive loading with `offset`/`limit` |

```pascal
// Bind a DataGrid to a web dataset with progressive loading
WWebDBConnection1.Backend := wbWeb;
WWebDBConnection1.BaseURL := 'http://localhost/api.php';
WWebDBTable1.Connection := WWebDBConnection1;
WWebDBTable1.TableName := 'Clienti';
WWebDBTable1.Progressive := True;
WWebDBTable1.PageSize := 100;
WDataGrid1.DataTable := WWebDBTable1;
WDataGrid1.InfiniteScroll := True;
await WWebDBTable1.Load;
```

### DataGrid + database

`TWDataGrid` can be fed from three mutually exclusive sources:

| Property | Type | Use when |
|---|---|---|
| `Data` | `TJSArray` | Static data in memory (array of JS objects) |
| `DataJSon` | `TLocalJSONDataset` | You already have a dataset (`TWWebDBTable.DataJson`, or your own) |
| `DataTable` | `TWWebDBTable` | You want the grid to follow a WebDB table, including progressive loading |

Setting `DataJson` clears `Data` and vice versa — pick one.

#### Binding to a table

```pascal
WWebDBTable1.Connection := WWebDBConnection1;
WWebDBTable1.TableName  := 'Clienti';
WWebDBTable1.Progressive := True;
WWebDBTable1.PageSize    := 100;

WDataGrid1.DataTable      := WWebDBTable1;
WDataGrid1.InfiniteScroll := True;

await WWebDBTable1.Load;   // async: the grid refreshes via OnLoad
```

What `DataTable` does behind the scenes (`datagrid.pas:1390`):

* it takes over `TWWebDBTable.OnLoad`, storing your existing handler and chaining it — you can still use `OnLoad` normally;
* on every load it clears `Data` and re-binds `DataJson` to the table's dataset;
* if the table is not `Active` yet, the grid stays empty until the first `Load`.

So the assignment order matters: bind `DataTable` **before** `Load`, and don't expect rows synchronously.

#### Columns

Columns are created automatically when no columns are defined and `AutoCreateColumns` is `True` (the default). The source decides how:

* **from a `Data` array of objects** — keys of the first row; boolean → centered `cfBoolean`, number → right-aligned `cfNumber`, anything else → `cfString`;
* **from a dataset** (`DataJSon`, including `DataTable`) — from the dataset's `FieldDefs`: `ftBoolean`, the numeric types (`ftFloat`/`ftInteger`/`ftLargeInt`/`ftAutoInc`), `ftDateTime` → `cfDataTime`, everything else → `cfString`.

The dataset branch needs the dataset to be **active**, otherwise `FieldDefs` is empty and you get no columns. Define `Columns` explicitly when you want to control titles and widths, or when the dataset is not loaded yet at design time.

#### Selection and dataset cursor

Each row carries a hidden `__dsrow` field with its record index. Selecting a row moves the underlying dataset cursor to that record (`MoveBy`), so after a click you can read the current record directly:

```pascal
procedure TWForm1.WDataGrid1CellClick(Sender: TObject; ACol, ARow: NativeInt);
begin
  Caption := WWebDBTable1.DataJson.FieldByName('Nome').AsString;
end;
```

#### Sorting

Sorting is hybrid (`datagrid.pas:1640`):

* if a `DataTable` is bound and **not fully loaded** (`LoadedRecords < TotalRecords`), the click is forwarded to the server: `SortField`/`SortDir` are set and the table reloads;
* otherwise sorting happens client-side on the rows already in memory.

That means a sort on a partially loaded table re-queries the backend, while a sort on a fully loaded one does not.

#### Progressive loading

`InfiniteScroll` hooks the body scroll event: when the user is within 50px of the bottom and `LoadedRecords < TotalRecords`, the grid calls `LoadNextPage`. Loading stops automatically once everything is loaded.

`TWPagination` is the alternative for page-by-page navigation, driven by the same `TotalRecords`/`LoadedRecords` pair.

#### Export

`ExportToCSV` writes a CSV with the column titles as header and escapes embedded quotes. It exports from `Data` when that is set, otherwise it walks the `DataJSon` dataset record by record.

#### Limitations

* **Read-only.** There is no cell editing and no write-back to the dataset — no `Edit`/`Post` path. To modify data, act on the table and reload.
* The grid renders what the dataset exposes: filtered/sorted views must come from the table, not from the grid.
* `__dsrow` is an internal field name; don't use it as a column name.

### DataGrid keyboard navigation

| Key | Action |
|---|---|
| ↑ ↓ | Previous/next row |
| ← → | Previous/next column |
| PageUp / PageDown | Jump one page of rows |
| Home / End | First/last row |

Selection and scroll position are preserved across data loads.

---

### Infrastructure

| Feature | Description |
|---|---|
| **Screen** | Global singleton: `Width`, `Height`, `PixelsPerInch`, `WorkArea` |
| **Application** | App lifecycle: `Initialize`, `Run`, `Terminate`, `MainForm`, `ActiveForm`, `BackgroundColor` |
| **Constraints** | `MinWidth`/`MaxWidth`/`MinHeight`/`MaxHeight` on every control, enforced in `SetBounds` |
| **Selection** | `SelStart`/`SelLength`/`SelText` on `TWEdit`/`TWMemo` (runtime only, as in LCL) |
| **Theme** | Shared CSS via `RegisterWCLStyle` — `.wcl-btn`, `.wcl-input`, `.wcl-panel` classes with hover/active/focus |
| **Responsive** | `@media(max-width:600px)` auto-scales buttons and inputs |
| **Keyboard nav** | Tab / Shift+Tab between controls via `TabOrder` |
| **Dialogs** | `MessageDlg`, `ShowMessage`, `InputBox`, `QuestionDlg`, `ShowMessageFmt` |

---

### Example (`Example/`)

A demo project showcasing all components including `TWWebDBConnection` + `TWWebDBTable` with progressive loading.

The **Grid Modes** tab shows the same `TWDataGrid` fed by all three sources (`Data`, `DataJSon`, `DataTable`) and lets you toggle responsive cards, grouping by a field, and CSV export — all in memory, so it works without a backend.

```bash
# Start the PHP backend
cd Example
php -S localhost:80

# Open project1.html in a browser (after compiling in Lazarus)
```

The `api.php` endpoint supports:
- `GET api.php?table=Clienti` → full JSON array
- `GET api.php?table=Clienti&offset=0&limit=100` → `{ "data": [...], "total": 5000 }`
- `GET api.php?table=Clienti&count=10000` → change total record count

> **GitHub Pages note:** the compiled `project1.js` is committed, so the demo can be served statically (see below). `api.php` needs a PHP server, so it is not executed by GitHub Pages — keep it on your own host and point **Load from URL** at it (`api.php` sends `Access-Control-Allow-Origin: *`, so cross-origin calls work). The **Grid Modes** tab needs no backend at all.

### Hosting the demo on GitHub Pages

The workflow `.github/workflows/pages.yml` publishes the `Example/` folder as-is:

1. In the repository, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Push to `master` (any change under `Example/` triggers a deploy), or run the workflow manually.

There is no build step in CI, so **`Example/project1.js` must be committed**. After changing the demo, recompile it and commit the result:

```bash
pas2js -dPas2js -O- -Jeutf-8 -Jirtl.js -Jc -JRjs \
  -Fu<path-to-pas2js>/packages/rtl/src -Fuwidgets -FuExample \
  -oExample/project1.js Example/project1.lpr
git add -f Example/project1.js    # the file is git-ignored by Example/.gitignore
git commit -m "chore: rebuild demo"
```

`project1.js.map` (about 5 MB) stays ignored on purpose.

---

### Notes
- Use only components from the _WCL_ palette tab
- Design-time units in `design/source/` use a `D` suffix to avoid name conflicts with runtime units
- Component icons are XPM in `design/image/`
- Runtime units in `widgets/` are compiled to JS
- `widgets/backup/` and `Example/backup/` hold obsolete snapshots and are git-ignored — not part of the build

### Recent changes

**Constraints** — new `TSizeConstraints` on `TControl` (`widgets/controls.pas`), published so it appears in the Object Inspector for every `TW*`. Values are enforced in `SetBounds`, `0` meaning "no limit" as in LCL.

```pascal
WEdit1.Constraints.MinWidth := 120;
WEdit1.Constraints.MaxWidth := 120;   // Width := 400 clamps to 120
```

**Selection fix** — `SelStart`/`SelLength`/`SelText` on `TWEdit`/`TWMemo` were reading/writing the wrong field: `GetSelStart` returned the cached `FSelLength`, and `SelText` inserted at a 0-based offset. Now the caret is read from the DOM and repositioned after a `SelText` assignment.

**ComboBox** — `DropDownCount` published, `ItemHeight` applies `min-height` to options. Note: native `<select>` dropdown height is browser-controlled, so `DropDownCount` is kept for LCL compatibility.

**Graphics** — `TCanvas` now handles `psDashDot`/`psDashDotDot`; `PenStyleToCSSBorderStyle` covers all pen styles; `TPicture` gained `Clear`, `IsEmpty`, `LoadFromDataURL`, `SaveToDataURL`, `LoadFromBase64`.

**Application** — new `BackgroundColor: TColor`, applied to `document.body` in `Run` (falls back to `MainForm.Color`, `clDefault` clears it).

**TWSplitter** — new component in `widgets/extctrls.pas` (`TCustomSplitter`) and `widgets/webctrls.pas` (`TWSplitter`), registered in the design package.

```pascal
VSplitter.Align  := alLeft;   // or alRight / alTop / alBottom
VSplitter.MinSize := 80;
VSplitter.OnMoved := @SplitterMoved;
```

It resizes the nearest sibling with the same alignment, clamping to `MinSize` and leaving room for the `alClient` control; `Parent.ReAlign` then repositions everything. Dragging is tracked on `document`, so the pointer can leave the few-pixels-wide splitter. `ResizeStyle = rsNone` applies the size only on release.

The **Layout** tab in the demo shows a vertical and a horizontal splitter.

**DataGrid fixes** — found while building the demo tab:

* `FormatCellValue` used `BoolToStr` without the `UseBoolStrs` flag, so boolean cells rendered as `-1`/`0` instead of `True`/`False` (FPC's default). Fixed, and `ExportToCSV` now uses the same formatting, so a boolean column exports `True`/`False` too (it used to export lowercase `true`/`false`, and the dataset branch did not escape quotes).
* `TWWebDBTable.LoadFromArray` called `Open` without building `FieldDefs`, which raised *"No fields found"* for an in-memory table. It now derives the field definitions from the first row, exactly like the web loading path.
* `TCustomTabSheet.SetPageControl` had an inverted condition, so `TWPageControl.AddTabSheet` never parented the new sheet. Runtime-created tabs work now.
* Removed the debug `console.log` calls that fired on every grid render.

### Further plans
- TPaintBox (Canvas 2D)
- TShape
