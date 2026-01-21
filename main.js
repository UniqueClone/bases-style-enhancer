// Simple plugin that tweaks font size for Bases table views.
const { Plugin, PluginSettingTab, Setting } = require("obsidian");

// Defaults for how table text should look when the plugin first loads.
const DEFAULT_SETTINGS = {
    tableFontSizeValue: 1.0,
    tableFontSizeUnit: "rem", // "rem" or "px"
    applyToHeaders: true,
};

class BasesTableFontSizePlugin extends Plugin {
    async onload() {
        // Load saved settings (if any) on top of the defaults.
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData(),
        );

        // Apply the initial CSS and register the settings tab.
        this.injectCss();
        this.addSettingTab(new BasesTableFontSizeSettingTab(this.app, this));
    }

    injectCss() {
        // Build the actual CSS size string (e.g. "1.0rem" or "16px").
        const size = `${this.settings.tableFontSizeValue}${this.settings.tableFontSizeUnit}`;
        // Optionally include table headers in the same selector.
        const headerSelector = this.settings.applyToHeaders
            ? ", .bases-thead"
            : "";

        const css = `
      body {
        --bases-table-text-size: ${size};
      }

      .bases-table-cell${headerSelector} {
        font-size: var(--bases-table-text-size) !important;
      }
    `;

        if (!this.styleEl) {
            // Create a single <style> tag that we update on each change.
            this.styleEl = document.createElement("style");
            this.styleEl.setAttribute("type", "text/css");
            document.head.appendChild(this.styleEl);
        }

        this.styleEl.textContent = css;
    }

    onunload() {
        // Clean up our injected <style> tag when the plugin is disabled.
        if (this.styleEl && this.styleEl.parentElement) {
            this.styleEl.parentElement.removeChild(this.styleEl);
            this.styleEl = null;
        }
    }

    async saveSettings() {
        // Persist settings and immediately re-apply CSS so changes are visible.
        await this.saveData(this.settings);
        this.injectCss();
    }
}

/**
 * Settings tab for configuring Bases table font size.
 */
class BasesTableFontSizeSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl("h2", { text: "Bases Table Font Size" });

        // Numeric value field (e.g. 1.0 or 16).
        new Setting(containerEl)
            .setName("Table font size value")
            .setDesc("Numeric size (e.g. 1.0 or 16)")
            .addText((text) =>
                text
                    .setPlaceholder("1.0")
                    .setValue(String(this.plugin.settings.tableFontSizeValue))
                    .onChange(async (value) => {
                        const num = parseFloat(value);
                        if (!isNaN(num) && num > 0) {
                            this.plugin.settings.tableFontSizeValue = num;
                            await this.plugin.saveSettings();
                        }
                    }),
            );

        // Unit selector (rem vs px).
        new Setting(containerEl)
            .setName("Units")
            .setDesc("CSS units for table text size")
            .addDropdown((drop) =>
                drop
                    .addOption("rem", "rem")
                    .addOption("px", "px")
                    .setValue(this.plugin.settings.tableFontSizeUnit)
                    .onChange(async (value) => {
                        this.plugin.settings.tableFontSizeUnit = value;
                        await this.plugin.saveSettings();
                    }),
            );

        // Toggle for whether header cells should match the body font size.
        new Setting(containerEl)
            .setName("Apply to table headers")
            .setDesc("If enabled, headings use the same font size as cells")
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.applyToHeaders)
                    .onChange(async (value) => {
                        this.plugin.settings.applyToHeaders = value;
                        await this.plugin.saveSettings();
                    }),
            );
    }
}

module.exports = BasesTableFontSizePlugin;
