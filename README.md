# Web Component Library (WCL)

RAD widgetset for Lazarus/pas2js — compile Object Pascal to JavaScript with LCL-compatible components.

### Live Demo
🔗 [**peruginia.github.io/Pas2JS_Widget/project1.html**](https://peruginia.github.io/Pas2JS_Widget/project1.html) — all components demo (DataGrid with progressive loading, filtering, sorting)
🔗 [**peruginia.github.io/Pas2JS_Widget/MobileDemo/mobile.html**](https://peruginia.github.io/Pas2JS_Widget/MobileDemo/mobile.html) — mobile/PWA demo (responsive layout, touch sizes, safe area, installable)

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
| **TWEdit** | `<input type="text">` | Single-line text input with `TextHint`, `Autocomplete`, `InputType` (`itEmail`/`itTel`/`itUrl`/`itSearch`), `SelStart`/`SelLength` |
| **TWMemo** | `<textarea>` | Multi-line text input |
| **TWComboBox** | `<input>` + dropdown | Editable/dropdown selector with `Items`, `ItemIndex`, `Style` (`csDropDown`/`csDropDownList`), `TopIndex`, `Columns`, `DropDownCount`, `ItemHeight` |
| **TWListBox** | `<select multiple>` | Multi-select list, `ItemHeight`, `TopIndex`, `Columns` |
| **TWCheckbox** | `<input type="checkbox">` | Boolean toggle with `Checked` |
| **TWRadioButton** | `<input type="radio">` | Radio selection with `Checked` |
| **TWLabel** | `<div>` | Text label with `FocusControl`, `AutoSize`, `ShowAccelChar` (`&X` underlined accelerator, Alt+X focuses `FocusControl`) |
| **TWImage** | `<img>` | Image display with `Stretch`, `Proportional`, `ZoomEnabled` |
| **TWPanel** | `<div>` | Container with `BevelOuter`/`BevelInner` |
| **TWGroupBox** | `<fieldset>` +`<legend>` | Group container, `Caption` as legend |
| **TWScrollBox** | `<div>` | Scrollable container (`overflow: auto`) |
| **TWPageControl** | custom tabs | Multi-page tabs, `AddTabSheet`, `OnShowPage` |
| **TWFloatEdit** | `<input type="text">` | Float numeric with `DecimalPlaces`, `MinValue`/`MaxValue`, `Value: Double` |
| **TWSpinEdit** | `<input type="number">` | Integer spin edit with `Value`, `MinValue`/`MaxValue`, `Increment` |
| **TWUpDown** | two buttons | Up/down buttons with `Associate`, `Min`/`Max`, `Position`, `Increment`, `Orientation`, `Wrap`, `OnChanging`/`OnChangingEx`/`OnClick` |
| **TWScrollBar** | `<input type="range">` | `Kind` (`sbHorizontal`/`sbVertical`), `Min`/`Max`, `Position`, `PageSize`, `SmallChange`/`LargeChange`, `OnChange`/`OnScroll` |
| **TWIntegerEdit** | `<input type="text">` | Integer numeric with `MinValue`/`MaxValue`, `Value: NativeInt` |
| **TWDateEditBox** | `<input type="date">` | Native date picker |
| **TWTimeEditBox** | `<input type="time">` | Native time picker |
| **TWFileButton** | `<input type="file">` | File selection |
| **TWDataGrid** | `<table>` / cards | Sorting, `FilterBox`, `DataJSon`/`Data`/`DataTable`, column formatting, responsive cards, `ExportToCSV`, `InfiniteScroll`, keyboard navigation (arrows, PageUp/Down, Home/End) |
| **TWStringGrid** | `<table>` | Editable string grid: `Cells`, `Options` (`goEditing`, `goTabs`), inline editor, `OnSelectCell`/`OnGetEditText`/`OnSetEditText`/`OnDrawCell` |
| **TWTreeView** | nested `<ul>`/`<li>` | Tree: `Items` (`Add`/`AddChild`/`Insert`), `Selected`, `ShowLines`/`ShowRoot`/`ShowButtons`, `Indent`, `RowHeight`, expand/collapse, `FullExpand`/`FullCollapse`, `AlphaSort`, `OnChange`/`OnExpanding`/`OnExpanded`/`OnCollapsing`/`OnCollapsed` |
| **TWListView** | `<table>` / rows / tiles | `ViewStyle` (`vsReport`/`vsList`/`vsSmallIcon`/`vsIcon`), `Items`, `Columns`, `Selected`, `MultiSelect`, `Checkboxes`, `GridLines`, `SortColumn`/`SortDirection`, `OnSelectItem`/`OnChange`/`OnColumnClick` |
| **TWPagination** | page nav | Page navigation with `CurrentPage` |
| **TWTrackBar** | `<input type="range">` | Slider with `Min`/`Max`/`Position`/`Frequency`/`Orientation` |
| **TWProgressBar** | `<progress>` | Progress bar with `Min`/`Max`/`Value` |
| **TWColorPicker** | `<input type="color">` | Native color picker with `Color`, `OnChange` |
| **TWSplitter** | `<div>` | Draggable splitter: `Align`, `MinSize`, `ResizeStyle`, `AutoSnap`, `Beveled`, `OnMoved` |
| **TWMainMenu** | `<div>` bar | Menu bar with dropdowns, separators, shortcuts and check marks |
| **TWPopupMenu** | `<div>` panel | Context menu shown by `TControl.PopupMenu` on right click |
| **TWShape** | `<canvas>` | Geometric figure with `Shape`, `Pen`, `Brush`, `OnChange` |
| **TWPaintBox** | `<canvas>` | Custom drawing in `OnPaint` through `Canvas` (Canvas 2D) |
| **TWForm** | form overlay | Application form, `ModalResult`, `AlphaBlend` |
| **TWFrame** | frame container | Embeddable frame |

#### Data / Non-visual
| Component | Description |
|---|---|
| **TWWebDBConnection** | Database connection: `Backend` (wbMemory / wbLocal / wbSession / wbIndexedDB / wbWeb), `Get`/`Put`/`Delete`/`GetPage` async |
| **TWWebDBTable** | Dataset table: binds to a `TWWebDBConnection`, `Load`/`Save`/`LoadNextPage`/`LoadAll` async, `Progressive` loading, `AutoLoad`, exposes `DataJson: TLocalJSONDataset` |
| **TWTimer** | JS timer | Interval timer, `OnTimer` |
| **TWWebSocketClient** | WebSocket client, `Url`, `OnMessage`, `OnBinaryMessage` |
| **TWAction** | Action: `Caption`, `Enabled`, `Checked`, `Visible`, `Hint`, `ShortCut`, `OnExecute`, `OnUpdate` |
| **TWActionList** | Owns actions: `AddAction`, `ActionByName`, `Update` |
| **TWOpenDialog** | File open dialog: `Filter`, `FileName`, `Files`, `Execute` async |
| **TWSaveDialog** | File save dialog: `Filter`, `FileName`, `Execute` async |
| **TWColorDialog** | Colour picker dialog: `Color`, `Execute` async |
| **TWFontDialog** | Font picker dialog: `Font`, `Title`, `Execute` async |
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

#### Separator rows

`OnAddSeparator` is called **before every row**. Write HTML into `Data` and the grid inserts an extra `<tr>` with that content in front of the row:

```pascal
procedure TWForm1.GridAddSeparator(ASender: TObject; var AData: string);
begin
  AData := '';
  if (not Grid.DataTable.Active) then Exit;
  if (Grid.DataTable.DataJson.RecNo <= 1) then FLastCity := '';   // reset each render
  VCity := Grid.DataTable.DataJson.FieldByName('City').AsString;
  if (VCity = '') or (VCity = FLastCity) then Exit;
  FLastCity := VCity;
  AData := '<td colspan="4" style="font-weight:bold">' + VCity + '</td>';
end;
```

The same markup also works in the responsive card layout: the separator is inserted before the card, and table-oriented HTML (`<td ...>`) is wrapped in a small table so its colspan and inline styles are preserved. A plain `<div>` or text works too.

Three things to keep in mind:

* the event carries **no row index** — the only way to know which record is being drawn is the dataset cursor, so separators work with `DataTable`/`DataJSon`, not with a plain `Data` array;
* the dataset is **not positioned** before the first row, so `FieldByName` can return an empty string; skip that case or you get a blank separator at the top;
* reset your state when `RecNo <= 1`, otherwise a re-render (sort, filter, reload) misses the first separator.

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

### StringGrid editing

`TWStringGrid` supports inline cell editing. Add `goEditing` to `Options` and the selected cell can be edited with `F2`, `Enter`, a double click, or simply by typing; `goTabs` makes `Tab`/`Shift+Tab` move between cells.

```pascal
StringGrid1.Options := [goEditing, goTabs];
StringGrid1.ColCount := 4;
StringGrid1.RowCount := 6;
StringGrid1.Cells[0, 0] := 'Name';
StringGrid1.Cells[1, 0] := 'Age';

StringGrid1.OnGetEditText := @GridGetEditText;   // initial editor value
StringGrid1.OnSetEditText := @GridSetEditText;   // commit a new value
StringGrid1.OnSelectCell := @GridSelectCell;     // CanSelect := False blocks a cell
StringGrid1.OnEditingDone := @GridEditingDone;
StringGrid1.OnDrawCell := @GridDrawCell;         // per-cell DOM customisation

procedure TForm1.GridGetEditText(Sender: TObject; ACol, ARow: LongInt;
  var Value: string);
begin
  // adjust Value before the editor is shown
end;

procedure TForm1.GridSetEditText(Sender: TObject; ACol, ARow: LongInt;
  const Value: string);
begin
  // the cell already contains Value; store it in your model here
end;

procedure TForm1.GridSelectCell(Sender: TObject; ACol, ARow: LongInt;
  var CanSelect: Boolean);
begin
  if (ACol = 3) and (ARow = 1) then
    CanSelect := False;
end;

procedure TForm1.GridDrawCell(Sender: TObject; ACol, ARow: LongInt;
  AState: TGridDrawState; ACell: TJSHTMLTableDataCellElement);
begin
  if (ACol = 2) and (ARow > 0) then
    ACell.style.SetProperty('background-color', '#FFF8C0');
end;
```

| Key | Action |
|---|---|
| Arrows | Move the selection |
| Home / End | First/last column of the row |
| PageUp / PageDown | Jump one visible page of rows |
| Enter / F2 | Start editing, or move down when not editable |
| Any printable key | Start editing with that character |
| Enter / Tab | Commit and move (Tab only with `goTabs`) |
| Esc | Cancel the edit |

The editor is an `<input>` placed inside the cell, so it scrolls with the grid and follows the cell size. `EditorMode` reflects the editing state and can also start or stop it from code. `OnDrawCell` receives the DOM cell element, like `OnDrawColumnCell` on `TWDataGrid`; the handler can change styles or content, while the cell text is provided by `Cells`.

### TreeView

`TWTreeView` renders a tree with nested `<ul>`/`<li>` elements. Nodes are created in code; `Add` follows LCL (a new node is the last sibling of the given node, or a root when it is `nil`), while `AddChild` appends a child:

```pascal
var
  VNode, VChild: TTreeNode;
begin
  VNode := TreeView1.Items.Add('Documents');
  VChild := TreeView1.Items.AddChild(VNode, 'Reports');
  TreeView1.Items.AddChild(VChild, '2025');
  TreeView1.Items.AddChild(VChild, '2026');
  VNode.Expanded := True;

  VNode := TreeView1.Items.Add('Images');
  VChild := TreeView1.Items.AddChild(VNode, 'Vacation');
  VChild.ImageUrl := 'photo.png';

  TreeView1.OnChange := @TreeSelectionChanged;
  TreeView1.Selected := VNode;
end;
```

`TTreeNode` exposes `Text`, `ImageUrl`, `Data`, `Level`, `Index`, `AbsoluteIndex`, `Parent`, `Count`/`Item[]`, `FirstChild`/`LastChild`, `NextSibling`/`PrevSibling`, `Next`/`Prev`, `HasChildren`, `Expanded`, `Selected`, `Expand`/`Collapse`/`ToggleExpanded`, `MakeVisible` and `Delete`. `Items` is the flat collection (`Count`, `Item[]`, `RootCount`, `Roots[]`, `GetFirstNode`, `IndexOf`, `Delete`, `Clear`, `AlphaSort`).

`ShowLines` draws the dotted child guides, `ShowRoot` hides the top-level rows (their children become the first level), `ShowButtons` controls the expander glyphs, and `Indent` sets the child indentation. `RowHeight` overrides the default row height; touch devices use 36 px rows automatically. Selecting a node raises `OnChange`; expanding and collapsing raise `OnExpanding`/`OnExpanded` and `OnCollapsing`/`OnCollapsed`, and `OnExpanding`/`OnCollapsing` can veto the change with `AllowExpansion := False` / `AllowCollapse := False`.

| Key | Action |
|---|---|
| ↑ / ↓ | Previous/next visible node |
| → | Expand the node, or move to its first child |
| ← | Collapse the node, or move to its parent |
| Home / End | First/last visible node |
| Enter / Space | Toggle the selected node |

Clicking a row selects it, clicking the expander (or double-clicking the row) toggles it. The tree can be designed in the IDE and the node data saved by the LCL tree editor (`Items.Data`) is accepted and ignored: build the nodes in code, as shown above.

### ListView

`TWListView` shows a list of items; `ViewStyle` selects the layout:

* `vsReport` — a table with `Columns` and headers; `Caption` fills the first column and `SubItems` the remaining ones.
* `vsList` — compact rows with the caption only.
* `vsSmallIcon` — rows with a 16 px `ImageUrl` icon.
* `vsIcon` — tiles in a responsive grid with a 32 px icon and the first subitem.

```pascal
var
  VColumn: TListColumn;
  VItem: TListItem;
begin
  ListView1.ViewStyle := vsReport;
  ListView1.Checkboxes := True;
  ListView1.GridLines := True;
  ListView1.RowHeight := 28;
  ListView1.OnSelectItem := @ListSelectItem;
  ListView1.OnChange := @ListChanged;
  ListView1.OnColumnClick := @ListColumnClick;

  VColumn := ListView1.Columns.Add;
  VColumn.Caption := 'Name';
  VColumn.Width := 160;

  VItem := ListView1.Items.Add;
  VItem.Caption := 'Mario Rossi';
  VItem.SubItems.Add('Developer');
  VItem.ImageUrl := 'user.png';
  VItem.Checked := True;
end;
```

`TListItem` exposes `Caption`, `SubItems`, `ImageUrl`, `Data`, `Checked`, `Selected`, `Index`, `ListView`, `Owner`, `Delete` and `MakeVisible`. `Items` supports `Add`, `Insert`, `Delete`, `Clear`, `IndexOf`, `BeginUpdate`/`EndUpdate` and `Item[]`. `Columns` is a collection of `TListColumn` (`Caption`, `Width`, `Alignment`, `Visible`, `MinWidth`, `MaxWidth`, `AutoSize`, `SortIndicator`).

Selection is single by default; `MultiSelect := True` enables Ctrl+click toggling and Shift+click ranges. Use `Selected`, `ItemIndex`, `SelCount`, `ClearSelection` and `SelectAll`. Clicking a row selects it and raises `OnSelectItem`; `OnChange` reports text, image and state changes (including checkbox toggles). `Checkboxes` adds a checkbox column, `ReadOnly` disables toggling from the UI, and `OnItemChecked` fires after a checkbox toggle.

In `vsReport`, clicking a column header sorts the rows when `AutoSort` is True (the default); clicking the same header toggles ascending/descending and the arrow is shown in the header. `AlphaSort` sorts by caption, `SortColumn`/`SortDirection` can be set in code, and `OnColumnClick` fires for every header click. With `SortType` set to `stData`/`stBoth` and `OnCompare` assigned, the comparison comes from the event.

| Key | Action |
|---|---|
| ↑ / ↓ | Previous/next item |
| Home / End | First/last item |
| Space | Toggle the selected item's checkbox |
| Ctrl+A | Select all (with `MultiSelect`) |

Items are built in code; the binary `Items.Data`/`Items.LazData` saved by the LCL list editor is accepted and ignored. Default rows grow to 36 px on touch devices, and the list shares the WCL theme.

### Scroll bars, spin edits and up-down

`TWScrollBar` uses a native `<input type="range">`; `Kind` selects the horizontal or vertical orientation:

```pascal
ScrollBar1.Kind := sbHorizontal;   // or sbVertical
ScrollBar1.Min := 0;
ScrollBar1.Max := 100;
ScrollBar1.Position := 30;
ScrollBar1.OnChange := @ScrollChanged;
ScrollBar1.OnScroll := @ScrollScrolled; // ScrollCode + var ScrollPos
```

`PageSize`, `SmallChange` and `LargeChange` are accepted; `SmallChange` maps to the native range step.

`TWSpinEdit` is a numeric edit with native `<input type="number">` steppers:

```pascal
SpinEdit1.MinValue := 0;
SpinEdit1.MaxValue := 100;
SpinEdit1.Increment := 1;
SpinEdit1.Value := 10;
```

`TWUpDown` shows two arrow buttons and can drive an edit through `Associate`:

```pascal
UpDown1.Associate := Edit1;
UpDown1.Min := 0;
UpDown1.Max := 100;
UpDown1.Increment := 1;
UpDown1.Position := 0;
UpDown1.Orientation := udVertical; // or udHorizontal
UpDown1.OnClick := @UpDownClick;   // TUDBtnType: btNext/btPrev
```

`OnChanging` and `OnChangingEx` can veto the change (`AllowChange := False`); `Wrap` wraps at the bounds and `Thousands` is accepted for compatibility.

### ComboBox styles and label accelerators

`TWComboBox.Style` selects the behaviour:

* `csDropDown` — editable text; clicking the field or pressing the arrow keys opens the item list.
* `csDropDownList` — read-only text; the value must come from the list.

The list is a custom dropdown positioned under the field, so it shows every item on click, supports mouse selection and the Up/Down/Enter/Escape keys, and closes when clicking outside.

```pascal
ComboBox1.Items.Add('Alpha');
ComboBox1.Items.Add('Beta');
ComboBox1.Style := csDropDown;
ComboBox1.ItemIndex := 0;
ComboBox1.TopIndex := 1;   // accepted for LCL compatibility
ComboBox1.Columns := 20;   // accepted for LCL compatibility
```

`TListBox.TopIndex` scrolls the list to the first visible item and `Columns` is accepted for compatibility.

`TWLabel.ShowAccelChar` is True by default. `&X` in the caption renders `X` underlined and `Alt+X` focuses `FocusControl`; write `&&` for a literal ampersand:

```pascal
NameLabel.Caption := '&Name';
NameLabel.FocusControl := NameEdit;
NameLabel.ShowAccelChar := True;
```

### Drag and drop

Every control exposes the LCL drag properties and events:

```pascal
SourceButton.DragMode := dmAutomatic;   // dmManual is the default
SourceButton.OnStartDrag := @DragStart;
SourceButton.OnEndDrag := @DragEnd;

TargetPanel.OnDragOver := @PanelDragOver;
TargetPanel.OnDragDrop := @PanelDragDrop;
```

`dmAutomatic` starts a drag after the pointer moves 5 px; with `dmManual` call `BeginDrag(True)` (immediately) or `BeginDrag(False, Threshold)` from `OnMouseDown`. `EndDrag(False)` cancels a drag and `Dragging` reports whether the control is the current source. `DragKind` (`dkDrag`/`dkDock`) is accepted for LCL compatibility.

`OnDragOver` is called while the pointer is over a target with the source control, the target-relative coordinates and `TDragState` (`dsDragEnter`, `dsDragMove`, `dsDragLeave`); set `Accept := True` to allow the drop. `OnDragDrop` receives the source and the target-relative `X`/`Y` when the pointer is released. `OnStartDrag` can supply a custom `TDragObject`; `OnEndDrag` runs on the source with the drop target (or `nil` when the drag is cancelled).

```pascal
procedure TForm1.PanelDragOver(Sender, Source: TObject; X, Y: Integer;
  State: TDragState; var Accept: Boolean);
begin
  Accept := Source is TControl;
end;

procedure TForm1.PanelDragDrop(Sender, Source: TObject; X, Y: Integer);
begin
  // X and Y are relative to the target panel
end;
```

The drag manager uses pointer events with pointer capture, shows a small ghost element under the pointer and outlines the accepted target with `.wcl-drag-over`. Press `Esc` to cancel a drag. A control only becomes a target when it has an `OnDragOver` handler, as in LCL.

### Message boxes

`Application.MessageBox` and the global `MessageBox` provide the familiar LCL flags (`MB_OK`, `MB_OKCANCEL`, `MB_YESNO`, `MB_ICONINFORMATION`, ...). Because the browser dialog is asynchronous, the result is delivered through a callback using the LCL `IDOK`/`IDCANCEL`/`IDYES`/`IDNO` values:

```pascal
Application.MessageBox('Save changes?', 'Confirm',
  MB_ICONQUESTION or MB_YESNO,
  TModalResultProc(procedure(Sender: TObject; ModalResult: TModalResult)
  begin
    if ModalResult = IDYES then
      SaveChanges;
  end));
```

The callback may be omitted for a simple notification. The global `MessageBox` uses `Application.ActiveForm` as owner. When the `Dialogs` unit is not linked, `Application.MessageBox` falls back to the browser alert.

### File, colour and font dialogs

`TOpenDialog`, `TSaveDialog`, `TColorDialog` and `TFontDialog` are non-visual components with asynchronous `Execute`:

```pascal
OpenDialog1.Filter := 'Text files (*.txt)|*.txt|All files (*.*)|*.*';
OpenDialog1.Execute(TDialogResultProc(procedure(Sender: TObject; Accepted: Boolean)
begin
  if Accepted then
    Memo1.Lines.LoadFromFile(OpenDialog1.FileName);
end));

ColorDialog1.Color := Label1.Font.Color;
ColorDialog1.Execute(TDialogResultProc(procedure(Sender: TObject; Accepted: Boolean)
begin
  if Accepted then
    Label1.Font.Color := ColorDialog1.Color;
end));

FontDialog1.Font.Assign(Label1.Font);
FontDialog1.Execute(TDialogResultProc(procedure(Sender: TObject; Accepted: Boolean)
begin
  if Accepted then
    Label1.Font.Assign(FontDialog1.Font);
end));
```

`TOpenDialog` uses a hidden `<input type="file">`; `Files` contains the selected names and `FileName` the first one. `TSaveDialog` uses `showSaveFilePicker` when available and otherwise asks for a file name. `TColorDialog` wraps `<input type="color">` and uses `showPicker` when available. `TFontDialog` opens a small form with font family, size, bold/italic and colour, plus a live preview.

---

### Infrastructure

| Feature | Description |
|---|---|
| **Screen** | Global singleton: `Width`, `Height`, `PixelsPerInch`, `WorkArea`, `ClientWidth`/`ClientHeight` (browser window), `IsTouch`, `IsMobile`, `SafeAreaTop/Right/Bottom/Left` |
| **Application** | App lifecycle: `Initialize`, `Run`, `Terminate`, `MainForm`, `ActiveForm`, `BackgroundColor` |
| **Viewport** | `Application.ViewportMode` (`vmResponsive` / `vmFitDesign`), `DesignWidth`, `ViewportFit`, `ApplyViewport` |
| **Constraints** | `MinWidth`/`MaxWidth`/`MinHeight`/`MaxHeight` on every control, enforced in `SetBounds` |
| **Selection** | `SelStart`/`SelLength`/`SelText` on `TWEdit`/`TWMemo` (runtime only, as in LCL) |
| **Theme** | Shared CSS via `RegisterWCLStyle` — `.wcl-btn`, `.wcl-input`, `.wcl-panel` classes with hover/active/focus |
| **Responsive** | Touch devices (`pointer: coarse`): 16px inputs (no iOS zoom), 36px targets, hover gated to `(hover: hover)`, `touch-action`, reduced motion |
| **Keyboard nav** | Tab / Shift+Tab between controls via `TabOrder` |
| **Drag and drop** | `DragMode`/`DragKind`, `BeginDrag`/`EndDrag`, `Dragging`, `OnStartDrag`/`OnDragOver`/`OnDragDrop`/`OnEndDrag`, pointer capture, ghost and drop highlight |
| **Dialogs** | `MessageDlg`, `ShowMessage`, `InputBox`, `QuestionDlg`, `ShowMessageFmt`, `MessageBox`, `Application.MessageBox` |

---

### Mobile and viewport

The application owns the `<meta name="viewport">` tag. `Application.Run` writes it from `ViewportMode` and `DesignWidth`, so the app HTML does not need to declare it. An existing tag is updated and any other directive it contains (for example `viewport-fit=cover`) is preserved.

```pascal
Application.ViewportMode := vmResponsive; // default: width=device-width
Application.ViewportMode := vmFitDesign;  // width=DesignWidth: the browser scales the layout
Application.DesignWidth := 1024;          // defaults to MainForm.Width when 0
Application.ViewportFit := True;          // add viewport-fit=cover, safe area insets
Application.ApplyViewport;                // re-apply after changing them at runtime
```

* **`vmResponsive`** - the layout viewport matches the device. Media queries work; the app must reflow with `Align`/`Anchors`.
* **`vmFitDesign`** - the layout viewport is `DesignWidth` and the browser scales the whole page to the screen. A fixed LCL layout stays reachable and proportional on a phone, with smaller text. Media queries on width do not fire in this mode, but touch queries (`pointer: coarse`) do.

`ViewportFit` adds `viewport-fit=cover`, so the page can use the whole screen including a notch. `Screen.UpdateSafeArea` measures `env(safe-area-inset-*)` into `Screen.SafeAreaTop/Right/Bottom/Left`; forms are automatically inset by those values (`ftWindow` fills the safe area, modal forms are centred inside it).

For runtime decisions use `Screen`:

```pascal
if Screen.IsTouch then
  WPageControl1.TabHeight := 36;   // the default already grows to 36 on touch
if Screen.ClientWidth < 600 then
  // switch to a compact layout
```

`Screen.Width`/`Height` are the physical screen, `Screen.ClientWidth`/`ClientHeight` the browser window, `Screen.IsTouch` checks `(pointer: coarse)` and `Screen.IsMobile` a phone-sized screen (`<= 600` CSS px).

Forms follow window and viewport changes: `ftWindow` forms fill the window and modal forms re-center, so rotating a phone or toggling the viewport keeps the layout in place.

On touch devices the shared theme also enlarges inputs to 16px (which prevents iOS from zooming on focus), gives buttons and fields a 36px minimum height, disables sticky `:hover` styles and honours `prefers-reduced-motion`. The page control uses a 36px minimum tab height unless `TabHeight` is set, the menu bar and its entries grow to 36px, and grid rows get a 32px minimum so they can be tapped.

---

### Example (`Example/`)

A demo project showcasing all components including `TWWebDBConnection` + `TWWebDBTable` with progressive loading.

The **Grid Modes** tab shows the same `TWDataGrid` fed by all three sources (`Data`, `DataJSon`, `DataTable`) and lets you toggle responsive cards, grouping by a field, separator rows and CSV export — all in memory, so it works without a backend.

The **Layout** tab shows `TWSplitter` in both orientations, the **Canvas** tab shows `TShape` figures and a `TPaintBox` drawing a small bar chart, the **Tree** tab has a `TWTreeView` with folders built in code plus Expand/Collapse/Add child/Sort buttons, the **List** tab has a `TWListView` in report mode with columns, checkboxes, multi-select, column sorting and a view-style cycler, the **Drag** tab has automatic and manual drag sources with a panel and a list box as drop targets, the **Widgets** tab shows horizontal/vertical scroll bars, a spin edit, an associated up-down, an editable/list combo and an `&Name` accelerator label, the **Dialogs** tab opens file, colour and font dialogs and applies the result to a sample label, the **Other** tab has an editable `TWStringGrid`, and the main form has a **menu bar** (File / View / Help) built with `TWMainMenu`. The **View** menu has a **Mobile: fit layout** toggle that switches between the responsive viewport and a scaled fixed design width. The **Basic Inputs** tab has an **Action demo** button linked to a `TAction`; the same action appears in the View menu with `Ctrl+Shift+A`, so the caption, check mark and shortcut come from the action.

The demo starts on a **login form** and switches to the main form after a successful login — see [Multi-form login](#multi-form-login) below.

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
- `GET api.php?cmd=Login&UserName=demo&Password=demo` → `{ "result": true, "SessionId": "...", "scade": "...", "Name": "Demo User" }`

> **GitHub Pages note:** the compiled `project1.js` is committed, so the demo can be served statically (see below). `api.php` needs a PHP server, so it is not executed by GitHub Pages — keep it on your own host and point **Load from URL** at it (`api.php` sends `Access-Control-Allow-Origin: *`, so cross-origin calls work). The **Grid Modes** tab needs no backend at all.

### Mobile demo (`MobileDemo/`)

A second, phone-first demo built entirely in code (a plain `TWForm`, no `.lfm`) to show the mobile side of the framework:

* **Form** tab — labels, edits with `InputType` (`itEmail`, `itTel`, `itUrl`), memo, combo, checkbox and trackbar stacked with `Align := alTop` inside a `TWScrollBox`. No fixed coordinates.
* **Data** tab — `TWDataGrid` in card mode (`ResponsiveMode := True`, `ResponsiveBreakpoint := 0`) with the filter box.
* **Info** tab — live values of `Screen.ClientWidth/Height`, `IsTouch`, `IsMobile`, the safe-area insets and the viewport mode.
* A **bottom navigation bar** switches pages (the page control tab strip is hidden with `ShowTabs := False`).

The app enables `Application.ViewportFit := True`: the viewport gets `viewport-fit=cover` and forms are inset by `Screen.SafeArea*`, so controls stay clear of a notch. It is a PWA: `manifest.json` (standalone, theme colour, 192/512 icons) and `sw.js` cache the app shell. Install it from the browser's "Add to Home screen"; the service worker needs HTTPS or localhost.

```bash
pas2js -dPas2js -O- -Jeutf-8 "-Jirtl.js" -Jc -JRjs \
  -FuC:/lazarus/pas2js/packages/rtl/src -Fuwidgets -FuMobileDemo \
  -oMobileDemo/mobile.js MobileDemo/mobile.lpr
```

When the app assets change, bump `CACHE` in `sw.js` (`wcl-mobile-v2`, …) so installed clients fetch the new build.

### Hosting the demo on GitHub Pages

The workflow `.github/workflows/pages.yml` publishes `Example/` at the site root and copies `MobileDemo/` under `/MobileDemo/`:

1. In the repository, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Push to `master` (any change under `Example/` or `MobileDemo/` triggers a deploy), or run the workflow manually.

There is no build step in CI, so **`Example/project1.js` and `MobileDemo/mobile.js` must be committed**. After changing a demo, recompile it and commit the result:

```bash
pas2js -dPas2js -O- -Jeutf-8 -Jirtl.js -Jc -JRjs \
  -Fu<path-to-pas2js>/packages/rtl/src -Fuwidgets -FuExample \
  -oExample/project1.js Example/project1.lpr
git add -f Example/project1.js    # the file is git-ignored by Example/.gitignore
git commit -m "chore: rebuild demo"
```

`project1.js.map` (about 5 MB) stays ignored on purpose.

---

### Multi-form login

The demo shows the classic two-form flow: a login window first, then the application.

```
Example/uLogin.pas    TFormLogin (TWForm)   username / password / Accedi
Example/unit1.pas     TWForm1               the component demo
Example/project1.lpr  creates both, login first
```

`TApplication.UpdateMainForm` keeps the **first** form created as `MainForm`, and `Application.Run` shows it. Creating the login first therefore makes it the start screen; the main form stays hidden until the login succeeds:

```pascal
Application.Initialize;
Application.CreateForm(TFormLogin, FormLogin);   // first => MainForm
Application.CreateForm(TWForm1, WForm1);         // created, still hidden
Application.Run;
```

On success the login hides itself and shows the main form; the **Disconnect** button in the user panel does the opposite, so the app returns to the login:

```pascal
// TFormLogin.LoginSucceeded
WForm1.Caption := 'WCL Component Demo - ' + AName;
WForm1.Show;
Hide;

// TWForm1.btnScollegaUtenteClick
WUserPannel.Visible := False;
Hide;
FormLogin.PrepareLogin;   // clears password + error, keeps the username
FormLogin.Show;
```

The login asks `api.php?cmd=Login` and accepts `demo` / `demo`:

```pascal
VRaw := await fetch(url, { cache: 'no-store' })...   // JSON: result / Name / SessionId
```

Because GitHub Pages does not execute PHP, the client falls back to a local `demo` / `demo` check when the endpoint is unreachable or does not return valid JSON — the multi-form demo works on a static host too. Passwords are typed in the login window; nothing is stored.

### Notes
- Use only components from the _WCL_ palette tab
- Design-time units in `design/source/` use a `D` suffix to avoid name conflicts with runtime units
- Component icons are XPM in `design/image/`
- Runtime units in `widgets/` are compiled to JS
- `widgets/backup/` and `Example/backup/` hold obsolete snapshots and are git-ignored — not part of the build

### Feature notes

**Constraints** — `TSizeConstraints` on every control, published so it appears in the Object Inspector for every `TW*`. Values are enforced in `SetBounds`; `0` means "no limit", as in LCL.

```pascal
WEdit1.Constraints.MinWidth := 120;
WEdit1.Constraints.MaxWidth := 120;   // Width := 400 clamps to 120
```

**TWSplitter** — `TCustomSplitter` in `widgets/extctrls.pas`, `TWSplitter` in `widgets/webctrls.pas`.

```pascal
VSplitter.Align  := alLeft;   // or alRight / alTop / alBottom
VSplitter.MinSize := 80;
VSplitter.OnMoved := @SplitterMoved;
```

It resizes the nearest sibling with the same alignment, clamping to `MinSize` and leaving room for the `alClient` control; `Parent.ReAlign` then repositions everything. Dragging is tracked on `document`, so the pointer can leave the few-pixels-wide splitter, and works with both mouse and touch (the touch listeners are non-passive, so the page does not scroll while dragging). `ResizeStyle = rsNone` applies the size only on release.

The **Layout** tab in the demo shows a vertical and a horizontal splitter.

**ComboBox** — `DropDownCount` is published and `ItemHeight` applies `min-height` to the options. The native `<select>` dropdown height is browser-controlled, so `DropDownCount` exists for LCL compatibility.

**TWEdit.Autocomplete** — writes the HTML `autocomplete` attribute (`'username'`, `'current-password'`, `'off'`, …). Empty is the default and removes the attribute, leaving the browser behaviour untouched:

```pascal
edtUser.Autocomplete := 'username';
edtPassword.Autocomplete := 'current-password';
```

**TWEdit.InputType** — chooses the HTML `type` attribute: `itText` (default), `itEmail`, `itTel`, `itUrl` or `itSearch`. It selects the mobile keyboard layout and enables the browser validation hints; `PasswordChar` still forces `password`:

```pascal
edtEmail.InputType := itEmail;   // type="email", email keyboard
edtSite.InputType := itUrl;      // type="url", URL keyboard
```

Numeric edits set `inputmode` automatically: `numeric` for integers and `decimal` for floats, so the phone shows a number pad with the decimal separator.

**Graphics** — `TCanvas` supports `psSolid`, `psDash`, `psDot`, `psDashDot`, `psDashDotDot` and `psClear`; `TPicture` provides `Clear`, `IsEmpty`, `LoadFromDataURL`, `SaveToDataURL` and `LoadFromBase64`.

**Application** — `BackgroundColor: TColor` is applied to `document.body` in `Run` (falls back to `MainForm.Color`; `clDefault` leaves it untouched).

**TMainMenu** — `TMenuItem`, `TMenuItems` and `TMainMenu` in `widgets/menus.pas`; `TWMenuItem` and `TWMainMenu` in `widgets/webctrls.pas`.

```pascal
FMainMenu := TWMainMenu.Create(Self);
with FMainMenu.Items.Add('File') do
begin
  Items.Add('New', @NewClick);
  Items.AddSeparator;
  Items.Add('Exit', @ExitClick);
end;
```

`TMainMenu` creates a bar parented to its owner (a form) with `Align := alTop`, so the rest of the layout reflows by itself. Clicking a top item opens its dropdown; choosing an entry runs `OnClick` and closes it. Submenus open on click at any depth, with an arrow marker. Clicking outside, pressing `Esc`, or clicking the same item again closes the open level.

Items expose `Caption`, `ShortCut`, `Enabled`, `Checked`, `RadioItem`, `GroupIndex`, `AutoCheck`, `Default`, `ImageUrl`, `Visible` and `OnClick`; a caption of `-` renders a separator.

* **ShortCuts are live**: pressing the combination anywhere on the page runs the item, whatever menu level it is on. Plain keys (no `Ctrl`/`Alt`) are ignored while the focus is in an `input`, `textarea` or `select`.
* **Radio groups**: items with `RadioItem := True` and the same non-zero `GroupIndex` are mutually exclusive — checking one clears the others in the same list.
* **`AutoCheck`** toggles `Checked` on click, and **`Default`** renders the caption in bold.
* **Icons** are set with `ImageUrl` (a URL, resolved by the browser). `ImageIndex` is accepted for `.lfm` compatibility but is not resolved, because the runtime has no image list.

Items can be built in code (above) or designed in the IDE: drop `TWMainMenu` on a form and use the menu designer. The items are streamed from the `.lfm` and attached to the tree automatically; `ShortCut` uses the LCL numeric encoding (`TShortCut`), so `Ctrl+S` designed in the IDE arrives as `16467` and is rendered back as `Ctrl+S`.

**TPopupMenu** — `TPopupMenu` in `widgets/menus.pas`, `TWPopupMenu` in `widgets/webctrls.pas`. Assign it to any control's `PopupMenu` property to show it on right click:

```pascal
FGridPopup := TWPopupMenu.Create(Self);
FGridPopup.Items.Add('Open row', @OpenRowClick);
FGridPopup.Items.Add('Copy value', @CopyValueClick);
FGridPopup.Items.AddSeparator;
FGridPopup.Items.Add('Clear filter', @ClearFilterClick);
FDemoGrid.PopupMenu := FGridPopup;
```

`TControl.PopupMenu` is inherited by every control, so the same menu can be shared. The menu is rendered with the same CSS as the menu bar dropdowns (entries, separators, shortcuts, check marks, icons), opens at the mouse position, and flips left/up when it would leave the viewport. Choosing an entry runs its `OnClick`; clicking outside or pressing `Esc` closes it. `Items` accepts the same `TMenuItem` properties as `TMainMenu`, and the menu can also be designed in the IDE with the menu designer.

**Actions** — `TAction` and `TActionList` in `widgets/actnlist.pas`; `TWAction`, `TWActionList` in `widgets/webctrls.pas`. An action centralises caption, state and handler; controls and menu items linked to it follow the action and run it on click:

```pascal
FActionList := TActionList.Create(Self);
FAction := FActionList.AddAction;
FAction.Caption := 'Save';
FAction.ShortCut := TextToShortCut('Ctrl+S');
FAction.OnExecute := @SaveExecute;

SaveButton.Action := FAction;       // caption, enabled and click come from it
SaveItem.Action := FAction;         // menu item: caption, check mark, shortcut
```

`TControl.Action` is available on every control; `TMenuItem.Action` on menu entries. Changing `Caption`, `Enabled`, `Visible`, `Checked`, `Hint` or `ShortCut` updates every linked client immediately, and `Action.Execute` runs `OnExecute`. When a menu item is linked, the action shortcut is displayed and handled by the menu bar. `ActionList.Update` calls `OnUpdate` on each action and refreshes the clients, for state that depends on the application (call it from a timer or before opening a menu). Actions can be created in the IDE with the standard action list editor, or added in code with `AddAction`.

**TShape and TPaintBox** - `TCustomShape`, `TCustomPaintBox` in `widgets/extctrls.pas`; `TWShape`, `TWPaintBox` in `widgets/webctrls.pas`. Both draw on an HTML `<canvas>` that fills the control:

```pascal
Shape1.Shape := stEllipse;
Shape1.Brush.Color := clSkyBlue;
Shape1.Pen.Color := clNavy;
Shape1.Pen.Width := 2;

PaintBox1.OnPaint := @PaintBox1Paint;

procedure TForm1.PaintBox1Paint(Sender: TObject);
begin
  PaintBox1.Canvas.Clear;
  PaintBox1.Canvas.Font.Size := 16;
  PaintBox1.Canvas.TextOut(8, 8, 'Hello canvas');
  PaintBox1.Canvas.Brush.Color := clSkyBlue;
  PaintBox1.Canvas.FillRect(8, 40, 120, 24);
end;
```

`TShape` supports `stRectangle`, `stSquare`, `stRoundRect`, `stRoundSquare`, `stCircle`, `stEllipse`, `stTriangle` and `stSquaredTriangle`; the figure is redrawn whenever the control changes or `Shape`/`Pen`/`Brush` change. `TPaintBox` repaints on every layout change and exposes `Canvas` and `OnPaint`.

The canvas is a real Canvas 2D context, so the drawing primitives work on both controls: `FillRect`, `Rectangle`, `RoundRect`, `Ellipse`, `MoveTo`/`LineTo`, `Polygon`, `Polyline` and `TextOut`, with `Pen` (color, width, style) and `Brush` (color, style). `TCustomControl` repaints itself after layout changes, so `OnPaint` code runs again when the control is resized.

### Further plans

See [TODO.md](TODO.md) for the remaining LCL features, in priority order:
grid editing, actions, tree/list views, drag and drop, extra inputs, dialogs.
