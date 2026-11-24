const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const ASSET_DIRECTORIES = [
  'apps-and-dashboards',
  'brands-and-logos',
  'cloud-architecture',
  'developer-tools',
  'gaming',
  'mobile-and-app',
  'os-and-desktop',
  'pixel-art',
  'system-and-ui'
];
const ASSET_PATTERN = /\.(?:svg|png|webp|ico|icns|jpe?g|avif|gif)$/i;
const VARIANT_NAME = /^(?:default|original|dark|light|mono(?:-lobe)?|outline|filled|solid|regular|brand|icon|wordmark)(?:-(?:dark|light|mono))?$/i;

function normalize(value) {
  return value.normalize('NFKD').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
}

function* walk(directory) {
  const absoluteDirectory = path.join(ROOT, directory);
  let entries;
  try {
    entries = fs.readdirSync(absoluteDirectory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }
  for (const entry of entries) {
    const relativePath = directory + '/' + entry.name;
    if (entry.isDirectory()) yield* walk(relativePath);
    else if (entry.isFile() && ASSET_PATTERN.test(entry.name)) yield relativePath;
  }
}

function listAssets() {
  return ASSET_DIRECTORIES.flatMap(category => Array.from(walk(category)));
}

function describeAsset(relativePath) {
  const parts = relativePath.split('/');
  const extension = path.posix.extname(relativePath);
  const stem = path.posix.basename(relativePath, extension);
  const pack = parts[1] || '';
  const parent = parts.at(-2) || '';
  let label = stem;
  let variant = '';
  if (parts.length > 3 && VARIANT_NAME.test(stem)) {
    label = parent;
    variant = stem;
  } else {
    const namedVariant = stem.match(/^(.*?)[-_.](dark|light|mono|wordmark|outline|filled|solid|regular)$/i);
    if (namedVariant) [, label, variant] = namedVariant;
    else if (/^(?:outline|filled|solid|regular|thin|light|bold|duotone)$/i.test(parent)) variant = parent;
  }
  return { category: parts[0], pack, label, variant, format: extension.slice(1).toLowerCase(), path: relativePath };
}

function searchAssets(query, { category, format, limit = 30 } = {}) {
  const key = normalize(query);
  const wantedFormat = format?.toLowerCase().replace(/^\./, '');
  if (!key || !Number.isInteger(limit) || limit < 1) return [];
  const scores = [];
  for (const relativePath of listAssets()) {
    if (category && !relativePath.startsWith(category + '/')) continue;
    const asset = describeAsset(relativePath);
    if (wantedFormat && asset.format !== wantedFormat) continue;
    const label = normalize(asset.label);
    const stem = normalize(path.posix.parse(relativePath).name);
    const folder = normalize(path.posix.dirname(relativePath));
    let score = 0;
    if (label === key || stem === key) score = 3;
    else if (label.includes(key) || stem.includes(key)) score = 2;
    else if (folder.includes(key)) score = 1;
    if (score) scores.push({ asset, score });
  }
  scores.sort((a, b) => b.score - a.score ||
    Number(b.asset.format === 'svg') - Number(a.asset.format === 'svg') ||
    Number(Boolean(a.asset.variant)) - Number(Boolean(b.asset.variant)) ||
    a.asset.path.localeCompare(b.asset.path, 'en'));
  return scores.slice(0, limit).map(result => result.asset);
}

function writeCatalog() {
  const assets = listAssets().sort().map(describeAsset);
  const rows = ['category\tpack\tlabel\tvariant\tformat\tpath'];
  const categories = Object.create(null);
  const formats = Object.create(null);
  for (const { category, pack, label, variant, format, path: relativePath } of assets) {
    rows.push([category, pack, label, variant, format, relativePath].join('\t'));
    categories[category] = (categories[category] || 0) + 1;
    formats[format] = (formats[format] || 0) + 1;
  }
  const summary = { assets: assets.length, categories, formats };
  fs.writeFileSync(path.join(__dirname, 'index.tsv'), rows.join('\n') + '\n', 'utf8');
  fs.writeFileSync(path.join(__dirname, 'summary.json'), JSON.stringify(summary, null, 2) + '\n', 'utf8');
  return summary;
}

module.exports = { ASSET_PATTERN, ASSET_DIRECTORIES, describeAsset, searchAssets, writeCatalog };
