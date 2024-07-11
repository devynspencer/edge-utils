importScripts('shared.js');

// Handle commands from manifest.json
chrome.commands.onCommand.addListener(function (command) {
    // Open extension popup on shortcut
    if (command === 'toggle-popup-display') {
        chrome.tabs.create({ url: "src/popup.html" });
    }

    // Pin current tab on shortcut
    if (command === 'toggle-pin-current-tab') {
        toggleActiveTabPin();
    }
});
