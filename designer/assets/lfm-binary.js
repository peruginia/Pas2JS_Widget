// Binary LFM values written by the Lazarus IDE.
//
// TTreeView keeps its nodes in `Items.Data` (LCL stream, magic -7) and
// TListView keeps its items in `Items.LazData`. The layouts follow the LCL
// sources (lcl/comctrls.pp, lcl/include/treeview.inc, listitems.inc), so the
// values can be decoded, edited and written back without losing data.
//
// The designer only edits the text/structure of the items; image indexes and
// other numeric fields are preserved as decoded.

const LCL_STREAM_ID = -7;
const TREE_STREAM_VERSION = 2;
const TREE_STREAM_VERSION_WITH_POINTER = 1;
const HEX_BYTES_PER_LINE = 32;

const decoder = new TextDecoder('utf-8');
const encoder = new TextEncoder();

class Reader {
  constructor(bytes) {
    this.bytes = bytes;
    this.pos = 0;
  }

  get remaining() {
    return this.bytes.length - this.pos;
  }

  need(count) {
    if (this.pos + count > this.bytes.length) {
      throw new Error('Unexpected end of binary data');
    }
  }

  u8() {
    this.need(1);
    return this.bytes[this.pos++];
  }

  u16() {
    this.need(2);
    const value = this.bytes[this.pos] | (this.bytes[this.pos + 1] << 8);
    this.pos += 2;
    return value;
  }

  i32() {
    this.need(4);
    const b = this.bytes;
    const p = this.pos;
    this.pos += 4;
    return b[p] | (b[p + 1] << 8) | (b[p + 2] << 16) | (b[p + 3] << 24);
  }

  u32() {
    return this.i32() >>> 0;
  }

  text(length) {
    if (length < 0) throw new Error('Invalid string length');
    this.need(length);
    const value = decoder.decode(this.bytes.subarray(this.pos, this.pos + length));
    this.pos += length;
    return value;
  }

  ansiString32() {
    return this.text(this.i32());
  }

  ansiString8() {
    return this.text(this.u8());
  }

  shortString() {
    return this.text(this.u8());
  }
}

class Writer {
  constructor() {
    this.buf = [];
  }

  get length() {
    return this.buf.length;
  }

  u8(value) {
    this.buf.push(value & 0xff);
  }

  u16(value) {
    this.buf.push(value & 0xff, (value >>> 8) & 0xff);
  }

  i32(value) {
    const v = value | 0;
    this.buf.push(v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff);
  }

  text(value) {
    for (const byte of encoder.encode(String(value ?? ''))) this.buf.push(byte);
  }

  shortText(value) {
    const bytes = shortBytes(value);
    this.u8(bytes.length);
    for (const byte of bytes) this.buf.push(byte);
  }

  bytes() {
    return Uint8Array.from(this.buf);
  }
}

function utf8Length(value) {
  return encoder.encode(String(value ?? '')).length;
}

function shortBytes(value) {
  const bytes = encoder.encode(String(value ?? ''));
  return bytes.length > 255 ? bytes.subarray(0, 255) : bytes;
}

function shortLength(value) {
  return shortBytes(value).length;
}

