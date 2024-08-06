function toggleActiveTabPin() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const activeTab = tabs.find(tab => tab.active);

        // Assumes active tab by default
        chrome.tabs.update({ pinned: !activeTab.pinned });
    });
}


async function organizeTabs() {
    const currentConfig = (await loadConfig()).config;
    const tabs = await chrome.tabs.query({ currentWindow: true });

    currentConfig?.tab_groups.forEach(group => {
        // Add any missing groups from config
        // Find tabs that belong to the group
        const groupTabs = tabs.filter(tab => {
            return group.tabs.some(url => {
                const tabUrl = tab.url.replace(/^https?:\/\/(?:www\.)?/, '');
                const configUrl = url.replace(/^https?:\/\/(?:www\.)?/, '');

                if (tabUrl.startsWith(configUrl)) {
                    console.log({ tab: tabUrl, config: configUrl, startsWith: tabUrl.startsWith(configUrl) });
                }

                else {
                    console.warn({ tab: tabUrl, config: configUrl, startsWith: tabUrl.startsWith(configUrl) });
                }

                return tabUrl.startsWith(configUrl);
            });
        });

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
    console.log(`Applying configuration from data ${data}...`);

    await chrome.storage.sync.set({
        config: {
            rules: data.rules || [],
            settings: data.settings || {},
            tabs: data.tabs || [],
            tab_groups: data.tab_groups || []
        }
    });

    console.log("Configuration applied successfully!", data);
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

async function loadConfig() {
    console.log("Loading configuration...");

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
