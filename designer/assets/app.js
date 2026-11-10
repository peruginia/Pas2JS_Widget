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
  roots: [],
  selected: null,
  dirty: false,
};

const els = {
  project: document.getElementById('projectSelect'),
  reload: document.getElementById('reloadBtn'),
  save: document.getElementById('saveBtn'),
  importFile: document.getElementById('importFile'),
  importBtn: document.getElementById('importBtn'),
  status: document.getElementById('status'),
  palette: document.getElementById('palette'),
  tree: document.getElementById('tree'),
  canvas: document.getElementById('canvas'),
  inspector: document.getElementById('inspector'),
  formTitle: document.getElementById('formTitle'),
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
  const walk = (list) => {
    for (const node of list) {
      node.__id = `${prefix}${++counter}`;
      walk(node.children);
    }
  };
  walk(nodes);
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

function selectedTabSheet(pageControl) {
  const active = getPropertyValue(pageControl, 'ActivePage', '');
  const sheets = pageControl.children.filter((node) => node.className === 'TTabSheet');
  if (sheets.length === 0) return pageControl.children;
  const activeSheet = sheets.find((node) => node.name === active);
  return activeSheet ? [activeSheet] : [sheets[0]];
}

function renderTree() {
  els.tree.innerHTML = '';
  if (state.roots.length === 0) {
    els.tree.textContent = 'No form loaded.';
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
      const sheet = selectedTabSheet(node)[0];
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
  const rect = element.getBoundingClientRect();
  addComponent(className, parent, event.clientX - rect.left, event.clientY - rect.top);
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
    els.canvas.textContent = 'Load a project to see the form.';
    return;
  }
  const form = document.createElement('div');
  form.className = 'designer-form';
  form.style.width = `${Math.max(1, propNumber(root, 'Width', 800))}px`;
  form.style.height = `${Math.max(1, propNumber(root, 'Height', 600))}px`;
  form.dataset.id = root.__id;
  form.addEventListener('click', (event) => {
    event.stopPropagation();
    selectNode(root);
  });

  const children = root.className === 'TWPageControl' ? selectedTabSheet(root) : root.children;
  for (const child of children) {
    renderCanvasNode(child, form);
  }
  els.canvas.appendChild(form);
  els.formTitle.textContent = `${root.name || root.className} · ${root.className}`;
}

function renderCanvasNode(node, parent) {
  if (!isVisual(node)) return;
  const el = document.createElement('div');
  el.className = 'designer-component';
  el.dataset.id = node.__id;
  el.title = nodeTitle(node);
  el.style.left = `${propNumber(node, 'Left', 0)}px`;
  el.style.top = `${propNumber(node, 'Top', 0)}px`;
  el.style.width = `${Math.max(1, propNumber(node, 'Width', 100))}px`;
  el.style.height = `${Math.max(1, propNumber(node, 'Height', 25))}px`;
  if (getPropertyValue(node, 'Visible', true) === false) {
    el.classList.add('hidden');
  }
  if (state.selected === node) el.classList.add('selected');

  const text = document.createElement('span');
  text.className = 'component-text';
  text.textContent = displayText(node);
  el.appendChild(text);

  const badge = document.createElement('span');
  badge.className = 'component-badge';
  badge.textContent = node.className;
  el.appendChild(badge);

  const preview = renderItemPreview(node);
  if (preview) el.appendChild(preview);

  if (state.selected === node) {
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
  el.addEventListener('pointerdown', (event) => {
    if (event.target instanceof Element && event.target.classList.contains('resize-handle')) return;
    startDrag(event, node, 'move');
  });

  const children = node.className === 'TWPageControl' ? selectedTabSheet(node) : node.children;
  for (const child of children) {
    renderCanvasNode(child, el);
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
    const row = document.createElement('div');
    row.className = 'property-row';
    const label = document.createElement('label');
    label.textContent = prop.name;
    label.title = prop.kind;
    row.appendChild(label);

    const kind = prop.kind;
    let input;
    if (kind === 'boolean') {
      input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = prop.value === true;
      input.addEventListener('change', () => {
        setPropertyValue(prop, input.checked, 'boolean');
        markDirty();
        renderCanvas();
        renderTree();
      });
    } else if (kind === 'integer' || kind === 'float') {
      input = document.createElement('input');
      input.type = 'number';
      input.value = prop.value;
      input.addEventListener('input', () => {
        setPropertyValue(prop, input.value, kind);
        markDirty();
        renderCanvas();
        renderTree();
      });
    } else if (kind === 'string') {
      input = document.createElement('input');
      input.type = 'text';
      input.value = prop.value;
      input.addEventListener('input', () => {
        setPropertyValue(prop, input.value, 'string');
        markDirty();
        renderCanvas();
        renderTree();
      });
    } else {
      input = document.createElement('textarea');
      input.rows = prop.raw.includes('\n') ? 4 : 2;
      input.value = prop.raw;
      input.addEventListener('input', () => {
        setPropertyValue(prop, input.value, 'raw');
        markDirty();
        renderCanvas();
        renderTree();
      });
    }
    input.className = 'property-input';
    row.appendChild(input);
    table.appendChild(row);
  }
  els.inspector.appendChild(table);
  const editor = renderItemsEditor(node);
  if (editor) els.inspector.appendChild(editor);
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

function selectNode(node) {
  state.selected = node;
  renderTree();
  renderCanvas();
  renderInspector();
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

async function loadProjects() {
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
  await loadProject(state.projects[0].id);
}

async function loadProject(id) {
  try {
    setStatus(`Loading ${id}...`);
    const data = await api('load', { project: id });
    const roots = parseLfm(data.lfm);
    state.project = data.project;
    state.roots = roots;
    state.selected = null;
    els.project.value = id;
    renderAll();
    setStatus(`${data.project.name} loaded`);
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function saveProject() {
  if (!state.project) {
    setStatus('No project selected.', true);
    return;
  }
  try {
    const lfm = writeLfm(state.roots);
    const formClass = state.roots[0] ? state.roots[0].className : '';
    const components = collectComponents(state.roots, false);
    const result = await api('save', {}, {
      project: state.project.id,
      lfm,
      formClass,
      components,
    });
    setDirty(false);
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
    await loadProjects();
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
    if (state.project) loadProject(state.project.id);
  });
  els.save.addEventListener('click', saveProject);
  els.project.addEventListener('change', () => {
    if (els.project.value) loadProject(els.project.value);
  });
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