export function parseHexBytes(raw) {
  const hex = String(raw ?? '').replace(/[^0-9A-Fa-f]/g, '');
  if (hex.length === 0) throw new Error('Empty binary value');
  if (hex.length % 2 !== 0) throw new Error('Odd number of hex digits');
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export function formatHexBytes(bytes, indent = '') {
  const lines = [];
  for (let i = 0; i < bytes.length; i += HEX_BYTES_PER_LINE) {
    let line = '';
    for (let j = i; j < Math.min(i + HEX_BYTES_PER_LINE, bytes.length); j++) {
      line += bytes[j].toString(16).toUpperCase().padStart(2, '0');
    }
    lines.push(`${indent}  ${line}`);
  }
  return `{\n${lines.join('\n')}\n${indent}}`;
}

export function newTreeNode(text = 'Node') {
  return {
    text,
    imageIndex: -1,
    selectedIndex: -1,
    stateIndex: 0,
    overlayIndex: -1,
    height: 0,
    expanded: false,
    children: [],
  };
}

function readTreeNode(reader, version) {
  const node = newTreeNode('');
  if (version === TREE_STREAM_VERSION_WITH_POINTER) {
    node.imageIndex = reader.i32();
    node.selectedIndex = reader.i32();
    node.stateIndex = reader.i32();
    node.overlayIndex = reader.i32();
    reader.u32(); // 32-bit Data pointer
    node.height = reader.i32();
    const count = reader.i32();
    node.expanded = reader.u8() !== 0;
    node.text = reader.text(reader.i32());
    for (let i = 0; i < count; i++) node.children.push(readTreeNode(reader, version));
    return node;
  }

  node.imageIndex = reader.i32();
  node.selectedIndex = reader.i32();
  node.stateIndex = reader.i32();
  node.overlayIndex = reader.i32();
  const count = reader.i32();
  node.height = reader.i32();
  node.expanded = reader.u8() !== 0;
  node.text = reader.text(reader.i32());
  for (let i = 0; i < count; i++) node.children.push(readTreeNode(reader, version));
  return node;
}

function readDelphiTreeNode(reader) {
  const size = reader.i32();
  const start = reader.pos;
  const node = newTreeNode('');
  node.imageIndex = reader.i32();
  node.selectedIndex = reader.i32();
  node.stateIndex = reader.i32();
  node.overlayIndex = reader.i32();
  reader.u32(); // 32-bit Data pointer
  const count = reader.i32();
  node.text = reader.shortString();
  reader.pos = start + size;
  for (let i = 0; i < count; i++) node.children.push(readDelphiTreeNode(reader));
  return node;
}

/**
 * Decode the `Items.Data` blob of a TTreeView.
 * Supports both the LCL stream (magic -7) and the Delphi stream.
 */
export function decodeTreeItems(bytes) {
  const reader = new Reader(bytes);
  const magic = reader.i32();

  if (magic === LCL_STREAM_ID) {
    const version = reader.u16();
    if (version !== TREE_STREAM_VERSION && version !== TREE_STREAM_VERSION_WITH_POINTER) {
      throw new Error(`Unsupported tree stream version ${version}`);
    }
    const count = reader.i32();
    if (count < 0) throw new Error('Invalid tree node count');
    const nodes = [];
    for (let i = 0; i < count; i++) nodes.push(readTreeNode(reader, version));
    return { format: 'lcl', nodes };
  }

  if (magic < 0) throw new Error('Unknown tree stream format');
  const nodes = [];
  for (let i = 0; i < magic; i++) nodes.push(readDelphiTreeNode(reader));
  return { format: 'delphi', nodes };
}

function writeTreeNode(writer, node) {
  const children = node.children || [];
  writer.i32(node.imageIndex ?? -1);
  writer.i32(node.selectedIndex ?? -1);
  writer.i32(node.stateIndex ?? 0);
  writer.i32(node.overlayIndex ?? -1);
  writer.i32(children.length);
  writer.i32(node.height ?? 0);
  writer.u8(node.expanded ? 1 : 0);
  const text = String(node.text ?? '');
  writer.i32(utf8Length(text));
  writer.text(text);
  for (const child of children) writeTreeNode(writer, child);
}

export function encodeTreeItems(nodes) {
  const writer = new Writer();
  writer.i32(LCL_STREAM_ID);
  writer.u16(TREE_STREAM_VERSION);
  writer.i32(nodes.length);
  for (const node of nodes) writeTreeNode(writer, node);
  return writer.bytes();
}

export function newListItem(caption = 'Item') {
  return {
    caption,
    imageIndex: -1,
    stateIndex: -1,
    overlayIndex: -1,
    subItems: [],
    subItemImages: [],
  };
}

/**
 * Decode a TListView `Items.LazData` (format 'laz') or `Items.Data`
 * (format 'delphi') blob.
 */
export function decodeListItems(bytes, format = 'laz') {
  const reader = new Reader(bytes);
  const start = reader.pos;
  const size = reader.i32();
  const count = reader.i32();
  if (count < 0) throw new Error('Invalid list item count');

  const items = [];
  for (let i = 0; i < count; i++) {
    const imageIndex = reader.i32();
    const stateIndex = reader.i32();
    const overlayIndex = reader.i32();
    const subCount = reader.i32();
    if (format === 'delphi') reader.u32(); // 32-bit Data pointer
    const caption = format === 'delphi' ? reader.ansiString8() : reader.ansiString32();
    const subItems = [];
    for (let j = 0; j < subCount; j++) {
      subItems.push(format === 'delphi' ? reader.ansiString8() : reader.ansiString32());
    }
    items.push({ caption, imageIndex, stateIndex, overlayIndex, subItems, subItemImages: [] });
  }

  const end = start + size;
  for (const item of items) {
    for (let j = 0; j < item.subItems.length; j++) {
      item.subItemImages.push(reader.pos + 4 <= end && reader.remaining >= 4 ? reader.i32() : -1);
    }
  }
  return items;
}

export function encodeListLazData(items) {
  let size = 8;
  for (const item of items) {
    size += 16 + 4 * item.subItems.length;
    size += 4 + utf8Length(item.caption);
    for (const subItem of item.subItems) size += 4 + utf8Length(subItem);
  }

  const writer = new Writer();
  writer.i32(size);
  writer.i32(items.length);
  for (const item of items) {
    writer.i32(item.imageIndex ?? -1);
    writer.i32(item.stateIndex ?? -1);
    writer.i32(item.overlayIndex ?? -1);
    writer.i32(item.subItems.length);
    writer.i32(utf8Length(item.caption));
    writer.text(item.caption);
    for (const subItem of item.subItems) {
      writer.i32(utf8Length(subItem));
      writer.text(subItem);
    }
  }
  for (const item of items) {
    for (let j = 0; j < item.subItems.length; j++) {
      writer.i32(item.subItemImages[j] ?? -1);
    }
  }
  return writer.bytes();
}

// Delphi-compatible `Items.Data`: byte-length strings and a 32-bit data
// pointer per item. Kept for forms written by Delphi.
export function encodeListData(items) {
  let size = 8;
  for (const item of items) {
    size += 20 + 1 + shortLength(item.caption);
    for (const subItem of item.subItems) size += 1 + shortLength(subItem);
    size += 4 * item.subItems.length;
  }

  const writer = new Writer();
  writer.i32(size);
  writer.i32(items.length);
  for (const item of items) {
    writer.i32(item.imageIndex ?? -1);
    writer.i32(item.stateIndex ?? -1);
    writer.i32(item.overlayIndex ?? -1);
    writer.i32(item.subItems.length);
    writer.i32(0); // data pointer
    writer.shortText(item.caption);
    for (const subItem of item.subItems) writer.shortText(subItem);
  }
  for (const item of items) {
    for (let j = 0; j < item.subItems.length; j++) {
      writer.i32(item.subItemImages[j] ?? -1);
    }
  }
  return writer.bytes();
}

export function countTreeNodes(nodes) {
  return nodes.reduce((total, node) => total + 1 + countTreeNodes(node.children), 0);
}

export function removeTreeNode(nodes, target) {
  const index = nodes.indexOf(target);
  if (index >= 0) {
    nodes.splice(index, 1);
    return true;
  }
  for (const node of nodes) {
    if (removeTreeNode(node.children, target)) return true;
  }
  return false;
}
