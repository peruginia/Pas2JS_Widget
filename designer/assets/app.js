import {
  parseLfm,
  writeLfm,
  parseCollection,
  writeCollection,
  getProperty,
  getPropertyValue,
  setPropertyValue,
  decodeValue,
  encodeLfmString,
} from './lfm.js';
import {
  decodeTreeItems,
  encodeTreeItems,
  decodeListItems,
  encodeListLazData,
  encodeListData,
  newTreeNode,
  newListItem,
  countTreeNodes,
  removeTreeNode,
  formatHexBytes,
} from './lfm-binary.js';

const state = {
  manifest: { nonVisual: [], aliases: {}, classes: [], defaults: {} },
  projects: [],
  project: null,
  forms: [],
  currentForm: null,
  currentUnit: '',
  roots: [],
  selected: null,
  activeTabs: new Map(),
  view: 'design',
  source: null,
  sourceEol: '\n',
  sourceTarget: null,
  sourceDirty: false,
  sourceCaret: { start: 0, end: 0 },
  sourceScrollTop: 0,
  dirty: false,
  formCache: new Map(),
  unitCache: new Map(),
  selection: [],
  clipboard: [],
  history: [],
  historyIndex: -1,
  savedLfm: '',
};

const els = {
  project: document.getElementById('projectSelect'),
  form: document.getElementById('formSelect'),
  reload: document.getElementById('reloadBtn'),
  save: document.getElementById('saveBtn'),
  previewMode: document.getElementById('previewMode'),
  newProjectBtn: document.getElementById('newProjectBtn'),
  newProjectDialog: document.getElementById('newProjectDialog'),
  newProjectName: document.getElementById('newProjectName'),
  newProjectId: document.getElementById('newProjectId'),
  newProjectKind: document.getElementById('newProjectKind'),
  newProjectHint: document.getElementById('newProjectHint'),
  newProjectCreateBtn: document.getElementById('newProjectCreateBtn'),
  newProjectCloseBtn: document.getElementById('newProjectCloseBtn'),
  importDialog: document.getElementById('importDialog'),
  importArchive: document.getElementById('importArchive'),
  importName: document.getElementById('importName'),
  importId: document.getElementById('importId'),
  importKind: document.getElementById('importKind'),
  importHint: document.getElementById('importHint'),
  importCreateBtn: document.getElementById('importCreateBtn'),
  importCloseBtn: document.getElementById('importCloseBtn'),
  projectBtn: document.getElementById('projectBtn'),
  importBtn: document.getElementById('importBtn'),
  status: document.getElementById('status'),
  palette: document.getElementById('palette'),
  tree: document.getElementById('tree'),
  canvas: document.getElementById('canvas'),
  inspector: document.getElementById('inspector'),
  formTitle: document.getElementById('formTitle'),
  undoBtn: document.getElementById('undoBtn'),
  redoBtn: document.getElementById('redoBtn'),
  editMenuBtn: document.getElementById('editMenuBtn'),
  editMenu: document.getElementById('editMenu'),
  multiTools: document.getElementById('multiTools'),
  multiCount: document.getElementById('multiCount'),
  designTab: document.getElementById('designTab'),
  sourceTab: document.getElementById('sourceTab'),
  sourceView: document.getElementById('sourceView'),
  sourceName: document.getElementById('sourceName'),
  sourceStatus: document.getElementById('sourceStatus'),
  sourceReload: document.getElementById('sourceReloadBtn'),
  sourceSave: document.getElementById('sourceSaveBtn'),
  sourceEditor: document.getElementById('sourceEditor'),
  sourceGutter: document.getElementById('sourceGutter'),
  previewBtn: document.getElementById('previewBtn'),
  previewDialog: document.getElementById('previewDialog'),
  previewTitle: document.getElementById('previewTitle'),
  previewFrame: document.getElementById('previewFrame'),
  previewOpenLink: document.getElementById('previewOpenLink'),
  previewCloseBtn: document.getElementById('previewCloseBtn'),
  buildDialog: document.getElementById('buildDialog'),
  buildOutput: document.getElementById('buildOutput'),
  buildCloseBtn: document.getElementById('buildCloseBtn'),
  projectDialog: document.getElementById('projectDialog'),
  dialogForms: document.getElementById('dialogForms'),
  dialogUnits: document.getElementById('dialogUnits'),
  dialogProgram: document.getElementById('dialogProgram'),
  settingName: document.getElementById('settingName'),
  settingKind: document.getElementById('settingKind'),
  settingProgram: document.getElementById('settingProgram'),
  settingHtml: document.getElementById('settingHtml'),
  settingOutput: document.getElementById('settingOutput'),
  settingEntry: document.getElementById('settingEntry'),
  settingManifest: document.getElementById('settingManifest'),
  settingModules: document.getElementById('settingModules'),
  saveSettingsBtn: document.getElementById('saveSettingsBtn'),
  deleteProjectBtn: document.getElementById('deleteProjectBtn'),
  newFormBtn: document.getElementById('newFormBtn'),
  newUnitBtn: document.getElementById('newUnitBtn'),
  projectCloseBtn: document.getElementById('projectCloseBtn'),
  deleteFilesCheck: document.getElementById('deleteFilesCheck'),
};

const nonVisual = new Set();
const containerClasses = new Set([
  'TWForm', 'TWFrame', 'TWPanel', 'TWGroupBox', 'TWScrollBox',
  'TWPageControl', 'TTabSheet',
]);

const fallbackDefaults = {
  TWButton: { width: 100, height: 30, caption: 'Button' },
  TWEdit: { width: 160, height: 28 },
  TWMemo: { width: 200, height: 100 },
  TWComboBox: { width: 160, height: 28 },
  TWListBox: { width: 160, height: 100 },
  TWLabel: { width: 100, height: 20, caption: 'Label' },
  TWCheckbox: { width: 100, height: 24, caption: 'Check' },
  TWRadioButton: { width: 100, height: 24, caption: 'Radio' },
  TWPanel: { width: 200, height: 120 },
  TWGroupBox: { width: 200, height: 100, caption: 'Group' },
  TWScrollBox: { width: 200, height: 150 },
  TWPageControl: { width: 320, height: 220 },
  TTabSheet: { width: 300, height: 200, caption: 'Tab' },
  TWImage: { width: 100, height: 100 },
  TWFileButton: { width: 130, height: 30, caption: 'Choose file' },
  TWDataGrid: { width: 320, height: 220 },
  TWPagination: { width: 220, height: 40 },
  TWStringGrid: { width: 320, height: 220 },
  TWTreeView: { width: 220, height: 220 },
  TWListView: { width: 260, height: 180 },
  TWScrollBar: { width: 120, height: 24 },
  TWSpinEdit: { width: 120, height: 28 },
  TWUpDown: { width: 26, height: 28 },
  TWTrackBar: { width: 160, height: 30 },
  TWProgressBar: { width: 200, height: 20 },
  TWColorPicker: { width: 60, height: 28 },
  TWSplitter: { width: 8, height: 120 },
  TWShape: { width: 80, height: 80 },
  TWPaintBox: { width: 200, height: 150 },
  TWFloatEdit: { width: 160, height: 28 },
  TWIntegerEdit: { width: 160, height: 28 },
  TWDateEditBox: { width: 160, height: 28 },
  TWTimeEditBox: { width: 120, height: 28 },
};

function apiEndpoint() {
  const configured = String(window.WCL_CONFIG?.apiBase || '').trim();
  return new URL(configured !== '' ? configured : 'api.php', window.location.href);
}

function apiUrl(action, params = {}) {
  const url = new URL(apiEndpoint().href);
  url.searchParams.set('action', action);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url;
}

function previewUrl(relative) {
  const configured = String(window.WCL_CONFIG?.previewBase || '').trim();
  let base;
  if (configured !== '') {
    base = new URL(configured.endsWith('/') ? configured : `${configured}/`, window.location.href);
  } else {
    base = new URL('.', apiEndpoint());
  }
  return new URL(relative, base);
}

async function api(action, params = {}, body = null) {
  const url = apiUrl(action, params);
  const options = body === null ? {} : {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }
  return data;
}

function setStatus(message, error = false) {
  els.status.textContent = message;
  els.status.classList.toggle('error', error);
  els.status.title = '';
}

function setDirty(value) {
  state.dirty = value;
  updateSaveIndicator();
}

function hasUnsavedChanges() {
  return state.dirty || state.sourceDirty || state.formCache.size > 0 || state.unitCache.size > 0;
}

function updateSaveIndicator() {
  const dirty = hasUnsavedChanges();
  els.save.classList.toggle('dirty', dirty);
  document.title = `${dirty ? '● ' : ''}WCL Designer`;
}

function markDirty() {
  state.dirty = true;
  commitHistory();
  state.dirty = writeLfm(state.roots) !== state.savedLfm;
  updateSaveIndicator();
  setStatus(state.dirty ? 'Modified' : 'No changes');
}

function cloneProp(prop) {
  const copy = {};
  for (const [key, value] of Object.entries(prop)) {
    if (key === '__items') continue;
    copy[key] = value instanceof Uint8Array ? new Uint8Array(value) : value;
  }
  return copy;
}

function cloneNodeTree(node) {
  const copy = {
    ...node,
    properties: node.properties.map(cloneProp),
    children: node.children.map(cloneNodeTree),
  };
  delete copy.__parent;
  delete copy.__id;
  return copy;
}

function cloneRoots(roots = state.roots) {
  return roots.map(cloneNodeTree);
}

function nodePath(node) {
  const path = [];
  let current = node;
  while (current) {
    const parent = current.__parent;
    const siblings = parent ? parent.children : state.roots;
    const index = siblings.indexOf(current);
    if (index < 0) return [];
    path.unshift(index);
    current = parent;
  }
  return path;
}

function nodeAtPath(path) {
  let list = state.roots;
  let node = null;
  for (const index of path) {
    node = list[index];
    if (!node) return null;
    list = node.children;
  }
  return node;
}

function updateUndoButtons() {
  if (!els.undoBtn || !els.redoBtn) return;
  const active = !!state.currentForm && state.view === 'design';
  els.undoBtn.disabled = !active || state.historyIndex <= 0;
  els.redoBtn.disabled = !active || state.historyIndex >= state.history.length - 1;
}

function commitHistory() {
  if (!state.currentForm || state.roots.length === 0) return;
  const lfm = writeLfm(state.roots);
  const current = state.history[state.historyIndex];
  if (current && current.lfm === lfm) return;
  if (state.historyIndex < state.history.length - 1) {
    state.history.splice(state.historyIndex + 1);
  }
  state.history.push({
    lfm,
    roots: cloneRoots(),
    selectedPath: nodePath(state.selected),
  });
  if (state.history.length > 100) {
    state.history.shift();
  }
  state.historyIndex = state.history.length - 1;
  updateUndoButtons();
}

function restoreHistory(index) {
  const entry = state.history[index];
  if (!entry) return;
  state.historyIndex = index;
  state.roots = entry.roots.map(cloneNodeTree);
  assignIds(state.roots);
  state.selected = nodeAtPath(entry.selectedPath) || state.roots[0] || null;
  state.selection = state.selected ? [state.selected] : [];
  state.activeTabs.clear();
  renderTree();
  renderCanvas();
  renderInspector();
  const lfm = writeLfm(state.roots);
  setDirty(lfm !== state.savedLfm);
  updateUndoButtons();
  updateMultiTools();
  if (state.view === 'source' && (!state.currentForm || state.currentUnit === state.currentForm.unit)) {
    applySourceNavigation();
  }
  setStatus(index === 0 ? 'Undo' : `History ${index + 1}/${state.history.length}`);
}

function undo() {
  if (state.historyIndex > 0) restoreHistory(state.historyIndex - 1);
}

function redo() {
  if (state.historyIndex < state.history.length - 1) restoreHistory(state.historyIndex + 1);
}

function stashCurrentForm() {
  if (!state.currentForm) return;
  if (state.dirty) {
    commitHistory();
    state.formCache.set(state.currentForm.form, {
      roots: state.roots,
      activeTabs: new Map(state.activeTabs),
      history: state.history,
      historyIndex: state.historyIndex,
      savedLfm: state.savedLfm,
    });
  } else {
    state.formCache.delete(state.currentForm.form);
  }
}

function stashCurrentUnit() {
  if (!state.currentUnit || state.source === null) return;
  if (state.view === 'source') rememberSourcePosition();
  if (state.sourceDirty) {
    state.unitCache.set(state.currentUnit, {
      text: sourceText(),
      baseline: state.source,
      eol: state.sourceEol,
      caret: { ...state.sourceCaret },
      scrollTop: state.sourceScrollTop,
    });
  } else {
    state.unitCache.delete(state.currentUnit);
  }
}

function discardAllChanges() {
  state.formCache.clear();
  state.unitCache.clear();
  state.history = [];
  state.historyIndex = -1;
  state.savedLfm = '';
  state.selection = [];
  state.dirty = false;
  state.sourceDirty = false;
  updateSaveIndicator();
  updateUndoButtons();
  updateMultiTools();
}

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sourceText() {
  return els.sourceEditor.value;
}

function syncSourceGutter() {
  els.sourceGutter.scrollTop = els.sourceEditor.scrollTop;
}

function updateSourceGutter() {
  const count = sourceText().split('\n').length;
  const numbers = [];
  for (let index = 1; index <= count; index++) numbers.push(index);
  els.sourceGutter.textContent = numbers.join('\n');
  syncSourceGutter();
}

function updateSourceStatus() {
  if (state.source === null) {
    els.sourceStatus.textContent = '';
    return;
  }
  const count = sourceText().split('\n').length;
  els.sourceStatus.textContent = state.sourceDirty
    ? `Modified · ${count} lines`
    : `${count} lines`;
}

function rememberSourcePosition() {
  const editor = els.sourceEditor;
  if (!editor) return;
  state.sourceCaret = { start: editor.selectionStart, end: editor.selectionEnd };
  state.sourceScrollTop = editor.scrollTop;
}

function focusSourceEditor({ restore = false } = {}) {
  const editor = els.sourceEditor;
  if (!editor || state.source === null) return;
  editor.focus({ preventScroll: true });
  if (restore) {
    editor.setSelectionRange(state.sourceCaret.start, state.sourceCaret.end);
    editor.scrollTop = state.sourceScrollTop;
  }
  syncSourceGutter();
}

function setView(view) {
  if (view === state.view) {
    if (view === 'source') focusSourceEditor();
    return;
  }
  if (state.view === 'source') rememberSourcePosition();
  state.view = view;
  const source = view === 'source';
  els.designTab.classList.toggle('active', !source);
  els.sourceTab.classList.toggle('active', source);
  els.canvas.classList.toggle('hidden-view', source);
  els.sourceView.classList.toggle('hidden-view', !source);
  if (source) {
    if (state.source === null) {
      loadSource();
    } else if (state.sourceTarget) {
      applySourceNavigation({ focus: true });
    } else {
      focusSourceEditor({ restore: true });
    }
  }
  closeEditMenu();
  updateUndoButtons();
  updateMultiTools();
}

function currentUnitName() {
  if (state.currentUnit) return state.currentUnit;
  if (state.currentForm && state.currentForm.unit) return state.currentForm.unit;
  if (state.project && state.project.unit) return state.project.unit;
  return '';
}

async function ensureFormUnit() {
  const unitName = state.currentForm ? state.currentForm.unit : '';
  if (!unitName) return false;
  if (state.currentUnit === unitName && state.source !== null) return true;
  stashCurrentUnit();
  state.currentUnit = unitName;
  state.source = null;
  state.sourceTarget = null;
  state.sourceDirty = false;
  await loadSource(true);
  return state.source !== null;
}

async function loadSource(force = false) {
  if (!state.project) {
    els.sourceName.textContent = 'No source';
    els.sourceStatus.textContent = 'Select a project.';
    els.sourceEditor.value = '';
    els.sourceGutter.textContent = '';
    state.source = null;
    return;
  }
  if (!currentUnitName()) {
    els.sourceName.textContent = 'No source';
    els.sourceStatus.textContent = 'The project has no source file.';
    els.sourceEditor.value = '';
    els.sourceGutter.textContent = '';
    state.source = null;
    state.sourceDirty = false;
    updateSaveIndicator();
    return;
  }
  els.sourceName.textContent = currentUnitName() || 'unit';
  if (state.source !== null && !force) {
    return;
  }
  const unitName = currentUnitName();
  const cached = state.unitCache.get(unitName);
  if (cached) {
    state.unitCache.delete(unitName);
    state.sourceEol = cached.eol || '\n';
    state.source = cached.baseline;
    state.sourceDirty = true;
    state.sourceCaret = cached.caret || { start: 0, end: 0 };
    state.sourceScrollTop = cached.scrollTop || 0;
    els.sourceEditor.value = cached.text;
    updateSourceGutter();
    updateSourceStatus();
    updateSaveIndicator();
    const hadTarget = !!state.sourceTarget;
    applySourceNavigation({ focus: hadTarget });
    if (!hadTarget) focusSourceEditor({ restore: true });
    return;
  }
  els.sourceStatus.textContent = 'Loading...';
  try {
    const data = await api('unit', { project: state.project.id, unit: currentUnitName() });
    state.sourceEol = data.source.includes('\r\n') ? '\r\n' : '\n';
    state.source = data.source.replace(/\r\n/g, '\n');
    state.sourceDirty = false;
    els.sourceName.textContent = data.unit;
    els.sourceEditor.value = state.source;
    updateSourceGutter();
    updateSourceStatus();
    updateSaveIndicator();
    const hadTarget = !!state.sourceTarget;
    applySourceNavigation({ focus: hadTarget });
    if (!hadTarget) focusSourceEditor();
  } catch (error) {
    state.source = null;
    state.sourceDirty = false;
    els.sourceEditor.value = '';
    els.sourceGutter.textContent = '';
    els.sourceStatus.textContent = error.message;
    updateSaveIndicator();
  }
}

function onSourceInput() {
  if (state.source === null) return;
  state.sourceDirty = sourceText() !== state.source;
  updateSourceGutter();
  updateSourceStatus();
  updateSaveIndicator();
}

async function saveSource({ saveForm = false } = {}) {
  if (!state.project || state.source === null) return;
  if (!state.sourceDirty) {
    if (saveForm && state.dirty) {
      await saveProject();
    } else {
      setStatus('No changes to save.');
    }
    return;
  }
  const text = sourceText().split('\n').join(state.sourceEol || '\n');
  els.sourceStatus.textContent = 'Saving...';
  try {
    const result = await api('saveUnit', {}, { project: state.project.id, unit: currentUnitName(), source: text });
    state.source = sourceText();
    state.sourceDirty = false;
    state.unitCache.delete(currentUnitName());
    updateSourceStatus();
    updateSaveIndicator();
    setStatus(`Source saved (${result.bytes} bytes)`);
    if (saveForm && state.dirty) {
      // The form may hold the event association that was just generated;
      // saving the unit alone would leave the LFM without it.
      await saveProject();
    }
  } catch (error) {
    els.sourceStatus.textContent = error.message;
    setStatus(error.message, true);
  }
}

async function saveCachedUnit(unit) {
  const cache = state.unitCache.get(unit);
  if (!cache) return;
  const text = cache.text.split('\n').join(cache.eol || '\n');
  const result = await api('saveUnit', {}, { project: state.project.id, unit, source: text });
  state.unitCache.delete(unit);
  if (state.currentUnit === unit) {
    state.source = cache.text;
    state.sourceDirty = false;
    updateSourceStatus();
  }
  updateSaveIndicator();
  return result;
}

async function saveAll() {
  if (!state.project) {
    setStatus('No project selected.', true);
    return false;
  }
  stashCurrentUnit();
  stashCurrentForm();
  if (!hasUnsavedChanges()) {
    setStatus('No changes to save.');
    return true;
  }

  const unitCount = state.unitCache.size;
  const formCount = state.formCache.size;
  const warnings = [];
  const syncedUnits = new Set();
  els.save.disabled = true;
  setStatus('Saving...');
  try {
    const sourceFiles = new Set(
      [...(state.project.units || []), state.project.program].filter(Boolean),
    );
    for (const unit of [...state.unitCache.keys()]) {
      if (!sourceFiles.has(unit)) {
        state.unitCache.delete(unit);
        continue;
      }
      await saveCachedUnit(unit);
    }
    for (const formFile of [...state.formCache.keys()]) {
      const cache = state.formCache.get(formFile);
      const formEntry = state.forms.find((entry) => entry.form === formFile);
      if (!formEntry) {
        state.formCache.delete(formFile);
        continue;
      }
      const lfm = writeLfm(cache.roots);
      const formClass = cache.roots[0] ? cache.roots[0].className : '';
      const components = collectComponents(cache.roots, false);
      const result = await api('save', {}, {
        project: state.project.id,
        form: formFile,
        lfm,
        formClass,
        components,
      });
      state.formCache.delete(formFile);
      if (state.currentForm && state.currentForm.form === formFile) {
        state.savedLfm = lfm;
      }
      if (result.warnings && result.warnings.length > 0) {
        warnings.push(...result.warnings);
      }
      syncedUnits.add(formEntry.unit);
    }

    state.dirty = false;
    state.sourceDirty = false;
    if (syncedUnits.has(state.currentUnit)) {
      // Saving a form may have synchronized its unit on disk.
      state.source = null;
      if (state.view === 'source') {
        await loadSource(true);
      }
    } else {
      updateSourceStatus();
    }
    updateSaveIndicator();

    const total = unitCount + formCount;
    let message = `Saved ${total} file${total === 1 ? '' : 's'}`;
    if (warnings.length > 0) {
      message += `; ${warnings.join('; ')}`;
    }
    setStatus(message, warnings.length > 0);
    return true;
  } catch (error) {
    updateSaveIndicator();
    setStatus(error.message, true);
    return false;
  } finally {
    els.save.disabled = false;
  }
}

function findFieldLine(lines, name) {
  const pattern = new RegExp(`\\b${escapeRegExp(name)}\\s*:`);
  return lines.findIndex((line) => pattern.test(line));
}

function methodPattern(name) {
  return new RegExp(
    `^\\s*(?:procedure|function|constructor|destructor)\\s+(?:[A-Za-z_][A-Za-z0-9_]*\\.)?${escapeRegExp(name)}\\b`,
    'i',
  );
}

