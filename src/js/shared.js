function toggleActiveTabPin() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const activeTab = tabs.find(tab => tab.active);

        // Assumes active tab by default
        chrome.tabs.update({ pinned: !activeTab.pinned });
    });
}

function validateConfig(config) {
    const requiredKeys = ["settings", "rules", "tabs", "tab_groups"];

    if (!config) {
        console.error("Invalid config file");
        return false;
    }

    for (const key of requiredKeys) {
        if (!config.hasOwnProperty(key)) {
            console.error(`Invalid config file: missing '${key}' key`);
            return false;
        }
    }

    return true;
}

