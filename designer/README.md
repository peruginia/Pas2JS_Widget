# WCL Designer (skeleton)

A small web designer for WCL forms. It imports and saves **LFM** files, shows
the component tree, renders a graphical preview of the form and lets you edit
the properties of the selected component.

The LFM round-trip, import/export, property editing, the palette with
drag & drop and the `.pas` field synchronisation are implemented. The pas2js
build/preview is the next step.

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
- Lets you edit properties; string, integer, boolean and raw LFM values are
  supported.
- Saves the generated LFM back through `api.php` and synchronises the `.pas`
  unit declared in `project.json`.
- Imports an existing `.lfm` as a new project.

Unknown properties, collections (`Columns = <...>`), string lists and binary
properties (`Items.Data = {...}`) are preserved as raw text, so saving a form
does not drop data the designer does not understand yet.

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
  assets/app.js           palette, tree, canvas, inspector
  assets/style.css
  manifest/components.json
  projects/demo/          imported copy of Example/unit1.lfm
  tests/lfm.test.mjs      Node round-trip tests
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
C:\Vario\xampp\php\php.exe designer\tests\pas-sync.test.php
```

The LFM test parses and rewrites `Example/unit1.lfm`, `Example/uLogin.lfm` and a
synthetic form with collections, string lists and binary data, then compares
the ASTs. The PHP test checks that missing fields and uses are added, existing
fields are not duplicated and a second run is a no-op.

## Notes / next steps

- The canvas is a preview, not a full layout engine: `Align`/`Anchors` are
  not simulated yet.
- `.pas` synchronisation only adds fields and units; it does not remove stale
  declarations, generate event methods or reorder the class.
- `.lfm` binary properties are preserved but not decoded, so tree/list items
  cannot be edited in the web designer yet.
- Build/preview via pas2js will be added after the LFM editor is stable.