function findImplementationLine(lines, name) {
  const pattern = methodPattern(name);
  const implIndex = lines.findIndex((line) => /^\s*implementation\b/i.test(line));
  const start = implIndex >= 0 ? implIndex : 0;
  for (let index = start; index < lines.length; index++) {
    if (pattern.test(lines[index])) return index;
  }
  return -1;
}

function findDeclarationLine(lines, name) {
  const pattern = methodPattern(name);
  const implIndex = lines.findIndex((line) => /^\s*implementation\b/i.test(line));
  const end = implIndex >= 0 ? implIndex : lines.length;
  for (let index = 0; index < end; index++) {
    if (pattern.test(lines[index])) return index;
  }
  return -1;
}

function findMethodLine(lines, name) {
  const implLine = findImplementationLine(lines, name);
  if (implLine >= 0) return implLine;
  return findDeclarationLine(lines, name);
}

function applySourceNavigation({ focus = false } = {}) {
  if (state.source === null) return;
  const lines = sourceText().split('\n');
  let line = -1;

  if (state.sourceTarget && state.sourceTarget.kind === 'method') {
    line = findMethodLine(lines, state.sourceTarget.name);
    if (line < 0) {
      setStatus(`Handler ${state.sourceTarget.name} not found in the unit.`, true);
      return;
    }
  } else if (state.selected && state.selected.name) {
    line = findFieldLine(lines, state.selected.name);
  }

  if (line >= 0) {
    scrollSourceToLine(line, focus);
    if (state.sourceTarget) state.sourceTarget = null;
  }
}

function scrollSourceToLine(line, focus) {
  const editor = els.sourceEditor;
  const lineHeight = parseFloat(getComputedStyle(editor).lineHeight) || 18;
  const centered = line * lineHeight - editor.clientHeight / 2 + lineHeight / 2;
  editor.scrollTop = Math.max(0, centered);
  syncSourceGutter();

  if (!focus) return;
  const lines = editor.value.split('\n');
  let offset = 0;
  for (let index = 0; index < line; index++) offset += lines[index].length + 1;
  const end = offset + (lines[line] || '').length;
  editor.focus();
  editor.setSelectionRange(offset, end);
}

function nodeTitle(node) {
  return `${node.className}${node.name ? ` (${node.name})` : ''}`;
}

function isVisual(node, isRoot = false) {
  if (isRoot) return true;
  const className = node.className;
  if (nonVisual.has(className)) return false;
  if (className === 'TMenuItem') return false;
  if (className.startsWith('TWWebDB')) return false;
  return true;
}

function propNumber(node, name, fallback = 0) {
  const prop = getProperty(node, name);
  if (!prop) return fallback;
  const value = Number(prop.value);
  return Number.isFinite(value) ? value : fallback;
}

function propText(node, name) {
  const prop = getProperty(node, name);
  if (!prop) return '';
  if (prop.kind === 'string') return prop.value;
  return prop.raw;
}

function displayText(node) {
  const caption = propText(node, 'Caption');
  if (caption) return caption;
  const text = propText(node, 'Text');
  if (text) return text;
  return node.name || node.className;
}

function assignIds(nodes, prefix = 'n') {
  let counter = 0;
  const walk = (list, parent) => {
    for (const node of list) {
      node.__id = `${prefix}${++counter}`;
      node.__parent = parent;
      walk(node.children, node);
    }
  };
  walk(nodes, null);
}

function findAncestor(node, predicate) {
  for (let current = node ? node.__parent : null; current; current = current.__parent) {
    if (predicate(current)) return current;
  }
  return null;
}

function findById(id) {
  let result = null;
  const walk = (nodes) => {
    for (const node of nodes) {
      if (node.__id === id) {
        result = node;
        return;
      }
      walk(node.children);
      if (result) return;
    }
  };
  walk(state.roots);
  return result;
}

function pageControlSheets(pageControl) {
  return pageControl.children.filter((node) => node.className === 'TTabSheet');
}

function activeTabSheet(pageControl) {
  const sheets = pageControlSheets(pageControl);
  if (sheets.length === 0) return null;
  const override = state.activeTabs.get(pageControl);
  if (override && sheets.includes(override)) return override;
  const active = getPropertyValue(pageControl, 'ActivePage', '');
  return sheets.find((sheet) => sheet.name === active) || sheets[0];
}

function activateTabSheet(sheet, persist = false) {
  const pageControl = sheet.__parent;
  if (!pageControl || pageControl.className !== 'TWPageControl') return;
  state.activeTabs.set(pageControl, sheet);
  if (!persist) return;
  const prop = getProperty(pageControl, 'ActivePage');
  if (!prop) {
    pageControl.properties.push(makeProp('ActivePage', sheet.name));
    markDirty();
  } else if (String(prop.value) !== sheet.name) {
    setPropertyValue(prop, sheet.name, 'identifier');
    markDirty();
  }
}

function showPageTabs(pageControl) {
  return getPropertyValue(pageControl, 'ShowTabs', true) !== false;
}

function alignOf(node) {
  const prop = getProperty(node, 'Align');
  if (!prop) return 'alNone';
  const value = String(prop.value || prop.raw || 'alNone').trim();
  return value.startsWith('al') ? value : 'alNone';
}

// Lay out the children of a container the way LCL does: alTop, alBottom,
// alLeft, alRight consume the remaining client area in that order and
// alClient fills what is left. The result is a render-only frame; the LFM
// Left/Top/Width/Height values are not modified.
function layoutFrames(container, width, height) {
  const frames = new Map();
  const children = container.children.filter((child) => isVisual(child));
  const rect = { left: 0, top: 0, right: Math.max(0, width), bottom: Math.max(0, height) };
  const withAlign = (align) => children.filter((child) => alignOf(child) === align);

  const tops = withAlign('alTop').sort((a, b) => propNumber(a, 'Top', 0) - propNumber(b, 'Top', 0));
  for (const child of tops) {
    const childHeight = Math.max(0, propNumber(child, 'Height', 0));
    frames.set(child, {
      left: rect.left,
      top: rect.top,
      width: rect.right - rect.left,
      height: childHeight,
      aligned: true,
    });
    rect.top += childHeight;
  }

  const bottoms = withAlign('alBottom').sort((a, b) => {
    const bottomA = propNumber(a, 'Top', 0) + propNumber(a, 'Height', 0);
    const bottomB = propNumber(b, 'Top', 0) + propNumber(b, 'Height', 0);
    return bottomB - bottomA;
  });
  for (const child of bottoms) {
    const childHeight = Math.max(0, propNumber(child, 'Height', 0));
    frames.set(child, {
      left: rect.left,
      top: rect.bottom - childHeight,
      width: rect.right - rect.left,
      height: childHeight,
      aligned: true,
    });
    rect.bottom -= childHeight;
  }

  const lefts = withAlign('alLeft').sort((a, b) => propNumber(a, 'Left', 0) - propNumber(b, 'Left', 0));
  for (const child of lefts) {
    const childWidth = Math.max(0, propNumber(child, 'Width', 0));
    frames.set(child, {
      left: rect.left,
      top: rect.top,
      width: childWidth,
      height: rect.bottom - rect.top,
      aligned: true,
    });
    rect.left += childWidth;
  }

  const rights = withAlign('alRight').sort((a, b) => {
    const rightA = propNumber(a, 'Left', 0) + propNumber(a, 'Width', 0);
    const rightB = propNumber(b, 'Left', 0) + propNumber(b, 'Width', 0);
    return rightB - rightA;
  });
  for (const child of rights) {
    const childWidth = Math.max(0, propNumber(child, 'Width', 0));
    frames.set(child, {
      left: rect.right - childWidth,
      top: rect.top,
      width: childWidth,
      height: rect.bottom - rect.top,
      aligned: true,
    });
    rect.right -= childWidth;
  }

  for (const child of withAlign('alClient')) {
    frames.set(child, {
      left: rect.left,
      top: rect.top,
      width: Math.max(0, rect.right - rect.left),
      height: Math.max(0, rect.bottom - rect.top),
      aligned: true,
    });
  }

  return frames;
}

function renderTree() {
  els.tree.innerHTML = '';
  if (state.roots.length === 0) {
    els.tree.textContent = 'This project has no form.';
    return;
  }
  const build = (nodes, parent) => {
    for (const node of nodes) {
      const li = document.createElement('li');
      const row = document.createElement('div');
      row.className = 'tree-row';
      if (!isVisual(node, node === state.roots[0])) row.classList.add('nonvisual');
      if (state.selection.includes(node)) row.classList.add('selected');
      if (state.selected === node) row.classList.add('primary');
      row.dataset.id = node.__id;
      const name = document.createElement('span');
      name.className = 'tree-name';
      name.textContent = node.name || node.className;
      const cls = document.createElement('span');
      cls.className = 'tree-class';
      cls.textContent = node.className;
      row.append(name, cls);
      row.addEventListener('click', (event) => {
        event.stopPropagation();
        const additive = event.ctrlKey || event.metaKey || event.shiftKey;
        if (additive) {
          selectNode(node, true);
        } else if (state.selection.includes(node) && state.selection.length > 1) {
          selectPrimarySelection(node);
        } else {
          selectNode(node);
        }
      });
      li.appendChild(row);
      if (node.children.length > 0) {
        const ul = document.createElement('ul');
        build(node.children, ul);
        li.appendChild(ul);
      }
      parent.appendChild(li);
    }
  };
  const ul = document.createElement('ul');
  build(state.roots, ul);
  els.tree.appendChild(ul);
}

function displayClassName(name) {
  return String(name || '').replace(/^TW/, '').replace(/^T/, '') || 'Component';
}

function renderPalette() {
  els.palette.innerHTML = '';
  const classes = (state.manifest.classes || [])
    .filter((item) => item.visual && item.name !== 'TWForm' && item.name !== 'TWFrame');
  for (const item of classes) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'palette-item';
    button.draggable = true;
    button.dataset.className = item.name;
    button.title = `${item.name}${item.unit ? ` · ${item.unit}` : ''}`;
    const mark = document.createElement('span');
    mark.className = 'palette-mark';
    const label = document.createElement('span');
    label.textContent = displayClassName(item.name);
    button.append(mark, label);
    button.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', item.name);
      event.dataTransfer.effectAllowed = 'copy';
      button.classList.add('dragging');
    });
    button.addEventListener('dragend', () => {
      button.classList.remove('dragging');
      clearDropTargets();
    });
    els.palette.appendChild(button);
  }
}

function defaultsFor(className) {
  return (state.manifest.defaults && state.manifest.defaults[className])
    || fallbackDefaults[className]
    || { width: 120, height: 28 };
}

function collectNames(nodes, names = new Set()) {
  for (const node of nodes) {
    if (node.name) names.add(node.name);
    collectNames(node.children, names);
  }
  return names;
}

function uniqueName(className) {
  const base = displayClassName(className);
  const names = collectNames(state.roots);
  let index = 1;
  while (names.has(`${base}${index}`)) index++;
  return `${base}${index}`;
}

function makeProp(name, raw) {
  return { name, raw, ...decodeValue(raw) };
}

function canonicalClassName(className) {
  return (state.manifest.aliases && state.manifest.aliases[className]) || className;
}

function classUnit(className) {
  const canonical = canonicalClassName(className);
  const info = (state.manifest.classes || []).find((item) => item.name === canonical);
  return info ? (info.unit || '') : '';
}

function collectComponents(nodes, include = true) {
  const result = [];
  for (const node of nodes) {
    if (include && node.name) {
      result.push({
        name: node.name,
        className: canonicalClassName(node.className),
        unit: classUnit(node.className),
      });
    }
    result.push(...collectComponents(node.children, true));
  }
  return result;
}

function decodeItemsProp(prop, decoder) {
  if (!prop || prop.kind !== 'binary' || !(prop.bytes instanceof Uint8Array)) return null;
  if (!prop.__items) {
    try {
      prop.__items = { value: decoder(prop.bytes) };
    } catch (error) {
      prop.__items = { error: error.message };
    }
  }
  return prop.__items;
}

// Decoded tree/list items for the selected component, or null when the class
// has no binary items property (or the blob cannot be decoded).
function componentItems(node) {
  if (node.className === 'TWTreeView') {
    const prop = getProperty(node, 'Items.Data');
    const decoded = decodeItemsProp(prop, (bytes) => decodeTreeItems(bytes).nodes);
    if (!decoded || decoded.error) return null;
    return { prop, kind: 'tree', format: 'lcl', nodes: decoded.value };
  }

  if (node.className === 'TWListView') {
    const laz = getProperty(node, 'Items.LazData');
    const data = getProperty(node, 'Items.Data');
    const prop = laz && laz.kind === 'binary' && laz.bytes instanceof Uint8Array
      ? laz
      : (data && data.kind === 'binary' && data.bytes instanceof Uint8Array ? data : null);
    if (!prop) return null;
    const format = prop === laz ? 'laz' : 'delphi';
    const decoded = decodeItemsProp(prop, (bytes) => decodeListItems(bytes, format));
    if (!decoded || decoded.error) return null;
    return { prop, kind: 'list', format, items: decoded.value };
  }

  return null;
}

function storeBinaryProp(prop, bytes) {
  prop.bytes = bytes;
  prop.raw = formatHexBytes(bytes, '');
  prop.kind = 'binary';
  prop.value = prop.raw;
}

function storeTreeItems(prop, nodes) {
  storeBinaryProp(prop, encodeTreeItems(nodes));
  markDirty();
}

function storeListItems(prop, items, format) {
  storeBinaryProp(prop, format === 'delphi' ? encodeListData(items) : encodeListLazData(items));
  markDirty();
}

function snap(value) {
  return Math.max(0, Math.round(value / 8) * 8);
}

function addComponent(className, parentNode, left, top) {
  if (!parentNode) return null;
  const defaults = defaultsFor(className);
  const node = {
    kind: 'object',
    name: uniqueName(className),
    className,
    properties: [],
    children: [],
  };
  node.properties.push(makeProp('Left', String(snap(left))));
  node.properties.push(makeProp('Top', String(snap(top))));
  node.properties.push(makeProp('Width', String(Math.max(1, defaults.width || 120))));
  node.properties.push(makeProp('Height', String(Math.max(1, defaults.height || 28))));
  if (defaults.caption) {
    node.properties.push(makeProp('Caption', encodeLfmString(defaults.caption)));
  }
  if (['TWEdit', 'TWMemo', 'TWComboBox'].includes(className)) {
    node.properties.push(makeProp('Text', encodeLfmString('')));
  }
  parentNode.children.push(node);
  assignIds(state.roots);
  state.selected = node;
  state.selection = [node];
  renderTree();
  renderCanvas();
  renderInspector();
  updateMultiTools();
  markDirty();
  setStatus(`Added ${node.name} (${className})`);
  return node;
}

function findDropElement(target) {
  let element = target instanceof Element
    ? target.closest('.designer-form, .designer-component')
    : null;
  while (element && element.classList.contains('designer-component')) {
    const node = findById(element.dataset.id);
    if (node && node.className === 'TWPageControl') {
      const sheet = activeTabSheet(node);
      const sheetElement = sheet
        ? els.canvas.querySelector(`[data-id="${sheet.__id}"]`)
        : null;
      if (sheetElement) return sheetElement;
    }
    if (node && (containerClasses.has(node.className) || node.children.length > 0)) {
      return element;
    }
    element = element.parentElement
      ? element.parentElement.closest('.designer-form, .designer-component')
      : null;
  }
  return els.canvas.querySelector('.designer-form');
}

function nodeFromDropElement(element) {
  if (!element) return null;
  if (element.classList.contains('designer-form')) return state.roots[0] || null;
  return findById(element.dataset.id);
}

function clearDropTargets() {
  for (const element of document.querySelectorAll('.drop-target')) {
    element.classList.remove('drop-target');
  }
}

function handleDragOver(event) {
  if (!event.dataTransfer) return;
  const types = Array.from(event.dataTransfer.types || []);
  if (!types.includes('text/plain')) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
  const element = findDropElement(event.target);
  clearDropTargets();
  if (element) element.classList.add('drop-target');
}

function handleDrop(event) {
  if (!event.dataTransfer) return;
  event.preventDefault();
  clearDropTargets();
  const className = event.dataTransfer.getData('text/plain');
  if (!className) return;
  const element = findDropElement(event.target);
  const parent = nodeFromDropElement(element);
  if (!parent) return;

  if (canonicalClassName(className) === 'TTabSheet') {
    const pageControl = parent.className === 'TWPageControl'
      ? parent
      : findAncestor(parent, (node) => node.className === 'TWPageControl');
    if (pageControl) {
      addTabSheet(pageControl);
    } else {
      setStatus('Drop a TTabSheet on a page control to add a tab.', true);
    }
    return;
  }

  const rect = element.getBoundingClientRect();
  addComponent(className, parent, event.clientX - rect.left, event.clientY - rect.top);
}

function addTabSheet(pageControl) {
  const caption = `Tab ${pageControlSheets(pageControl).length + 1}`;
  const sheet = {
    kind: 'object',
    name: uniqueName('TTabSheet'),
    className: 'TTabSheet',
    properties: [makeProp('Caption', encodeLfmString(caption))],
    children: [],
  };
  pageControl.children.push(sheet);
  assignIds(state.roots);
  state.activeTabs.set(pageControl, sheet);
  const activeProp = getProperty(pageControl, 'ActivePage');
  if (activeProp) setPropertyValue(activeProp, sheet.name, 'identifier');
  else pageControl.properties.push(makeProp('ActivePage', sheet.name));
  state.selected = sheet;
  state.selection = [sheet];
  renderTree();
  renderCanvas();
  renderInspector();
  updateMultiTools();
  markDirty();
  setStatus(`Added ${sheet.name} (TTabSheet)`);
  return sheet;
}

const RESIZE_HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
const GRID = 8;

const drag = {
  active: false,
  mode: null,
  handle: null,
  node: null,
  el: null,
  group: null,
  startX: 0,
  startY: 0,
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  current: null,
};

function setNumberProp(node, name, value) {
  const prop = getProperty(node, name);
  const rounded = Math.round(value);
  if (!prop) {
    node.properties.push(makeProp(name, String(rounded)));
  } else {
    setPropertyValue(prop, rounded, 'integer');
  }
}

