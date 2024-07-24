function toggleActiveTabPin() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const activeTab = tabs.find(tab => tab.active);

        // Assumes active tab by default
        chrome.tabs.update({ pinned: !activeTab.pinned });
    });
}

async function applyConfig(data) {
    console.log(`Applying configuration from data ${data}...`);

    await chrome.storage.sync.set({
        config: {
            rules: data.rules,
            settings: data.settings,
            tabs: data.tabs,
            tab_groups: data.tab_groups
        }
    });

    console.log("Configuration applied successfully!", data);
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

    return config;
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
