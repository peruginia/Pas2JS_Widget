import {
  parseLfm,
  writeLfm,
  getProperty,
  getPropertyValue,
  setPropertyValue,
  decodeValue,
} from './lfm.js';

const state = {
  manifest: { nonVisual: [], aliases: {}, classes: [] },
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
  tree: document.getElementById('tree'),
  canvas: document.getElementById('canvas'),
  inspector: document.getElementById('inspector'),
  formTitle: document.getElementById('formTitle'),
};

const nonVisual = new Set();

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

  el.addEventListener('click', (event) => {
    event.stopPropagation();
    selectNode(node);
  });

  const children = node.className === 'TWPageControl' ? selectedTabSheet(node) : node.children;
  for (const child of children) {
    renderCanvasNode(child, el);
  }
  parent.appendChild(el);
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
  for (const prop of node.properties) {
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
    const result = await api('save', {}, { project: state.project.id, lfm });
    setDirty(false);
    setStatus(`Saved ${result.bytes} bytes`);
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
  document.addEventListener('click', () => {
    // Keep the current selection when clicking outside the designer surface.
  });
  try {
    await loadProjects();
  } catch (error) {
    setStatus(error.message, true);
  }
}

boot();