function startDrag(event, node, handle) {
  if (event.button !== 0) return;
  if (event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (alignOf(node) !== 'alNone') {
    event.preventDefault();
    event.stopPropagation();
    setStatus(`${node.name} is aligned (${alignOf(node)}); set Align = alNone to move it.`);
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  if (!state.selection.includes(node)) {
    selectNode(node);
  } else {
    selectPrimarySelection(node);
  }
  const el = els.canvas.querySelector(`[data-id="${node.__id}"]`);
  if (!el) return;

  const groupMode = handle === 'move' && state.selection.length > 1;
  let group = null;
  if (groupMode) {
    const selected = topLevelSelection().filter((item) => isVisual(item));
    if (selected.some((item) => alignOf(item) !== 'alNone')) {
      setStatus('Some selected components are aligned; set Align = alNone to move them.');
      return;
    }
    group = selected.map((item) => ({
      node: item,
      el: els.canvas.querySelector(`[data-id="${item.__id}"]`),
      startLeft: propNumber(item, 'Left', 0),
      startTop: propNumber(item, 'Top', 0),
      left: propNumber(item, 'Left', 0),
      top: propNumber(item, 'Top', 0),
    })).filter((item) => item.el);
    if (group.length < 2) group = null;
  }

  drag.active = true;
  drag.mode = handle === 'move' ? 'move' : 'resize';
  drag.handle = handle;
  drag.node = node;
  drag.el = el;
  drag.group = group;
  drag.startX = event.clientX;
  drag.startY = event.clientY;
  drag.left = propNumber(node, 'Left', 0);
  drag.top = propNumber(node, 'Top', 0);
  drag.width = Math.max(1, propNumber(node, 'Width', 100));
  drag.height = Math.max(1, propNumber(node, 'Height', 25));
  drag.current = { left: drag.left, top: drag.top, width: drag.width, height: drag.height };

  window.addEventListener('pointermove', onDragMove);
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  document.body.classList.add('dragging');
}

function onDragMove(event) {
  if (!drag.active) return;
  event.preventDefault();
  const snapValue = event.altKey
    ? (value) => Math.round(value)
    : (value) => Math.round(value / GRID) * GRID;
  const dx = event.clientX - drag.startX;
  const dy = event.clientY - drag.startY;

  if (drag.group && drag.mode === 'move') {
    for (const item of drag.group) {
      item.left = Math.max(0, snapValue(item.startLeft + dx));
      item.top = Math.max(0, snapValue(item.startTop + dy));
      item.el.style.left = `${item.left}px`;
      item.el.style.top = `${item.top}px`;
    }
    const primary = drag.group.find((item) => item.node === drag.node) || drag.group[0];
    setStatus(`${drag.group.length} selected · ${primary.node.name}: ${primary.left}, ${primary.top}`);
    return;
  }

  let left = drag.left;
  let top = drag.top;
  let width = drag.width;
  let height = drag.height;

  if (drag.mode === 'move') {
    left = Math.max(0, snapValue(drag.left + dx));
    top = Math.max(0, snapValue(drag.top + dy));
  } else {
    const handle = drag.handle;
    if (handle.includes('e')) width = Math.max(GRID, snapValue(drag.width + dx));
    if (handle.includes('s')) height = Math.max(GRID, snapValue(drag.height + dy));
    if (handle.includes('w')) {
      left = Math.max(0, Math.min(snapValue(drag.left + dx), drag.left + drag.width - GRID));
      width = drag.left + drag.width - left;
    }
    if (handle.includes('n')) {
      top = Math.max(0, Math.min(snapValue(drag.top + dy), drag.top + drag.height - GRID));
      height = drag.top + drag.height - top;
    }
  }

  drag.current = { left, top, width, height };
  drag.el.style.left = `${left}px`;
  drag.el.style.top = `${top}px`;
  drag.el.style.width = `${width}px`;
  drag.el.style.height = `${height}px`;
  setStatus(`${drag.node.name}: ${left}, ${top} · ${width} × ${height}`);
}

function endDrag() {
  if (!drag.active) return;
  const { node, current, group } = drag;
  drag.active = false;
  window.removeEventListener('pointermove', onDragMove);
  window.removeEventListener('pointerup', endDrag);
  window.removeEventListener('pointercancel', endDrag);
  document.body.classList.remove('dragging');

  if (group && group.length > 0) {
    const changed = group.some((item) => item.left !== item.startLeft || item.top !== item.startTop);
    if (changed) {
      for (const item of group) {
        setNumberProp(item.node, 'Left', item.left);
        setNumberProp(item.node, 'Top', item.top);
      }
      markDirty();
      renderCanvas();
      renderInspector();
      setStatus(`${group.length} components updated`);
    }
    drag.group = null;
    drag.node = null;
    drag.el = null;
    drag.current = null;
    return;
  }

  if (node && current) {
    const changed = current.left !== drag.left || current.top !== drag.top
      || current.width !== drag.width || current.height !== drag.height;
    if (changed) {
      setNumberProp(node, 'Left', current.left);
      setNumberProp(node, 'Top', current.top);
      setNumberProp(node, 'Width', current.width);
      setNumberProp(node, 'Height', current.height);
      markDirty();
      renderCanvas();
      renderInspector();
      setStatus(`${node.name}: ${current.left}, ${current.top} · ${current.width} × ${current.height}`);
    }
  }

  drag.node = null;
  drag.el = null;
  drag.group = null;
  drag.current = null;
}

function renderCanvas() {
  els.canvas.innerHTML = '';
  const root = state.roots[0];
  if (!root) {
    els.canvas.textContent = 'This project has no form.';
    els.formTitle.textContent = 'No form';
    return;
  }
  const form = document.createElement('div');
  form.className = 'designer-form';
  const formWidth = Math.max(1, propNumber(root, 'Width', 800));
  const formHeight = Math.max(1, propNumber(root, 'Height', 600));
  form.style.width = `${formWidth}px`;
  form.style.height = `${formHeight}px`;
  form.dataset.id = root.__id;
  form.addEventListener('click', (event) => {
    event.stopPropagation();
    selectNode(root);
  });

  const frames = layoutFrames(root, formWidth, formHeight);
  const rootFont = resolveNodeFont(root);
  const rootColor = resolveNodeColor(root);
  if (rootColor) form.style.backgroundColor = rootColor;
  for (const child of root.children) {
    renderCanvasNode(child, form, frames.get(child) || null, rootFont, rootColor);
  }
  els.canvas.appendChild(form);
  els.formTitle.textContent = `${root.name || root.className} · ${root.className}`;
}

const TAB_STRIP_HEIGHT = 28;

const COMPONENT_KINDS = {
  TWButton: 'button',
  TWFileButton: 'button',
  TWEdit: 'input',
  TWDateEditBox: 'input',
  TWTimeEditBox: 'input',
  TWMemo: 'memo',
  TWComboBox: 'select',
  TWListBox: 'list',
  TWCheckbox: 'check',
  TWRadioButton: 'radio',
  TWGroupBox: 'group',
  TWPanel: 'panel',
  TWScrollBox: 'scrollbox',
  TWPageControl: 'pagecontrol',
  TWLabel: 'label',
  TWImage: 'image',
  TWProgressBar: 'progress',
  TWScrollBar: 'slider',
  TWTrackBar: 'slider',
  TWSpinEdit: 'spin',
  TWIntegerEdit: 'spin',
  TWFloatEdit: 'spin',
  TWColorPicker: 'color',
  TWStringGrid: 'grid',
  TWDataGrid: 'grid',
  TWPagination: 'pagination',
  TWShape: 'canvas',
  TWPaintBox: 'canvas',
  TWSplitter: 'splitter',
  TWUpDown: 'updown',
};

const DELPHI_COLORS = {
  clBlack: '#000000',
  clMaroon: '#800000',
  clGreen: '#008000',
  clOlive: '#808000',
  clNavy: '#000080',
  clPurple: '#800080',
  clTeal: '#008080',
  clGray: '#808080',
  clSilver: '#c0c0c0',
  clRed: '#ff0000',
  clLime: '#00ff00',
  clYellow: '#ffff00',
  clBlue: '#0000ff',
  clFuchsia: '#ff00ff',
  clAqua: '#00ffff',
  clWhite: '#ffffff',
  clMoneyGreen: '#c0c0dc',
  clSkyBlue: '#a6caf0',
  clCream: '#fffbf0',
  clMedGray: '#a0a0a4',
  clScrollBar: '#c0c0c0',
  clBackground: '#3a6ea5',
  clActiveCaption: '#99b4d1',
  clInactiveCaption: '#bfcddb',
  clMenu: '#f0f0f0',
  clMenuText: '#000000',
  clWindow: '#ffffff',
  clWindowFrame: '#646464',
  clWindowText: '#000000',
  clCaptionText: '#000000',
  clActiveBorder: '#b4b4b4',
  clInactiveBorder: '#f4f7fc',
  clAppWorkspace: '#ababab',
  clHighlight: '#0078d7',
  clHighlightText: '#ffffff',
  clBtnFace: '#f0f0f0',
  clBtnShadow: '#a0a0a0',
  clGrayText: '#6d6d6d',
  clBtnText: '#000000',
  clInactiveCaptionText: '#000000',
  clBtnHighlight: '#ffffff',
  cl3DDkShadow: '#696969',
  cl3DLight: '#e3e3e3',
  clInfoText: '#000000',
  clInfoBk: '#ffffe1',
  clLtGray: '#c0c0c0',
  clDkGray: '#808080',
};

const ENUM_OPTIONS = {
  Align: ['alNone', 'alTop', 'alBottom', 'alLeft', 'alRight', 'alClient', 'alCustom'],
  Alignment: ['taLeftJustify', 'taRightJustify', 'taCenter'],
  BevelOuter: ['bvNone', 'bvLowered', 'bvRaised', 'bvSpace'],
  BevelInner: ['bvNone', 'bvLowered', 'bvRaised', 'bvSpace'],
  BorderStyle: ['bsNone', 'bsSingle'],
  ScrollBars: ['ssNone', 'ssHorizontal', 'ssVertical', 'ssBoth', 'ssAutoHorizontal', 'ssAutoVertical', 'ssAutoBoth'],
  Shape: ['stRectangle', 'stSquare', 'stRoundRect', 'stRoundSquare', 'stCircle', 'stEllipse', 'stSquaredTriangle', 'stTriangle'],
  Orientation: ['trHorizontal', 'trVertical'],
  Kind: ['sbHorizontal', 'sbVertical'],
  ViewStyle: ['vsIcon', 'vsSmallIcon', 'vsList', 'vsReport'],
  SortDirection: ['sdAscending', 'sdDescending'],
  ModalResult: [
    'mrNone', 'mrOk', 'mrCancel', 'mrAbort', 'mrRetry', 'mrIgnore',
    'mrYes', 'mrNo', 'mrAll', 'mrNoToAll', 'mrYesToAll', 'mrClose',
  ],
  InputType: ['itText', 'itEmail', 'itTel', 'itUrl', 'itSearch'],
  Cursor: [
    'crDefault', 'crNone', 'crArrow', 'crCross', 'crIBeam', 'crSizeAll',
    'crSizeNESW', 'crSizeNS', 'crSizeNWSE', 'crSizeWE', 'crSizeNW', 'crSizeN',
    'crSizeNE', 'crSizeW', 'crSizeE', 'crSizeSW', 'crSizeS', 'crSizeSE',
    'crUpArrow', 'crHourGlass', 'crDrag', 'crNoDrop', 'crHSplit', 'crVSplit',
    'crMultiDrag', 'crSQLWait', 'crNo', 'crAppStart', 'crHelp', 'crHandPoint',
    'crMove',
  ],
  CharCase: ['ecNormal', 'ecUppercase', 'ecLowerCase'],
  State: ['cbUnchecked', 'cbChecked'],
  Layout: ['tlTop', 'tlCenter', 'tlBottom'],
  TextLayout: ['tlTop', 'tlCenter', 'tlBottom'],
  DragKind: ['dkDrag', 'dkDock'],
  DragMode: ['dmManual', 'dmAutomatic'],
  FormType: ['ftModalForm', 'ftWindow'],
  SortIndicator: ['siNone', 'siAscending', 'siDescending'],
  SortType: ['stNone', 'stData', 'stText', 'stBoth'],
  TabPosition: ['tpTop', 'tpBottom', 'tpLeft', 'tpRight'],
  ResizeStyle: ['rsNone', 'rsLine', 'rsUpdate', 'rsPattern'],
  'Pen.Style': ['psSolid', 'psDash', 'psDot', 'psDashDot', 'psDashDotDot', 'psInsideFrame', 'psPattern', 'psClear'],
  'Brush.Style': ['bsSolid', 'bsClear', 'bsHorizontal', 'bsVertical', 'bsFDiagonal', 'bsBDiagonal', 'bsCross', 'bsDiagCross', 'bsImage', 'bsPattern'],
};

const COMBO_STYLE_OPTIONS = ['csDropDown', 'csDropDownList', 'csOwnerDrawFixed', 'csOwnerDrawVariable', 'csSimple'];
const FORM_BORDER_OPTIONS = ['bsNone', 'bsSingle', 'bsSizeable', 'bsDialog', 'bsToolWindow', 'bsSizeToolWin'];
const WCL_DEFAULT_FONT = '"Arial Narrow", Arial, "Helvetica Condensed", Helvetica, sans-serif';
const FONT_FAMILIES = [
  'Arial', 'Arial Narrow', 'Calibri', 'Cambria', 'Candara', 'Consolas',
  'Courier New', 'Garamond', 'Georgia', 'Lucida Console', 'Palatino Linotype',
  'Segoe UI', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana',
  'system-ui', 'sans-serif', 'serif', 'monospace',
];
const CHECKBOX_ALIGNMENT_OPTIONS = ['taLeftJustify', 'taRightJustify'];
const ANCHOR_OPTIONS = ['akTop', 'akLeft', 'akRight', 'akBottom'];
const FONT_STYLE_OPTIONS = ['fsBold', 'fsItalic', 'fsUnderline', 'fsStrikeOut'];
const GRID_OPTIONS = [
  'goFixedVertLine', 'goFixedHorzLine', 'goVertLine', 'goHorzLine', 'goRangeSelect',
  'goDrawFocusSelected', 'goRowSizing', 'goColSizing', 'goRowMoving', 'goColMoving',
  'goEditing', 'goTabs', 'goRowSelect', 'goAlwaysShowEditor', 'goThumbTracking',
  'goColSpanning', 'goRelaxedRowSelect', 'goDblClickAutoSize', 'goSmoothScroll',
];

const NESTED_GROUP_LABELS = {
  Font: 'Font',
  BorderSpacing: 'Border spacing',
  Constraints: 'Constraints',
  Pen: 'Pen',
  Brush: 'Brush',
  Margins: 'Margins',
};

const NESTED_GROUP_DEFAULTS = {
  Font: [
    { name: 'Font.Name', kind: 'string', value: '' },
    { name: 'Font.Height', kind: 'integer', value: '-13' },
    { name: 'Font.Color', kind: 'identifier', value: 'clBlack' },
    { name: 'Font.Style', kind: 'set', value: '[]' },
  ],
  BorderSpacing: [
    { name: 'BorderSpacing.Around', kind: 'integer', value: '0' },
    { name: 'BorderSpacing.Left', kind: 'integer', value: '0' },
    { name: 'BorderSpacing.Top', kind: 'integer', value: '0' },
    { name: 'BorderSpacing.Right', kind: 'integer', value: '0' },
    { name: 'BorderSpacing.Bottom', kind: 'integer', value: '0' },
  ],
  Constraints: [
    { name: 'Constraints.MinWidth', kind: 'integer', value: '0' },
    { name: 'Constraints.MinHeight', kind: 'integer', value: '0' },
    { name: 'Constraints.MaxWidth', kind: 'integer', value: '0' },
    { name: 'Constraints.MaxHeight', kind: 'integer', value: '0' },
  ],
};

const DATA_GRID_COLUMN_FIELDS = [
  { name: 'Title', kind: 'string', primary: true, label: 'Title', placeholder: 'Title' },
  { name: 'Name', kind: 'string', label: 'Field', placeholder: 'Field name' },
  { name: 'Width', kind: 'integer', label: 'Width', placeholder: 'auto' },
  { name: 'Alignment', kind: 'enum', label: 'Align', options: ENUM_OPTIONS.Alignment, default: 'taLeftJustify' },
  {
    name: 'Format',
    kind: 'enum',
    label: 'Format',
    options: ['cfBoolean', 'cfDataTime', 'cfNumber', 'cfCurrency', 'cfString'],
    default: 'cfString',
  },
  { name: 'DisplayMask', kind: 'string', label: 'Mask', placeholder: 'Display mask' },
  { name: 'Visible', kind: 'boolean', label: 'Visible', default: true },
  { name: 'Hint', kind: 'string', label: 'Hint', placeholder: 'Hint' },
  { name: 'Color', kind: 'color', label: 'Color', default: 'clWhite', wide: true },
  { name: 'ValueChecked', kind: 'string', label: 'Checked', placeholder: 'True' },
  { name: 'ValueUnchecked', kind: 'string', label: 'Unchecked', placeholder: 'False' },
];

const LIST_VIEW_COLUMN_FIELDS = [
  { name: 'Caption', kind: 'string', primary: true, label: 'Caption', placeholder: 'Caption' },
  { name: 'Width', kind: 'integer', label: 'Width', placeholder: '100' },
  { name: 'Alignment', kind: 'enum', label: 'Align', options: ENUM_OPTIONS.Alignment, default: 'taLeftJustify' },
  { name: 'AutoSize', kind: 'boolean', label: 'Auto', default: false },
  { name: 'Visible', kind: 'boolean', label: 'Visible', default: true },
  { name: 'MinWidth', kind: 'integer', label: 'Min', placeholder: '0' },
  { name: 'MaxWidth', kind: 'integer', label: 'Max', placeholder: '0' },
  {
    name: 'SortIndicator',
    kind: 'enum',
    label: 'Sort',
    options: ENUM_OPTIONS.SortIndicator,
    default: 'siNone',
  },
];

const COLLECTION_EDITORS = {
  TWDataGrid: {
    property: 'Columns',
    title: 'Columns',
    unit: 'columns',
    fields: DATA_GRID_COLUMN_FIELDS,
    fonts: ['TitleFont', 'Font'],
  },
  TWListView: {
    property: 'Columns',
    title: 'Columns',
    unit: 'columns',
    fields: LIST_VIEW_COLUMN_FIELDS,
  },
};

const COMMON_PROPERTIES = [
  { name: 'Align', kind: 'identifier', value: 'alNone' },
  { name: 'Anchors', kind: 'set', value: '[akLeft, akTop]' },
  { name: 'Color', kind: 'identifier', value: 'clDefault' },
  { name: 'ParentColor', kind: 'boolean', value: 'False' },
  { name: 'ParentFont', kind: 'boolean', value: 'True' },
  { name: 'Cursor', kind: 'identifier', value: 'crDefault' },
  { name: 'Enabled', kind: 'boolean', value: 'True' },
  { name: 'Visible', kind: 'boolean', value: 'True' },
  { name: 'Hint', kind: 'string', value: '' },
  { name: 'OnClick', kind: 'identifier', value: '' },
  { name: 'OnDblClick', kind: 'identifier', value: '' },
  { name: 'OnMouseEnter', kind: 'identifier', value: '' },
  { name: 'OnMouseLeave', kind: 'identifier', value: '' },
];

// Published properties offered by the inspector when the LFM does not set
// them. Editing one of these rows adds the property to the form.
const CLASS_PROPERTIES = {
  TWButton: [
    { name: 'Caption', kind: 'string', value: 'Button' },
    { name: 'ModalResult', kind: 'identifier', value: 'mrNone' },
    { name: 'Default', kind: 'boolean', value: 'False' },
  ],
  TWEdit: [
    { name: 'Text', kind: 'string', value: '' },
    { name: 'TextHint', kind: 'string', value: '' },
    { name: 'ReadOnly', kind: 'boolean', value: 'False' },
    { name: 'MaxLength', kind: 'integer', value: '0' },
    { name: 'OnChange', kind: 'identifier', value: '' },
  ],
  TWMemo: [
    { name: 'Text', kind: 'string', value: '' },
    { name: 'ReadOnly', kind: 'boolean', value: 'False' },
    { name: 'ScrollBars', kind: 'identifier', value: 'ssBoth' },
    { name: 'OnChange', kind: 'identifier', value: '' },
  ],
  TWComboBox: [
    { name: 'Text', kind: 'string', value: '' },
    { name: 'Items.Strings', kind: 'strings', value: '()' },
    { name: 'ItemIndex', kind: 'integer', value: '-1' },
    { name: 'Style', kind: 'identifier', value: 'csDropDown' },
    { name: 'Sorted', kind: 'boolean', value: 'False' },
    { name: 'OnChange', kind: 'identifier', value: '' },
  ],
  TWListBox: [
    { name: 'Items.Strings', kind: 'strings', value: '()' },
    { name: 'ItemIndex', kind: 'integer', value: '-1' },
    { name: 'MultiSelect', kind: 'boolean', value: 'False' },
    { name: 'Sorted', kind: 'boolean', value: 'False' },
    { name: 'OnChange', kind: 'identifier', value: '' },
  ],
  TWCheckbox: [
    { name: 'Caption', kind: 'string', value: 'Check' },
    { name: 'Checked', kind: 'boolean', value: 'False' },
    { name: 'OnChange', kind: 'identifier', value: '' },
  ],
  TWRadioButton: [
    { name: 'Caption', kind: 'string', value: 'Radio' },
    { name: 'Checked', kind: 'boolean', value: 'False' },
    { name: 'OnChange', kind: 'identifier', value: '' },
  ],
  TWLabel: [
    { name: 'Caption', kind: 'string', value: 'Label' },
    { name: 'AutoSize', kind: 'boolean', value: 'True' },
    { name: 'FocusControl', kind: 'identifier', value: '' },
    { name: 'Transparent', kind: 'boolean', value: 'False' },
    { name: 'WordWrap', kind: 'boolean', value: 'False' },
  ],
  TWImage: [
    { name: 'Stretch', kind: 'boolean', value: 'False' },
    { name: 'Proportional', kind: 'boolean', value: 'False' },
    { name: 'ZoomEnabled', kind: 'boolean', value: 'True' },
  ],
  TWPanel: [
    { name: 'Caption', kind: 'string', value: '' },
    { name: 'BevelOuter', kind: 'identifier', value: 'bvRaised' },
    { name: 'Alignment', kind: 'identifier', value: 'taLeftJustify' },
  ],
  TWGroupBox: [
    { name: 'Caption', kind: 'string', value: 'Group' },
  ],
  TWScrollBox: [
    { name: 'AutoScroll', kind: 'boolean', value: 'True' },
  ],
  TWPageControl: [
    { name: 'ActivePage', kind: 'identifier', value: '' },
    { name: 'ShowTabs', kind: 'boolean', value: 'True' },
    { name: 'TabIndex', kind: 'integer', value: '0' },
    { name: 'TabOrder', kind: 'integer', value: '0' },
    { name: 'OnShowPage', kind: 'identifier', value: '' },
  ],
  TTabSheet: [
    { name: 'Caption', kind: 'string', value: 'Tab' },
    { name: 'TabVisible', kind: 'boolean', value: 'True' },
  ],
  TWProgressBar: [
    { name: 'Min', kind: 'integer', value: '0' },
    { name: 'Max', kind: 'integer', value: '100' },
    { name: 'Value', kind: 'integer', value: '0' },
  ],
  TWScrollBar: [
    { name: 'Kind', kind: 'identifier', value: 'sbHorizontal' },
    { name: 'Min', kind: 'integer', value: '0' },
    { name: 'Max', kind: 'integer', value: '100' },
    { name: 'Position', kind: 'integer', value: '0' },
    { name: 'PageSize', kind: 'integer', value: '0' },
  ],
  TWTrackBar: [
    { name: 'Min', kind: 'integer', value: '0' },
    { name: 'Max', kind: 'integer', value: '10' },
    { name: 'Position', kind: 'integer', value: '0' },
    { name: 'Frequency', kind: 'integer', value: '1' },
    { name: 'Orientation', kind: 'identifier', value: 'trHorizontal' },
    { name: 'OnChange', kind: 'identifier', value: '' },
  ],
  TWSpinEdit: [
    { name: 'Value', kind: 'integer', value: '0' },
    { name: 'MinValue', kind: 'integer', value: '0' },
    { name: 'MaxValue', kind: 'integer', value: '100' },
    { name: 'Increment', kind: 'integer', value: '1' },
    { name: 'OnChange', kind: 'identifier', value: '' },
  ],
  TWIntegerEdit: [
    { name: 'Value', kind: 'integer', value: '0' },
    { name: 'MinValue', kind: 'integer', value: '0' },
    { name: 'MaxValue', kind: 'integer', value: '100' },
    { name: 'Increment', kind: 'integer', value: '1' },
    { name: 'OnChange', kind: 'identifier', value: '' },
  ],
  TWFloatEdit: [
    { name: 'Value', kind: 'float', value: '0' },
    { name: 'MinValue', kind: 'float', value: '0' },
    { name: 'MaxValue', kind: 'float', value: '100' },
    { name: 'DecimalPlaces', kind: 'integer', value: '2' },
    { name: 'Increment', kind: 'float', value: '1' },
    { name: 'OnChange', kind: 'identifier', value: '' },
  ],
  TWDateEditBox: [
    { name: 'Value', kind: 'float', value: '0' },
    { name: 'OnChange', kind: 'identifier', value: '' },
  ],
  TWTimeEditBox: [
    { name: 'Value', kind: 'float', value: '0' },
    { name: 'OnChange', kind: 'identifier', value: '' },
  ],
  TWColorPicker: [
    { name: 'Color', kind: 'identifier', value: 'clBlack' },
    { name: 'OnChange', kind: 'identifier', value: '' },
  ],
  TWFileButton: [
    { name: 'Caption', kind: 'string', value: 'Choose file' },
    { name: 'OnChange', kind: 'identifier', value: '' },
  ],
  TWStringGrid: [
    { name: 'ColCount', kind: 'integer', value: '5' },
    { name: 'RowCount', kind: 'integer', value: '5' },
    { name: 'FixedCols', kind: 'integer', value: '1' },
    { name: 'FixedRows', kind: 'integer', value: '1' },
    { name: 'Cells.Strings', kind: 'strings', value: '()' },
  ],
  TWTreeView: [
    { name: 'ShowLines', kind: 'boolean', value: 'True' },
    { name: 'ShowRoot', kind: 'boolean', value: 'True' },
    { name: 'ShowButtons', kind: 'boolean', value: 'True' },
    { name: 'ReadOnly', kind: 'boolean', value: 'False' },
    { name: 'Indent', kind: 'integer', value: '18' },
    { name: 'OnChange', kind: 'identifier', value: '' },
  ],
  TWListView: [
    { name: 'ViewStyle', kind: 'identifier', value: 'vsList' },
    { name: 'MultiSelect', kind: 'boolean', value: 'False' },
    { name: 'Checkboxes', kind: 'boolean', value: 'False' },
    { name: 'RowSelect', kind: 'boolean', value: 'False' },
    { name: 'ReadOnly', kind: 'boolean', value: 'False' },
  ],
  TWDataGrid: [
    { name: 'DataJSon', kind: 'string', value: '' },
  ],
  TWPagination: [
    { name: 'CurrentPage', kind: 'integer', value: '1' },
    { name: 'RecordsPerPage', kind: 'integer', value: '10' },
    { name: 'TotalRecords', kind: 'integer', value: '0' },
  ],
  TWUpDown: [
    { name: 'Min', kind: 'integer', value: '0' },
    { name: 'Max', kind: 'integer', value: '100' },
    { name: 'Position', kind: 'integer', value: '0' },
    { name: 'Increment', kind: 'integer', value: '1' },
  ],
  TWShape: [
    { name: 'Shape', kind: 'identifier', value: 'stRectangle' },
  ],
};

function nodeDepth(node) {
  let depth = 0;
  for (let parent = node.__parent; parent; parent = parent.__parent) depth++;
  return depth;
}

function formatStringList(values, indent) {
  if (values.length === 0) return '()';
  const lines = values.map((value) => `${indent}  ${encodeLfmString(value)}`);
  return `(\n${lines.join('\n')}\n${indent})`;
}

function rawForKind(kind, value) {
  switch (kind) {
    case 'string':
      return encodeLfmString(value);
    case 'boolean':
      return value === true || /^(true|1|yes)$/i.test(String(value)) ? 'True' : 'False';
    case 'integer':
      return String(parseInt(value, 10) || 0);
    case 'float':
      return String(Number(value) || 0);
    case 'strings':
      return '()';
    default:
      return String(value ?? '');
  }
}

function inferKind(value) {
  const text = String(value ?? '').trim();
  if (text === 'True' || text === 'False') return 'boolean';
  if (/^-?\d+$/.test(text)) return 'integer';
  if (/^-?(?:\d+\.\d*|\d*\.\d+)$/.test(text)) return 'float';
  if (/^['(<\[{]/.test(text)) return 'raw';
  return 'string';
}

function classPropertySpecs(node) {
  const common = isVisual(node, node === state.roots[0]) ? COMMON_PROPERTIES : [];
  return [...common, ...(CLASS_PROPERTIES[canonicalClassName(node.className)] || [])];
}

function missingProperties(node) {
  const present = new Set(node.properties.map((prop) => prop.name));
  const seen = new Set();
  const specs = [...classPropertySpecs(node), ...nestedDefaultSpecs(node)];
  return specs.filter((spec) => {
    if (present.has(spec.name) || seen.has(spec.name)) return false;
    seen.add(spec.name);
    return true;
  });
}

function ensureProperty(node, spec) {
  const existing = getProperty(node, spec.name);
  if (existing) return existing;
  const prop = makeProp(spec.name, spec.raw ?? rawForKind(spec.kind, spec.value));
  let index = node.properties.length;
  if (spec.name.includes('.')) {
    const prefix = spec.name.slice(0, spec.name.indexOf('.') + 1);
    for (let i = node.properties.length - 1; i >= 0; i -= 1) {
      if (node.properties[i].name.startsWith(prefix)) {
        index = i + 1;
        break;
      }
    }
  }
  node.properties.splice(index, 0, prop);
  return prop;
}

function componentKind(node) {
  return COMPONENT_KINDS[canonicalClassName(node.className)] || '';
}

function bgrToHex(value) {
  const number = value >>> 0;
  const red = number & 0xff;
  const green = (number >>> 8) & 0xff;
  const blue = (number >>> 16) & 0xff;
  return `#${[red, green, blue].map((part) => part.toString(16).padStart(2, '0')).join('')}`;
}

function colorHex(raw) {
  const text = String(raw ?? '').trim();
  if (!text || text === 'clNone' || text === 'clDefault') return null;
  if (DELPHI_COLORS[text]) return DELPHI_COLORS[text];
  if (/^#[0-9A-Fa-f]{6}$/.test(text)) return text.toLowerCase();
  if (/^\$[0-9A-Fa-f]{1,8}$/.test(text)) {
    const value = parseInt(text.slice(1), 16);
    return value >= 0 && value <= 0xffffff ? bgrToHex(value) : null;
  }
  if (/^-?\d+$/.test(text)) {
    const value = Number(text);
    return value >= 0 && value <= 0xffffff ? bgrToHex(value) : null;
  }
  return null;
}

function colorValue(raw) {
  return colorHex(raw) || '#f0f0f0';
}

function colorRawFromHex(hex) {
  const normalized = String(hex || '').toLowerCase();
  for (const [name, value] of Object.entries(DELPHI_COLORS)) {
    if (value.toLowerCase() === normalized) return name;
  }
  const red = parseInt(normalized.slice(1, 3), 16) || 0;
  const green = parseInt(normalized.slice(3, 5), 16) || 0;
  const blue = parseInt(normalized.slice(5, 7), 16) || 0;
  return String((blue << 16) | (green << 8) | red);
}

function isColorProperty(name) {
  if (/^On[A-Z]/.test(name)) return false;
  if (name === 'ParentColor' || name === 'ShowColor') return false;
  return name === 'Color' || /(?:^|\.)[A-Za-z]*Color$/.test(name);
}

function enumOptionsFor(name, node) {
  if (/^On[A-Z]/.test(name)) return null;
  const className = canonicalClassName(node.className);
  if (name === 'Style') {
    return className === 'TWComboBox' ? COMBO_STYLE_OPTIONS : null;
  }
  if (name === 'Alignment' && (className === 'TWCheckbox' || className === 'TWRadioButton')) {
    return CHECKBOX_ALIGNMENT_OPTIONS;
  }
  if (name === 'BorderStyle' && (node === state.roots[0] || className === 'TWForm')) {
    return FORM_BORDER_OPTIONS;
  }
  if (name === 'Orientation' && className === 'TWUpDown') {
    return ['udHorizontal', 'udVertical'];
  }
  return ENUM_OPTIONS[name] || null;
}

function setOptionsFor(name, node) {
  if (name === 'Anchors') return ANCHOR_OPTIONS;
  if (name === 'Font.Style') return FONT_STYLE_OPTIONS;
  if (name === 'Options' && canonicalClassName(node.className) === 'TWStringGrid') return GRID_OPTIONS;
  return null;
}

function nestedDefaultSpecs(node) {
  if (!isVisual(node, node === state.roots[0])) return [];
  return Object.values(NESTED_GROUP_DEFAULTS).flat();
}

function propertyGroupPrefix(name) {
  if (!name.includes('.')) return '';
  const prefix = name.slice(0, name.indexOf('.'));
  if (['Items', 'Cells', 'Lines', 'Columns'].includes(prefix)) return '';
  return prefix;
}

// Parse the `( 'a' 'b' )` form used by Items.Strings and Cells.Strings.
function parseStringList(raw) {
  const text = String(raw ?? '').trim().replace(/^\(/, '').replace(/\)$/, '');
  if (text.trim() === '') return [];
  const result = [];
  let current = '';
  let hasToken = false;
  let index = 0;
  const flush = () => {
    result.push(current);
    current = '';
    hasToken = false;
  };

  while (index < text.length) {
    const ch = text[index];
    if (ch === "'") {
      hasToken = true;
      index++;
      while (index < text.length) {
        if (text[index] === "'") {
          if (text[index + 1] === "'") {
            current += "'";
            index += 2;
            continue;
          }
          index++;
          break;
        }
        current += text[index++];
      }
    } else if (ch === '#') {
      hasToken = true;
      index++;
      let digits = '';
      while (index < text.length && /[0-9A-Fa-f$]/.test(text[index])) digits += text[index++];
      if (digits.startsWith('$')) current += String.fromCharCode(parseInt(digits.slice(1), 16));
      else if (digits) current += String.fromCharCode(parseInt(digits, 10));
    } else if (ch === '\n' || ch === '\r' || ch === ',') {
      if (hasToken) flush();
      index++;
    } else {
      index++;
    }
  }

  if (hasToken) flush();
  return result;
}

function stringList(node, name) {
  const prop = getProperty(node, name);
  return prop && prop.kind === 'strings' ? parseStringList(prop.raw) : [];
}

function skinElement(tag, className, text) {
  const el = document.createElement(tag);
  el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

// Resolve the font a control would use at run time. ParentFont keeps the
// inherited font; otherwise the Font.* properties of the node override it.
// Font.Height is the negative pixel height used by the LFM, while Font.Size is
// expressed in points and converted for the CSS preview.
function resolveNodeFont(node, inherited = null) {
  const parentFont = getPropertyValue(node, 'ParentFont', true) !== false;
  if (parentFont && inherited) return inherited;
  const font = {};
  const family = propText(node, 'Font.Name').trim();
  if (family) font.family = family;
  const height = propNumber(node, 'Font.Height', 0);
  if (height !== 0) {
    font.size = `${Math.abs(height)}px`;
  } else {
    const size = propNumber(node, 'Font.Size', 0);
    if (size > 0) font.size = `${Math.max(1, Math.round((size * 96) / 72))}px`;
  }
  const color = getProperty(node, 'Font.Color');
  if (color) {
    const hex = colorHex(color.raw);
    if (hex) font.color = hex;
  }
  const style = getProperty(node, 'Font.Style');
  if (style) {
    const values = new Set(parseSet(style.raw));
    font.bold = values.has('fsBold');
    font.italic = values.has('fsItalic');
    font.underline = values.has('fsUnderline');
    font.strike = values.has('fsStrikeOut');
  }
  return font;
}

function applyNodeFont(element, font) {
  if (!element || !font) return;
  if (font.family) element.style.fontFamily = font.family;
  if (font.size) element.style.fontSize = font.size;
  if (font.color) element.style.color = font.color;
  if (font.bold === true) element.style.fontWeight = '700';
  else if (font.bold === false) element.style.fontWeight = 'normal';
  else element.style.fontWeight = '';
  if (font.italic === true) element.style.fontStyle = 'italic';
  else if (font.italic === false) element.style.fontStyle = 'normal';
  else element.style.fontStyle = '';
  if (font.underline !== undefined || font.strike !== undefined) {
    const decoration = [];
    if (font.underline) decoration.push('underline');
    if (font.strike) decoration.push('line-through');
    element.style.textDecoration = decoration.join(' ') || 'none';
  } else {
    element.style.textDecoration = '';
  }
}

// Keep the visible ParentFont/ParentColor default rows in sync when a font or
// colour edit clears inheritance without rebuilding the whole inspector.
function syncParentToggle(node, name, value) {
  if (state.selected !== node) return;
  const row = [...document.querySelectorAll('#inspector > .property-list > .property-row')]
    .find((entry) => entry.querySelector('label')?.textContent === name);
  if (!row) return;
  const input = row.querySelector('input[type="checkbox"]');
  if (!input) return;
  input.checked = value;
  row.classList.remove('default');
  const label = row.querySelector('label');
  if (label) label.title = `${name} (boolean)`;
}

// LCL clears ParentFont as soon as one of the font properties is edited, so
// the new value is not inherited again by the control.
function ensureOwnFont(node) {
  if (!node || node === state.roots[0]) return;
  const prop = getProperty(node, 'ParentFont');
  if (!prop) {
    node.properties.push(makeProp('ParentFont', 'False'));
  } else if (prop.value !== false) {
    setPropertyValue(prop, false, 'boolean');
  }
  syncParentToggle(node, 'ParentFont', false);
}

// The control background follows Color / ParentColor.  clDefault and clNone
// leave the element transparent, as the runtime does.
function resolveNodeColor(node, inherited = null) {
  if (getPropertyValue(node, 'ParentColor', false) === true && inherited) {
    return inherited;
  }
  const prop = getProperty(node, 'Color');
  if (!prop) return null;
  return colorHex(prop.raw);
}

function ensureOwnColor(node) {
  if (!node || node === state.roots[0]) return;
  const prop = getProperty(node, 'ParentColor');
  if (!prop) {
    node.properties.push(makeProp('ParentColor', 'False'));
  } else if (prop.value !== false) {
    setPropertyValue(prop, false, 'boolean');
  }
  syncParentToggle(node, 'ParentColor', false);
}

// Merge `<prefix>.Name/Height/Size/Color/Style` of a collection item over a
// base font.  A missing TitleFont/Font inherits the font of the grid.
function collectionFont(item, prefix, base = {}) {
  const font = { ...base };
  const prop = (name) => item.properties.find((entry) => entry.name === `${prefix}.${name}`);
  const name = prop('Name');
  if (name && String(name.value ?? '').trim() !== '') {
    font.family = String(name.value).trim();
  }
  const height = prop('Height');
  if (height) {
    const value = Number(height.value);
    if (Number.isFinite(value) && value !== 0) font.size = `${Math.abs(value)}px`;
  } else {
    const size = prop('Size');
    if (size) {
      const value = Number(size.value);
      if (Number.isFinite(value) && value > 0) {
        font.size = `${Math.max(1, Math.round((value * 96) / 72))}px`;
      }
    }
  }
  const color = prop('Color');
  if (color) {
    const hex = colorHex(color.raw);
    if (hex) font.color = hex;
  }
  const style = prop('Style');
  if (style) {
    const values = new Set(parseSet(style.raw));
    font.bold = values.has('fsBold');
    font.italic = values.has('fsItalic');
    font.underline = values.has('fsUnderline');
    font.strike = values.has('fsStrikeOut');
  }
  return font;
}

function fontSetRaw(font) {
  const values = [];
  if (font.bold) values.push('fsBold');
  if (font.italic) values.push('fsItalic');
  if (font.underline) values.push('fsUnderline');
  if (font.strike) values.push('fsStrikeOut');
  return `[${values.join(', ')}]`;
}

// Resolve a node font with the same ParentFont rules used by the canvas, so
// the column editors can show the font a TitleFont/Font would inherit.
function resolvedNodeFont(node) {
  const chain = [];
  for (let current = node; current; current = current.__parent) chain.push(current);
  let font = null;
  for (let index = chain.length - 1; index >= 0; index -= 1) {
    font = resolveNodeFont(chain[index], font);
  }
  return font || {};
}

function renderComponentSkin(node, font = {}) {
  const className = canonicalClassName(node.className);
  const caption = propText(node, 'Caption');
  const text = propText(node, 'Text');

  switch (className) {
    case 'TWButton':
    case 'TWFileButton':
      return skinElement('div', 'preview-button', caption || node.name);

    case 'TWEdit':
      return skinElement('div', 'preview-input', text);

    case 'TWDateEditBox':
    case 'TWTimeEditBox':
      return skinElement('div', 'preview-input preview-muted', propText(node, 'Value') || text);

    case 'TWMemo':
      return skinElement('div', 'preview-input preview-memo', text);

    case 'TWComboBox': {
      const items = stringList(node, 'Items.Strings');
      const index = propNumber(node, 'ItemIndex', -1);
      const value = index >= 0 && index < items.length ? items[index] : text;
      const box = skinElement('div', 'preview-input preview-select', value || '');
      box.appendChild(skinElement('span', 'preview-arrow', '▾'));
      return box;
    }

    case 'TWListBox': {
      const items = stringList(node, 'Items.Strings');
      const box = skinElement('div', 'preview-list');
      for (const item of items.slice(0, 12)) {
        box.appendChild(skinElement('div', 'preview-row', item || ' '));
      }
      if (items.length === 0) box.appendChild(skinElement('div', 'preview-row preview-muted', '(empty)'));
      return box;
    }

    case 'TWCheckbox':
    case 'TWRadioButton': {
      const row = skinElement('div', 'preview-check');
      if (getPropertyValue(node, 'Checked', false) === true) row.classList.add('checked');
      const box = skinElement('span', className === 'TWRadioButton' ? 'preview-box preview-radio' : 'preview-box');
      row.append(box, skinElement('span', 'preview-check-label', caption || node.name));
      return row;
    }

    case 'TWProgressBar': {
      const min = propNumber(node, 'Min', 0);
      const max = propNumber(node, 'Max', 100);
      const value = propNumber(node, 'Value', 0);
      const ratio = max > min ? (value - min) / (max - min) : 0;
      const bar = skinElement('div', 'preview-progress');
      const fill = skinElement('div', 'preview-progress-fill');
      fill.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
      bar.appendChild(fill);
      return bar;
    }

    case 'TWScrollBar':
    case 'TWTrackBar': {
      const min = propNumber(node, 'Min', 0);
      const max = propNumber(node, 'Max', 100);
      const value = propNumber(node, 'Position', 0);
      const ratio = max > min ? (value - min) / (max - min) : 0;
      const bar = skinElement('div', 'preview-slider');
      const thumb = skinElement('div', 'preview-thumb');
      thumb.style.left = `calc(${Math.max(0, Math.min(1, ratio)) * 100}% - 6px)`;
      bar.appendChild(thumb);
      return bar;
    }

    case 'TWSpinEdit':
    case 'TWIntegerEdit':
    case 'TWFloatEdit': {
      const box = skinElement('div', 'preview-input preview-spin', propText(node, 'Value') || '0');
      const buttons = skinElement('span', 'preview-spin-buttons');
      buttons.append(skinElement('span', '', '▴'), skinElement('span', '', '▾'));
      box.appendChild(buttons);
      return box;
    }

    case 'TWColorPicker': {
      const box = skinElement('div', 'preview-color');
      const swatch = skinElement('span', 'preview-swatch');
      swatch.style.background = colorValue(propText(node, 'Color'));
      box.append(swatch, skinElement('span', 'preview-muted', propText(node, 'Color')));
      return box;
    }

    case 'TWImage':
      return skinElement('div', 'preview-image');

    case 'TWStringGrid': {
      const cells = stringList(node, 'Cells.Strings');
      const cols = Math.max(1, propNumber(node, 'ColCount', 5));
      const rows = Math.max(1, propNumber(node, 'RowCount', 5));
      const table = document.createElement('table');
      table.className = 'preview-grid';
      for (let row = 0; row < Math.min(rows, 8); row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < Math.min(cols, 8); col++) {
          tr.appendChild(skinElement('td', '', cells[row * cols + col] || ''));
        }
        table.appendChild(tr);
      }
      return table;
    }

    case 'TWDataGrid': {
      const info = readCollectionProperty(node, 'Columns');
      if (!info.valid || info.items.length === 0) return null;
      const columns = info.items.filter((item) => {
        const visible = collectionFieldValue(item, { name: 'Visible', kind: 'boolean', default: true });
        return visible !== false;
      }).slice(0, 8);
      if (columns.length === 0) return null;
      const table = document.createElement('table');
      table.className = 'preview-grid preview-datagrid';

      const widths = columns.map((item) => {
        const value = Number(collectionFieldValue(item, { name: 'Width', kind: 'integer' }));
        return Number.isFinite(value) && value > 0 ? value : 0;
      });
      if (widths.some((width) => width > 0)) {
        const colgroup = document.createElement('colgroup');
        for (const width of widths) {
          const col = document.createElement('col');
          if (width > 0) col.style.width = `${width}px`;
          colgroup.appendChild(col);
        }
        table.appendChild(colgroup);
      }

      if (getPropertyValue(node, 'ShowHeader', true) !== false) {
        const header = document.createElement('tr');
        for (const item of columns) {
          const cell = document.createElement('th');
          cell.textContent = String(
            collectionFieldValue(item, { name: 'Title', kind: 'string' })
            || collectionFieldValue(item, { name: 'Name', kind: 'string' })
            || '',
          );
          applyNodeFont(cell, collectionFont(item, 'TitleFont', font));
          header.appendChild(cell);
        }
        table.appendChild(header);
      }

      const alternate = colorHex(String(getPropertyValue(node, 'AlternateRowColor', '15921906') ?? ''));
      for (let row = 0; row < 3; row++) {
        const tr = document.createElement('tr');
        for (const item of columns) {
          const cell = document.createElement('td');
          applyNodeFont(cell, collectionFont(item, 'Font', font));
          const columnColor = colorHex(String(
            collectionFieldValue(item, { name: 'Color', kind: 'color' }) || 'clWhite',
          ));
          const background = alternate && row % 2 === 0 ? alternate : columnColor;
          if (background) cell.style.backgroundColor = background;
          const alignment = String(collectionFieldValue(item, { name: 'Alignment', kind: 'enum' }) || '');
          if (alignment === 'taCenter') cell.style.textAlign = 'center';
          else if (alignment === 'taRightJustify') cell.style.textAlign = 'right';
          tr.appendChild(cell);
        }
        table.appendChild(tr);
      }
      return table;
    }

    case 'TWPagination': {
      const current = propNumber(node, 'CurrentPage', 1);
      const count = Math.max(1, propNumber(node, 'PageCount', 5));
      const row = skinElement('div', 'preview-pagination');
      for (let page = 1; page <= Math.min(count, 9); page++) {
        row.appendChild(skinElement('span', page === current ? 'preview-page active' : 'preview-page', String(page)));
      }
      return row;
    }

    case 'TWShape':
    case 'TWPaintBox':
      return skinElement('div', 'preview-canvas');

    case 'TWUpDown': {
      const box = skinElement('div', 'preview-updown');
      box.append(skinElement('span', '', '▴'), skinElement('span', '', '▾'));
      return box;
    }

    case 'TWSplitter':
      return skinElement('div', 'preview-splitter');

    default:
      return null;
  }
}

function renderPageControl(node, el, geometry, inheritedFont = null, inheritedColor = null) {
  const sheets = pageControlSheets(node);
  if (sheets.length === 0) {
    for (const child of node.children) renderCanvasNode(child, el, null, inheritedFont, inheritedColor);
    return;
  }

  const active = activeTabSheet(node);
  const stripHeight = showPageTabs(node) ? TAB_STRIP_HEIGHT : 0;
  if (stripHeight > 0) {
    const strip = document.createElement('div');
    strip.className = 'page-tabs';
    applyNodeFont(strip, inheritedFont);
    for (const sheet of sheets) {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'page-tab';
      if (sheet === active) tab.classList.add('active');
      tab.textContent = propText(sheet, 'Caption') || sheet.name;
      tab.title = sheet.name;
      tab.addEventListener('pointerdown', (event) => event.stopPropagation());
      tab.addEventListener('click', (event) => {
        event.stopPropagation();
        activateTabSheet(sheet, true);
        selectNode(sheet);
      });
      strip.appendChild(tab);
    }
    el.appendChild(strip);
  }

  if (!active) return;
  const width = Math.max(1, geometry ? geometry.width : propNumber(node, 'Width', 300));
  const height = Math.max(1, geometry ? geometry.height : propNumber(node, 'Height', 200));
  renderCanvasNode(active, el, {
    left: 0,
    top: stripHeight,
    width,
    height: Math.max(1, height - stripHeight),
    chrome: false,
  }, inheritedFont, inheritedColor);
}

function renderCanvasNode(node, parent, frame = null, inheritedFont = null, inheritedColor = null) {
  if (!isVisual(node)) return;
  const el = document.createElement('div');
  el.className = 'designer-component';
  el.dataset.id = node.__id;
  el.title = nodeTitle(node);
  const font = resolveNodeFont(node, inheritedFont);
  const color = resolveNodeColor(node, inheritedColor);

  const geometry = frame || {
    left: propNumber(node, 'Left', 0),
    top: propNumber(node, 'Top', 0),
    width: Math.max(1, propNumber(node, 'Width', 100)),
    height: Math.max(1, propNumber(node, 'Height', 25)),
  };
  el.style.left = `${geometry.left}px`;
  el.style.top = `${geometry.top}px`;
  el.style.width = `${Math.max(1, geometry.width)}px`;
  el.style.height = `${Math.max(1, geometry.height)}px`;
  if (getPropertyValue(node, 'Visible', true) === false) {
    el.classList.add('hidden');
  }
  if (state.selection.includes(node)) el.classList.add('selected');
  if (state.selected === node) el.classList.add('primary');

  const chrome = !frame || frame.chrome !== false;
  const aligned = !!(frame && frame.aligned);
  if (!chrome) el.classList.add('page-sheet');
  if (aligned) el.classList.add('aligned');

  const kind = componentKind(node);
  if (kind) el.classList.add(`kind-${kind}`);

  const isPageControl = canonicalClassName(node.className) === 'TWPageControl';

  if (chrome) {
    const skin = renderComponentSkin(node, font);
    if (skin) {
      applyNodeFont(skin, font);
      if (color) skin.style.backgroundColor = color;
      el.appendChild(skin);
    } else if (!isPageControl) {
      const text = document.createElement('span');
      text.className = 'component-text';
      text.textContent = displayText(node);
      applyNodeFont(text, font);
      el.appendChild(text);
    }
    if (!skin && color) el.style.backgroundColor = color;

    if (!isPageControl) {
      const badge = document.createElement('span');
      badge.className = 'component-badge';
      badge.textContent = node.className;
      el.appendChild(badge);
    }

    const preview = renderItemPreview(node);
    if (preview) {
      applyNodeFont(preview, font);
      el.appendChild(preview);
    }

    if (!aligned && state.selection.length === 1 && state.selected === node) {
      for (const handle of RESIZE_HANDLES) {
        const grip = document.createElement('span');
        grip.className = `resize-handle handle-${handle}`;
        grip.dataset.handle = handle;
        grip.addEventListener('pointerdown', (event) => startDrag(event, node, handle));
        el.appendChild(grip);
      }
    }

    el.addEventListener('click', (event) => {
      event.stopPropagation();
      const additive = event.ctrlKey || event.metaKey || event.shiftKey;
      if (additive) {
        event.preventDefault();
        selectNode(node, true);
      } else if (!state.selection.includes(node)) {
        selectNode(node);
      } else {
        selectPrimarySelection(node);
      }
    });

    if (aligned) {
      el.addEventListener('pointerdown', (event) => {
        event.stopPropagation();
        setStatus(`${node.name} is aligned (${alignOf(node)}); set Align = alNone to move it.`);
      });
    } else {
      el.addEventListener('pointerdown', (event) => {
        if (event.target instanceof Element && event.target.classList.contains('resize-handle')) return;
        startDrag(event, node, 'move');
      });
    }
  }

  if (!chrome && color) el.style.backgroundColor = color;

  if (isPageControl) {
    renderPageControl(node, el, geometry, font, color);
  } else {
    const frames = layoutFrames(node, geometry.width, geometry.height);
    for (const child of node.children) {
      renderCanvasNode(child, el, frames.get(child) || null, font, color);
    }
  }
  parent.appendChild(el);
}

function renderItemPreview(node) {
  const items = componentItems(node);
  if (!items) return null;

  const box = document.createElement('div');
  box.className = 'component-items';
  if (items.kind === 'tree') {
    const walk = (nodes, depth) => {
      for (const item of nodes) {
        const row = document.createElement('div');
        row.className = 'component-item';
        row.style.paddingLeft = `${depth * 10}px`;
        row.textContent = item.text || '(empty)';
        box.appendChild(row);
        walk(item.children, depth + 1);
      }
    };
    walk(items.nodes, 0);
  } else {
    for (const item of items.items) {
      const row = document.createElement('div');
      row.className = 'component-item';
      row.textContent = [item.caption, ...item.subItems].join('   ');
      box.appendChild(row);
    }
  }
  return box.children.length > 0 ? box : null;
}

function renderExistingPropertyRow(node, prop, labelText) {
  const row = propertyRow(prop.name, prop.kind, false, labelText);
  const editor = propertyEditor(node, prop);
  if (isEventProperty(prop)) {
    const wrap = document.createElement('div');
    wrap.className = 'property-editor-with-action';
    wrap.append(editor, eventButton(prop));
    if (NOTIFY_EVENTS.has(prop.name)) {
      wrap.append(eventCreateButton(node, prop));
    }
    row.appendChild(wrap);
  } else {
    row.appendChild(editor);
  }
  return row;
}

function renderDefaultPropertyRow(node, spec, labelText) {
  const row = propertyRow(spec.name, spec.kind, true, labelText);
  row.appendChild(isEventProperty(spec)
    ? defaultEventEditor(node, spec, row)
    : defaultPropertyEditor(node, spec, row));
  return row;
}

function renderInspector() {
  els.inspector.innerHTML = '';
  const node = state.selected;
  if (!node) {
    els.inspector.textContent = 'Select a component.';
    return;
  }
  const header = document.createElement('div');
  header.className = 'inspector-header';
  const title = document.createElement('strong');
  title.textContent = node.name || node.className;
  const sub = document.createElement('span');
  sub.textContent = node.className;
  header.append(title, sub);
  els.inspector.appendChild(header);

  const table = document.createElement('div');
  table.className = 'property-list';
  const items = componentItems(node);
  const collectionConfig = collectionConfigFor(node);
  const collectionInfo = collectionConfig
    ? readCollectionProperty(node, collectionConfig.property)
    : null;
  const entries = [];
  const groups = new Map();
  const addEntry = (name, entry) => {
    const prefix = propertyGroupPrefix(name);
    if (!prefix) {
      entries.push({ type: 'row', name, ...entry });
      return;
    }
    let group = groups.get(prefix);
    if (!group) {
      group = {
        type: 'group',
        prefix,
        label: NESTED_GROUP_LABELS[prefix] || prefix,
        rows: [],
        hasExisting: false,
      };
      groups.set(prefix, group);
      entries.push(group);
    }
    if (entry.prop) group.hasExisting = true;
    group.rows.push({ name, label: name.slice(prefix.length + 1), ...entry });
  };

  for (const prop of node.properties) {
    if (items && prop === items.prop) continue;
    if (collectionInfo && collectionInfo.valid && prop === collectionInfo.prop) continue;
    addEntry(prop.name, { prop, isDefault: false });
  }
  for (const spec of missingProperties(node)) {
    addEntry(spec.name, { spec, isDefault: true });
  }

  for (const entry of entries) {
    if (entry.type === 'group') {
      const details = document.createElement('details');
      details.className = 'property-group';
      if (entry.hasExisting) details.open = true;
      const summary = document.createElement('summary');
      summary.append(document.createTextNode(entry.label));
      if (!entry.hasExisting) {
        const note = document.createElement('span');
        note.className = 'property-group-note';
        note.textContent = 'not set';
        summary.appendChild(note);
      }
      details.appendChild(summary);
      const body = document.createElement('div');
      body.className = 'property-group-body';
      for (const rowEntry of entry.rows) {
        body.appendChild(rowEntry.prop
          ? renderExistingPropertyRow(node, rowEntry.prop, rowEntry.label)
          : renderDefaultPropertyRow(node, rowEntry.spec, rowEntry.label));
      }
      details.appendChild(body);
      table.appendChild(details);
    } else {
      table.appendChild(entry.prop
        ? renderExistingPropertyRow(node, entry.prop, entry.name)
        : renderDefaultPropertyRow(node, entry.spec, entry.name));
    }
  }
  els.inspector.appendChild(table);
  const editor = renderItemsEditor(node);
  if (editor) els.inspector.appendChild(editor);
  if (collectionConfig && collectionInfo && collectionInfo.valid) {
    els.inspector.appendChild(renderCollectionEditor(node, collectionConfig, collectionInfo));
  }
  const pages = renderPagesEditor(node);
  if (pages) els.inspector.appendChild(pages);
  els.inspector.appendChild(renderAddProperty(node));
}

function propertyRow(name, kind, isDefault = false, labelText = name) {
  const row = document.createElement('div');
  row.className = 'property-row';
  if (isDefault) row.classList.add('default');
  const label = document.createElement('label');
  label.textContent = labelText;
  label.title = isDefault
    ? `${name} (${kind}) · not set in the LFM`
    : `${name} (${kind})`;
  row.appendChild(label);
  return row;
}

function finishInput(input) {
  input.className = 'property-input';
  return input;
}

function enumEditor(initial, options, onChange) {
  const current = String(initial ?? '').trim();
  const values = [...options];
  if (current === '') values.unshift('');
  else if (!values.includes(current)) values.unshift(current);
  const select = document.createElement('select');
  select.className = 'property-input property-select';
  for (const value of values) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value === '' ? '(not set)' : value;
    select.appendChild(option);
  }
  select.value = current;
  select.addEventListener('change', () => onChange(select.value));
  return select;
}

let fontFamilyDatalist = null;

function ensureFontFamilyDatalist() {
  if (fontFamilyDatalist && fontFamilyDatalist.isConnected) return fontFamilyDatalist;
  const list = document.createElement('datalist');
  list.id = 'wcl-font-families';
  const fallback = document.createElement('option');
  fallback.value = WCL_DEFAULT_FONT;
  fallback.label = 'WCL default';
  list.appendChild(fallback);
  for (const family of FONT_FAMILIES) {
    const option = document.createElement('option');
    option.value = family;
    list.appendChild(option);
  }
  document.body.appendChild(list);
  fontFamilyDatalist = list;
  return list;
}

function fontNameEditor(initial, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'property-font';
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'property-input property-font-input';
  input.value = String(initial ?? '');
  input.spellcheck = false;
  input.title = 'Font family or CSS font stack';
  input.setAttribute('list', ensureFontFamilyDatalist().id);
  const sample = document.createElement('span');
  sample.className = 'property-font-sample';
  sample.textContent = 'Aa';
  sample.title = 'Font preview';
  sample.style.fontFamily = input.value.trim() || WCL_DEFAULT_FONT;
  input.addEventListener('input', () => {
    sample.style.fontFamily = input.value.trim() || WCL_DEFAULT_FONT;
    onChange(input.value);
  });
  wrap.append(input, sample);
  return wrap;
}

function colorEditor(initial, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'property-color';
  const picker = document.createElement('input');
  picker.type = 'color';
  picker.className = 'property-color-input';
  const text = document.createElement('input');
  text.type = 'text';
  text.className = 'property-input property-color-text';
  let lastRaw = String(initial ?? '');
  text.value = lastRaw;
  picker.value = colorHex(initial) || '#f0f0f0';
  const apply = (raw) => {
    lastRaw = raw;
    onChange(raw);
  };
  picker.addEventListener('input', () => {
    const raw = colorRawFromHex(picker.value);
    text.value = raw;
    apply(raw);
  });
  const commitText = (final) => {
    const value = text.value.trim();
    if (value === '') return;
    const hex = colorHex(value);
    if (value.startsWith('#')) {
      if (hex) {
        picker.value = hex;
        apply(colorRawFromHex(hex));
        if (final) text.value = lastRaw;
      } else if (final) {
        text.value = lastRaw;
      }
      return;
    }
    if (hex) picker.value = hex;
    apply(value);
  };
  text.addEventListener('input', () => commitText(false));
  text.addEventListener('change', () => commitText(true));
  wrap.append(picker, text);
  return wrap;
}

function parseSet(raw) {
  const text = String(raw ?? '').trim();
  if (!text || text === '[]') return [];
  return text.replace(/^\[/, '').replace(/\]$/, '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function setEditor(initial, options, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'property-set';
  const selected = new Set(parseSet(initial));
  const all = [...options];
  for (const value of selected) {
    if (!all.includes(value)) all.push(value);
  }
  for (const value of all) {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = selected.has(value);
    input.addEventListener('change', () => {
      if (input.checked) selected.add(value);
      else selected.delete(value);
      const values = all.filter((item) => selected.has(item));
      onChange(`[${values.join(', ')}]`);
    });
    label.append(input, document.createTextNode(value));
    wrap.appendChild(label);
  }
  return wrap;
}

function propertyEditor(node, prop) {
  const commit = () => {
    if (prop.name.startsWith('Font.')) ensureOwnFont(node);
    if (prop.name === 'Color') ensureOwnColor(node);
    markDirty();
    renderCanvas();
    renderTree();
  };

  if (prop.name === 'Font.Name') {
    return fontNameEditor(prop.value, (value) => {
      setPropertyValue(prop, value, 'string');
      commit();
    });
  }

  const enumOptions = enumOptionsFor(prop.name, node);
  if (enumOptions) {
    return enumEditor(prop.raw, enumOptions, (value) => {
      setPropertyValue(prop, value, 'raw');
      commit();
    });
  }

  if (isColorProperty(prop.name)) {
    return colorEditor(prop.raw, (value) => {
      setPropertyValue(prop, value, 'raw');
      commit();
    });
  }

  const setOptions = setOptionsFor(prop.name, node);
  if (setOptions) {
    return setEditor(prop.raw, setOptions, (value) => {
      setPropertyValue(prop, value, 'raw');
      commit();
    });
  }

  if (prop.kind === 'boolean') {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = prop.value === true;
    input.addEventListener('change', () => {
      setPropertyValue(prop, input.checked, 'boolean');
      commit();
    });
    return finishInput(input);
  }

  if (prop.kind === 'integer' || prop.kind === 'float') {
    const input = document.createElement('input');
    input.type = 'number';
    input.value = prop.value;
    input.addEventListener('input', () => {
      setPropertyValue(prop, input.value, prop.kind);
      commit();
    });
    return finishInput(input);
  }

  if (prop.kind === 'string') {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = prop.value;
    input.addEventListener('input', () => {
      setPropertyValue(prop, input.value, 'string');
      commit();
    });
    return finishInput(input);
  }

  if (prop.kind === 'strings') {
    return stringListEditor(node, prop);
  }

  if (prop.kind === 'identifier' || prop.kind === 'empty') {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = prop.raw;
    input.addEventListener('input', () => {
      setPropertyValue(prop, input.value, 'raw');
      commit();
    });
    return finishInput(input);
  }

  const input = document.createElement('textarea');
  input.rows = prop.raw.includes('\n') ? 4 : 2;
  input.value = prop.raw;
  input.addEventListener('input', () => {
    setPropertyValue(prop, input.value, 'raw');
    commit();
  });
  return finishInput(input);
}

function isEventProperty(prop) {
  return /^On[A-Z]/.test(prop.name);
}

function eventButton(prop) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'event-btn';
  button.textContent = '{ }';
  button.title = 'Show the handler in the source';
  button.addEventListener('click', () => gotoHandler(prop));
  return button;
}

async function gotoHandler(prop) {
  const name = String(prop.value ?? prop.raw ?? '').trim();
  if (!name) {
    setStatus('No handler assigned to this event.', true);
    return;
  }
  if (!(await ensureFormUnit())) return;
  state.sourceTarget = { kind: 'method', name };
  if (state.view === 'source') {
    applySourceNavigation({ focus: true });
  } else {
    setView('source');
  }
}

// Events whose handler is a TNotifyEvent (procedure(Sender: TObject)).
const NOTIFY_EVENTS = new Set([
  'OnActivate', 'OnChange', 'OnClick', 'OnCreate', 'OnDblClick', 'OnDeactivate',
  'OnDestroy', 'OnEditingDone', 'OnEndDraw', 'OnEnter', 'OnError', 'OnExecute',
  'OnExit', 'OnHide', 'OnLoad', 'OnMouseEnter', 'OnMouseLeave', 'OnMoved',
  'OnOpen', 'OnPaint', 'OnPictureChanged', 'OnResize', 'OnSave', 'OnScroll',
  'OnShow', 'OnShowPage', 'OnStartTimer', 'OnStopTimer', 'OnTimer',
  'OnTopLeftChanged', 'OnUnload', 'OnUpdate',
]);

function handlerNameExists(lines, name) {
  return findDeclarationLine(lines, name) >= 0 || findImplementationLine(lines, name) >= 0;
}

function defaultHandlerName(node, eventName) {
  const base = `${node.name || 'Form'}${eventName.replace(/^On/, '')}`;
  const lines = sourceText().split('\n');
  let name = base;
  let index = 2;
  while (handlerNameExists(lines, name)) name = `${base}${index++}`;
  return name;
}

function insertHandlerDeclaration(text, formClass, name) {
  const lines = text.split('\n');
  const pattern = new RegExp(`^([ \\t]*)${escapeRegExp(formClass)}\\s*=\\s*class\\b`, 'i');
  let headerIndex = -1;
  let indent = '';

  for (let index = 0; index < lines.length; index++) {
    const match = pattern.exec(lines[index]);
    if (match) {
      headerIndex = index;
      indent = match[1] || '';
      break;
    }
  }
  if (headerIndex < 0) return null;

  const memberIndent = `${indent}  `;
  lines.splice(headerIndex + 1, 0, `${memberIndent}procedure ${name}(Sender: TObject);`);
  return lines.join('\n');
}

function insertHandlerImplementation(text, formClass, name) {
  const lines = text.split('\n');
  let endIndex = -1;
  for (let index = lines.length - 1; index >= 0; index--) {
    if (/^\s*end\.\s*$/.test(lines[index])) {
      endIndex = index;
      break;
    }
  }
  if (endIndex < 0) return null;

  const block = [
    `procedure ${formClass}.${name}(Sender: TObject);`,
    'begin',
    'end;',
    '',
  ];
  if (endIndex === 0 || lines[endIndex - 1].trim() !== '') {
    block.unshift('');
  }
  lines.splice(endIndex, 0, ...block);
  return lines.join('\n');
}

async function createHandler(node, prop) {
  if (!NOTIFY_EVENTS.has(prop.name)) {
    setStatus(`${prop.name} needs a hand-written signature.`, true);
    return;
  }
  if (!(await ensureFormUnit())) return;

  const assigned = String(prop.value ?? prop.raw ?? '').trim();
  const name = assigned !== '' ? assigned : defaultHandlerName(node, prop.name);
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
    setStatus(`Invalid handler name: ${name}`, true);
    return;
  }

  const lines = sourceText().split('\n');
  if (findImplementationLine(lines, name) >= 0) {
    if (assigned === '') {
      setPropertyValue(prop, name, 'identifier');
      markDirty();
      renderInspector();
    }
    state.sourceTarget = { kind: 'method', name };
    if (state.view === 'source') applySourceNavigation({ focus: true });
    else setView('source');
    setStatus(`Handler ${name} already exists.`);
    return;
  }

  const formClass = state.roots[0] ? state.roots[0].className : '';
  if (!formClass) {
    setStatus('Cannot find the form class.', true);
    return;
  }

  let updated = sourceText();
  if (findDeclarationLine(lines, name) < 0) {
    updated = insertHandlerDeclaration(updated, formClass, name);
    if (updated === null) {
      setStatus(`Cannot find class ${formClass} in the unit.`, true);
      return;
    }
  }
  updated = insertHandlerImplementation(updated, formClass, name);
  if (updated === null) {
    setStatus('Cannot find the end of the unit.', true);
    return;
  }

  if (assigned === '') {
    setPropertyValue(prop, name, 'identifier');
    markDirty();
    renderInspector();
  }

  els.sourceEditor.value = updated;
  onSourceInput();
  state.sourceTarget = { kind: 'method', name };
  if (state.view === 'source') applySourceNavigation({ focus: true });
  else setView('source');
  setStatus(`Handler ${name} created`);
}

function eventCreateButton(node, prop) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'event-btn';
  button.textContent = '+';
  button.title = 'Create the handler in the unit (or show it if it already exists)';
  button.addEventListener('click', () => createHandler(node, prop));
  return button;
}

function stringListEditor(node, prop) {
  const values = parseStringList(prop.raw);
  const wrap = document.createElement('div');
  wrap.className = 'string-list';

  const commit = () => {
    prop.raw = formatStringList(values, '  '.repeat(nodeDepth(node) + 1));
    prop.kind = 'strings';
    prop.value = prop.raw;
    markDirty();
    renderCanvas();
    renderTree();
  };

  const addRow = (value, index) => {
    const row = document.createElement('div');
    row.className = 'string-list-row';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'property-input';
    input.value = value;
    input.placeholder = `Item ${index + 1}`;
    input.addEventListener('input', () => {
      values[index] = input.value;
      commit();
    });
    const remove = smallButton('×', 'Remove item');
    remove.addEventListener('click', () => {
      values.splice(index, 1);
      commit();
      renderInspector();
    });
    row.append(input, remove);
    return row;
  };

  values.forEach((value, index) => wrap.appendChild(addRow(value, index)));

  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'item-add';
  add.textContent = 'Add item';
  add.addEventListener('click', () => {
    values.push('');
    commit();
    renderInspector();
  });
  wrap.appendChild(add);
  return wrap;
}

function defaultEventEditor(node, spec, row) {
  let prop = null;
  const ensure = () => {
    if (!prop) {
      prop = ensureProperty(node, spec);
      if (row) row.classList.remove('default');
    }
    return prop;
  };

  const wrap = document.createElement('div');
  wrap.className = 'property-editor-with-action';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'property-input';
  input.placeholder = 'Handler name';
  input.addEventListener('input', () => {
    setPropertyValue(ensure(), input.value, 'raw');
    markDirty();
    renderCanvas();
    renderTree();
  });

  const go = document.createElement('button');
  go.type = 'button';
  go.className = 'event-btn';
  go.textContent = '{ }';
  go.title = 'Show the handler in the source';
  go.addEventListener('click', async () => {
    if (!prop) {
      setStatus('No handler assigned to this event.', true);
      return;
    }
    await gotoHandler(prop);
  });

  const plus = document.createElement('button');
  plus.type = 'button';
  plus.className = 'event-btn';
  plus.textContent = '+';
  plus.title = 'Create the handler in the unit';
  plus.addEventListener('click', () => createHandler(node, ensure()));

  wrap.append(input, go);
  if (NOTIFY_EVENTS.has(spec.name)) {
    wrap.appendChild(plus);
  }
  return wrap;
}

function defaultPropertyEditor(node, spec, row) {
  let created = false;
  const ensure = () => {
    const prop = ensureProperty(node, spec);
    if (!created) {
      created = true;
      if (row) {
        row.classList.remove('default');
        const group = row.closest('details.property-group');
        if (group) {
          group.open = true;
          const note = group.querySelector('summary .property-group-note');
          if (note) note.remove();
        }
      }
    }
    return prop;
  };
  const commit = () => {
    if (spec.name.startsWith('Font.')) ensureOwnFont(node);
    if (spec.name === 'Color') ensureOwnColor(node);
    markDirty();
    renderCanvas();
    renderTree();
  };

  if (spec.name === 'Font.Name') {
    return fontNameEditor(spec.value, (value) => {
      setPropertyValue(ensure(), value, 'string');
      commit();
    });
  }

  const enumOptions = enumOptionsFor(spec.name, node);
  if (enumOptions) {
    return enumEditor(spec.value, enumOptions, (value) => {
      setPropertyValue(ensure(), value, 'raw');
      commit();
    });
  }

  if (isColorProperty(spec.name)) {
    return colorEditor(spec.value, (value) => {
      setPropertyValue(ensure(), value, 'raw');
      commit();
    });
  }

  const setOptions = setOptionsFor(spec.name, node);
  if (setOptions) {
    return setEditor(spec.value, setOptions, (value) => {
      setPropertyValue(ensure(), value, 'raw');
      commit();
    });
  }

  if (spec.kind === 'boolean') {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = String(spec.value) === 'True';
    input.addEventListener('change', () => {
      setPropertyValue(ensure(), input.checked, 'boolean');
      commit();
    });
    return finishInput(input);
  }

  if (spec.kind === 'integer' || spec.kind === 'float') {
    const input = document.createElement('input');
    input.type = 'number';
    input.value = spec.value;
    input.addEventListener('input', () => {
      setPropertyValue(ensure(), input.value, spec.kind);
      commit();
    });
    return finishInput(input);
  }

  if (spec.kind === 'strings') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'item-add';
    button.textContent = 'Create list';
    button.addEventListener('click', () => {
      ensure();
      commit();
      renderInspector();
    });
    return button;
  }

  const input = document.createElement('input');
  input.type = 'text';
  input.value = spec.kind === 'string' ? '' : spec.value;
  input.placeholder = spec.value === '' ? '(default)' : spec.value;
  input.addEventListener('input', () => {
    setPropertyValue(ensure(), input.value, spec.kind === 'string' ? 'string' : 'raw');
    commit();
  });
  return finishInput(input);
}

function propertySuggestions(node) {
  const className = canonicalClassName(node.className);
  const names = new Set(classPropertySpecs(node).map((spec) => spec.name));
  for (const spec of nestedDefaultSpecs(node)) names.add(spec.name);
  const walk = (nodes) => {
    for (const item of nodes) {
      if (canonicalClassName(item.className) === className) {
        for (const prop of item.properties) names.add(prop.name);
      }
      walk(item.children);
    }
  };
  walk(state.roots);
  return [...names].sort();
}

function renderAddProperty(node) {
  const wrap = document.createElement('div');
  wrap.className = 'add-property';

  const title = document.createElement('div');
  title.className = 'items-title';
  const label = document.createElement('span');
  label.textContent = 'Add property';
  title.appendChild(label);

  const name = document.createElement('input');
  name.type = 'text';
  name.className = 'property-input';
  name.placeholder = 'Property name';
  name.setAttribute('list', 'wcl-property-names');

  const list = document.createElement('datalist');
  list.id = 'wcl-property-names';
  for (const suggestion of propertySuggestions(node)) {
    const option = document.createElement('option');
    option.value = suggestion;
    list.appendChild(option);
  }

  const kind = document.createElement('select');
  kind.className = 'property-input';
  for (const [value, text] of [
    ['auto', 'Auto'],
    ['string', 'String'],
    ['integer', 'Integer'],
    ['float', 'Float'],
    ['boolean', 'Boolean'],
    ['identifier', 'Identifier'],
    ['strings', 'String list'],
    ['raw', 'Raw'],
  ]) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    kind.appendChild(option);
  }

  const value = document.createElement('input');
  value.type = 'text';
  value.className = 'property-input';
  value.placeholder = 'Value';

  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'item-add';
  add.textContent = 'Add';

  name.addEventListener('change', () => {
    const spec = [...classPropertySpecs(node), ...nestedDefaultSpecs(node)]
      .find((item) => item.name === name.value.trim());
    if (!spec) return;
    kind.value = spec.kind;
    value.value = spec.kind === 'string' ? '' : spec.value;
  });

  add.addEventListener('click', () => {
    const propertyName = name.value.trim();
    if (!/^[A-Za-z_][A-Za-z0-9_.]*$/.test(propertyName)) {
      setStatus('Invalid property name.', true);
      return;
    }
    const chosenKind = kind.value === 'auto'
      ? (/^On[A-Z]/.test(propertyName) ? 'identifier' : inferKind(value.value))
      : kind.value;
    const raw = chosenKind === 'strings' ? '()' : rawForKind(chosenKind, value.value);
    let prop = getProperty(node, propertyName);
    if (prop) {
      prop.raw = raw;
      delete prop.__items;
      Object.assign(prop, decodeValue(raw));
    } else {
      prop = makeProp(propertyName, raw);
      node.properties.push(prop);
    }
    if (propertyName.startsWith('Font.')) ensureOwnFont(node);
    if (propertyName === 'Color') ensureOwnColor(node);
    markDirty();
    renderInspector();
    renderCanvas();
    renderTree();
    setStatus(`${propertyName} = ${prop.raw}`);
  });

  wrap.append(title, name, list, kind, value, add);
  return wrap;
}

