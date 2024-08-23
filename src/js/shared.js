// TODO: Use different icons for different types of notifications (and make em cute)
// TODO: Format message based on type (debug vs info vs error etc.)
// TODO: Set priority based on message type (error, warning, info etc.)
// TODO: This should porobvably accept an options object instead of multiple parameters (if only to clearly identify what random text is the message body vs title etc)
// TODO: Capture calling function name and line number for debugging purposes
// TODO: Debounce multiple notifications into a single one
function showNotification(options = {}) {
    const extensionInfo = chrome.runtime.getManifest();
    const element = document.getElementById("notificationText");
    const title = options.title || `${extensionInfo.name} v${extensionInfo.version}`;

    // TODO: Add a close button to the notification
    // TODO: Only add message paragraph if a message is provided

    // TODO: Purge this heresy
    if (options.message) {
        element.innerHTML = `<div class="notification"><h6>${title}</h6><p>${options.message}</p></div>`;
    }

    else {
        element.innerHTML = `<div class="notification"><h6>${title}</h6></div>`;
    }
}

function toggleActiveTabPin() {
    // TODO: Refactor this into a promise-based function
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const activeTab = tabs.find(tab => tab.active);

        showNotification({
            title: `Toggling pin for tab ${activeTab.id}...`
        });

        // Assumes active tab by default
        chrome.tabs.update({ pinned: !activeTab.pinned });
    });
}

// TODO: Add function to toggle collapse/expand on all tab groups
// TODO: Add function to sort tab groups by name
// TODO: Add function to export current tab groups to a config file
// FIX: Existing tabs sometimes show as blank (cleared by collapse/expand on group)

async function organizeTabs() {
    const currentConfig = (await loadConfig()).config;
    const tabs = await chrome.tabs.query({ currentWindow: true });

    showNotification({
        title: `Organizing [${tabs.length}] tabs...`
    });

    currentConfig?.tab_groups.forEach(group => {
        // TODO: Add any missing groups from config

        // Find tabs that belong to the group
        const groupTabs = tabs.filter(tab => {
            return group.tabs.some(url => {
                const tabUrl = tab.url.replace(/^https?:\/\/(?:www\.)?/, '');
                const configUrl = url.replace(/^https?:\/\/(?:www\.)?/, '');

                const result = { tab: tabUrl, config: configUrl, startsWith: tabUrl.startsWith(configUrl) };

                if (tabUrl.startsWith(configUrl)) {
                    console.log(`Matching tab found: ${JSON.stringify(result)} `);
                }

                return tabUrl.startsWith(configUrl);
            });
        });

        // TODO: Handle groups with identical names
        // TODO: Ensure group doesn't already exist so we're not creating a new one

        // Move tabs to the group
        if (groupTabs.length > 0) {
            const color = group.color.toLowerCase() || "grey";
            const collapse = group.collapse || false;

            chrome.tabs.group({ tabIds: groupTabs.map(tab => tab.id) }, groupId => {
                // Update group properties to match configuration
                chrome.tabGroups.update(groupId, { color: color, title: group.name, collapsed: collapse });

                // Order tabs based on how they appear in the configuration file
                chrome.tabGroups.move(groupId, { index: -1 });
            });
        }
    });

    // Get remaining tabs that don't belong to any group
    const remainingTabs = await chrome.tabs.query({ groupId: -1 });

    // Move remaining tabs below the last group
    chrome.tabs.move(remainingTabs.map(tab => tab.id), { index: -1 });
}

async function applyConfig(data) {
    await chrome.storage.sync.set({
        // TODO: Remove settings key, and move settings to the root level of the config object
        // CRITICAL: Remove unnecessary config key around data, i.e. keep { rules, settings: {}, tabs: [], tab_groups: [] }
        config: {
            rules: data.rules || [],
            settings: data.settings || {},
            tabs: data.tabs || [],
            tab_groups: data.tab_groups || []
        }
    });

    showNotification({
        title: "Configuration applied successfully.",
        message: JSON.stringify(config, null, 2)
    });
}

function setDefaultConfigValues(config) {
    const defaultConfig = {
        rules: [],
        settings: {},
        tabs: [],
        tab_groups: []
    };

    return Object.assign({}, defaultConfig, config);
}

// TODO: Ensure all groups in config have unique titles
// TODO: Ensure multiple groups do not contain a tab with the same URL (otherwise how would it know where to place the tab)
function validateConfig(data) {
    const requiredKeys = ["settings", "rules", "tabs", "tab_groups"];

    if (!data) {
        console.error(`Invalid configuration file`);
        return false;
    }

    for (const key of requiredKeys) {
        if (!data.hasOwnProperty(key)) {
            console.error(`Invalid config file: missing '${key}' key`);
            return false;
        }
    }

    return true;
}

// TODO: Consider separate configs for layout, settings, features etc.
// TODO: Document configuration options
// TODO: Add diagram for configuration structure, and how it is applied
// Apply local configuration from browser storage
async function loadConfig() {
    const config = await chrome.storage.sync.get("config");

    return config || setDefaultConfigValues();
}

// https://stackoverflow.com/questions/4810841/pretty-print-json-using-javascript
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

async function muteTabs() {
    const audibleTabs = await chrome.tabs.query({ audible: true });

    if (audibleTabs.length === 0) {
        showNotification({ title: "No tabs to mute." });
        return;
    }

    showNotification({
        title: `Muting[${audibleTabs.length}] tabs...`,
        message: audibleTabs.map(tab => tab.url.slice(0, 50)).join("...\n")
    });

    audibleTabs.forEach(tab => chrome.tabs.update(tab.id, { muted: true }));
}
