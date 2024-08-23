importScripts('shared.js');

// TODO: Add a context menu to run scripts on a page

// Handle commands from manifest.json
chrome.commands.onCommand.addListener(function (command) {
    // Pin current tab on shortcut
    if (command === 'toggle-pin-current-tab') {
        toggleActiveTabPin();
    }

    if (command === 'mute-all-tabs') {
        muteAllTabs();
    }

    // TODO: Organize tabs in current window on shortcut
    // TODO: Should ungrouped tabs be moved to a default group? -- *helping to differentiate newly opened tabs from existing tabs*
    // Organize tabs in current window on shortcut
    if (command === 'organize-tabs') {
        organizeTabs();
    }
});

chrome.runtime.onStartup.addListener(() => {
    loadConfig();
});