function renderItemsEditor(node) {
  const items = componentItems(node);
  if (!items) return null;
  return items.kind === 'tree' ? treeItemsEditor(items) : listItemsEditor(items);
}

function collectionConfigFor(node) {
  return COLLECTION_EDITORS[canonicalClassName(node.className)] || null;
}

function readCollectionProperty(node, name) {
  const prop = getProperty(node, name);
  if (!prop) return { prop: null, items: [], valid: true };
  if (prop.kind !== 'collection') return { prop, items: [], valid: false };
  try {
    const items = parseCollection(prop.raw);
    if (!items) return { prop, items: [], valid: false };
    return { prop, items, valid: true };
  } catch {
    return { prop, items: [], valid: false };
  }
}

function collectionFieldValue(item, field) {
  const prop = item.properties.find((entry) => entry.name === field.name);
  if (!prop) {
    if (field.kind === 'boolean') return field.default === true;
    if (field.kind === 'color') return field.default || '';
    return '';
  }
  if (field.kind === 'color') return prop.raw;
  return prop.value ?? '';
}

function setCollectionField(item, field, value) {
  const index = item.properties.findIndex((entry) => entry.name === field.name);
  const remove = () => {
    if (index >= 0) item.properties.splice(index, 1);
  };
  let raw;
  if (field.kind === 'boolean') {
    if (value === (field.default === true)) {
      remove();
      return;
    }
    raw = value ? 'True' : 'False';
  } else if (field.kind === 'integer') {
    if (String(value ?? '').trim() === '') {
      remove();
      return;
    }
    const number = Number(value);
    if (!Number.isFinite(number)) {
      remove();
      return;
    }
    raw = String(Math.trunc(number));
  } else if (field.kind === 'enum' || field.kind === 'color') {
    if (value === '' || value === field.default) {
      remove();
      return;
    }
    raw = String(value);
  } else if (field.kind === 'fontstyle') {
    raw = String(value);
  } else {
    if (value === '') {
      remove();
      return;
    }
    raw = encodeLfmString(value);
  }
  if (index >= 0) {
    const prop = item.properties[index];
    prop.raw = raw;
    delete prop.__items;
    Object.assign(prop, decodeValue(raw));
  } else {
    item.properties.push(makeProp(field.name, raw));
  }
}

