# WCL roadmap

Gaps compared to the LCL/VCL widgetset, in the order they are worth closing.
This list covers base functionality only: features the browser cannot provide
by itself, not platform-specific ones (MDI, docking, printing, registry).

## 1. TShape and TPaintBox — done

Custom drawing on top of the existing Canvas 2D: `TShape` (rectangle, square,
round rect, round square, circle, ellipse, triangle, squared triangle) and
`TPaintBox` (`OnPaint` + `Canvas`). `TCanvas` gained `Ellipse`, `RoundRect`,
`Polygon` and `Polyline`; `TCustomControl` repaints when it changes.

## 2. TStringGrid editing and events — done

`TCustomGrid` now has an inline `<input>` editor, `goEditing`/`goTabs` options,
keyboard navigation (arrows, Home/End, PageUp/Down, Enter, F2, Delete, Tab) and
the missing events: `OnSelectCell` (with `CanSelect`), `OnGetEditText`,
`OnSetEditText`, `OnEditingDone` and `OnDrawCell` (DOM cell, like
`OnDrawColumnCell`). `EditorMode` reflects and controls the editor, mouse
clicks resolve the cell from the DOM, `ScrollToCell` keeps the selection
visible, and `InvalidateCell` repaints. See the StringGrid editing section in
the README.

## 3. TActionList and TAction — done

`TBasicAction` lives in `controls.pas` (caption, enabled, visible, checked,
hint, shortcut, `Update`, client links); `TAction`/`TActionList` are in
`widgets/actnlist.pas`, with `TWAction`/`TWActionList` in `webctrls.pas`.
`TControl.Action` and `TMenuItem.Action` link controls and menu items to an
action: caption/state/shortcut follow the action, clicking runs `OnExecute`,
and the menu bar handles the shortcut of a linked item. Actions can be added
in code or designed with the action list editor (nested `TAction` blocks are
registered for the reader).

## 4. TTreeView and TListView — done

`TTreeView` is done: `TTreeNode`/`TTreeNodes` and `TCustomTreeView` live in
`widgets/comctrls.pas` (published as `TWTreeView`), rendering nested
`<ul>`/`<li>` rows with selection, expand/collapse, keyboard navigation,
`ShowLines`/`ShowRoot`/`ShowButtons`, `Indent`/`RowHeight`, `FullExpand`/
`FullCollapse`, `AlphaSort` and the LCL events. Nodes are built in code; the
binary `Items.Data` saved by the IDE tree editor is accepted and ignored.

`TListView` is done too: `TListItem`/`TListItems` and `TListColumn`/
`TListColumns` back `TCustomListView` (published as `TWListView`). It renders
`vsReport` as a sortable table, `vsList`/`vsSmallIcon` as rows and `vsIcon` as
a responsive tile grid, with checkboxes, multi-selection, keyboard navigation,
`OnSelectItem`/`OnChange`/`OnColumnClick`/`OnItemChecked`, `AlphaSort` and the
shared touch theme. Items are built in code; `Items.Data`/`Items.LazData` from
the IDE list editor are accepted and ignored.

## 5. Drag and drop between controls — done

`TControl` now has `DragMode` (`dmManual`/`dmAutomatic`), `DragKind`,
`Dragging`, `BeginDrag`, `EndDrag` and the `OnStartDrag`/`OnDragOver`/
`OnDragDrop`/`OnEndDrag` events. A global drag manager in `controls.pas`
tracks the pending click, uses pointer events with pointer capture, finds
the control under the pointer, shows a ghost element and highlights the
accepted target (`.wcl-drag-over`). `OnDragOver` decides whether a control
accepts the drop; `OnDragDrop` receives the source and target-relative
coordinates. `TDragObject` is the drag payload and `Esc` cancels a drag.

## 6. TScrollBar, TSpinEdit/TUpDown, TComboBox.Style, TLabel accelerators — done

`TScrollBar` (StdCtrls) uses a native range input and exposes `Kind`,
`Min`/`Max`, `Position`, `PageSize`, `SmallChange`/`LargeChange` and
`OnChange`/`OnScroll`. `TSpinEdit` (NumCtrls) builds on the numeric edit with
a native number input, `Value`, `MinValue`/`MaxValue` and `Increment`;
`TUpDown` adds two buttons with `Associate`, `Min`/`Max`, `Position`,
`Orientation`, `Wrap`, `OnChanging`/`OnChangingEx`/`OnClick`.
`TComboBox.Style` supports `csDropDown` (editable with a datalist) and
`csDropDownList` (read-only); `TopIndex`/`Columns` are accepted for LCL
compatibility. `TListBox` supports `TopIndex`/`Columns`. `TLabel.ShowAccelChar`
renders `&X` as an underlined accelerator and focuses `FocusControl` on
Alt+X.

## 7. File, colour and font dialogs

Only `MessageDlg`/`ShowMessage`/`InputBox` exist. Add `TOpenDialog`/
`TSaveDialog` as wrappers around `<input type="file">` (with `Filter`,
`FileName`, `Execute` callback), `TColorDialog` around `<input type="color">`,
and `TFontDialog` with a small built-in picker. Keep the asynchronous callback
style already used by `ShowModal`.

## Also worth considering

* `TClipboard` (`navigator.clipboard` with a `document.execCommand` fallback).
* `TForm.Menu`/`Position`/`WindowState` for `.lfm` compatibility.
* `Application.OnIdle`/`OnException` and `QueueAsyncCall`.
* `TImageList` so `ImageIndex` works in menus and toolbars.
* `TStatusBar`/`TToolBar`/`THeaderControl`.
