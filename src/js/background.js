// Handle commands from manifest.json
chrome.commands.onCommand.addListener(function (command) {
    // Open extension popup on shortcut
    if (command === 'toggle-popup') {
        chrome.tabs.create({ url: "src/popup.html" });
    }
});