function newCollectionItem(config, number) {
  const primary = config.fields.find((field) => field.primary) || config.fields[0];
  return {
    properties: [makeProp(primary.name, encodeLfmString(`Column ${number}`))],
  };
}

function storeCollection(node, config, items) {
  let prop = getProperty(node, config.property);
  if (!prop) {
    prop = makeProp(config.property, '<>');
    node.properties.push(prop);
  }
  const indent = ' '.repeat(nodeDepth(node) * 2 + 2);
  setPropertyValue(prop, writeCollection(items, indent), 'raw');
  markDirty();
  renderCanvas();
  renderTree();
  return prop;
}

function renderCollectionEditor(node, config, info) {
  const { wrap, rows, actions } = editorShell(
    config.title,
    `${info.items.length} ${config.unit}`,
  );
  wrap.classList.add('collection-editor');
  const primary = config.fields.find((field) => field.primary) || config.fields[0];
  const fields = config.fields.filter((field) => field !== primary);
  const baseFont = resolvedNodeFont(node);
  const store = () => storeCollection(node, config, info.items);
  const rebuild = () => {
    store();
    renderInspector();
  };

  info.items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'collection-card';

    const head = document.createElement('div');
    head.className = 'collection-head';
    const badge = document.createElement('span');
    badge.className = 'collection-index';
    badge.textContent = String(index + 1);
    const titleLabel = document.createElement('span');
    titleLabel.className = 'collection-title-label';
    titleLabel.textContent = primary.label || primary.name;
    const input = document.createElement('input');
    input.className = 'item-text';
    input.value = String(collectionFieldValue(item, primary) ?? '');
    input.placeholder = primary.placeholder || primary.name;
    input.addEventListener('input', () => {
      setCollectionField(item, primary, input.value);
      store();
    });

    const up = smallButton('↑', 'Move up');
    up.disabled = index === 0;
    up.addEventListener('click', () => {
      if (index === 0) return;
      [info.items[index - 1], info.items[index]] = [info.items[index], info.items[index - 1]];
      rebuild();
    });
    const down = smallButton('↓', 'Move down');
    down.disabled = index === info.items.length - 1;
    down.addEventListener('click', () => {
      if (index === info.items.length - 1) return;
      [info.items[index + 1], info.items[index]] = [info.items[index], info.items[index + 1]];
      rebuild();
    });
    const duplicate = smallButton('⧉', 'Duplicate column');
    duplicate.addEventListener('click', () => {
      const copy = {
        properties: item.properties.map((prop) => {
          const clone = { name: prop.name, raw: prop.raw, ...decodeValue(prop.raw) };
          if (clone.bytes instanceof Uint8Array) clone.bytes = new Uint8Array(clone.bytes);
          return clone;
        }),
      };
      const primaryProp = copy.properties.find((prop) => prop.name === primary.name);
      if (primaryProp && primaryProp.kind === 'string' && primaryProp.value) {
        setCollectionField(copy, primary, `${primaryProp.value} copy`);
      }
      info.items.splice(index + 1, 0, copy);
      rebuild();
    });
    const remove = smallButton('✕', 'Delete column');
    remove.addEventListener('click', () => {
      info.items.splice(index, 1);
      rebuild();
    });
    head.append(badge, titleLabel, input, up, down, duplicate, remove);
    card.appendChild(head);

    const body = document.createElement('div');
    body.className = 'collection-fields';
    for (const field of fields) {
      const cell = document.createElement('div');
      cell.className = 'collection-field';
      if (field.wide) cell.classList.add('wide');
      const label = document.createElement('span');
      label.textContent = field.label || field.name;

      if (field.kind === 'boolean') {
        const check = document.createElement('label');
        check.className = 'collection-check';
        const box = document.createElement('input');
        box.type = 'checkbox';
        box.checked = collectionFieldValue(item, field) === true;
        box.addEventListener('change', () => {
          setCollectionField(item, field, box.checked);
          store();
        });
        check.append(box, document.createTextNode(field.label || field.name));
        cell.appendChild(check);
      } else {
        cell.appendChild(label);
        if (field.kind === 'enum') {
          const select = document.createElement('select');
          select.className = 'property-input';
          const current = String(collectionFieldValue(item, field) ?? '');
          const options = [...field.options];
          if (current && !options.includes(current)) options.unshift(current);
          const empty = document.createElement('option');
          empty.value = '';
          empty.textContent = '(default)';
          select.appendChild(empty);
          for (const option of options) {
            const element = document.createElement('option');
            element.value = option;
            element.textContent = option;
            select.appendChild(element);
          }
          select.value = current;
          select.addEventListener('change', () => {
            setCollectionField(item, field, select.value);
            store();
          });
          cell.appendChild(select);
        } else if (field.kind === 'color') {
          const raw = String(collectionFieldValue(item, field) ?? field.default ?? '');
          cell.appendChild(colorEditor(raw, (value) => {
            setCollectionField(item, field, value);
            store();
          }));
        } else {
          const box = document.createElement('input');
          box.type = field.kind === 'integer' ? 'number' : 'text';
          box.className = 'property-input';
          if (field.kind === 'integer') box.min = '0';
          box.value = String(collectionFieldValue(item, field) ?? '');
          box.placeholder = field.placeholder || '';
          box.addEventListener('input', () => {
            setCollectionField(item, field, box.value);
            store();
          });
          cell.appendChild(box);
        }
      }
      body.appendChild(cell);
    }
    card.appendChild(body);
    if (config.fonts) {
      for (const prefix of config.fonts) {
        card.appendChild(renderCollectionFontSection(
          item,
          prefix,
          prefix === 'TitleFont' ? 'Title font' : 'Font',
          baseFont,
          store,
        ));
      }
    }
    rows.appendChild(card);
  });

  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'item-add';
  add.textContent = 'Add column';
  add.addEventListener('click', () => {
    info.items.push(newCollectionItem(config, info.items.length + 1));
    rebuild();
  });
  actions.appendChild(add);
  return wrap;
}

