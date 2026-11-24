# Asset expansion

This import adds **11,335 image files**. The [catalog](index.tsv) lists every image across the repository by category, pack, name, variant, format, and path.

The [upstream coverage table](upstream-coverage.tsv) shows the audited paths filled by this import and those still missing.

| Collection | Asset category | Format | Added |
| --- | --- | --- | ---: |
| brands-and-apps | brands-and-logos | SVG | 707 |
| gaming | gaming | PNG | 3 |
| gaming | gaming | SVG | 393 |
| os-and-desktop | os-and-desktop | ICO | 1 |
| os-and-desktop | os-and-desktop | PNG | 48 |
| os-and-desktop | os-and-desktop | SVG | 178 |
| system-and-ui | system-and-ui | SVG | 9,547 |
| upstream-refresh | apps-and-dashboards | PNG | 4 |
| upstream-refresh | brands-and-logos | SVG | 14 |
| upstream-refresh | cloud-architecture | PNG | 23 |
| upstream-refresh | cloud-architecture | SVG | 23 |
| upstream-refresh | developer-tools | SVG | 265 |
| vendor-products | apps-and-dashboards | SVG | 2 |
| vendor-products | brands-and-logos | SVG | 94 |
| vendor-products | os-and-desktop | PNG | 33 |

## Finding and using assets

- `node bin/cli.js search wifi --category system --format svg` looks up app-ready symbols.
- `node bin/cli.js search bluetooth --category system --format svg` finds Bluetooth variants across packs.
- `node bin/cli.js search <name>` searches product and folder names and shows SVGs first among equally relevant results.
- `node bin/cli.js catalog` rebuilds the repository-wide index.

## Collection layout

| Directory | Contents |
| --- | --- |
| `brands-and-logos/google` and `brands-and-logos/microsoft` | Product marks. Check each pack's source and rights. |
| `brands-and-logos/vendor-packs` | Other vendor and product marks with pack provenance. |
| `os-and-desktop/apple` and `os-and-desktop/originals` | Native or publisher-sourced desktop marks where identified. |
| `os-and-desktop/themes` | Community theme glyphs. These are useful as alternate visuals. |
| `system-and-ui` | Generic interface symbol packs with their own licenses and styles. |
| `gaming` | Game-oriented controls, illustrations, and eligible title or launcher assets. |

## Source and coverage notes

Use each pack's source manifest and license to identify official originals, community variants, terms, and format. Trademark and vendor reuse conditions can apply separately from the license on the surrounding icon pack.
The Catalog includes existing entries under their original paths so applications that reference those paths keep working.
Coverage is bounded by the available, identifiable source collections. The package retains source-only references or unresolved entries where acquisition or rights verification is incomplete. No placeholder images count as completed downloads.
