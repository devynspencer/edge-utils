importScripts('shared.js');

// Handle commands from manifest.json
chrome.commands.onCommand.addListener(function (command) {
    // Pin current tab on shortcut
    if (command === 'toggle-pin-current-tab') {
        toggleActiveTabPin();
    }

    if (command === 'mute-all-tabs') {
        muteAllTabs();
    }

    // Organize tabs in current window on shortcut
    if (command === 'organize-tabs') {
        organizeTabs();
    }
});
chrome.runtime.onStartup.addListener(() => {
});
