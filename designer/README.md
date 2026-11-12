# WCL Designer (skeleton)

A small web designer for WCL forms and pas2js projects. It imports and saves
**LFM** files, shows the component tree, renders a graphical preview of the
form and lets you edit the properties of the selected component.

The LFM round-trip, import/export, property editing, the palette with
drag & drop, moving/resizing on the canvas, tree/list item editing, the
`.pas` field synchronisation and the pas2js build/preview are implemented.

## Requirements

- Apache + PHP 8 on the **API server** (XAMPP is fine)
- The API server serves `designer/projects` and can write to it
- The pas2js compiler on the API server: set the `PAS2JS` environment variable
  to its path, or use the default
  `C:\lazarus\pas2js\bin\x86_64-win64\pas2js.exe`
- A static web server for `index.html`, `assets/`, `manifest/` and `config.js`
  (the same Apache folder is fine; see
  [Frontend and API on different servers](#frontend-and-api-on-different-servers))
- Optional: Node.js only for the LFM parser tests
- No CDN is required at runtime: CodeMirror 5 (MIT) is vendored under
  `designer/assets/vendor/codemirror`

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
- Loads the project, lists its forms and opens the main one.
- The toolbar has the project selector, the current form name and the
  **Compile** / **Run** actions; **Files** in the left panel switches forms.
- Parses LFM into a lossless AST in the browser.
- Shows the component tree and a graphical preview.
- Shows a palette of visual components above the canvas in Design mode; drag
  one onto the form or into a container (panel, group box, tab sheet, page
  control) to add it.
- Draws a preview of the common controls and shows every tab of a page
  control, with the active tab selectable.
- Moves and resizes components on the canvas; `Left`, `Top`, `Width` and
  `Height` are written back to the LFM.
- Edits with undo/redo, copy/paste/duplicate/delete, multi-selection,
  alignment/distribution and z-order.
- Lets you edit properties; string, integer, boolean, raw LFM values, known
  enumerations, colours and sets have dedicated editors. Common properties
  missing from the LFM are offered as defaults, nested properties are grouped,
  and any other property can be added by name.
- Splits the inspector into **Properties** and **Events** tabs with a name
  filter.
- Renders fonts (`Font.Name`, `Font.Height`/`Font.Size`, `Font.Style`,
  `Font.Color`) and `Color`/`ParentColor` backgrounds in the canvas preview.
- Edits `Items.Strings` and `Cells.Strings` as a list of rows instead of raw
  text.
- Decodes `TTreeView.Items.Data` and `TListView.Items.LazData` into an item
  editor; the canvas preview shows the tree nodes and list rows.
- Edits DataGrid and ListView columns with a dedicated editor (title, field,
  width, alignment, format, visibility, ...).
- Saves the generated LFM back through `api.php` and synchronises the unit of
  the selected form.
- Shows and edits the project sources in a **Source** tab: the selected form's
  unit, extra units and the project program (`.lpr`); component fields and
  event handlers can be reached from the tree and the inspector.
- Shows the project files in the always-visible **Files** panel: forms, units,
  the program, text/configuration files and assets; new forms/units and asset
  uploads are started from the same panel.
- Saves automatic project snapshots before writes and restores them from
  **History…**.
- Autosaves unsaved forms and sources as local drafts and offers to restore
  them after a reload or crash.
- Creates application, host application and module projects.
- Compiles the whole project (or the selected form) with pas2js, with a
  separate **Compile** action, and runs it in a preview dialog with **Run**.
- Imports a project from a ZIP archive (LFM, PAS, LPR, HTML and assets).

Unknown properties, binary blobs and collections the designer does not decode
are preserved as raw text, so saving a form does not drop data the designer
does not understand yet.

## Workspace layout

- The top bar contains the project selector, the current form name, **Save**,
  the build target (project or current form), **Compile**, **Run**, the main
  menu and the status message. The menu holds new/import project, project
  settings, reload, save all and the last build log.
- The left panel always shows **Project files** on top and the **Components**
  tree below. Both sections scroll independently; creating forms/units,
  uploading assets and opening the project history are in the Files section.
- In Design mode a compact component palette sits above the form, with a
  search box and a horizontal list. It is hidden in Source mode.
- The inspector remains on the right with its Properties/Events tabs and
  filter.

## Frontend and API on different servers

`index.html`, `assets/` and `config.js` are a static frontend; `api.php` and
its folders run on the API server. To publish the frontend on GitHub Pages or
another static host:

1. copy `index.html`, `assets/`, `manifest/` and `config.js` to the static
   host;
2. set `apiBase` in `config.js` to the full URL of `api.php`, for example
   `https://example.com/Editor/api.php`;
3. optionally set `previewBase` to the folder that serves `designer/projects/`.
   By default the preview is resolved next to `api.php`;
4. serve `designer/projects/` from the API server: the browser loads the
   generated preview page and its scripts directly from there;
5. allow the frontend origin with `WCL_CORS_ORIGINS` (comma-separated origins)
   or leave it empty to accept any origin. Use the origin only, without the
   repository path: `https://user.github.io`, not
   `https://user.github.io/repo/`;
6. use HTTPS on both sides: an HTTPS frontend cannot call an HTTP API.

The API server needs PHP 8, `zlib`, the `widgets/` folder and pas2js; the
static host needs none of them.

Apache example:

```apache
SetEnv WCL_CORS_ORIGINS "https://user.github.io"
```

`api.php` answers `OPTIONS` preflights and sends the CORS headers. The preview
is a separate static document loaded from the API server; do not block it with
`X-Frame-Options` if you use the preview dialog.

CORS is not authentication. Anyone who can reach `api.php` can read, change,
delete projects and run pas2js. Use it on a trusted network or protect it with
a reverse proxy or HTTP authentication: a public static frontend cannot keep
an API secret.

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

- `kind` is `application`, `host` or `module` and decides how Compile/Run build
  the project. A missing value means `application`.
- `forms` lists the forms; each entry has the LFM file, its unit and an
  optional title shown in the Files panel and top bar.
- `mainForm` is the form opened when the project is selected.
- `units` lists additional units (without a form) that belong to the project.
- `program` names the `.lpr` that starts an application or host; for a module
  it is the `-Jc-` stub. When it is missing, Compile/Run generate a fallback
  program in `preview/`.
- `html` names the deployment page; the designer generates its own page for
  the preview.
- `output` overrides the JavaScript file name (default: program name + `.js`).
- `manifest` (module) names the generated manifest (default `modules.json`).
- `entry` (module) is the unit a host runs with `rtl.run(entry)`.
- `modules` (host) lists the module manifests to load before the host program;
  relative paths are resolved from the project folder. A host next to the
  `module` project can use `"modules": ["../module/preview/lib/modules.json"]`.
- A single-form project written by the first designer version (`form`/`unit`)
  is accepted and normalized automatically.

A project may have no forms (a module or a unit-only project): the top bar
shows **No form** and the project opens directly in the Source tab, on the
entry unit when one is configured (or the first unit).

The built-in **demo** project is listed first and opened at startup; it
contains the Components and Login forms.

The left **Files** panel and the top bar show the current form. The component
tree, canvas and Source tab follow that form. Moving between forms and units
keeps the changes in memory; **Save all** writes every modified LFM and
unit. Unsaved changes are discarded only when you switch project or reload,
after a confirmation.

The **New project…** button asks for a name, a folder id and a type:

- **Application** creates a main form (`unit1.lfm` + `unit1.pas`),
  `project1.lpr` and `project1.html`;
- **Host application** creates the same files; its module manifests are set in
  the project settings;
- **Module** creates `module1.pas` with a `TModule1.Register` skeleton and a
  `project1.lpr` stub, compiled with `-Jc-`.

The **Import project…** button imports an existing project from a ZIP archive
(see below).

The **Project…** button opens a dialog with:

- **Settings**: name, type, program, HTML and output; modules also have the
  entry unit and the manifest, hosts have the module manifest list (one per
  line). **Delete project** removes the whole project folder;
- **Program** opens the `.lpr` configured in Settings in the Source tab;
- **Forms**/**Units**:
  - **New form** creates `unitN.lfm` + `unitN.pas` (`TFormN` / `FormN`), adds
    them to the project and opens the new form;
  - **New unit** creates a plain `unitN.pas` (or the file name you type) and
    opens it in the Source tab;
  - **Open** switches to a form or opens a unit in the Source tab;
  - **Remove** deletes the entry from `project.json`; with **Also delete files**
    checked it also deletes the LFM/unit file. The last form cannot be removed;
  - form units are listed as `form` and are removed together with their form.

## Project files and history

The **Files** tab in the left panel lists the project files and assets:

- **Forms** (`.lfm`) open in the designer;
- Pascal units and the program (`.pas`, `.lpr`) open in the source editor and
  are saved through `saveUnit`;
- HTML, CSS, JS, JSON, Markdown, XML, SVG and other text files open in the
  same editor and are saved through `writeFile`;
- images and other assets open in a new browser tab.

The buttons at the bottom create a new form or unit, upload an image/font
asset (PNG, JPEG, GIF, WebP, ICO, SVG, WOFF/WOFF2, TTF/OTF, EOT or PDF, up
to 4 MB) and open the project history. Text files are limited to 2 MB and to
the extensions the API accepts. `project.json` is shown in the tree but is
edited from **Project…**, not as a text file.

**History** creates a snapshot automatically before every form, source, text
file or asset write, and before forms/units/settings are removed. Snapshots
contain the project files but not the generated `preview/` folder or the
snapshot folder itself; the last 40 are kept. The history dialog lists them
and can restore one. Restoring first creates a safety snapshot of the current
files, then replaces the project contents. Restoring while there are unsaved
changes asks for confirmation and discards them.

Project paths are validated before any read or write: absolute paths, `..`,
hidden entries and the `preview/` and `.snapshots/` folders are rejected. The
`projects/.htaccess` file denies direct access to hidden paths on Apache when
`AllowOverride` is enabled. Snapshots and project files still live under the
web root: for a shared deployment, protect `designer/projects` with
authentication as well.

## Unsaved changes

Moving between forms, units and the Design/Source tabs never saves or discards
anything. Modified forms and source files stay in memory:

- the toolbar **Save all** writes every modified LFM and source file (Ctrl+S
  outside the source editor does the same); forms are saved after their units,
  so the `.pas` synchronisation sees the latest unit text;
- the Source **Save** (or Ctrl+S in the editor) writes the current source file
  and writes its form when the form is modified;
- switching project or pressing **Reload** discards all unsaved changes after a
  confirmation; deleting a form or unit warns when it has unsaved changes;
- the browser warns before closing the page while something is unsaved.

Changes live in the browser: a page reload without the prompt (for example a
crash) loses the in-memory state, but the designer also keeps **local drafts**
of modified forms and sources in `localStorage`:

- drafts are written at most every 1.5 seconds while editing and again when
  the page is hidden or unloaded;
- when a project is opened again in the same browser profile, a dialog lists
  the autosaved files; **Restore all** puts them back in memory and opens the
  first one, while **Discard all** removes them;
- the drafts are removed automatically after a successful save or a discard;
- drafts are per browser profile and are not shared between devices; clearing
  the browser data also removes them. Server-side drafts would be the next
  step for cross-device/team recovery, and need authentication.

## Importing a project

**Import project…** takes a ZIP of the project folder (LFM, PAS, LPR, LPI,
HTML, JS, CSS, images, fonts and `.res`). It asks for the folder id, the name
and the project type; the type is not guessed because host and application
projects look alike.

- The ZIP is limited to 20 MB, 2000 files, 10 MB per file and 50 MB
  uncompressed. Files inside `backup/`, `backups/`, `.git/`, `node_modules/`
  and `__MACOSX/` are skipped.
- If the archive has a single top-level folder, it becomes the project root;
  asset subfolders are preserved.
- The program is the `.lpr` (preferring one matching the project name when
  there are several). The main form is the first `Application.CreateForm` in
  the program; otherwise the first form.
- Every `.lfm` becomes a form with the `.pas` of the same name; when the unit
  is missing a stub with the LFM class and `{$R *.lfm}` is created. The form
  title comes from the LFM `Caption`.
- Other `.pas` files become project units. For a module, `entry` is the last
  project unit in the program `uses` clause (falling back to the first unit).
- An HTML file that references the compiled JS becomes `html`. A `project.json`
  already in the archive keeps its program, HTML, output, manifest, entry and
  module list when those values are valid.
- Only the whitelisted extensions are written. Server-side files (`.php`,
  `.phtml`, `.phar`, `.htaccess`, `.ini`, ...) and paths with `..` or absolute
  names are rejected, because the project folder is served by Apache.
- Nested `.pas`/`.lfm`/`.lpr` files are copied as assets but are not part of
  the designer project: the project model keeps forms and units flat.
- Warnings (multiple programs, generated units, ignored nested sources) are
  reported in the status line and its tooltip.

The importer uses an internal ZIP reader, so the PHP `zip` extension is not
required; only `zlib` is used for deflate entries.

## Build and preview

**Compile** builds the project or the selected form without opening the
preview; the result and warnings are available from **Build log** in the main
menu. **Run** builds the same target and opens it in a dialog. The target
selector next to them chooses the mode:

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

**F9** runs the target and **Ctrl+F9** compiles it without opening the
preview.

The build then:

- writes all unsaved changes first, so the preview matches the designer;
- requires form units to link their resource with `{$R *.lfm}` (the template
  used by **New form** does); a missing directive is reported instead of
  opening an empty form;
- compiles a copy of the program without `{$R ...res}` directives when the
  program links a Windows resource file: the browser build does not need it and
  an imported project may not contain the `.res`;
- runs pas2js with the runtime `widgets` folder and the project folder on its
  unit path, so the project units can use each other;
- resolves relative paths in the form (images, URLs) against the project
  folder, because the preview page uses it as its base;
- opens the result in a dialog on success; **Open in tab** opens the same page
  in a browser tab;
- opens the compiler output in a **Build log** dialog on failure. Lines in the
  form `unit.pas(line,column) Error: ...` are clickable: they open the unit in
  the source view, scroll to the line and highlight it.

Every build overwrites the generated files in `preview/`, which are not part of
the project sources. The page requests the new script with a cache-busting
query, so the browser does not keep the previous build. Host module manifests
are loaded as configured; building the module projects is a separate Run
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

### Selection and multiple components

- **Ctrl+click** (or **Shift+click**) a component or a tree row to add or
  remove it from the selection; a normal click selects it alone.
- When more than one component is selected, an alignment bar appears with
  **Left**, **Center**, **Right**, **Top**, **Middle**, **Bottom** and
  **Dist H**/**Dist V** (three or more). The components must share the same
  parent and have `Align = alNone`; distribution keeps the first and last
  positions and spaces the others evenly.
- Dragging one of the selected components moves the whole selection; resize
  handles appear only for a single selection.

### Undo, copy and z-order

- **Undo** and **Redo** (toolbar buttons, `Ctrl+Z`, `Ctrl+Y` or
  `Ctrl+Shift+Z`) keep up to 100 states of the current form. Each form keeps
  its own history while it has unsaved changes; the history is also restored
  when you switch back to that form.
- The **Edit** menu in the canvas header and the keyboard shortcuts provide:
  - `Ctrl+C` / `Ctrl+V`: copy and paste selected components. Paste uses the
    selected container (or its parent); tab sheets are pasted into their page
    control. Names are made unique and the copies are offset by 16 px.
  - `Ctrl+D`: duplicate the selection.
  - `Delete` / `Backspace`: delete the selection.
  - **Bring to front**, **Send to back**, **Bring forward**, **Send backward**:
    change the child order in the LFM.
  - `Ctrl+Z` / `Ctrl+Y`: undo and redo.
- Undoing back to the saved state clears the modified marker; any later
  modification marks the form dirty again.

The `.pas` synchronisation is add-only: deleting a component removes it from
the LFM, but its field in the form class is left in place and can be removed by
hand.

## Component previews

The canvas draws a preview for the common controls instead of a plain box:
buttons, edits, memos, combo boxes, list boxes, check boxes, radio buttons,
progress bars, sliders, spin edits, colour pickers, images, string grids,
data grids and pagination. The preview uses the LFM properties (`Caption`,
`Text`, `Items.Strings`, `Min`/`Max`/`Value`, `Color`, ...) and does not run
the runtime code. Captions and text also use `Font.Name`, `Font.Height` /
`Font.Size`, `Font.Style` and `Font.Color`; a control with `ParentFont = True`
inherits the font of its parent. Editing a font property writes
`ParentFont = False`, as the LCL object inspector does, so the value is not
inherited at run time.

`Color` and `ParentColor` paint the component background: a control with
`ParentColor = True` inherits the parent colour, while `clDefault` and
`clNone` leave the element transparent. Editing `Color` writes
`ParentColor = False`. A `TWDataGrid` with columns also shows its visible
column titles and applies the column `Font` / `TitleFont`, `Color`, width,
alignment and `Visible`; `AlternateRowColor` paints the alternate rows and
`ShowHeader` hides or shows the header line.

## Source view

The **Design / Source** switch in the canvas header shows a source file of the
project: the selected form's `.pas` unit, an extra unit, or the program
(`.lpr`) opened from the **Program** section of the Project dialog.

- the source is loaded on demand with the `unit` API action (which also serves
  the configured program) and rendered with **CodeMirror**: Pascal syntax
  highlighting, line numbers, bracket matching, auto-indent and the search
  dialog (`Ctrl+F`);
- selecting a component in the component tree scrolls to its field
  declaration when the form's unit is shown;
- event properties (`OnClick`, `OnChange`, ...) have a **{ }** button that
  opens the source at the handler implementation;
- the same rows have a **+** button that creates the handler skeleton: the
  declaration in the form class and the implementation at the end of the
  unit. When the property is empty it also assigns a unique name such as
  `Button1Click`. This covers `TNotifyEvent` handlers (`Sender: TObject`);
  events with other signatures must be written by hand. The source is left
  modified; saving it (or the form) persists both the unit and the event
  association;
- the pane is always editable: **Save** (or Ctrl+S) writes the source file
  with the `saveUnit` API action; if the form has unsaved changes (for example
  a new event association) it also writes the LFM, so the two files stay in
  sync. The status shows "Modified" until the text is saved, and the original
  line endings are preserved;
- switching between Design and Source keeps the editor content, caret,
  selection and scroll position (and returns the focus to the editor);
  **Reload** re-reads the file (asking before discarding unsaved changes), and
  a save or project reload refreshes it automatically;
- **F12** toggles between the form and the source. Browsers that reserve F12
  for the developer tools also accept **Ctrl+`**. The Design/Source buttons
  show the same switch.

The project program is the place for initialization order, command-line-style
setup and application options, for example:

```pascal
Application.Initialize;
Application.ViewportMode := vmResponsive;
Application.ViewportFit := True;
Application.CreateForm(TForm1, Form1);
Application.Run;
```

## Properties

The inspector has two tabs: **Properties** for the published properties and
**Events** for the `On...` handlers. The Events tab shows the assigned handler
count; it lists both the events already stored in the LFM and the events
offered as defaults. Component-specific editors and the **Add property** box
stay in the Properties tab.

Above the tabs, the filter box matches property and event names as you type.
Matching nested groups open automatically and empty groups disappear. The
filter stays active when you select another component; use **×** or **Esc**
to clear it, and Ctrl+F to focus it. It is reset when you switch form or
project. Component-specific editors and the Add property box stay available
below the filtered list.

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

`ParentColor` and `ParentFont` are listed as common properties too, so the
inherited colour or font can be restored after setting an explicit value.
Editing `Color` or a `Font.*` property clears the corresponding parent flag
and updates the visible `ParentColor`/`ParentFont` row.

The editor is chosen from the property name:

- known enumerations are dropdowns: `Align`, `Alignment` (left/right only for
  check boxes and radio buttons), `BorderStyle` (the form border styles for a
  form), `Style` on a combo box, `Shape`, `ModalResult`, `Cursor`,
  `ViewStyle`, `SortIndicator`, `SortType`, `TabPosition`, `Orientation`,
  `ResizeStyle`, `DragKind`/`DragMode`, `InputType` and
  `Pen.Style`/`Brush.Style`. A value that is not in the list is kept and
  offered as the first choice, so unusual LFM values are not lost;
- `Font.Name` shows the common families and the WCL default stack in a
  dropdown while still accepting any CSS font stack; the **Aa** sample next to
  the field is drawn with the selected family and the canvas preview uses the
  font immediately;
- colour properties (`Color`, `Font.Color`, `Pen.Color`, `AlternateRowColor`,
  ...) get a colour swatch plus the raw LFM text. The swatch writes a named
  constant when one matches (`clRed`, `clBtnFace`, ...) and a numeric
  `TColor` otherwise; the text accepts constants, `$00FF00`, decimal values
  and `#rrggbb`. `clNone` and `clDefault` are shown as text only;
- set properties are checkboxes: `Anchors`, `Font.Style`, the string grid
  `Options` and any other known set;
- dotted properties are grouped in collapsible sections: `Font`,
  `BorderSpacing`, `Constraints`, `Pen`, `Brush`, `Margins` and any other
  dotted prefix. A group with properties stored in the LFM starts open; a
  group that only lists the defaults is collapsed and marked **not set**.
  Editing a default row adds the property next to the existing properties of
  the same group.

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

## DataGrid and ListView columns

`TWDataGrid` and `TWListView` store their columns in the `Columns`
collection. The inspector replaces the raw collection with a **Columns**
editor:

- each column has a title (or caption), field name, width, alignment, format,
  visibility and the other common published options;
- DataGrid columns also have **Font** and **Title font** sections for family,
  height, colour and style; when they are not set they inherit the font of the
  grid, and the canvas uses them for the cells and the column titles. Each
  section has a reset button that removes its properties and returns to the
  inherited font;
- columns can be added, duplicated, removed and moved up or down;
- properties the editor does not expose are kept unchanged when the
  collection is written back;
- the `TWDataGrid` canvas preview draws the titles of the visible columns.

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
  config.js               API/preview base for static deployments
  api.php                 projects/forms/units/build API
  lib/PasSync.php         add-only .pas field/uses synchronisation
  lib/ModuleManifest.php  modules.json generation for -Jc- builds
  lib/SimpleZip.php       internal ZIP reader used by the project import
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

All responses are JSON. The API answers `OPTIONS` preflights and sends CORS
headers; set `WCL_CORS_ORIGINS` on the server to restrict the allowed origins
(empty means any origin). See
[Frontend and API on different servers](#frontend-and-api-on-different-servers).

| Action | Method | Parameters |
|---|---|---|
| `projects` | GET | - |
| `load` | GET | `project=<id>` and optional `form=<lfm>` |
| `unit` | GET | `project=<id>` and optional `unit=<pas>` |
| `files` | GET | `project=<id>` |
| `readFile` | GET | `project=<id>` and `file=<path>` |
| `writeFile` | POST | JSON `{ "project": "<id>", "file": "<path>", "source": "..." }` |
| `uploadFile` | POST | JSON `{ "project": "<id>", "name": "<asset>", "data": "<base64>" }` |
| `snapshots` | GET | `project=<id>` |
| `createSnapshot` | POST | JSON `{ "project": "<id>", "reason": "..." }` |
| `restoreSnapshot` | POST | JSON `{ "project": "<id>", "snapshot": "<id>" }` |
| `saveUnit` | POST | JSON `{ "project": "<id>", "unit": "<pas>", "source": "..." }` |
| `save` | POST | JSON `{ "project": "<id>", "form": "<lfm>", "lfm": "...", "formClass": "TForm1", "components": [{ "name": "Button1", "className": "TWButton", "unit": "WebCtrls" }] }` |
| `createForm` | POST | JSON `{ "project": "<id>", "title": "..." }` |
| `deleteForm` | POST | JSON `{ "project": "<id>", "form": "<lfm>", "deleteFiles": true }` |
| `createUnit` | POST | JSON `{ "project": "<id>", "name": "<unit>.pas" }` |
| `deleteUnit` | POST | JSON `{ "project": "<id>", "unit": "<pas>", "deleteFile": true }` |
| `createProject` | POST | JSON `{ "id": "<id>", "name": "...", "kind": "application\|host\|module" }` |
| `updateProject` | POST | JSON `{ "project": "<id>", "settings": { "name": "...", "kind": "...", "program": "...", "html": "...", "output": "...", "entry": "...", "manifest": "...", "modules": ["..."] } }` |
| `deleteProject` | POST | JSON `{ "project": "<id>" }` |
| `build` | POST | JSON `{ "project": "<id>", "mode": "project\|form", "form": "<lfm>" }` |
| `importProject` | POST | multipart `id`, `name`, `kind` and `archive` (ZIP file) |

`load` uses `mainForm` when `form` is omitted; `unit` uses the main form's unit
(or the program in a project without units) when `unit` is omitted. `unit` and
`saveUnit` accept a form unit, an extra unit or the configured `program`
(`.lpr`). A project without forms returns `form: null` and an empty `lfm`.
`save` returns `ok`, `form`, `unit`, `bytes`, `pasChanged` and `warnings`. The
`formClass` and `components` fields are optional; when they are omitted the
`.pas` file is not touched.

`files` returns the project tree without `preview/` and `.snapshots/`; each
entry has `path`, `size`, `mtime`, `kind` (`form`, `source`, `text`, `image`,
`asset` or `settings`) and `editable`. `readFile` and `writeFile` accept text
files only, up to 2 MB. `uploadFile` accepts images and fonts up to 4 MB and
refuses to overwrite an existing file. All paths are relative to the project
folder; absolute paths, `..`, hidden entries and reserved folders are
rejected. `snapshots` returns the project history; `createSnapshot` adds a
manual entry, and `restoreSnapshot` first creates a safety snapshot and then
replaces the project files.

`build` returns `ok`, `url`, `kind`, `program` and `output`; a module build also
returns `manifest`, and form mode returns `form`, `unit` and `formClass`. When
the compiler fails, `ok` is `false` and `output` contains the compiler log (or
the reason the build could not start).

`deleteProject` removes the whole project folder (forms, units, preview and
assets). `importProject` returns `ok`, `project`, `summary` (kind, forms,
units, program) and `warnings`; the project folder is created only after the
ZIP has been validated.

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
