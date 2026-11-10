# WCL Designer (skeleton)

A small web designer for WCL forms. It imports and saves **LFM** files, shows
the component tree, renders a graphical preview of the form and lets you edit
the properties of the selected component.

This is the first skeleton: the LFM round-trip, import/export and property
editing are implemented. A palette with drag & drop, adding components,
`.pas` field synchronisation and the pas2js build/preview are the next steps.

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
- Lets you edit properties; string, integer, boolean and raw LFM values are
  supported.
- Saves the generated LFM back through `api.php`.
- Imports an existing `.lfm` as a new project.

Unknown properties, collections (`Columns = <...>`), string lists and binary
properties (`Items.Data = {...}`) are preserved as raw text, so saving a form
does not drop data the designer does not understand yet.

## Layout

```text
designer/
  index.html              designer shell
  api.php                 projects/load/save/import API
  assets/lfm.js           LFM parser + writer
  assets/app.js           tree, canvas, inspector
  assets/style.css
  manifest/components.json
  projects/demo/          imported copy of Example/unit1.lfm
  tests/lfm.test.mjs      Node round-trip tests
```

## API

All responses are JSON.

| Action | Method | Parameters |
|---|---|---|
| `projects` | GET | - |
| `load` | GET | `project=<id>` |
| `save` | POST | JSON `{ "project": "<id>", "lfm": "..." }` |
| `import` | POST | JSON `{ "id": "...", "name": "...", "lfm": "..." }` |

## Tests

```powershell
node designer\tests\lfm.test.mjs
```

The test parses and rewrites `Example/unit1.lfm`, `Example/uLogin.lfm` and a
synthetic form with collections, string lists and binary data, then compares
the ASTs.

## Notes / next steps

- The canvas is a preview, not a full layout engine: `Align`/`Anchors` are
  not simulated yet.
- Adding components and synchronising fields in the `.pas` file is not
  implemented yet.
- `.lfm` binary properties are preserved but not decoded, so tree/list items
  cannot be edited in the web designer yet.
- Build/preview via pas2js will be added after the LFM editor is stable.
