// Lossless LFM parser/writer used by the WCL web designer.
//
// The parser keeps the original text of every property value (`raw`). The
// writer emits those values unchanged, so importing a form and saving it
// again does not drop unknown properties, collections or binary blobs.
// The web UI only rewrites `raw` for the values it explicitly edits.

import { parseHexBytes, formatHexBytes } from './lfm-binary.js';

const OBJECT_KINDS = new Set(['object', 'inherited', 'inline']);

function isWordChar(ch) {
  return /[A-Za-z0-9_]/.test(ch);
}

export class LfmParser {
  constructor(text) {
    this.text = String(text ?? '').replace(/^\uFEFF/, '');
    this.pos = 0;
  }

  eof() {
    return this.pos >= this.text.length;
  }

  skipWs() {
    while (!this.eof() && /\s/.test(this.text[this.pos])) this.pos++;
  }

  skipSpaces() {
    while (!this.eof() && (this.text[this.pos] === ' ' || this.text[this.pos] === '\t')) this.pos++;
  }

  peekWord() {
    const match = /^[A-Za-z_][A-Za-z0-9_]*/.exec(this.text.slice(this.pos));
    return match ? match[0] : '';
  }

  readWord() {
    const word = this.peekWord();
    if (!word) throw this.error('Expected identifier');
    this.pos += word.length;
    return word;
  }

  readLine() {
    const start = this.pos;
    while (!this.eof() && this.text[this.pos] !== '\n' && this.text[this.pos] !== '\r') this.pos++;
    const line = this.text.slice(start, this.pos);
    if (this.text[this.pos] === '\r') this.pos++;
    if (this.text[this.pos] === '\n') this.pos++;
    return line;
  }

  error(message) {
    const before = this.text.slice(0, this.pos);
    const line = before.split(/\r?\n/).length;
    const column = before.length - before.lastIndexOf('\n');
    return new Error(`${message} at ${line}:${column}`);
  }

  parse() {
    const nodes = [];
    this.skipWs();
    while (!this.eof()) {
      nodes.push(this.parseObject());
      this.skipWs();
    }
    return nodes;
  }

  parseObject() {
    this.skipWs();
    const kind = this.readWord();
    if (!OBJECT_KINDS.has(kind)) {
      throw this.error(`Expected object/inherited/inline, found "${kind}"`);
    }
    const header = this.readLine().trim();
    let name = '';
    let className = header;
    const colon = header.indexOf(':');
    if (colon >= 0) {
      name = header.slice(0, colon).trim();
      className = header.slice(colon + 1).trim();
    }

    const properties = [];
    const children = [];

    for (;;) {
      this.skipWs();
      if (this.eof()) throw this.error('Unexpected end of file inside object');
      const word = this.peekWord();
      if (word === 'end') {
        this.readWord();
        break;
      }
      if (OBJECT_KINDS.has(word)) {
        children.push(this.parseObject());
      } else {
        properties.push(this.parseProperty());
      }
    }

    return { kind, name, className, properties, children };
  }

  parseProperty() {
    const start = this.pos;
    let eq = this.pos;
    while (!this.eof() && this.text[eq] !== '=' && this.text[eq] !== '\n' && this.text[eq] !== '\r') eq++;
    if (this.text[eq] !== '=') throw this.error('Expected "=" in property');
    const name = this.text.slice(start, eq).trim();
    if (!name) throw this.error('Empty property name');
    this.pos = eq + 1;
    this.skipSpaces();
    const raw = this.readValue();
    return { name, raw, ...decodeValue(raw) };
  }

  readValue() {
    this.skipSpaces();
    if (this.eof()) return '';
    const ch = this.text[this.pos];
    if (ch === "'" || ch === '#') return this.readStringExpr();
    if (ch === '[') return this.readBalanced('[', ']');
    if (ch === '(') return this.readBalanced('(', ')');
    if (ch === '<') return this.readBalanced('<', '>');
    if (ch === '{') return this.readBalanced('{', '}');

    const start = this.pos;
    while (!this.eof() && this.text[this.pos] !== '\n' && this.text[this.pos] !== '\r') this.pos++;
    return this.text.slice(start, this.pos).trim();
  }

