import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { parseLfm, writeLfm } from '../assets/lfm.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');

function normalize(nodes) {
  return nodes.map((node) => ({
    kind: node.kind,
    name: node.name,
    className: node.className,
    properties: node.properties.map((prop) => ({ name: prop.name, raw: prop.raw })),
    children: normalize(node.children),
  }));
}

function roundTrip(file) {
  const text = fs.readFileSync(file, 'utf8');
  const first = parseLfm(text);
  const written = writeLfm(first);
  const second = parseLfm(written);
  assert.deepEqual(normalize(second), normalize(first), `Round-trip changed ${file}`);
  return { file, nodes: count(first), bytes: written.length };
}

function count(nodes) {
  return nodes.reduce((total, node) => total + 1 + count(node.children), 0);
}

const files = [
  path.join(root, 'examples', 'demo', 'unit1.lfm'),
  path.join(root, 'examples', 'demo', 'uLogin.lfm'),
];

for (const file of files) {
  const result = roundTrip(file);
  console.log(`OK ${path.relative(root, result.file)}: ${result.nodes} components, ${result.bytes} bytes`);
}

const synthetic = `object Form1: TForm1
  Left = 0
  Caption = 'A ''quoted'' value'
  Columns = <
    item
      Caption = 'Name'
      Width = 120
    end
    item
      Caption = 'Role'
    end>
  Items.Strings = (
    'Alpha'
    'Beta')
  Data = {
    0A00FF
  }
  Font.Style = [fsBold, fsItalic]
  OnClick = FormClick
end
`;
const ast = parseLfm(synthetic);
const out = writeLfm(ast);
const again = parseLfm(out);
assert.deepEqual(normalize(again), normalize(ast), 'Synthetic round-trip failed');
assert.equal(ast[0].properties.find((p) => p.name === 'Caption').value, "A 'quoted' value");
assert.equal(ast[0].properties.find((p) => p.name === 'Data').kind, 'binary');
assert.equal(ast[0].properties.find((p) => p.name === 'Columns').kind, 'collection');
console.log('OK synthetic collections/binary/strings');

console.log('LFM round-trip tests passed.');
