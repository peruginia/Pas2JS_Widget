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

## 3. TActionList and TAction

No action support: handlers are duplicated per control and `Enabled`/`Checked`
are not centralised. Implement `TAction` (Caption, ShortCut, Enabled, Checked,
OnExecute, OnUpdate), `TActionList`, and the `Action` property on buttons, menu
items and edits.

## 4. TTreeView and TListView

The two data controls still missing. `TTreeView` (nested `<ul>`/`<li>` with
expand/collapse, selection, `OnChange`, `OnExpanding`) and `TListView` (columns,
`ViewStyle` vs/icons/details, selection, `OnSelectItem`). Both should reuse the
existing CSS theme and support touch scrolling.

## 5. Drag and drop between controls

No `DragMode`, `DragKind`, `OnDragOver`, `OnDragDrop`, `OnStartDrag`,
`OnEndDrag` or `BeginDrag`. Add pointer-capture based dragging with a
`TDragObject`, a drop target under the pointer and a `TDragImageList`-free
ghost element.

## 6. TScrollBar, TSpinEdit/TUpDown, TComboBox.Style, TLabel accelerators

* `TScrollBar` (`Min`/`Max`/`Position`/`PageSize`/`Kind`/`OnScroll`).
* `TSpinEdit`/`TUpDown` on top of the numeric edits.
* `TComboBox.Style` (`csDropDown` editable, `csDropDownList`), `TopIndex`,
  `Columns`; `TListBox.TopIndex`/`Columns`.
* `TLabel.ShowAccelChar`: render `&X` as an underlined accelerator and focus
  `FocusControl` on Alt+X.

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