  readStringExpr() {
    const start = this.pos;
    let lastEnd = this.pos;
    for (;;) {
      this.skipSpaces();
      if (this.eof()) break;
      const ch = this.text[this.pos];
      if (ch === "'") {
        this.readQuoted();
        lastEnd = this.pos;
        continue;
      }
      if (ch === '#') {
        this.readCharCode();
        lastEnd = this.pos;
        continue;
      }
      if (ch === '+') {
        this.pos++;
        lastEnd = this.pos;
        continue;
      }
      this.pos = lastEnd;
      break;
    }
    return this.text.slice(start, lastEnd).trim();
  }

  readQuoted() {
    if (this.text[this.pos] !== "'") throw this.error('Expected quote');
    this.pos++;
    while (!this.eof()) {
      if (this.text[this.pos] === "'") {
        if (this.text[this.pos + 1] === "'") {
          this.pos += 2;
          continue;
        }
        this.pos++;
        return;
      }
      this.pos++;
    }
    throw this.error('Unterminated string');
  }

  readCharCode() {
    this.pos++; // '#'
    while (!this.eof() && /[0-9A-Fa-f$]/.test(this.text[this.pos])) this.pos++;
  }

  readBalanced(open, close) {
    const start = this.pos;
    let depth = 0;
    let quoted = false;
    while (!this.eof()) {
      const ch = this.text[this.pos];
      if (quoted) {
        if (ch === "'") {
          if (this.text[this.pos + 1] === "'") {
            this.pos += 2;
            continue;
          }
          quoted = false;
        }
        this.pos++;
        continue;
      }
      if (ch === "'") {
        quoted = true;
        this.pos++;
        continue;
      }
      if (ch === open) depth++;
      if (ch === close) {
        depth--;
        this.pos++;
        if (depth === 0) return this.text.slice(start, this.pos);
        continue;
      }
      this.pos++;
    }
    throw this.error(`Unterminated ${open}${close} value`);
  }
}

class LfmCollectionParser extends LfmParser {
  parseItems() {
    const items = [];
    let current = null;
    this.skipWs();
    while (!this.eof()) {
      const word = this.peekWord();
      if (word === 'item') {
        this.readWord();
        current = { properties: [] };
        items.push(current);
        this.skipWs();
        continue;
      }
      if (word === 'end') {
        this.readWord();
        current = null;
        this.skipWs();
        continue;
      }
      if (!current) throw this.error('Property outside a collection item');
      current.properties.push(this.parseProperty());
      this.skipWs();
    }
    return items;
  }
}

// A collection value such as `Columns = < item ... end>`.  The main parser
// keeps the collection as raw text; this turns it into items so the designer
// can edit collections without losing properties it does not know.
export function parseCollection(raw) {
  const text = String(raw ?? '').trim();
  if (text === '') return [];
  if (!text.startsWith('<')) return null;
  const outer = new LfmParser(text);
  outer.skipWs();
  if (outer.text[outer.pos] !== '<') return null;
  const balanced = outer.readBalanced('<', '>');
  return new LfmCollectionParser(balanced.slice(1, -1)).parseItems();
}

export function writeCollection(items, indent = '') {
  if (!Array.isArray(items) || items.length === 0) return '<>';
  const lines = ['<'];
  for (const item of items) {
    lines.push(`${indent}  item`);
    for (const prop of item.properties || []) {
      const raw = String(prop.raw ?? '').trim();
      if (!prop.name || raw === '') continue;
      const rawLines = raw.split(/\r?\n/);
      lines.push(`${indent}    ${prop.name} = ${rawLines[0]}`);
      for (const line of rawLines.slice(1)) lines.push(`${indent}    ${line}`);
    }
    lines.push(`${indent}  end`);
  }
  lines[lines.length - 1] += '>';
  return lines.join('\n');
}

