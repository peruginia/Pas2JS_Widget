# WCL Designer (skeleton)

A small web designer for WCL forms. It imports and saves **LFM** files, shows
the component tree, renders a graphical preview of the form and lets you edit
the properties of the selected component.

The LFM round-trip, import/export, property editing, the palette with
drag & drop, moving/resizing on the canvas, tree/list item editing and the
`.pas` field synchronisation are implemented. The pas2js build/preview is the
next step.

## Requirements

- Apache + PHP 8 (XAMPP is fine)
- A project folder served by Apache
- Optional: Node.js only for the LFM parser tests

The current XAMPP setup exposes this folder as:

```text
http://127.0.0.1/Editor/
```

If Apache points somewhere else, add an alias like:

```apache
Alias /Editor "C:/Progetti/Remoti/Pas2JS_Widget/designer"
<Directory "C:/Progetti/Remoti/Pas2JS_Widget/designer">
    Require all granted
    DirectoryIndex index.html
</Directory>
```

Make sure `designer/projects` is writable by Apache.

## What it does

- Lists the projects in `designer/projects/<id>/`.
- Loads the form file declared in `project.json`.
- Parses LFM into a lossless AST in the browser.
- Shows the component tree and a graphical preview.
- Shows a palette of visual components; drag one onto the form or into a
  container (panel, group box, tab sheet, page control) to add it.
- Draws a preview of the common controls and shows every tab of a page
  control, with the active tab selectable.
- Moves and resizes components on the canvas; `Left`, `Top`, `Width` and
  `Height` are written back to the LFM.
- Lets you edit properties; string, integer, boolean and raw LFM values are
  supported. Common properties missing from the LFM are offered as defaults
  and any other property can be added by name.
- Edits `Items.Strings` and `Cells.Strings` as a list of rows instead of raw
  text.
- Decodes `TTreeView.Items.Data` and `TListView.Items.LazData` into an item
  editor; the canvas preview shows the tree nodes and list rows.
- Saves the generated LFM back through `api.php` and synchronises the `.pas`
  unit declared in `project.json`.
- Shows and edits the `.pas` unit in a **Source** tab; component fields and
  event handlers can be reached from the tree and the inspector.
- Imports an existing `.lfm` as a new project.

Unknown properties, collections (`Columns = <...>`), string lists and binary
properties the designer does not decode are preserved as raw text, so saving a
form does not drop data the designer does not understand yet.

## Canvas editing

Components on the canvas can be moved and resized with the mouse:

- drag a component to move it; `Left` and `Top` are updated;
- drag one of the eight handles of the selected component to resize it;
  `Width` and `Height` are updated (minimum 8×8);
- positions and sizes snap to an 8 px grid; hold **Alt** while dragging to
  move freely;
- the inspector and the status bar show the new coordinates.

Components with `Align` set (`alTop`, `alBottom`, `alLeft`, `alRight`,
`alClient`) are laid out the way LCL does: the aligned sides consume the
parent area in that order and `alClient` fills the rest. Aligned components
cannot be moved or resized on the canvas; set `Align = alNone` to move them
freely. `Anchors` are not simulated yet.

## Component previews

The canvas draws a preview for the common controls instead of a plain box:
buttons, edits, memos, combo boxes, list boxes, check boxes, radio buttons,
progress bars, sliders, spin edits, colour pickers, images, string grids and
pagination. The preview uses the LFM properties (`Caption`, `Text`,
`Items.Strings`, `Min`/`Max`/`Value`, `Color`, ...) and does not run the
runtime code.

## Source view

The **Design / Source** switch in the canvas header shows the `.pas` unit
declared in `project.json` next to the form:

- the source is loaded on demand with the `unit` API action and rendered in a
  text editor with a line-number gutter;
- selecting a component in the component tree scrolls to its field
  declaration;
- event properties (`OnClick`, `OnChange`, ...) have a **{ }** button that
  opens the source at the handler implementation;
- the pane is always editable: **Save** (or Ctrl+S) writes the unit with the
  `saveUnit` API action; the status shows "Modified" until it is saved, and
  the original line endings are preserved;
- switching between Design and Source keeps the editor content and scroll
  position; **Reload** re-reads the file (asking before discarding unsaved
  changes), and a save or project reload refreshes it automatically.

## Properties

The inspector lists the properties stored in the LFM. For the known controls
it also shows the common published properties the form does not set yet
(`Text`, `Items.Strings`, `Checked`, `Min`/`Max`, `Visible`, ...). Those rows
have a dashed border and an italic label; editing one adds the property to the
LFM, so the form keeps only the values that differ from the defaults.

String lists (`Items.Strings`, `Cells.Strings`) are edited as a list of rows
with add and remove buttons, not as raw text.

