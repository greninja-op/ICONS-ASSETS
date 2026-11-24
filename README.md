# ICONS-ASSETS

A searchable catalog of vector and raster icons for apps, brands, development, cloud architecture, mobile, desktop, product interfaces, gaming, and pixel art.

See the [asset catalog guide](asset-catalog/README.md), [full file index](asset-catalog/index.tsv), and [format and category totals](asset-catalog/summary.json).

Each third-party pack retains its own license and source notes. Product logos and app icons can carry additional trademark and reuse conditions.

## Local usage

```powershell
node bin/cli.js list
node bin/cli.js search wifi --category system --format svg
node bin/cli.js get gaming ./my-gaming-assets
node bin/cli.js catalog
```

## JavaScript API

```javascript
const { findIcon, searchAssets } = require('./index');
const wifi = searchAssets('wifi', { category: 'system-and-ui', format: 'svg' });
const python = findIcon('Python.svg', 'languages');
```

## Collections

- [apps-and-dashboards](apps-and-dashboards)
- [brands-and-logos](brands-and-logos)
- [cloud-architecture](cloud-architecture)
- [developer-tools](developer-tools)
- [gaming](gaming)
- [mobile-and-app](mobile-and-app)
- [os-and-desktop](os-and-desktop)
- [pixel-art](pixel-art)
- [system-and-ui](system-and-ui)

## 🚀 Publishing to NPM (Owner Guide)

As the owner of the `greninja-op` account, follow these steps to publish `@greninja-op/icons-assets` to the NPM registry:

### Step 1: Log in to your NPM Account
In your terminal, authenticate with NPM:
```bash
npm login
```
*Enter your NPM username, password, and one-time two-factor authentication (2FA) code.*

### Step 2: Verify Authentication
```bash
npm whoami
# Should output: your-npm-username
```

### Step 3: Publish with Public Access
Because scoped packages (`@scope/package-name`) default to private on NPM, publish with the `--access public` flag:
```bash
cd ICONS-ASSETS
npm publish --access public
```

### Step 4: Updating the Package in the Future
Whenever you update icons or add new suites:
```bash
# Bump the version (patch: 1.0.1, minor: 1.1.0, major: 2.0.0)
npm version patch

# Publish the new release
npm publish --access public
```

---