export function decodeLfmString(raw) {
  let result = '';
  let i = 0;
  while (i < raw.length) {
    const ch = raw[i];
    if (ch === "'") {
      i++;
      while (i < raw.length) {
        if (raw[i] === "'") {
          if (raw[i + 1] === "'") {
            result += "'";
            i += 2;
            continue;
          }
          i++;
          break;
        }
        result += raw[i++];
      }
    } else if (ch === '#') {
      i++;
      let digits = '';
      while (i < raw.length && /[0-9A-Fa-f$]/.test(raw[i])) digits += raw[i++];
      if (digits.startsWith('$')) result += String.fromCharCode(parseInt(digits.slice(1), 16));
      else if (digits) result += String.fromCharCode(parseInt(digits, 10));
    } else {
      i++;
    }
  }
  return result;
}

export function encodeLfmString(value) {
  let text = String(value ?? '');
  text = text.replace(/\r\n/g, '#13#10').replace(/\n/g, '#10').replace(/\r/g, '#13');
  return "'" + text.replace(/'/g, "''") + "'";
}

export function decodeValue(raw) {
  const text = String(raw ?? '').trim();
  if (text.startsWith("'") || text.startsWith('#')) {
    return { kind: 'string', value: decodeLfmString(text) };
  }
  if (text === 'True' || text === 'False') {
    return { kind: 'boolean', value: text === 'True' };
  }
  if (/^-?\d+$/.test(text)) {
    return { kind: 'integer', value: parseInt(text, 10) };
  }
  if (/^-?(?:\d+\.\d*|\d*\.\d+)(?:[eE][+-]?\d+)?$/.test(text)) {
    return { kind: 'float', value: parseFloat(text) };
  }
  if (text.startsWith('[')) return { kind: 'set', value: text };
  if (text.startsWith('(')) return { kind: 'strings', value: text };
  if (text.startsWith('<')) return { kind: 'collection', value: text };
  if (text.startsWith('{')) {
    let bytes = null;
    try {
      bytes = parseHexBytes(text);
    } catch {
      bytes = null;
    }
    return { kind: 'binary', value: text, bytes };
  }
  if (text === '') return { kind: 'empty', value: '' };
  return { kind: 'identifier', value: text };
}

export function setPropertyValue(prop, value, kind = prop.kind) {
  switch (kind) {
    case 'string':
      prop.raw = encodeLfmString(value);
      break;
    case 'boolean':
      prop.raw = value ? 'True' : 'False';
      break;
    case 'integer':
      prop.raw = String(parseInt(value, 10) || 0);
      break;
    case 'float':
      prop.raw = String(Number(value) || 0);
      break;
    default:
      prop.raw = String(value);
      break;
  }
  delete prop.__items;
  Object.assign(prop, decodeValue(prop.raw));
  return prop;
}

export function getProperty(node, name) {
  return node.properties.find((prop) => prop.name === name);
}

export function getPropertyValue(node, name, fallback = undefined) {
  const prop = getProperty(node, name);
  return prop ? prop.value : fallback;
}

export function findNode(nodes, predicate) {
  for (const node of nodes) {
    if (predicate(node)) return node;
    const found = findNode(node.children, predicate);
    if (found) return found;
  }
  return null;
}

export function writeLfm(nodes) {
  return nodes.map((node) => writeNode(node, 0)).join('\n') + '\n';
}

function writeNode(node, level) {
  const pad = '  '.repeat(level);
  const header = node.name ? `${node.kind} ${node.name}: ${node.className}` : `${node.kind} ${node.className}`;
  const lines = [`${pad}${header}`];
  for (const prop of node.properties) {
    if (level === 0 && prop.name === 'Caption' && prop.kind === 'string'
      && String(prop.value ?? '') === '') {
      continue;
    }
    const raw = prop.kind === 'binary' && prop.bytes instanceof Uint8Array
      ? formatHexBytes(prop.bytes, `${pad}  `)
      : (prop.raw ?? '');
    lines.push(`${pad}  ${prop.name} = ${raw}`);
  }
  for (const child of node.children) {
    lines.push(writeNode(child, level + 1));
  }
  lines.push(`${pad}end`);
  return lines.join('\n');
}

export function parseLfm(text) {
  return new LfmParser(text).parse();
}
