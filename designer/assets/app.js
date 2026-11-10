import {
  parseLfm,
  writeLfm,
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
  projectBtn: document.getElementById('projectBtn'),
  importFile: document.getElementById('importFile'),
  importBtn: document.getElementById('importBtn'),
  status: document.getElementById('status'),
  palette: document.getElementById('palette'),
  tree: document.getElementById('tree'),
  canvas: document.getElementById('canvas'),
  inspector: document.getElementById('inspector'),
  formTitle: document.getElementById('formTitle'),
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
  settingName: document.getElementById('settingName'),
  settingKind: document.getElementById('settingKind'),
  settingProgram: document.getElementById('settingProgram'),
  settingHtml: document.getElementById('settingHtml'),
  settingOutput: document.getElementById('settingOutput'),
  settingEntry: document.getElementById('settingEntry'),
  settingManifest: document.getElementById('settingManifest'),
  settingModules: document.getElementById('settingModules'),
  saveSettingsBtn: document.getElementById('saveSettingsBtn'),
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

async function api(action, params = {}, body = null) {
  const url = new URL('api.php', window.location.href);
  url.searchParams.set('action', action);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
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
}

function setDirty(value) {
  state.dirty = value;
  els.save.classList.toggle('dirty', value);
  document.title = `${value ? '● ' : ''}WCL Designer`;
}

function markDirty() {
  setDirty(true);
  setStatus('Modified');
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
  if (state.currentUnit !== unitName && state.sourceDirty) {
    await saveSource();
    if (state.sourceDirty) return false;
  }
  state.currentUnit = unitName;
  state.source = null;
  state.sourceTarget = null;
  await loadSource(true);
  return state.source !== null;
}

async function loadSource(force = false) {
  if (!state.project) {
    els.sourceName.textContent = 'No unit';
    els.sourceStatus.textContent = 'Select a project.';
    els.sourceEditor.value = '';
    els.sourceGutter.textContent = '';
    state.source = null;
    return;
  }
  if (!currentUnitName()) {
    els.sourceName.textContent = 'No unit';
    els.sourceStatus.textContent = 'The project has no unit.';
    els.sourceEditor.value = '';
    els.sourceGutter.textContent = '';
    state.source = null;
    state.sourceDirty = false;
    return;
  }
  els.sourceName.textContent = currentUnitName() || 'unit';
  if (state.source !== null && !force) {
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
    const hadTarget = !!state.sourceTarget;
    applySourceNavigation({ focus: hadTarget });
    if (!hadTarget) focusSourceEditor();
  } catch (error) {
    state.source = null;
    state.sourceDirty = false;
    els.sourceEditor.value = '';
    els.sourceGutter.textContent = '';
    els.sourceStatus.textContent = error.message;
  }
}

function onSourceInput() {
  if (state.source === null) return;
  state.sourceDirty = sourceText() !== state.source;
  updateSourceGutter();
  updateSourceStatus();
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
    updateSourceStatus();
    setStatus(`Unit saved (${result.bytes} bytes)`);
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
      if (state.selected === node) row.classList.add('selected');
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
        selectNode(node);
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
  renderTree();
  renderCanvas();
  renderInspector();
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
  renderTree();
  renderCanvas();
  renderInspector();
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
  if (alignOf(node) !== 'alNone') {
    event.preventDefault();
    event.stopPropagation();
    setStatus(`${node.name} is aligned (${alignOf(node)}); set Align = alNone to move it.`);
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  selectNode(node);
  const el = els.canvas.querySelector(`[data-id="${node.__id}"]`);
  if (!el) return;

  drag.active = true;
  drag.mode = handle === 'move' ? 'move' : 'resize';
  drag.handle = handle;
  drag.node = node;
  drag.el = el;
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
  const { node, current } = drag;
  drag.active = false;
  window.removeEventListener('pointermove', onDragMove);
  window.removeEventListener('pointerup', endDrag);
  window.removeEventListener('pointercancel', endDrag);
  document.body.classList.remove('dragging');

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
  for (const child of root.children) {
    renderCanvasNode(child, form, frames.get(child) || null);
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
  clBtnFace: '#f0f0f0',
  clBtnText: '#000000',
  clWindow: '#ffffff',
  clWindowText: '#000000',
};

const COMMON_PROPERTIES = [
  { name: 'Align', kind: 'identifier', value: 'alNone' },
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
  return classPropertySpecs(node).filter((spec) => {
    if (present.has(spec.name) || seen.has(spec.name)) return false;
    seen.add(spec.name);
    return true;
  });
}

function ensureProperty(node, spec) {
  const existing = getProperty(node, spec.name);
  if (existing) return existing;
  const prop = makeProp(spec.name, spec.raw ?? rawForKind(spec.kind, spec.value));
  node.properties.push(prop);
  return prop;
}

function componentKind(node) {
  return COMPONENT_KINDS[canonicalClassName(node.className)] || '';
}

function colorValue(raw) {
  const text = String(raw ?? '').trim();
  if (!text) return '#f0f0f0';
  if (DELPHI_COLORS[text]) return DELPHI_COLORS[text];
  const match = /^\$([0-9A-Fa-f]{1,8})$/.exec(text);
  if (match) {
    const value = parseInt(match[1], 16);
    return `rgb(${value & 0xff}, ${(value >> 8) & 0xff}, ${(value >> 16) & 0xff})`;
  }
  return '#f0f0f0';
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

function renderComponentSkin(node) {
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

function renderPageControl(node, el, geometry) {
  const sheets = pageControlSheets(node);
  if (sheets.length === 0) {
    for (const child of node.children) renderCanvasNode(child, el);
    return;
  }

  const active = activeTabSheet(node);
  const stripHeight = showPageTabs(node) ? TAB_STRIP_HEIGHT : 0;
  if (stripHeight > 0) {
    const strip = document.createElement('div');
    strip.className = 'page-tabs';
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
  });
}

function renderCanvasNode(node, parent, frame = null) {
  if (!isVisual(node)) return;
  const el = document.createElement('div');
  el.className = 'designer-component';
  el.dataset.id = node.__id;
  el.title = nodeTitle(node);

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
  if (state.selected === node) el.classList.add('selected');

  const chrome = !frame || frame.chrome !== false;
  const aligned = !!(frame && frame.aligned);
  if (!chrome) el.classList.add('page-sheet');
  if (aligned) el.classList.add('aligned');

  const kind = componentKind(node);
  if (kind) el.classList.add(`kind-${kind}`);

  const isPageControl = canonicalClassName(node.className) === 'TWPageControl';

  if (chrome) {
    const skin = renderComponentSkin(node);
    if (skin) {
      el.appendChild(skin);
    } else if (!isPageControl) {
      const text = document.createElement('span');
      text.className = 'component-text';
      text.textContent = displayText(node);
      el.appendChild(text);
    }

    if (!isPageControl) {
      const badge = document.createElement('span');
      badge.className = 'component-badge';
      badge.textContent = node.className;
      el.appendChild(badge);
    }

    const preview = renderItemPreview(node);
    if (preview) el.appendChild(preview);

    if (!aligned && state.selected === node) {
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
      selectNode(node);
    });

    if (aligned) {
      el.addEventListener('pointerdown', (event) => {
        event.stopPropagation();
        selectNode(node);
        setStatus(`${node.name} is aligned (${alignOf(node)}); set Align = alNone to move it.`);
      });
    } else {
      el.addEventListener('pointerdown', (event) => {
        if (event.target instanceof Element && event.target.classList.contains('resize-handle')) return;
        startDrag(event, node, 'move');
      });
    }
  }

  if (isPageControl) {
    renderPageControl(node, el, geometry);
  } else {
    const frames = layoutFrames(node, geometry.width, geometry.height);
    for (const child of node.children) {
      renderCanvasNode(child, el, frames.get(child) || null);
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
  for (const prop of node.properties) {
    if (items && prop === items.prop) continue;
    const row = propertyRow(prop.name, prop.kind);
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
    table.appendChild(row);
  }
  for (const spec of missingProperties(node)) {
    const row = propertyRow(spec.name, spec.kind, true);
    row.appendChild(isEventProperty(spec)
      ? defaultEventEditor(node, spec, row)
      : defaultPropertyEditor(node, spec, row));
    table.appendChild(row);
  }
  els.inspector.appendChild(table);
  const editor = renderItemsEditor(node);
  if (editor) els.inspector.appendChild(editor);
  const pages = renderPagesEditor(node);
  if (pages) els.inspector.appendChild(pages);
  els.inspector.appendChild(renderAddProperty(node));
}

function propertyRow(name, kind, isDefault = false) {
  const row = document.createElement('div');
  row.className = 'property-row';
  if (isDefault) row.classList.add('default');
  const label = document.createElement('label');
  label.textContent = name;
  label.title = isDefault ? `${kind} · not set in the LFM` : kind;
  row.appendChild(label);
  return row;
}

function finishInput(input) {
  input.className = 'property-input';
  return input;
}

function propertyEditor(node, prop) {
  const commit = () => {
    markDirty();
    renderCanvas();
    renderTree();
  };

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
      if (row) row.classList.remove('default');
    }
    return prop;
  };
  const commit = () => {
    markDirty();
    renderCanvas();
    renderTree();
  };

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
    const spec = classPropertySpecs(node).find((item) => item.name === name.value.trim());
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
      }
      assignIds(state.roots);
      renderTree();
      renderCanvas();
      renderInspector();
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

function selectNode(node) {
  state.sourceTarget = null;
  for (let current = node; current; current = current.__parent) {
    if (current.className === 'TTabSheet') activateTabSheet(current);
  }
  state.selected = node;
  renderTree();
  renderCanvas();
  renderInspector();
  if (state.view === 'source' && (!state.currentForm || state.currentUnit === state.currentForm.unit)) {
    applySourceNavigation();
  }
}

function renderAll() {
  assignIds(state.roots);
  if (!state.selected || !state.roots.includes(state.selected)) {
    state.selected = state.roots[0] || null;
  }
  renderTree();
  renderCanvas();
  renderInspector();
  setDirty(false);
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
    setStatus('No projects found. Import an .lfm file.', true);
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
  if (state.dirty || state.sourceDirty) {
    if (!window.confirm('Discard the unsaved changes?')) {
      if (state.currentForm) els.form.value = state.currentForm.form;
      return;
    }
  }
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
  if (!state.project) return;
  renderProjectSettings();

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
  els.newProjectCreateBtn.disabled = true;
  try {
    const result = await api('createProject', {}, { id, name, kind: els.newProjectKind.value });
    closeDialog(els.newProjectDialog);
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
  if (state.sourceDirty) {
    await saveSource();
    if (state.sourceDirty) return;
  }
  if (state.dirty) {
    await saveProject();
    if (state.dirty) return;
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
    const url = new URL(result.url, window.location.href);
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
  if (state.sourceDirty && state.currentUnit !== unit) {
    if (!window.confirm('Discard the unsaved changes to the unit?')) return;
  }
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
    await loadProject(state.project.id, result.form.form);
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
  const message = deleteFiles
    ? `Remove ${label} from the project and delete ${form.form} and ${form.unit}?`
    : `Remove ${label} from the project? The files are kept.`;
  if (!window.confirm(message)) return;
  try {
    const result = await api('deleteForm', {}, {
      project: state.project.id,
      form: form.form,
      deleteFiles,
    });
    state.project = result.project;
    state.forms = result.project.forms || [];
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
  const message = deleteFile
    ? `Remove ${unit} from the project and delete the file?`
    : `Remove ${unit} from the project? The file is kept.`;
  if (!window.confirm(message)) return;
  try {
    const result = await api('deleteUnit', {}, {
      project: state.project.id,
      unit,
      deleteFile,
    });
    state.project = result.project;
    state.forms = result.project.forms || [];
    if (state.currentUnit === unit) {
      state.currentUnit = state.currentForm ? state.currentForm.unit : '';
      state.source = null;
      if (state.view === 'source') await loadSource(true);
    }
    renderProjectDialog();
    setStatus(`Removed ${unit}`);
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function loadProject(id, formName = '') {
  try {
    setStatus(`Loading ${id}...`);
    const params = { project: id };
    if (formName) params.form = formName;
    const data = await api('load', params);
    const roots = data.lfm && String(data.lfm).trim() !== '' ? parseLfm(data.lfm) : [];
    state.project = data.project;
    state.forms = data.project.forms || [];
    state.currentForm = data.form || state.forms[0] || null;
    state.currentUnit = state.currentForm
      ? state.currentForm.unit
      : (state.project.units[0] || '');
    state.roots = roots;
    state.selected = null;
    state.activeTabs.clear();
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
    setStatus(`${data.project.name} loaded`);
    if (state.view === 'source') loadSource(true);
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
  if (state.sourceDirty) {
    await saveSource();
    if (state.sourceDirty) return;
  }
  try {
    const lfm = writeLfm(state.roots);
    const formClass = state.roots[0] ? state.roots[0].className : '';
    const components = collectComponents(state.roots, false);
    const result = await api('save', {}, {
      project: state.project.id,
      form: state.currentForm ? state.currentForm.form : '',
      lfm,
      formClass,
      components,
    });
    setDirty(false);
    state.source = null;
    if (state.view === 'source') loadSource(true);
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

async function importFile(file) {
  try {
    const lfm = await file.text();
    parseLfm(lfm); // validate before sending
    const id = (window.prompt('Project id', 'imported') || '').trim();
    if (!id) return;
    const name = (window.prompt('Project name', id) || id).trim();
    await api('import', {}, { id, name, lfm });
    setStatus(`Imported ${name}`);
    await loadProjects(false);
    els.project.value = id;
    await loadProject(id);
  } catch (error) {
    setStatus(error.message, true);
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
    if ((state.dirty || state.sourceDirty) && !window.confirm('Discard the unsaved changes?')) return;
    loadProject(state.project.id, state.currentForm ? state.currentForm.form : '');
  });
  els.save.addEventListener('click', saveProject);
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
  els.settingKind.addEventListener('change', updateSettingsVisibility);
  els.newFormBtn.addEventListener('click', createForm);
  els.newUnitBtn.addEventListener('click', createUnit);
  els.designTab.addEventListener('click', () => setView('design'));
  els.sourceTab.addEventListener('click', () => setView('source'));
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
    if ((state.dirty || state.sourceDirty) && !window.confirm('Discard the unsaved changes?')) {
      els.project.value = state.project ? state.project.id : els.project.value;
      return;
    }
    loadProject(els.project.value);
  });
  els.form.addEventListener('change', () => loadForm(els.form.value));
  els.importBtn.addEventListener('click', () => els.importFile.click());
  els.importFile.addEventListener('change', () => {
    const file = els.importFile.files[0];
    if (file) importFile(file);
    els.importFile.value = '';
  });
  try {
    await loadProjects();
  } catch (error) {
    setStatus(error.message, true);
  }
}

boot();
