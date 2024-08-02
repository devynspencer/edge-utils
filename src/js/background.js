importScripts('shared.js');

// Handle commands from manifest.json
chrome.commands.onCommand.addListener(function (command) {
    // Pin current tab on shortcut
    if (command === 'toggle-pin-current-tab') {
        toggleActiveTabPin();
    }
});
