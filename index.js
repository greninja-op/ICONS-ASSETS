/**
 * @greninja-op/icons-assets
 * Programmatic access and directory index for 350,000+ authentic SVG and raster icon assets.
 */

const path = require('path');
const fs = require('fs');

const BASE_PATH = __dirname;

const CATEGORIES = {
  apps: path.join(BASE_PATH, 'apps-and-dashboards'),
  brands: path.join(BASE_PATH, 'brands-and-logos'),
  cloud: path.join(BASE_PATH, 'cloud-architecture'),
  devtools: path.join(BASE_PATH, 'developer-tools'),
  mobile: path.join(BASE_PATH, 'mobile-and-app'),
  os: path.join(BASE_PATH, 'os-and-desktop'),
  pixel: path.join(BASE_PATH, 'pixel-art'),
  system: path.join(BASE_PATH, 'system-and-ui'),
  apple: path.join(BASE_PATH, 'os-and-desktop', 'macos-icons'),
  google: path.join(BASE_PATH, 'cloud-architecture', 'google-cloud-icons'),
  microsoft: path.join(BASE_PATH, 'brands-and-logos', 'microsoft-cloud-logos'),
  languages: path.join(BASE_PATH, 'developer-tools', 'stacks-and-languages'),
  ai: path.join(BASE_PATH, 'brands-and-logos', 'ai-agents')
};

/**
 * Returns the absolute directory path for a given category.
 * @param {string} category 
 * @returns {string}
 */
function getCategoryPath(category) {
  const c = category.toLowerCase();
  if (CATEGORIES[c]) {
    return CATEGORIES[c];
  }
  throw new Error(`Category "${category}" not found. Available categories: ${Object.keys(CATEGORIES).join(', ')}`);
}

/**
 * Resolves an icon path by searching within a category or the entire repository.
 * @param {string} iconName 
 * @param {string} [category] 
 * @returns {string|null}
 */
function findIcon(iconName, category) {
  const searchRoot = category ? getCategoryPath(category) : BASE_PATH;
  let found = null;

  function walk(dir) {
    if (found) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory()) {
        walk(path.join(dir, e.name));
      } else if (e.name.toLowerCase() === iconName.toLowerCase() || 
                 path.parse(e.name).name.toLowerCase() === iconName.toLowerCase()) {
        found = path.join(dir, e.name);
        return;
      }
    }
  }

  walk(searchRoot);
  return found;
}

module.exports = {
  CATEGORIES,
  getCategoryPath,
  findIcon,
  BASE_PATH
};