function renderCollectionFontSection(item, prefix, label, baseFont, store) {
  const details = document.createElement('details');
  details.className = 'collection-font';
  const hasFont = item.properties.some((prop) => prop.name.startsWith(`${prefix}.`));
  details.open = hasFont;

  const summary = document.createElement('summary');
  const title = document.createElement('span');
  title.textContent = label;
  const note = document.createElement('span');
  note.className = 'collection-font-note';
  const sample = document.createElement('span');
  sample.className = 'collection-font-sample';
  sample.textContent = 'Aa';
  const reset = smallButton('↺', 'Reset to inherited font');
  reset.disabled = !hasFont;
  reset.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    item.properties = item.properties.filter((prop) => !prop.name.startsWith(`${prefix}.`));
    store();
    renderInspector();
  });
  summary.append(title, note, reset, sample);
  details.appendChild(summary);

  const body = document.createElement('div');
  body.className = 'collection-font-body';

  const refresh = () => {
    const sampleFont = collectionFont(item, prefix, baseFont);
    delete sampleFont.color;
    applyNodeFont(sample, sampleFont);
    const active = item.properties.some((prop) => prop.name.startsWith(`${prefix}.`));
    note.textContent = active ? '' : 'inherits';
  };
  refresh();

  const addCell = (text, wide = false) => {
    const cell = document.createElement('div');
    cell.className = 'collection-field';
    if (wide) cell.classList.add('wide');
    const caption = document.createElement('span');
    caption.textContent = text;
    cell.appendChild(caption);
    body.appendChild(cell);
    return cell;
  };

  const familyField = { name: `${prefix}.Name`, kind: 'font' };
  const familyCell = addCell('Family', true);
  const familyEditor = fontNameEditor(collectionFieldValue(item, familyField), (value) => {
    setCollectionField(item, familyField, value);
    store();
    refresh();
  });
  familyEditor.querySelector('.property-font-sample')?.remove();
  const familyInput = familyEditor.querySelector('.property-font-input');
  if (familyInput) familyInput.placeholder = 'inherit';
  familyCell.appendChild(familyEditor);

  const heightField = { name: `${prefix}.Height`, kind: 'integer' };
  const heightCell = addCell('Height');
  const heightInput = document.createElement('input');
  heightInput.type = 'number';
  heightInput.className = 'property-input';
  heightInput.placeholder = 'inherit';
  heightInput.value = String(collectionFieldValue(item, heightField) ?? '');
  heightInput.addEventListener('input', () => {
    setCollectionField(item, heightField, heightInput.value);
    store();
    refresh();
  });
  heightCell.appendChild(heightInput);

  const colorField = { name: `${prefix}.Color`, kind: 'color' };
  const colorCell = addCell('Color');
  const colorControl = colorEditor(
    String(collectionFieldValue(item, colorField) ?? ''),
    (value) => {
      setCollectionField(item, colorField, value);
      store();
      refresh();
    },
  );
  colorCell.appendChild(colorControl);

  const styleField = { name: `${prefix}.Style`, kind: 'fontstyle' };
  const styleCell = addCell('Style', true);
  const styleWrap = document.createElement('div');
  styleWrap.className = 'collection-font-styles';
  const styleProp = item.properties.find((prop) => prop.name === styleField.name);
  const selectedStyles = new Set(styleProp ? parseSet(styleProp.raw) : parseSet(fontSetRaw(baseFont)));
  for (const [value, text] of [
    ['fsBold', 'Bold'],
    ['fsItalic', 'Italic'],
    ['fsUnderline', 'Underline'],
    ['fsStrikeOut', 'Strike'],
  ]) {
    const check = document.createElement('label');
    check.className = 'collection-check';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = selectedStyles.has(value);
    box.addEventListener('change', () => {
      if (box.checked) selectedStyles.add(value);
      else selectedStyles.delete(value);
      setCollectionField(item, styleField, `[${[...selectedStyles].join(', ')}]`);
      store();
      refresh();
    });
    check.append(box, document.createTextNode(text));
    styleWrap.appendChild(check);
  }
  styleCell.appendChild(styleWrap);

  details.appendChild(body);
  return details;
}

function editorShell(titleText, countText) {
  const wrap = document.createElement('div');
  wrap.className = 'items-editor';
  const title = document.createElement('div');
  title.className = 'items-title';
  const label = document.createElement('span');
  label.textContent = titleText;
  const count = document.createElement('span');
  count.className = 'items-count';
  count.textContent = countText;
  title.append(label, count);
  const rows = document.createElement('div');
  rows.className = 'items-rows';
  const actions = document.createElement('div');
  actions.className = 'items-actions';
  wrap.append(title, rows, actions);
  return { wrap, rows, actions };
}

function smallButton(text, title) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'item-btn';
  button.textContent = text;
  button.title = title;
  return button;
}

function treeItemsEditor({ prop, nodes }) {
  const { wrap, rows, actions } = editorShell('Items', `${countTreeNodes(nodes)} nodes`);

  const addRows = (list, depth) => {
    for (const item of list) {
      const row = document.createElement('div');
      row.className = 'item-row';
      row.style.paddingLeft = `${depth * 10}px`;

      const input = document.createElement('input');
      input.className = 'item-text';
      input.value = item.text;
      input.placeholder = 'Node text';
      input.addEventListener('input', () => {
        item.text = input.value;
        storeTreeItems(prop, nodes);
        renderCanvas();
      });

      const addChild = smallButton('+', 'Add child node');
      addChild.addEventListener('click', () => {
        item.children.push(newTreeNode('Node'));
        storeTreeItems(prop, nodes);
        renderInspector();
        renderCanvas();
      });

      const remove = smallButton('×', 'Delete node');
      remove.addEventListener('click', () => {
        if (!removeTreeNode(nodes, item)) return;
        storeTreeItems(prop, nodes);
        renderInspector();
        renderCanvas();
      });

      row.append(input, addChild, remove);
      rows.appendChild(row);
      addRows(item.children, depth + 1);
    }
  };
  addRows(nodes, 0);

  const addRoot = document.createElement('button');
  addRoot.type = 'button';
  addRoot.className = 'item-add';
  addRoot.textContent = 'Add node';
  addRoot.addEventListener('click', () => {
    nodes.push(newTreeNode('Node'));
    storeTreeItems(prop, nodes);
    renderInspector();
    renderCanvas();
  });
  actions.appendChild(addRoot);
  return wrap;
}

