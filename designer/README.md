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
  supported.
- Decodes `TTreeView.Items.Data` and `TListView.Items.LazData` into an item
  editor; the canvas preview shows the tree nodes and list rows.
- Saves the generated LFM back through `api.php` and synchronises the `.pas`
  unit declared in `project.json`.
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

The canvas remains a preview: `Align` and `Anchors` are not simulated, so a
component with `Align` set may be laid out differently in the browser.

## Component previews

The canvas draws a preview for the common controls instead of a plain box:
buttons, edits, memos, combo boxes, list boxes, check boxes, radio buttons,
progress bars, sliders, spin edits, colour pickers, images, string grids and
pagination. The preview uses the LFM properties (`Caption`, `Text`,
`Items.Strings`, `Min`/`Max`/`Value`, `Color`, ...) and does not run the
runtime code.

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

- The canvas is a preview, not a full layout engine: `Align`/`Anchors` are
  not simulated yet.
- `.pas` synchronisation only adds fields and units; it does not remove stale
  declarations, generate event methods or reorder the class.
- The tree/list item editor changes text and structure only; image indexes
  and subitem images keep their decoded values and cannot be edited yet.
- Build/preview via pas2js will be added after the LFM editor is stable.