The **Add property** box at the bottom of the inspector accepts any property
name, a type (auto, string, integer, float, boolean, identifier, string list or
raw) and a value. It updates the property when it already exists.

## Page control

A `TWPageControl` is drawn with a tab strip for all its `TTabSheet` children:

- click a tab to show that sheet in the designer; the active page is stored in
  `ActivePage`;
- selecting a tab sheet (or one of its children) in the component tree shows
  its tab as well;
- the **Pages** section of the inspector renames, activates and deletes tabs
  and adds new ones;
- dropping a `TTabSheet` from the palette onto a page control adds a tab;
  dropping it elsewhere is refused.

The tab sheet fills the page control below the tab strip, so the components
inside it keep their own `Left`/`Top`.

## Tree and list items

`TTreeView` stores its nodes in the binary `Items.Data` property and
`TListView` stores its items in `Items.LazData` (Delphi writes `Items.Data`
instead). The designer decodes both formats:

- the inspector shows an **Items** editor for the selected tree view or list
  view: add, edit and delete nodes (tree) or items and subitems (list);
- the canvas preview renders the decoded nodes and rows;
- only the text and the structure are edited; image indexes, state indexes
  and subitem images are preserved.

Both the LCL and the Delphi list formats are written back in the format they
were read in. Tree nodes are always written in the current LCL format
(`StreamVersion` 2), which the Lazarus IDE reads.

## `.pas` synchronisation

On save the designer also sends the form class name and the list of components
(name, class, unit). `lib/PasSync.php` updates the unit declared as `unit` in
`project.json`:

- adds missing units to the **interface** `uses` clause;
- adds missing fields right after the form class header, using the same
  indentation as the class;
- keeps the existing line endings.

The update is deliberately conservative: it only adds. It never removes stale
fields, never rewrites existing declarations, never generates event handlers
and never touches the implementation section. Existing fields are detected by
name, so repeated saves are idempotent.

```pascal
type
  TForm1 = class(TWForm)
    Button1: TWButton;
    Edit1: TWEdit;
  private
  public
  end;
```

When no change is needed the file is left untouched; the save response reports
`pasChanged` and any `warnings` (for example a missing unit file or a form class
that could not be located).

## Layout

```text
designer/
  index.html              designer shell
  api.php                 projects/load/save/import API
  lib/PasSync.php         add-only .pas field/uses synchronisation
  assets/lfm.js           LFM parser + writer
  assets/lfm-binary.js    tree/list binary item codecs
  assets/app.js           palette, tree, canvas, inspector
  assets/style.css
  manifest/components.json
  projects/demo/          imported copy of Example/unit1.lfm
  tests/lfm.test.mjs      Node round-trip tests
  tests/binary.test.mjs   Node tree/list binary codec tests
  tests/pas-sync.test.php PHP .pas synchronisation test
```

## API

All responses are JSON.

| Action | Method | Parameters |
|---|---|---|
| `projects` | GET | - |
| `load` | GET | `project=<id>` |
| `unit` | GET | `project=<id>` |
| `saveUnit` | POST | JSON `{ "project": "<id>", "source": "..." }` |
| `save` | POST | JSON `{ "project": "<id>", "lfm": "...", "formClass": "TForm1", "components": [{ "name": "Button1", "className": "TWButton", "unit": "WebCtrls" }] }` |
| `import` | POST | JSON `{ "id": "...", "name": "...", "lfm": "..." }` |

`save` returns `ok`, `bytes`, `pasChanged` and `warnings`. The `formClass` and
`components` fields are optional; when they are omitted the `.pas` file is not
touched.

## Tests

```powershell
node designer\tests\lfm.test.mjs
node designer\tests\binary.test.mjs
C:\Vario\xampp\php\php.exe designer\tests\pas-sync.test.php
```

The LFM test parses and rewrites `Example/unit1.lfm`, `Example/uLogin.lfm` and a
synthetic form with collections, string lists and binary data, then compares
the ASTs. The binary test decodes real Lazarus `Items.Data`/`Items.LazData`
blobs, checks the item structure and that re-encoding reproduces the original
bytes. The PHP test checks that missing fields and uses are added, existing
fields are not duplicated and a second run is a no-op.

## Notes / next steps

- The canvas is a preview, not a full layout engine: `Align` is simulated,
  `Anchors` and `ChildSizing` are not.
- `.pas` synchronisation only adds fields and units; it does not remove stale
  declarations, generate event methods or reorder the class.
- The tree/list item editor changes text and structure only; image indexes
  and subitem images keep their decoded values and cannot be edited yet.
- Build/preview via pas2js will be added after the LFM editor is stable.
