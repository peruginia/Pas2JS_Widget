# WCL Designer (skeleton)

A small web designer for WCL forms and pas2js projects. It imports and saves
**LFM** files, shows the component tree, renders a graphical preview of the
form and lets you edit the properties of the selected component.

The LFM round-trip, import/export, property editing, the palette with
drag & drop, moving/resizing on the canvas, tree/list item editing, the
`.pas` field synchronisation and the pas2js build/preview are implemented.

## Requirements

- Apache + PHP 8 (XAMPP is fine)
- A project folder served by Apache
- The pas2js compiler: set the `PAS2JS` environment variable to its path, or
  use the default `C:\lazarus\pas2js\bin\x86_64-win64\pas2js.exe`
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
- Loads the project, lists its forms and opens the selected one.
- The toolbar has a project selector and a form selector; each form has its
  own LFM and unit.
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
- Saves the generated LFM back through `api.php` and synchronises the unit of
  the selected form.
- Shows and edits the `.pas` unit of the selected form in a **Source** tab;
  component fields and event handlers can be reached from the tree and the
  inspector.
- Creates application, host application and module projects.
- Builds the whole project (or the selected form) with pas2js and runs it in a
  preview dialog.
- Imports an existing `.lfm` as a new project.

Unknown properties, collections (`Columns = <...>`), string lists and binary
properties the designer does not decode are preserved as raw text, so saving a
form does not drop data the designer does not understand yet.

## Projects

A project is a folder in `designer/projects/<id>/` with a `project.json`:

```json
{
  "name": "WCL Demo",
  "kind": "application",
  "mainForm": "unit1.lfm",
  "forms": [
    { "form": "unit1.lfm", "unit": "unit1.pas", "title": "Components" },
    { "form": "uLogin.lfm", "unit": "uLogin.pas", "title": "Login" }
  ],
  "units": [],
  "program": "project1.lpr",
  "html": "project1.html",
  "modules": []
}
```

- `kind` is `application`, `host` or `module` and decides how Preview builds
  the project. A missing value means `application`.
- `forms` lists the forms; each entry has the LFM file, its unit and an
  optional title shown in the form selector.
- `mainForm` is the form opened when the project is selected.
- `units` lists additional units (without a form) that belong to the project.
- `program` names the `.lpr` that starts an application or host; for a module
  it is the `-Jc-` stub. When it is missing, Preview generates a fallback
  program in `preview/`.
- `html` names the deployment page (Preview generates its own page).
- `output` overrides the JavaScript file name (default: program name + `.js`).
- `manifest` (module) names the generated manifest (default `modules.json`).
- `entry` (module) is the unit a host runs with `rtl.run(entry)`.
- `modules` (host) lists the module manifests to load before the host program;
  relative paths are resolved from the project folder. A host next to the
  `module` project can use `"modules": ["../module/preview/lib/modules.json"]`.
- A single-form project written by the first designer version (`form`/`unit`)
  is accepted and normalized automatically.

A project may have no forms (a module or a unit-only project): the form
selector shows **No form**, the canvas is empty and the Source tab opens the
units.

The toolbar shows the project selector and the form selector. Switching forms
discards unsaved changes after a confirmation; the component tree, canvas and
Source tab follow the selected form. Save writes the selected LFM and
synchronises the selected form's unit; in a project without forms it saves the
open unit.

The **New project…** button asks for a name, a folder id and a type:

- **Application** creates a main form (`unit1.lfm` + `unit1.pas`),
  `project1.lpr` and `project1.html`;
- **Host application** creates the same files; its module manifests are set in
  the project settings;
- **Module** creates `module1.pas` with a `TModule1.Register` skeleton and a
  `project1.lpr` stub, compiled with `-Jc-`.

The **Project…** button opens a dialog with:

- **Settings**: name, type, program, HTML and output; modules also have the
  entry unit and the manifest, hosts have the module manifest list (one per
  line);
