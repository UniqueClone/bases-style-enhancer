# Contributing

Thanks for your interest in improving **Bases Style Enhancer**.

This plugin is intentionally simple: it ships a single `main.js` file plus `manifest.json`, optional `styles.css`, and documentation. There is no build step or `package.json`.

## Development

1. **Clone the repo**
    - Clone the repository into your Obsidian vault's `.obsidian/plugins` folder, for example:
        - `.obsidian/plugins/bases-style-enhancer`

2. **Enable the plugin in Obsidian**
    - In Obsidian, go to **Settings → Community plugins**.
    - Make sure community plugins are enabled, then enable **Bases Style Enhancer**.

3. **Edit the code**
    - Open `main.js` in your editor.
    - Make changes directly to the plugin code.

4. **Reload the plugin**
    - In Obsidian, use **Command Palette → Reload app without saving** or restart Obsidian.
    - Alternatively, disable and re-enable the plugin from **Community plugins**.

Because there is no bundling step, Obsidian loads `main.js` as-is.

## Testing changes

When you change the plugin:

- Open a **Bases** table view.
- Adjust the plugin's settings under **Settings → Community plugins → Bases Style Enhancer**.
- Confirm that:
    - Table cell text size updates immediately.
    - (If enabled) table headers follow the same size.

Use the demo Tasks/Bases view you prefer for visual checks and screenshots.

## Release process

Releases are created from Git tags and handled by GitHub Actions.

1. **Update version**
    - Bump the version number in `manifest.json`.
    - Update `versions.json` to include the new version and minimum Obsidian version if necessary.
    - Commit your changes.

2. **Create a tag**
    - From the plugin repository root, create and push a tag matching the `manifest.json` version, for example:
        - `git tag 1.0.0`
        - `git push origin 1.0.0`

3. **GitHub Actions release**
    - The workflow in `.github/workflows/release.yml` runs on tagged pushes.
    - It:
        - Checks out the repo.
        - Creates a **draft** GitHub release for the tag.
        - Attaches `main.js`, `manifest.json`, and `styles.css` (if present).

4. **Finalize the release**
    - On GitHub, edit the draft release:
        - Add release notes (changes, important notes, etc.).
        - Publish the release.

5. **Submit to Obsidian community plugins (when needed)**
    - Follow the Obsidian community plugin submission/update process, pointing to the new release/tag.

## Coding guidelines

- Keep the plugin small and focused on styling Bases tables.
- Prefer clear, straightforward JavaScript over complex abstractions.
- When adding settings:
    - Use existing patterns in `main.js` (numeric input, dropdown, toggle).
    - Make sure `saveSettings` is called so changes apply immediately.
- Keep comments brief and practical.
