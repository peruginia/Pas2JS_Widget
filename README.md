# Web Component Library (WCL)

RAD widgetset for Lazarus/pas2js — compile Object Pascal to JavaScript with LCL-compatible components.

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
| **TWComboBox** | `<select>` | Dropdown selector with `Items`, `ItemIndex` |
| **TWListBox** | `<select multiple>` | Multi-select list |
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
| **Application** | App lifecycle: `Initialize`, `Run`, `Terminate`, `MainForm`, `ActiveForm` |
| **Theme** | Shared CSS via `RegisterWCLStyle` — `.wcl-btn`, `.wcl-input`, `.wcl-panel` classes with hover/active/focus |
| **Responsive** | `@media(max-width:600px)` auto-scales buttons and inputs |
| **Keyboard nav** | Tab / Shift+Tab between controls via `TabOrder` |
| **Dialogs** | `MessageDlg`, `ShowMessage`, `InputBox`, `QuestionDlg`, `ShowMessageFmt` |

---

### Example (`Example/`)

A demo project showcasing all components including `TWWebDBConnection` + `TWWebDBTable` with progressive loading.

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

> **GitHub Pages note:** the compiled JS frontend can be served from GitHub Pages, but `api.php` needs a PHP server. For a fully static demo, replace `wbWeb` with `wbMemory`/`wbLocal` or host the PHP backend separately (e.g. InfinityFree, 000webhost, or a $5 VPS).

---

### Notes
- Use only components from the _WCL_ palette tab
- Design-time units in `design/source/` use a `D` suffix to avoid name conflicts with runtime units
- Component icons are XPM in `design/image/`
- Runtime units in `widgets/` are compiled to JS

### Further plans
- TPaintBox (Canvas 2D)
- TSplitter
- TShape