- **Forms**/**Units**:
  - **New form** creates `unitN.lfm` + `unitN.pas` (`TFormN` / `FormN`), adds
    them to the project and opens the new form;
  - **New unit** creates a plain `unitN.pas` (or the file name you type) and
    opens it in the Source tab;
  - **Open** switches to a form or opens a unit in the Source tab;
  - **Remove** deletes the entry from `project.json`; with **Also delete files**
    checked it also deletes the LFM/unit file. The last form cannot be removed;
  - form units are listed as `form` and are removed together with their form.

## Build and preview

The **Preview** button builds the project or the selected form and runs it in a
dialog. The selector next to it chooses the target:

- **Project** follows `kind`:
  - `application` compiles `program` with `-Jc`; when `program` is missing, a
    fallback program is generated from the main form and it uses every unit of
    the project;
  - `host` compiles its `program` the same way, then the generated page loads
    the manifests listed in `modules`, skips the units the host already
    provides and runs the host program;
  - `module` compiles `program` with `-Jc-` into `preview/lib/`, generates
    `modules.json` from the emitted `rtl.module()` calls and opens a load-test
    page (it reports the number of modules and the entry unit);
- **Current form** compiles a small generated program for the selected form.
  It is the quick way to look at a form that is not the application entry
  point.

The build then:

- writes unsaved form and unit changes first, so the preview matches the
  designer;
- requires form units to link their resource with `{$R *.lfm}` (the template
  used by **New form** does); a missing directive is reported instead of
  opening an empty form;
- runs pas2js with the runtime `widgets` folder and the project folder on its
  unit path, so the project units can use each other;
- resolves relative paths in the form (images, URLs) against the project
  folder, because the preview page uses it as its base;
- opens the result in a dialog on success; **Open in tab** opens the same page
  in a browser tab;
- opens the compiler output in a **Build log** dialog on failure.

Every build overwrites the generated files in `preview/`, which are not part of
the project sources. The page requests the new script with a cache-busting
query, so the browser does not keep the previous build. Host module manifests
are loaded as configured; building the module projects is a separate Preview
(there is no automatic dependency build yet).

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
- the same rows have a **+** button that creates the handler skeleton: the
  declaration in the form class and the implementation at the end of the
  unit. When the property is empty it also assigns a unique name such as
  `Button1Click`. This covers `TNotifyEvent` handlers (`Sender: TObject`);
  events with other signatures must be written by hand. The unit is left
  modified; saving it (or the form) persists both the unit and the event
  association;
- the pane is always editable: **Save** (or Ctrl+S) writes the unit with the
  `saveUnit` API action; if the form has unsaved changes (for example a new
  event association) it also writes the LFM, so the two files stay in sync.
  The status shows "Modified" until the text is saved, and the original line
  endings are preserved;
- switching between Design and Source keeps the editor content, caret,
  selection and scroll position (and returns the focus to the editor);
  **Reload** re-reads the file (asking before discarding unsaved changes), and
  a save or project reload refreshes it automatically;
- **F12** toggles between the form and the unit. Browsers that reserve F12 for
  the developer tools also accept **Ctrl+`**. The Design/Source buttons show
  the same switch.

## Properties

The inspector lists the properties stored in the LFM. For the known controls
it also shows the common published properties the form does not set yet
(`Text`, `Items.Strings`, `Checked`, `Min`/`Max`, `Visible`, ...). Those rows
have a dashed border and an italic label; editing one adds the property to the
LFM, so the form keeps only the values that differ from the defaults.

The default rows also include the common events: `OnClick`, `OnDblClick`,
`OnMouseEnter` and `OnMouseLeave` for every visual control, plus `OnChange`
for the input-like controls. They show the same `{ }` and `+` buttons as the
events already stored in the LFM, so a new component can get a handler
without adding the property first. The **Add property** box treats names
starting with `On` as identifiers when the type is Auto.

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
(name, class, unit). `lib/PasSync.php` updates the unit of the selected form:

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
  api.php                 projects/forms/units/build API
  lib/PasSync.php         add-only .pas field/uses synchronisation
  lib/ModuleManifest.php  modules.json generation for -Jc- builds
  assets/lfm.js           LFM parser + writer
  assets/lfm-binary.js    tree/list binary item codecs
  assets/app.js           palette, tree, canvas, inspector
  assets/style.css
  manifest/components.json
  projects/demo/          imported copy of examples/demo (unit1 + uLogin)
  tests/lfm.test.mjs      Node round-trip tests
  tests/binary.test.mjs   Node tree/list binary codec tests
  tests/pas-sync.test.php PHP .pas synchronisation test
```

## API

All responses are JSON.

| Action | Method | Parameters |
|---|---|---|
| `projects` | GET | - |
| `load` | GET | `project=<id>` and optional `form=<lfm>` |
| `unit` | GET | `project=<id>` and optional `unit=<pas>` |
| `saveUnit` | POST | JSON `{ "project": "<id>", "unit": "<pas>", "source": "..." }` |
| `save` | POST | JSON `{ "project": "<id>", "form": "<lfm>", "lfm": "...", "formClass": "TForm1", "components": [{ "name": "Button1", "className": "TWButton", "unit": "WebCtrls" }] }` |
| `createForm` | POST | JSON `{ "project": "<id>", "title": "..." }` |
| `deleteForm` | POST | JSON `{ "project": "<id>", "form": "<lfm>", "deleteFiles": true }` |
| `createUnit` | POST | JSON `{ "project": "<id>", "name": "<unit>.pas" }` |
| `deleteUnit` | POST | JSON `{ "project": "<id>", "unit": "<pas>", "deleteFile": true }` |
| `createProject` | POST | JSON `{ "id": "<id>", "name": "...", "kind": "application\|host\|module" }` |
| `updateProject` | POST | JSON `{ "project": "<id>", "settings": { "name": "...", "kind": "...", "program": "...", "html": "...", "output": "...", "entry": "...", "manifest": "...", "modules": ["..."] } }` |
| `build` | POST | JSON `{ "project": "<id>", "mode": "project\|form", "form": "<lfm>" }` |
| `import` | POST | JSON `{ "id": "...", "name": "...", "lfm": "..." }` |

`load` uses `mainForm` when `form` is omitted; `unit` uses the main form's unit
when `unit` is omitted. A project without forms returns `form: null` and an
empty `lfm`. `save` returns `ok`, `form`, `unit`, `bytes`, `pasChanged` and
`warnings`. The `formClass` and `components` fields are optional; when they are
omitted the `.pas` file is not touched.

`build` returns `ok`, `url`, `kind`, `program` and `output`; a module build also
returns `manifest`, and form mode returns `form`, `unit` and `formClass`. When
the compiler fails, `ok` is `false` and `output` contains the compiler log (or
the reason the build could not start).

## Tests

```powershell
node designer\tests\lfm.test.mjs
node designer\tests\binary.test.mjs
C:\Vario\xampp\php\php.exe designer\tests\pas-sync.test.php
```

The LFM test parses and rewrites `examples/demo/unit1.lfm`, `examples/demo/uLogin.lfm` and a
synthetic form with collections, string lists and binary data, then compares
the ASTs. The binary test decodes real Lazarus `Items.Data`/`Items.LazData`
blobs, checks the item structure and that re-encoding reproduces the original
bytes. The PHP test checks that missing fields and uses are added, existing
fields are not duplicated and a second run is a no-op.

## Notes / next steps

- The canvas is a preview, not a full layout engine: `Align` is simulated,
  `Anchors` and `ChildSizing` are not.
- `.pas` synchronisation only adds fields and units; it does not remove stale
  declarations or reorder the class. Event handlers are created explicitly
  with the **+** button in the inspector.
- The tree/list item editor changes text and structure only; image indexes
  and subitem images keep their decoded values and cannot be edited yet.
- The project preview follows `kind`: a host does not build its module
  projects, it loads the manifests configured in its settings, and a module
  preview is a load test (its screens appear when a host loads it). There is no
  automatic dependency build yet.
