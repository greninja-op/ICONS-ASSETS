#!/usr/bin/env node

/**
 * @greninja-op/icons-assets CLI
 * Allows users to inspect, search, and selectively extract icon collections without pulling the entire 350k+ repository.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const CATEGORIES = {
  'apps': { name: 'Apps & Dashboards', path: 'apps-and-dashboards' },
  'brands': { name: 'Brands & Logos', path: 'brands-and-logos' },
  'cloud': { name: 'Cloud Architecture', path: 'cloud-architecture' },
  'devtools': { name: 'Developer Tools & Languages', path: 'developer-tools' },
  'mobile': { name: 'Mobile & App Icons', path: 'mobile-and-app' },
  'os': { name: 'OS & Desktop Icons', path: 'os-and-desktop' },
  'pixel': { name: 'Pixel Art Icons', path: 'pixel-art' },
  'system': { name: 'System & UI Icons', path: 'system-and-ui' },
  'apple': { name: 'Apple & macOS Icons', path: 'os-and-desktop/macos-icons' },
  'google': { name: 'Google Cloud & Workspace', path: 'cloud-architecture/google-cloud-icons' },
  'microsoft': { name: 'Microsoft 365 & Cloud', path: 'brands-and-logos/microsoft-cloud-logos' },
  'languages': { name: 'Programming Languages & Stacks', path: 'developer-tools/stacks-and-languages' },
  'ai': { name: 'AI Models & Coding Agents', path: 'brands-and-logos/ai-agents' }
};

function printHelp() {
  console.log(`
=====================================================
  @greninja-op/icons-assets CLI
  350,000+ Curated Official Icons & Logos
=====================================================

Usage:
  npx @greninja-op/icons-assets <command> [options]

Commands:
  list                 List all available icon suites & categories
  search <query>       Search for specific icons by keyword
  get <category> [dir] Extract a specific icon category to a local folder

Categories for 'get':
  apps        Apps & Dashboards (3,400+ SVGs, 8,300+ PNG/WebP)
  brands      Brands & Logos (SimpleIcons, TheSVG, Gilbarbara, etc.)
  cloud       Cloud Architecture (AWS, CNCF, Google Cloud)
  devtools    Developer Tools & Languages (.NET, Docker, React, Python, Devicon, Octicons)
  mobile      Mobile & App Icons (CoreUI, Ionicons, Bytesize)
  os          OS & Desktop Icons (Papirus, Yaru, WhiteSur, Breeze, macOS)
  pixel       Pixel Art Icons (HackerNoon, Pixelarticons)
  system      System & UI Icons (Fluent UI, Phosphor, Lucide, Tabler, Material, SF Symbols)
  apple       Apple & macOS Application & System Icons
  google      Google Cloud & Workspace Icons
  microsoft   Microsoft 365, Azure & Cloud Logos
  languages   Programming Languages, Frameworks & CSS Logos
  ai          AI Models & Coding Agents (Claude, ChatGPT, Antigravity, Gemini, Grok, etc.)

Examples:
  npx @greninja-op/icons-assets list
  npx @greninja-op/icons-assets search antigravity
  npx @greninja-op/icons-assets get apple ./src/assets/apple
  npx @greninja-op/icons-assets get languages ./src/assets/tech-logos
`);
}

function listCategories() {
  console.log('\n--- Available Icon Suites in @greninja-op/icons-assets ---\n');
  for (const [key, info] of Object.entries(CATEGORIES)) {
    const fullPath = path.join(ROOT_DIR, info.path);
    let count = 0;
    if (fs.existsSync(fullPath)) {
      try {
        function countFiles(dir) {
          let c = 0;
          const entries = fs.readdirSync(dir, { withFileTypes: true });
          for (const e of entries) {
            if (e.isDirectory()) c += countFiles(path.join(dir, e.name));
            else if (/\.(svg|png|webp|ico)$/i.test(e.name)) c++;
          }
          return c;
        }
        count = countFiles(fullPath);
      } catch (err) {
        count = 'Available';
      }
    }
    console.log(`  * ${key.padEnd(12)} : ${info.name.padEnd(35)} (~${count} icons)`);
  }
  console.log('\nTo extract a category, run: npx @greninja-op/icons-assets get <category> [target-directory]\n');
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const e of entries) {
    const srcPath = path.join(src, e.name);
    const destPath = path.join(dest, e.name);
    if (e.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else if (/\.(svg|png|webp|ico|json)$/i.test(e.name)) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function getCategory(categoryKey, targetDir) {
  const cat = CATEGORIES[categoryKey.toLowerCase()];
  if (!cat) {
    console.error(`Error: Unknown category "${categoryKey}". Run 'npx @greninja-op/icons-assets list' to see available categories.`);
    process.exit(1);
  }

  const srcDir = path.join(ROOT_DIR, cat.path);
  if (!fs.existsSync(srcDir)) {
    console.error(`Error: Source directory ${srcDir} does not exist.`);
    process.exit(1);
  }

  const outDir = path.resolve(process.cwd(), targetDir || `./icons-${categoryKey}`);
  console.log(`Extracting [${cat.name}] to: ${outDir}...`);
  copyRecursive(srcDir, outDir);
  console.log(`Successfully extracted ${cat.name} icons into ${outDir}`);
}

function searchIcons(query) {
  if (!query) {
    console.error('Error: Please provide a search query.');
    process.exit(1);
  }
  const q = query.toLowerCase();
  console.log(`\nSearching for icons matching "${query}"...\n`);
  const matches = [];

  function searchDir(dir, relPath) {
    if (matches.length >= 30) return;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        if (e.isDirectory()) {
          searchDir(path.join(dir, e.name), path.join(relPath, e.name));
        } else if (/\.(svg|png|webp)$/i.test(e.name)) {
          if (e.name.toLowerCase().includes(q)) {
            matches.push(path.join(relPath, e.name));
          }
        }
      }
    } catch (e) {}
  }

  searchDir(ROOT_DIR, '');
  if (matches.length === 0) {
    console.log(`No icons matching "${query}" found.`);
  } else {
    matches.forEach(m => console.log(`  - ${m}`));
    if (matches.length >= 30) {
      console.log('\n(Showing first 30 matches. Narrow your query for specific results.)');
    }
  }
  console.log('');
}

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === '--help' || command === '-h') {
  printHelp();
} else if (command === 'list' || command === '--list') {
  listCategories();
} else if (command === 'get') {
  const cat = args[1];
  const dest = args[2];
  if (!cat) {
    console.error('Error: Missing category name. Example: get apple ./icons/apple');
    process.exit(1);
  }
  getCategory(cat, dest);
} else if (command === 'search') {
  searchIcons(args[1]);
} else {
  // Check if first argument is a category directly
  if (CATEGORIES[command.toLowerCase()]) {
    getCategory(command, args[1]);
  } else {
    console.error(`Unknown command "${command}". Run 'npx @greninja-op/icons-assets --help' for usage.`);
  }
}