function listItemsEditor({ prop, items, format }) {
  const { wrap, rows, actions } = editorShell('Items', `${items.length} items`);
  const rebuild = () => {
    storeListItems(prop, items, format);
    renderInspector();
    renderCanvas();
  };

  for (const item of items) {
    const row = document.createElement('div');
    row.className = 'item-row';

    const caption = document.createElement('input');
    caption.className = 'item-text';
    caption.value = item.caption;
    caption.placeholder = 'Caption';
    caption.addEventListener('input', () => {
      item.caption = caption.value;
      storeListItems(prop, items, format);
      renderCanvas();
    });
    row.appendChild(caption);

    for (let index = 0; index < item.subItems.length; index++) {
      const sub = document.createElement('input');
      sub.className = 'item-sub';
      sub.value = item.subItems[index];
      sub.placeholder = `Sub ${index + 1}`;
      sub.addEventListener('input', () => {
        item.subItems[index] = sub.value;
        storeListItems(prop, items, format);
        renderCanvas();
      });
      row.appendChild(sub);
    }

    const addSub = smallButton('+', 'Add subitem');
    addSub.addEventListener('click', () => {
      item.subItems.push('');
      item.subItemImages.push(-1);
      rebuild();
    });

    const remove = smallButton('×', 'Delete item');
    remove.addEventListener('click', () => {
      const index = items.indexOf(item);
      if (index >= 0) items.splice(index, 1);
      rebuild();
    });

    row.append(addSub, remove);
    rows.appendChild(row);
  }

  const addItem = document.createElement('button');
  addItem.type = 'button';
  addItem.className = 'item-add';
  addItem.textContent = 'Add item';
  addItem.addEventListener('click', () => {
    items.push(newListItem('Item'));
    rebuild();
  });
  actions.appendChild(addItem);
  return wrap;
}

function renderPagesEditor(node) {
  if (canonicalClassName(node.className) !== 'TWPageControl') return null;
  const sheets = pageControlSheets(node);
  const { wrap, rows, actions } = editorShell('Pages', `${sheets.length} tabs`);
  const active = activeTabSheet(node);

  for (const sheet of sheets) {
    const row = document.createElement('div');
    row.className = 'item-row';

    const activate = smallButton(sheet === active ? '●' : '○', 'Show this tab');
    if (sheet === active) activate.classList.add('active');
    activate.addEventListener('click', () => {
      activateTabSheet(sheet, true);
      selectNode(sheet);
    });

    const input = document.createElement('input');
    input.className = 'item-text';
    input.value = propText(sheet, 'Caption');
    input.placeholder = 'Tab caption';
    input.addEventListener('input', () => {
      const prop = getProperty(sheet, 'Caption');
      if (prop) setPropertyValue(prop, input.value, 'string');
      else sheet.properties.push(makeProp('Caption', encodeLfmString(input.value)));
      markDirty();
      renderCanvas();
      renderTree();
    });

    const remove = smallButton('×', 'Delete tab');
    remove.addEventListener('click', () => {
      const index = node.children.indexOf(sheet);
      if (index < 0) return;
      node.children.splice(index, 1);
      if (state.activeTabs.get(node) === sheet) state.activeTabs.delete(node);
      if (state.selected === sheet || findAncestor(state.selected, (parent) => parent === sheet)) {
        state.selected = node;
        state.selection = [node];
      }
      assignIds(state.roots);
      renderTree();
      renderCanvas();
      renderInspector();
      updateMultiTools();
      markDirty();
    });

    row.append(activate, input, remove);
    rows.appendChild(row);
  }

  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'item-add';
  add.textContent = 'Add tab';
  add.addEventListener('click', () => addTabSheet(node));
  actions.appendChild(add);
  return wrap;
}

function selectPrimarySelection(node) {
  if (!node) return;
  state.sourceTarget = null;
  for (let current = node; current; current = current.__parent) {
    if (current.className === 'TTabSheet') activateTabSheet(current);
  }
  state.selected = node;
  if (!state.selection.includes(node)) {
    state.selection = [node];
  }
  renderTree();
  renderCanvas();
  renderInspector();
  updateMultiTools();
  if (state.view === 'source' && (!state.currentForm || state.currentUnit === state.currentForm.unit)) {
    applySourceNavigation();
  }
}

function selectNode(node, additive = false) {
  if (!node) return;
  state.sourceTarget = null;
  for (let current = node; current; current = current.__parent) {
    if (current.className === 'TTabSheet') activateTabSheet(current);
  }
  if (additive) {
    const index = state.selection.indexOf(node);
    if (index >= 0) {
      state.selection.splice(index, 1);
      state.selected = state.selection[state.selection.length - 1] || state.roots[0] || null;
    } else {
      state.selection.push(node);
      state.selected = node;
    }
  } else {
    state.selection = [node];
    state.selected = node;
  }
  if (state.selection.length === 0) {
    state.selection = state.selected ? [state.selected] : [];
  }
  for (let current = state.selected; current; current = current.__parent) {
    if (current.className === 'TTabSheet') activateTabSheet(current);
  }
  renderTree();
  renderCanvas();
  renderInspector();
  updateMultiTools();
  if (state.view === 'source' && (!state.currentForm || state.currentUnit === state.currentForm.unit)) {
    applySourceNavigation();
  }
}

function renderAll() {
  assignIds(state.roots);
  const validNode = (node) => !!node && (state.roots.includes(node)
    || !!findAncestor(node, (parent) => state.roots.includes(parent)));
  if (!validNode(state.selected)) {
    state.selected = state.roots[0] || null;
  }
  state.selection = state.selection.filter(validNode);
  if (!state.selection.includes(state.selected)) {
    state.selection = state.selected ? [state.selected] : [];
  }
  renderTree();
  renderCanvas();
  renderInspector();
  updateMultiTools();
}

function updateMultiTools() {
  if (!els.multiTools) return;
  const nodes = state.selection.filter((node) => node && node !== state.roots[0] && isVisual(node));
  const visible = state.view === 'design' && nodes.length > 1;
  els.multiTools.classList.toggle('hidden-view', !visible);
  if (els.multiCount) {
    els.multiCount.textContent = visible ? `${nodes.length} selected` : '';
  }
  for (const button of els.multiTools.querySelectorAll('button[data-align]')) {
    if (button.dataset.align === 'distribute-h' || button.dataset.align === 'distribute-v') {
      button.disabled = nodes.length < 3;
    }
  }
  updateEditMenu();
}

function updateEditMenu() {
  if (els.undoBtn && els.redoBtn) {
    const active = !!state.currentForm && state.view === 'design';
    els.undoBtn.disabled = !active || state.historyIndex <= 0;
    els.redoBtn.disabled = !active || state.historyIndex >= state.history.length - 1;
  }
  if (!els.editMenu) return;
  if (els.editMenuBtn) els.editMenuBtn.disabled = state.view !== 'design';
  const hasSelection = state.selection.some((node) => node && node !== state.roots[0]);
  for (const button of els.editMenu.querySelectorAll('button[data-action]')) {
    const action = button.dataset.action;
    if (action === 'paste') {
      button.disabled = state.clipboard.length === 0;
    } else if (['copy', 'duplicate', 'delete', 'front', 'back', 'forward', 'backward'].includes(action)) {
      button.disabled = !hasSelection;
    }
  }
}

function toggleEditMenu() {
  if (!els.editMenu) return;
  if (els.editMenu.classList.contains('hidden-view')) {
    updateEditMenu();
    els.editMenu.classList.remove('hidden-view');
  } else {
    closeEditMenu();
  }
}

function closeEditMenu() {
  if (els.editMenu) els.editMenu.classList.add('hidden-view');
}

function topLevelSelection() {
  return state.selection.filter((node) => node && node !== state.roots[0]
    && !findAncestor(node, (ancestor) => state.selection.includes(ancestor)));
}

function pasteParentFor(clones) {
  const primary = state.selected;
  if (!primary) return state.roots[0] || null;
  if (clones.length > 0 && clones.every((clone) => canonicalClassName(clone.className) === 'TTabSheet')) {
    if (canonicalClassName(primary.className) === 'TWPageControl') return primary;
    const page = findAncestor(primary, (node) => canonicalClassName(node.className) === 'TWPageControl');
    if (page) return page;
  }
  if (primary === state.roots[0]) return primary;
  const canonical = canonicalClassName(primary.className);
  if (canonical === 'TWPageControl') {
    return activeTabSheet(primary);
  }
  if (containerClasses.has(canonical) || containerClasses.has(primary.className)) {
    return primary;
  }
  return primary.__parent || state.roots[0] || null;
}

function nextCopyName(base, names) {
  const stem = String(base || 'Component').replace(/\d+$/, '') || 'Component';
  let index = 1;
  while (names.has(`${stem}${index}`)) index++;
  const name = `${stem}${index}`;
  names.add(name);
  return name;
}

function renameClipboardTree(node, names) {
  node.name = nextCopyName(node.name || displayClassName(node.className), names);
  for (const child of node.children) {
    renameClipboardTree(child, names);
  }
}

function insertClones(clones, parent, offset = 16) {
  if (!parent || clones.length === 0) return [];
  const names = collectNames(state.roots);
  const created = clones.map((clone) => {
    const copy = cloneNodeTree(clone);
    renameClipboardTree(copy, names);
    if (offset && isVisual(copy)) {
      setNumberProp(copy, 'Left', propNumber(copy, 'Left', 0) + offset);
      setNumberProp(copy, 'Top', propNumber(copy, 'Top', 0) + offset);
    }
    parent.children.push(copy);
    return copy;
  });
  assignIds(state.roots);
  state.selection = created;
  state.selected = created[created.length - 1] || parent;
  renderTree();
  renderCanvas();
  renderInspector();
  updateMultiTools();
  markDirty();
  return created;
}

function copySelection() {
  const nodes = topLevelSelection();
  if (nodes.length === 0) {
    setStatus('Select a component to copy.', true);
    return;
  }
  state.clipboard = nodes.map(cloneNodeTree);
  updateEditMenu();
  setStatus(`Copied ${nodes.length} component${nodes.length === 1 ? '' : 's'}`);
}

function pasteSelection() {
  if (state.clipboard.length === 0) {
    setStatus('The clipboard is empty.', true);
    return;
  }
  const parent = pasteParentFor(state.clipboard);
  if (!parent) {
    setStatus('Select a container (or add a tab sheet) before pasting.', true);
    return;
  }
  const created = insertClones(state.clipboard, parent);
  setStatus(`Pasted ${created.length} component${created.length === 1 ? '' : 's'}`);
}

function duplicateSelection() {
  const nodes = topLevelSelection();
  if (nodes.length === 0) {
    setStatus('Select a component to duplicate.', true);
    return;
  }
  const parent = pasteParentFor(nodes);
  if (!parent) {
    setStatus('Select a container before duplicating.', true);
    return;
  }
  const created = insertClones(nodes, parent);
  setStatus(`Duplicated ${created.length} component${created.length === 1 ? '' : 's'}`);
}

function deleteSelection() {
  const nodes = topLevelSelection();
  if (nodes.length === 0) {
    setStatus('Select a component to delete.', true);
    return;
  }
  const parent = nodes[0].__parent || state.roots[0];
  for (const node of nodes) {
    const owner = node.__parent;
    if (!owner) continue;
    const index = owner.children.indexOf(node);
    if (index >= 0) owner.children.splice(index, 1);
    for (const [pageControl, sheet] of state.activeTabs) {
      if (sheet === node || findAncestor(sheet, (ancestor) => ancestor === node)) {
        state.activeTabs.delete(pageControl);
      }
    }
  }
  assignIds(state.roots);
  state.selected = parent;
  state.selection = parent ? [parent] : [];
  renderTree();
  renderCanvas();
  renderInspector();
  updateMultiTools();
  markDirty();
  setStatus(`Deleted ${nodes.length} component${nodes.length === 1 ? '' : 's'}`);
}

function reorderSelection(mode) {
  const nodes = topLevelSelection();
  if (nodes.length === 0) {
    setStatus('Select a component first.', true);
    return;
  }
  if (mode === 'front' || mode === 'back') {
    const parent = nodes[0].__parent;
    if (!parent || !nodes.every((node) => node.__parent === parent)) {
      setStatus('Select components with the same parent.', true);
      return;
    }
    const selected = new Set(nodes);
    const picked = parent.children.filter((node) => selected.has(node));
    const rest = parent.children.filter((node) => !selected.has(node));
    parent.children = mode === 'front' ? [...rest, ...picked] : [...picked, ...rest];
  } else {
    const node = state.selected && state.selected !== state.roots[0] ? state.selected : nodes[0];
    const parent = node.__parent;
    if (!parent) return;
    const index = parent.children.indexOf(node);
    if (mode === 'forward' && index >= 0 && index < parent.children.length - 1) {
      parent.children.splice(index, 1);
      parent.children.splice(index + 1, 0, node);
    } else if (mode === 'backward' && index > 0) {
      parent.children.splice(index, 1);
      parent.children.splice(index - 1, 0, node);
    } else {
      setStatus('The component is already at the edge of the z-order.');
      return;
    }
  }
  assignIds(state.roots);
  renderTree();
  renderCanvas();
  renderInspector();
  updateMultiTools();
  markDirty();
  setStatus(`Z-order: ${mode}`);
}

function alignSelection(mode) {
  const nodes = topLevelSelection().filter((node) => isVisual(node));
  if (nodes.length < 2) {
    setStatus('Select at least two visual components with Ctrl+click.', true);
    return;
  }
  const parent = nodes[0].__parent;
  if (!parent || !nodes.every((node) => node.__parent === parent)) {
    setStatus('Select components with the same parent.', true);
    return;
  }
  if (nodes.some((node) => alignOf(node) !== 'alNone')) {
    setStatus('Some selected components are aligned; set Align = alNone first.', true);
    return;
  }
  const boxes = nodes.map((node) => ({
    node,
    left: propNumber(node, 'Left', 0),
    top: propNumber(node, 'Top', 0),
    width: Math.max(1, propNumber(node, 'Width', 1)),
    height: Math.max(1, propNumber(node, 'Height', 1)),
  }));
  const left = Math.min(...boxes.map((box) => box.left));
  const right = Math.max(...boxes.map((box) => box.left + box.width));
  const top = Math.min(...boxes.map((box) => box.top));
  const bottom = Math.max(...boxes.map((box) => box.top + box.height));

  if (mode === 'left') {
    boxes.forEach((box) => setNumberProp(box.node, 'Left', left));
  } else if (mode === 'center') {
    const center = (left + right) / 2;
    boxes.forEach((box) => setNumberProp(box.node, 'Left', Math.round(center - box.width / 2)));
  } else if (mode === 'right') {
    boxes.forEach((box) => setNumberProp(box.node, 'Left', right - box.width));
  } else if (mode === 'top') {
    boxes.forEach((box) => setNumberProp(box.node, 'Top', top));
  } else if (mode === 'middle') {
    const middle = (top + bottom) / 2;
    boxes.forEach((box) => setNumberProp(box.node, 'Top', Math.round(middle - box.height / 2)));
  } else if (mode === 'bottom') {
    boxes.forEach((box) => setNumberProp(box.node, 'Top', bottom - box.height));
  } else if (mode === 'distribute-h') {
    if (boxes.length < 3) {
      setStatus('Select at least three components to distribute.', true);
      return;
    }
    const sorted = [...boxes].sort((a, b) => a.left - b.left);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const total = sorted.reduce((sum, box) => sum + box.width, 0);
    const gap = (last.left + last.width - first.left - total) / (sorted.length - 1);
    let cursor = first.left;
    for (const box of sorted) {
      setNumberProp(box.node, 'Left', Math.round(cursor));
      cursor += box.width + gap;
    }
  } else if (mode === 'distribute-v') {
    if (boxes.length < 3) {
      setStatus('Select at least three components to distribute.', true);
      return;
    }
    const sorted = [...boxes].sort((a, b) => a.top - b.top);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const total = sorted.reduce((sum, box) => sum + box.height, 0);
    const gap = (last.top + last.height - first.top - total) / (sorted.length - 1);
    let cursor = first.top;
    for (const box of sorted) {
      setNumberProp(box.node, 'Top', Math.round(cursor));
      cursor += box.height + gap;
    }
  } else {
    return;
  }

  renderCanvas();
  renderInspector();
  markDirty();
  setStatus(`Aligned ${nodes.length} components`);
}

function runEditAction(action) {
  if (action === 'undo') undo();
  else if (action === 'redo') redo();
  else if (action === 'copy') copySelection();
  else if (action === 'paste') pasteSelection();
  else if (action === 'duplicate') duplicateSelection();
  else if (action === 'delete') deleteSelection();
  else if (action === 'front' || action === 'back' || action === 'forward' || action === 'backward') {
    reorderSelection(action);
  }
}

function isEditableTarget(target) {
  return target instanceof HTMLElement && (
    target.tagName === 'INPUT'
    || target.tagName === 'TEXTAREA'
    || target.tagName === 'SELECT'
    || target.isContentEditable
  );
}

function hasOpenDialog() {
  return !!document.querySelector('dialog[open]');
}


function clearProjectView() {
  state.project = null;
  state.forms = [];
  state.currentForm = null;
  state.currentUnit = '';
  state.roots = [];
  state.selected = null;
  state.selection = [];
  state.activeTabs.clear();
  state.source = null;
  state.sourceTarget = null;
  state.sourceDirty = false;
  state.dirty = false;
  state.history = [];
  state.historyIndex = -1;
  state.savedLfm = '';
  state.clipboard = [];
  state.formCache.clear();
  state.unitCache.clear();
  els.project.value = '';
  els.form.innerHTML = '';
  els.form.disabled = true;
  els.sourceEditor.value = '';
  els.sourceGutter.textContent = '';
  els.sourceName.textContent = 'No source';
  els.sourceStatus.textContent = '';
  renderAll();
  setDirty(false);
  updateUndoButtons();
  updateMultiTools();
  els.canvas.textContent = 'No project selected.';
  els.formTitle.textContent = 'No form';
  els.tree.textContent = 'No project selected.';
  els.inspector.textContent = 'Select a component.';
}

async function loadProjects(loadFirst = true) {
  const data = await api('projects');
  state.projects = data.projects || [];
  els.project.innerHTML = '';
  for (const project of state.projects) {
    const option = document.createElement('option');
    option.value = project.id;
    option.textContent = project.name;
    els.project.appendChild(option);
  }
  if (state.projects.length === 0) {
    clearProjectView();
    setStatus('No projects found. Create or import a project.', true);
    return;
  }
  if (loadFirst) {
    await loadProject(state.projects[0].id);
  }
}

function renderFormSelect() {
  els.form.innerHTML = '';
  if (state.forms.length === 0) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'No form';
    els.form.appendChild(option);
  }
  for (const form of state.forms) {
    const option = document.createElement('option');
    option.value = form.form;
    option.textContent = form.title || form.form;
    els.form.appendChild(option);
  }
  if (state.currentForm) {
    els.form.value = state.currentForm.form;
  }
  els.form.disabled = state.forms.length <= 1;
}

async function loadForm(formName) {
  if (!state.project || !formName) return;
  if (state.currentForm && state.currentForm.form === formName) return;
  stashCurrentForm();
  stashCurrentUnit();
  await loadProject(state.project.id, formName);
}

function closeProjectDialog() {
  if (els.projectDialog.close) {
    els.projectDialog.close();
  } else {
    els.projectDialog.removeAttribute('open');
  }
}

function dialogButton(text, title) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'dialog-btn';
  button.textContent = text;
  button.title = title;
  return button;
}

function updateSettingsVisibility() {
  const kind = els.settingKind.value;
  for (const node of els.projectDialog.querySelectorAll('.module-only')) {
    node.classList.toggle('hidden-field', kind !== 'module');
  }
  for (const node of els.projectDialog.querySelectorAll('.host-only')) {
    node.classList.toggle('hidden-field', kind !== 'host');
  }
}

function renderProjectSettings() {
  if (!state.project) return;
  els.settingName.value = state.project.name || '';
  els.settingKind.value = state.project.kind || 'application';
  els.settingProgram.value = state.project.program || '';
  els.settingHtml.value = state.project.html || '';
  els.settingOutput.value = state.project.output || '';
  els.settingEntry.value = state.project.entry || '';
  els.settingManifest.value = state.project.manifest || '';
  els.settingModules.value = (state.project.modules || []).join('\n');
  updateSettingsVisibility();
}

async function saveProjectSettings() {
  if (!state.project) return;
  const settings = {
    name: els.settingName.value.trim(),
    kind: els.settingKind.value,
    program: els.settingProgram.value.trim(),
    html: els.settingHtml.value.trim(),
    output: els.settingOutput.value.trim(),
    entry: els.settingEntry.value.trim(),
    manifest: els.settingManifest.value.trim(),
    modules: els.settingModules.value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean),
  };
  try {
    const result = await api('updateProject', {}, { project: state.project.id, settings });
    state.project = result.project;
    state.forms = result.project.forms || [];
    const option = [...els.project.options].find((item) => item.value === state.project.id);
    if (option) option.textContent = state.project.name;
    renderFormSelect();
    renderProjectDialog();
    setStatus('Project settings saved');
  } catch (error) {
    setStatus(error.message, true);
  }
}

function renderProjectDialog() {
  els.dialogForms.innerHTML = '';
  els.dialogUnits.innerHTML = '';
  els.dialogProgram.innerHTML = '';
  if (!state.project) return;
  renderProjectSettings();

  if (state.project.program) {
    const li = document.createElement('li');
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = state.project.program;
    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = 'program';
    const open = dialogButton('Open', 'Open the program in the Source tab');
    open.addEventListener('click', async () => {
      closeProjectDialog();
      await openUnit(state.project.program);
    });
    li.append(name, meta, open);
    els.dialogProgram.appendChild(li);
  } else {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'No program configured (set Program in Settings).';
    els.dialogProgram.appendChild(li);
  }

  const formUnits = new Set(state.forms.map((form) => form.unit));

  for (const form of state.forms) {
    const li = document.createElement('li');
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = form.title || form.form;
    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = `${form.form} · ${form.unit}`;
    const open = dialogButton('Open', 'Open this form');
    open.addEventListener('click', async () => {
      closeProjectDialog();
      await loadForm(form.form);
    });
    const remove = dialogButton('Remove', 'Remove this form from the project');
    remove.disabled = state.forms.length <= 1;
    remove.addEventListener('click', () => deleteForm(form));
    li.append(name, meta, open, remove);
    els.dialogForms.appendChild(li);
  }

  for (const unit of state.project.units || []) {
    const li = document.createElement('li');
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = unit;
    const open = dialogButton('Open', 'Open this unit in the Source tab');
    open.addEventListener('click', async () => {
      closeProjectDialog();
      await openUnit(unit);
    });
    li.append(name);
    if (formUnits.has(unit)) {
      const meta = document.createElement('span');
      meta.className = 'meta';
      meta.textContent = 'form';
      li.appendChild(meta);
    }
    li.appendChild(open);
    if (!formUnits.has(unit)) {
      const remove = dialogButton('Remove', 'Remove this unit from the project');
      remove.addEventListener('click', () => deleteUnit(unit));
      li.appendChild(remove);
    }
    els.dialogUnits.appendChild(li);
  }
}

