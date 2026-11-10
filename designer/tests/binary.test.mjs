import assert from 'node:assert/strict';
import {
  parseHexBytes,
  formatHexBytes,
  decodeTreeItems,
  encodeTreeItems,
  decodeListItems,
  encodeListLazData,
  encodeListData,
  newTreeNode,
  newListItem,
  countTreeNodes,
} from '../assets/lfm-binary.js';
import { parseLfm, writeLfm } from '../assets/lfm.js';

// Real LCL blobs taken from Lazarus-written .lfm files.

// TTreeView.Items.Data with a single "Voice0" node.
const treeHex = 'F9FFFFFF020001000000FFFFFFFF0000000000000000FFFFFFFF000000000000'
  + '00000005000000566F636530';

// TListView.Items.LazData with two items, two subitems each.
const listHex = '7300000002000000FFFFFFFFFFFFFFFFFFFFFFFF020000000600000047656F72'
  + '6765030000003132330E00000041646D696E6973747261746F7273FFFFFFFFFF'
  + 'FFFFFFFFFFFFFF0200000004000000416C657803000000333231050000005573'
  + '657273FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';

function toHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).toUpperCase().padStart(2, '0')).join('');
}

const treeBytes = parseHexBytes(treeHex);
const tree = decodeTreeItems(treeBytes);
assert.equal(tree.format, 'lcl');
assert.equal(tree.nodes.length, 1);
assert.equal(tree.nodes[0].text, 'Voce0');
assert.equal(tree.nodes[0].imageIndex, -1);
assert.equal(tree.nodes[0].selectedIndex, 0);
assert.equal(tree.nodes[0].overlayIndex, -1);
assert.equal(tree.nodes[0].children.length, 0);
assert.equal(toHex(encodeTreeItems(tree.nodes)), treeHex, 'Tree blob changed when re-encoded');

tree.nodes[0].children.push(newTreeNode('Child'));
assert.equal(countTreeNodes(tree.nodes), 2);
const treeRound = decodeTreeItems(encodeTreeItems(tree.nodes));
assert.equal(treeRound.nodes[0].children[0].text, 'Child');
console.log('OK tree Items.Data decode/encode');

const listBytes = parseHexBytes(listHex);
const items = decodeListItems(listBytes, 'laz');
assert.equal(items.length, 2);
assert.equal(items[0].caption, 'George');
assert.deepEqual(items[0].subItems, ['123', 'Administrators']);
assert.deepEqual(items[0].subItemImages, [-1, -1]);
assert.equal(items[1].caption, 'Alex');
assert.deepEqual(items[1].subItems, ['321', 'Users']);
assert.equal(toHex(encodeListLazData(items)), listHex, 'List blob changed when re-encoded');

items.push(newListItem('New'));
items[2].subItems.push('Extra');
items[2].subItemImages.push(-1);
const listRound = decodeListItems(encodeListLazData(items), 'laz');
assert.equal(listRound.length, 3);
assert.equal(listRound[2].caption, 'New');
assert.deepEqual(listRound[2].subItems, ['Extra']);
console.log('OK list Items.LazData decode/encode');

// Delphi-compatible Items.Data keeps 32-bit pointers and byte-length strings.
const delphiBytes = encodeListData(items);
const delphiRound = decodeListItems(delphiBytes, 'delphi');
assert.equal(delphiRound.length, 3);
assert.equal(delphiRound[0].caption, 'George');
assert.deepEqual(delphiRound[0].subItems, ['123', 'Administrators']);
assert.equal(delphiBytes.length, new DataView(delphiBytes.buffer).getInt32(0, true));
console.log('OK list Items.Data (Delphi) encode/decode');

const formatted = formatHexBytes(treeBytes, '  ');
assert.ok(formatted.startsWith('{\n    F9FFFFFF'), 'Hex should be indented below the property');
assert.ok(formatted.endsWith('\n  }'), 'Closing brace should match the property indent');

const lfm = `object Form1: TForm1
  object TreeView1: TWTreeView
    Items.Data = {
      ${treeHex.match(/.{1,64}/g).join('\n      ')}
    }
  end
end
`;
const ast = parseLfm(lfm);
const prop = ast[0].children[0].properties[0];
assert.equal(prop.name, 'Items.Data');
assert.equal(prop.kind, 'binary');
assert.deepEqual(prop.bytes, treeBytes);
const rewritten = writeLfm(ast);
assert.ok(rewritten.includes('F9FFFFFF0200'), 'Binary value is written back');
assert.equal(toHex(parseLfm(rewritten)[0].children[0].properties[0].bytes), treeHex);

console.log('Binary LFM tests passed.');