function openProjectDialog() {
  if (!state.project) {
    setStatus('No project selected.', true);
    return;
  }
  renderProjectDialog();
  if (els.projectDialog.showModal) {
    els.projectDialog.showModal();
  } else {
    els.projectDialog.setAttribute('open', '');
  }
}

function openDialog(dialog) {
  if (dialog.showModal) {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }
}

let newProjectIdTouched = false;

function deriveProjectId(name) {
  return String(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'project';
}

function updateNewProjectHint() {
  const hints = {
    application: 'A pas2js application: a main form, project1.lpr and project1.html.',
    host: 'A pas2js application that loads the module manifests configured in its settings.',
    module: 'A pas2js module: the units are compiled separately with a modules.json manifest.',
  };
  els.newProjectHint.textContent = hints[els.newProjectKind.value] || '';
}

function openNewProjectDialog() {
  els.newProjectName.value = 'New project';
  els.newProjectId.value = 'new-project';
  els.newProjectKind.value = 'application';
  newProjectIdTouched = false;
  updateNewProjectHint();
  openDialog(els.newProjectDialog);
}

async function createNewProject() {
  const name = els.newProjectName.value.trim();
  const id = els.newProjectId.value.trim();
  if (!name || !id) {
    setStatus('Project name and folder id are required.', true);
    return;
  }
  if (hasUnsavedChanges() && !window.confirm('Discard all unsaved changes in the current project?')) {
    return;
  }
  els.newProjectCreateBtn.disabled = true;
  try {
    const result = await api('createProject', {}, { id, name, kind: els.newProjectKind.value });
    closeDialog(els.newProjectDialog);
    discardAllChanges();
    await loadProjects(false);
    els.project.value = result.project.id;
    await loadProject(result.project.id);
    setStatus(`Created ${result.project.name}`);
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    els.newProjectCreateBtn.disabled = false;
  }
}

function closeDialog(dialog) {
  if (dialog.close) {
    dialog.close();
  } else {
    dialog.removeAttribute('open');
  }
}

async function buildPreview() {
  if (!state.project) {
    setStatus('No project selected.', true);
    return;
  }
  let mode = els.previewMode.value === 'form' ? 'form' : 'project';
  if (mode === 'form' && !state.currentForm) {
    mode = 'project';
  }
  if (hasUnsavedChanges()) {
    const saved = await saveAll();
    if (!saved) return;
  }

  const form = state.currentForm;
  const body = { project: state.project.id, mode };
  if (mode === 'form') body.form = form.form;
  els.previewBtn.disabled = true;
  setStatus(mode === 'form' ? `Building ${form.form}...` : `Building ${state.project.name}...`);
  try {
    const result = await api('build', {}, body);
    if (!result.ok) {
      els.buildOutput.textContent = result.output || 'Build failed.';
      openDialog(els.buildDialog);
      setStatus('Build failed', true);
      return;
    }
    const url = previewUrl(result.url);
    url.searchParams.set('t', Date.now().toString());
    els.previewTitle.textContent = mode === 'form' && form
      ? `Preview · ${form.title || form.form}`
      : `Preview · ${state.project.name}`;
    els.previewOpenLink.href = url.href;
    els.previewFrame.src = url.href;
    openDialog(els.previewDialog);
    setStatus(mode === 'form' ? `Preview built · ${result.unit}` : `Preview built · ${result.kind || state.project.kind}`);
  } catch (error) {
    els.buildOutput.textContent = error.message;
    openDialog(els.buildDialog);
    setStatus(error.message, true);
  } finally {
    els.previewBtn.disabled = false;
  }
}

async function openUnit(unit) {
  if (!state.project || !unit) return;
  if (state.currentUnit === unit && state.source !== null) {
    if (state.view !== 'source') setView('source');
    return;
  }
  stashCurrentUnit();
  state.currentUnit = unit;
  state.source = null;
  state.sourceTarget = null;
  state.sourceDirty = false;
  state.sourceCaret = { start: 0, end: 0 };
  state.sourceScrollTop = 0;
  els.sourceEditor.value = '';
  els.sourceGutter.textContent = '';
  if (state.view === 'source') {
    await loadSource(true);
  } else {
    setView('source');
  }
}

async function createForm() {
  if (!state.project) return;
  const title = window.prompt('Form title', '');
  if (title === null) return;
  try {
    const result = await api('createForm', {}, { project: state.project.id, title });
    closeProjectDialog();
    state.project = result.project;
    state.forms = result.project.forms || [];
    stashCurrentForm();
    stashCurrentUnit();
    await loadProject(state.project.id, result.form.form);
    setView('design');
    setStatus(`Created ${result.form.title || result.form.form}`);
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function createUnit() {
  if (!state.project) return;
  const name = window.prompt('Unit file name (empty for the next unitN.pas)', '');
  if (name === null) return;
  try {
    const result = await api('createUnit', {}, { project: state.project.id, name });
    state.project = result.project;
    state.forms = result.project.forms || [];
    closeProjectDialog();
    await openUnit(result.unit);
    setStatus(`Created ${result.unit}`);
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function deleteForm(form) {
  if (!state.project) return;
  const deleteFiles = els.deleteFilesCheck.checked;
  const label = form.title || form.form;
  const hasChanges = (state.currentForm && state.currentForm.form === form.form && state.dirty)
    || state.formCache.has(form.form)
    || state.unitCache.has(form.unit);
  const message = (deleteFiles
    ? `Remove ${label} from the project and delete ${form.form} and ${form.unit}?`
    : `Remove ${label} from the project? The files are kept.`)
    + (hasChanges ? '\n\nUnsaved changes in this form and its unit will be lost.' : '');
  if (!window.confirm(message)) return;
  try {
    const result = await api('deleteForm', {}, {
      project: state.project.id,
      form: form.form,
      deleteFiles,
    });
    state.project = result.project;
    state.forms = result.project.forms || [];
    state.formCache.delete(form.form);
    state.unitCache.delete(form.unit);
    const currentRemoved = !state.currentForm
      || !state.forms.some((entry) => entry.form === state.currentForm.form);
    if (currentRemoved) {
      closeProjectDialog();
      await loadProject(state.project.id, result.project.mainForm);
      setStatus(`Removed ${label}`);
      return;
    }
    if (state.currentUnit === form.unit) {
      state.currentUnit = state.currentForm.unit;
      state.source = null;
      state.sourceDirty = false;
      if (state.view === 'source') await loadSource(true);
    }
    renderFormSelect();
    renderProjectDialog();
    setStatus(`Removed ${label}`);
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function deleteUnit(unit) {
  if (!state.project) return;
  const deleteFile = els.deleteFilesCheck.checked;
  const hasChanges = (state.currentUnit === unit && state.sourceDirty) || state.unitCache.has(unit);
  const message = (deleteFile
    ? `Remove ${unit} from the project and delete the file?`
    : `Remove ${unit} from the project? The file is kept.`)
    + (hasChanges ? '\n\nUnsaved changes in this unit will be lost.' : '');
  if (!window.confirm(message)) return;
  try {
    const result = await api('deleteUnit', {}, {
      project: state.project.id,
      unit,
      deleteFile,
    });
    state.project = result.project;
    state.forms = result.project.forms || [];
    state.unitCache.delete(unit);
    if (state.currentUnit === unit) {
      state.currentUnit = state.currentForm ? state.currentForm.unit : '';
      state.source = null;
      state.sourceDirty = false;
      if (state.view === 'source') await loadSource(true);
    }
    renderProjectDialog();
    setStatus(`Removed ${unit}`);
  } catch (error) {
    setStatus(error.message, true);
  }
}

function defaultProjectUnit(project) {
  const units = project.units || [];
  if (units.length === 0) return project.program || '';
  const entry = String(project.entry || '').trim().toLowerCase();
  if (entry !== '') {
    const match = units.find((unit) => unit.replace(/\.pas$/i, '').toLowerCase() === entry);
    if (match) return match;
  }
  return units[0];
}

async function loadProject(id, formName = '') {
  try {
    setStatus(`Loading ${id}...`);
    const params = { project: id };
    if (formName) params.form = formName;
    const data = await api('load', params);
    const cachedForm = data.form ? state.formCache.get(data.form.form) : null;
    const roots = cachedForm
      ? cachedForm.roots
      : (data.lfm && String(data.lfm).trim() !== '' ? parseLfm(data.lfm) : []);
    if (cachedForm && data.form) {
      state.formCache.delete(data.form.form);
    }
    state.project = data.project;
    state.forms = data.project.forms || [];
    state.currentForm = data.form || state.forms[0] || null;
    state.currentUnit = state.currentForm
      ? state.currentForm.unit
      : defaultProjectUnit(state.project);
    state.roots = roots;
    assignIds(state.roots);
    state.activeTabs = cachedForm ? new Map(cachedForm.activeTabs) : new Map();
    state.history = cachedForm ? (cachedForm.history || []) : [];
    state.historyIndex = cachedForm && Number.isInteger(cachedForm.historyIndex)
      ? cachedForm.historyIndex
      : -1;
    if (state.history.length > 0 && (state.historyIndex < 0 || state.historyIndex >= state.history.length)) {
      state.historyIndex = state.history.length - 1;
    }
    state.savedLfm = cachedForm ? (cachedForm.savedLfm || '') : '';
    const historyEntry = state.history[state.historyIndex];
    state.selected = historyEntry
      ? (nodeAtPath(historyEntry.selectedPath) || state.roots[0] || null)
      : (state.roots[0] || null);
    state.selection = state.selected ? [state.selected] : [];
    state.source = null;
    state.sourceTarget = null;
    state.sourceDirty = false;
    state.sourceCaret = { start: 0, end: 0 };
    state.sourceScrollTop = 0;
    els.sourceEditor.value = '';
    els.sourceGutter.textContent = '';
    els.project.value = id;
    renderFormSelect();
    renderAll();
    if (!cachedForm || state.history.length === 0) {
      state.savedLfm = writeLfm(state.roots);
      state.history = [{
        lfm: state.savedLfm,
        roots: cloneRoots(),
        selectedPath: nodePath(state.selected),
      }];
      state.historyIndex = 0;
    }
    setDirty(cachedForm ? writeLfm(state.roots) !== state.savedLfm : false);
    updateUndoButtons();
    updateMultiTools();
    setStatus(`${data.project.name} loaded`);
    if (!state.currentForm && state.currentUnit) {
      if (state.view === 'source') {
        loadSource(true);
      } else {
        setView('source');
      }
    } else if (state.view === 'source') {
      loadSource(true);
    }
  } catch (error) {
    if (state.currentForm) els.form.value = state.currentForm.form;
    if (state.project) els.project.value = state.project.id;
    setStatus(error.message, true);
  }
}

async function saveProject() {
  if (!state.project) {
    setStatus('No project selected.', true);
    return;
  }
  if (!state.currentForm) {
    if (state.sourceDirty) {
      await saveSource();
    } else {
      setStatus('No form to save.');
    }
    return;
  }
  const formUnit = state.currentForm.unit;
  if (state.currentUnit === formUnit && state.sourceDirty) {
    await saveSource();
    if (state.sourceDirty) return;
  } else if (state.unitCache.has(formUnit)) {
    try {
      await saveCachedUnit(formUnit);
    } catch (error) {
      setStatus(error.message, true);
      return;
    }
  }
  try {
    const lfm = writeLfm(state.roots);
    const formClass = state.roots[0] ? state.roots[0].className : '';
    const components = collectComponents(state.roots, false);
    const result = await api('save', {}, {
      project: state.project.id,
      form: state.currentForm.form,
      lfm,
      formClass,
      components,
    });
    state.formCache.delete(state.currentForm.form);
    state.savedLfm = lfm;
    setDirty(false);
    if (state.currentUnit === formUnit) {
      // Saving the form synchronizes its unit on disk.
      state.source = null;
      state.sourceDirty = false;
      if (state.view === 'source') {
        await loadSource(true);
      }
    }
    updateSaveIndicator();
    const warnings = result.warnings || [];
    if (warnings.length > 0) {
      setStatus(`Saved ${result.bytes} bytes; ${warnings.join('; ')}`, true);
    } else {
      setStatus(`Saved ${result.bytes} bytes${result.pasChanged ? ' · .pas updated' : ''}`);
    }
  } catch (error) {
    setStatus(error.message, true);
  }
}

let importIdTouched = false;

function updateImportHint() {
  const hints = {
    application: 'The .lpr is compiled with -Jc and its main form is opened.',
    host: 'The .lpr is compiled with -Jc and loads the module manifests configured later.',
    module: 'The units are compiled with -Jc- and a modules.json manifest is generated.',
  };
  els.importHint.textContent = hints[els.importKind.value] || '';
}

function openImportDialog() {
  els.importArchive.value = '';
  els.importName.value = '';
  els.importId.value = '';
  els.importKind.value = 'application';
  importIdTouched = false;
  updateImportHint();
  openDialog(els.importDialog);
  els.importArchive.focus();
}

function onImportArchiveChange() {
  const file = els.importArchive.files[0];
  if (!file) return;
  const base = file.name.replace(/\.zip$/i, '') || 'imported';
  if (!els.importName.value.trim()) els.importName.value = base;
  if (!importIdTouched || !els.importId.value.trim()) els.importId.value = deriveProjectId(base);
}

async function importProjectArchive() {
  const file = els.importArchive.files[0];
  const name = els.importName.value.trim();
  const id = els.importId.value.trim();
  const kind = els.importKind.value;
  if (!file) {
    setStatus('Choose a ZIP archive.', true);
    return;
  }
  if (!name || !id) {
    setStatus('Project name and folder id are required.', true);
    return;
  }
  if (file.size > 20 * 1024 * 1024) {
    setStatus('The ZIP is too large (max 20 MB).', true);
    return;
  }
  if (hasUnsavedChanges() && !window.confirm('Discard all unsaved changes in the current project?')) {
    return;
  }
  const form = new FormData();
  form.append('id', id);
  form.append('name', name);
  form.append('kind', kind);
  form.append('archive', file);
  els.importCreateBtn.disabled = true;
  setStatus(`Importing ${file.name}...`);
  try {
    const url = apiUrl('importProject');
    const response = await fetch(url, { method: 'POST', body: form });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error
        || (response.status === 413 ? 'The upload is too large for PHP.' : `HTTP ${response.status}`));
    }
    closeDialog(els.importDialog);
    discardAllChanges();
    await loadProjects(false);
    els.project.value = data.project.id;
    await loadProject(data.project.id);
    const summary = data.summary || {};
    const warnings = data.warnings || [];
    let message = `Imported ${data.project.name} · ${summary.forms || 0} forms, ${summary.units || 0} units`;
    if (summary.program) message += ` · ${summary.program}`;
    if (warnings.length) message += ` · ${warnings.length} warning${warnings.length === 1 ? '' : 's'}`;
    setStatus(message);
    if (warnings.length) els.status.title = warnings.join('\n');
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    els.importCreateBtn.disabled = false;
  }
}

async function deleteProject() {
  if (!state.project) return;
  const name = state.project.name;
  const id = state.project.id;
  const dirty = hasUnsavedChanges();
  const message = `Delete the project "${name}" and all its files?`
    + (dirty ? '\n\nUnsaved changes will be lost.' : '')
    + '\n\nThis deletes the whole folder and cannot be undone.';
  if (!window.confirm(message)) return;
  els.deleteProjectBtn.disabled = true;
  try {
    await api('deleteProject', {}, { project: id });
    closeProjectDialog();
    discardAllChanges();
    await loadProjects(false);
    if (state.projects.length > 0) {
      els.project.value = state.projects[0].id;
      await loadProject(state.projects[0].id);
    } else {
      clearProjectView();
    }
    setStatus(`Deleted ${name}`);
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    els.deleteProjectBtn.disabled = false;
  }
}

async function boot() {
  try {
    const response = await fetch('manifest/components.json');
    if (response.ok) {
      state.manifest = await response.json();
      for (const name of state.manifest.nonVisual || []) nonVisual.add(name);
    }
  } catch (error) {
    // The manifest is optional for the tree/canvas.
  }
  renderPalette();
  els.canvas.addEventListener('dragover', handleDragOver);
  els.canvas.addEventListener('drop', handleDrop);
  els.canvas.addEventListener('dragleave', (event) => {
    if (!els.canvas.contains(event.relatedTarget)) clearDropTargets();
  });
  document.addEventListener('dragend', clearDropTargets);
  els.reload.addEventListener('click', () => {
    if (!state.project) return;
    if (hasUnsavedChanges() && !window.confirm('Discard all unsaved changes?')) return;
    discardAllChanges();
    loadProject(state.project.id, state.currentForm ? state.currentForm.form : '');
  });
  els.save.addEventListener('click', saveAll);
  els.previewBtn.addEventListener('click', buildPreview);
  els.previewCloseBtn.addEventListener('click', () => closeDialog(els.previewDialog));
  els.buildCloseBtn.addEventListener('click', () => closeDialog(els.buildDialog));
  els.previewDialog.addEventListener('close', () => {
    els.previewFrame.src = 'about:blank';
  });
  els.projectBtn.addEventListener('click', openProjectDialog);
  els.projectCloseBtn.addEventListener('click', closeProjectDialog);
  els.newProjectBtn.addEventListener('click', openNewProjectDialog);
  els.newProjectCloseBtn.addEventListener('click', () => closeDialog(els.newProjectDialog));
  els.newProjectCreateBtn.addEventListener('click', createNewProject);
  els.newProjectName.addEventListener('input', () => {
    if (!newProjectIdTouched) {
      els.newProjectId.value = deriveProjectId(els.newProjectName.value);
    }
  });
  els.newProjectId.addEventListener('input', () => {
    newProjectIdTouched = true;
  });
  els.newProjectKind.addEventListener('change', updateNewProjectHint);
  els.newProjectDialog.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
      event.preventDefault();
      createNewProject();
    }
  });
  els.saveSettingsBtn.addEventListener('click', saveProjectSettings);
  els.deleteProjectBtn.addEventListener('click', deleteProject);
  els.settingKind.addEventListener('change', updateSettingsVisibility);
  els.newFormBtn.addEventListener('click', createForm);
  els.newUnitBtn.addEventListener('click', createUnit);
  els.designTab.addEventListener('click', () => setView('design'));
  els.sourceTab.addEventListener('click', () => setView('source'));
  els.undoBtn.addEventListener('click', undo);
  els.redoBtn.addEventListener('click', redo);
  els.editMenuBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleEditMenu();
  });
  els.editMenu.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    event.preventDefault();
    closeEditMenu();
    runEditAction(button.dataset.action);
  });
  els.multiTools.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-align]');
    if (button) alignSelection(button.dataset.align);
  });
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element) || !event.target.closest('.design-tools')) {
      closeEditMenu();
    }
  });
  els.sourceReload.addEventListener('click', () => {
    if (state.sourceDirty && !window.confirm('Discard the unsaved changes to the unit?')) return;
    loadSource(true);
  });
  els.sourceSave.addEventListener('click', () => saveSource({ saveForm: true }));
  document.addEventListener('keydown', (event) => {
    const f12 = event.key === 'F12' && !event.ctrlKey && !event.altKey && !event.metaKey;
    const ctrlBackquote = (event.ctrlKey || event.metaKey) && event.code === 'Backquote';
    if (!f12 && !ctrlBackquote) return;
    event.preventDefault();
    setView(state.view === 'source' ? 'design' : 'source');
  });
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's' && event.target !== els.sourceEditor) {
      event.preventDefault();
      saveAll();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeEditMenu();
      return;
    }
    if (hasOpenDialog() || state.view !== 'design' || !state.currentForm) return;
    if (isEditableTarget(event.target)) return;
    const ctrl = event.ctrlKey || event.metaKey;
    const key = event.key.toLowerCase();
    if (ctrl && key === 'z' && event.shiftKey) {
      event.preventDefault();
      redo();
      return;
    }
    if (ctrl && key === 'z') {
      event.preventDefault();
      undo();
      return;
    }
    if (ctrl && key === 'y') {
      event.preventDefault();
      redo();
      return;
    }
    if (ctrl && key === 'c') {
      event.preventDefault();
      copySelection();
      return;
    }
    if (ctrl && key === 'v') {
      event.preventDefault();
      pasteSelection();
      return;
    }
    if (ctrl && key === 'd') {
      event.preventDefault();
      duplicateSelection();
      return;
    }
    if (!ctrl && (event.key === 'Delete' || event.key === 'Backspace')) {
      event.preventDefault();
      deleteSelection();
    }
  });
  window.addEventListener('beforeunload', (event) => {
    if (!hasUnsavedChanges()) return;
    event.preventDefault();
    event.returnValue = '';
  });
  els.sourceEditor.addEventListener('input', onSourceInput);
  els.sourceEditor.addEventListener('scroll', syncSourceGutter);
  els.sourceEditor.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      saveSource({ saveForm: true });
    }
  });
  els.project.addEventListener('change', () => {
    if (!els.project.value) return;
    if (hasUnsavedChanges() && !window.confirm('Discard all unsaved changes in the current project?')) {
      els.project.value = state.project ? state.project.id : els.project.value;
      return;
    }
    discardAllChanges();
    loadProject(els.project.value);
  });
  els.form.addEventListener('change', () => loadForm(els.form.value));
  els.importBtn.addEventListener('click', openImportDialog);
  els.importCloseBtn.addEventListener('click', () => closeDialog(els.importDialog));
  els.importCreateBtn.addEventListener('click', importProjectArchive);
  els.importArchive.addEventListener('change', onImportArchiveChange);
  els.importName.addEventListener('input', () => {
    if (!importIdTouched) {
      els.importId.value = deriveProjectId(els.importName.value);
    }
  });
  els.importId.addEventListener('input', () => {
    importIdTouched = true;
  });
  els.importKind.addEventListener('change', updateImportHint);
  els.importDialog.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
      event.preventDefault();
      importProjectArchive();
    }
  });
  try {
    await loadProjects();
  } catch (error) {
    setStatus(error.message, true);
  }
}

boot();
