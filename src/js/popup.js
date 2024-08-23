

// TODO: Retrieve the stored filter type from chrome storage
document.getElementById("filterType")
    .addEventListener("change", async (event) => {
        const filterType = event.target.value;
        const filterText = document.getElementById("tabFilter");
        let placeholder = "";
        const currentTab = await chrome.tabs.query({ active: true, currentWindow: true });
        const domain = new URL(currentTab[0].url).hostname;

        switch (filterType) {
            case "Wildcard": {
                placeholder = `*.${domain}`;
                break;
            }

            case "Regex": {
                placeholder = `^\\w+\\.${domain}`;
                break;
            }

            case "Domain": {
                placeholder = `${domain}`;
                break;
            }

            // TODO: Unsure if default value is necessary and/or helpful
        }

        // Apply the placeholder text based on the selected filter type
        filterText.value = placeholder;

        // Store selected filter type for quick reuse
        chrome.storage.sync.set({ filterType: document.getElementById("filterType").value });
    });

// Fix: disabled checkboxes not appearing enabled
document.getElementById("exportFormat")
    .addEventListener("change", (event) => {
        const exportFormat = event.target.value;
        const titleCheckbox = document.getElementById("includeTitle");
        const urlCheckbox = document.getElementById("includeUrl");
        const timestampCheckbox = document.getElementById("includeTimestamp");

        switch (exportFormat) {
            case "MarkdownTable":
            case "XML":
            case "CSV":
            case "YAML":
            case "JSON": {
                titleCheckbox.parentElement.disabled = false;
                titleCheckbox.disabled = false;
                urlCheckbox.parentElement.disabled = false;
                urlCheckbox.disabled = false;
                timestampCheckbox.parentElement.disabled = false;
                timestampCheckbox.disabled = false;

                break;
            }

            case "CSV": {
                titleCheckbox.parentElement.disabled = false;
                titleCheckbox.disabled = false;
                urlCheckbox.parentElement.disabled = false;
                urlCheckbox.disabled = false;
                timestampCheckbox.parentElement.disabled = false;
                timestampCheckbox.disabled = false;
                break;
            }

            default: {
                titleCheckbox.parentElement.disabled = true;
                titleCheckbox.disabled = true;
                urlCheckbox.parentElement.disabled = true;
                urlCheckbox.disabled = true;
                timestampCheckbox.parentElement.disabled = true;
                timestampCheckbox.disabled = true;
            }
        }

        chrome.storage.sync.set({ exportFormat: event.target.value });
    });

document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the stored filter type from chrome storage
    chrome.storage.sync.get("filterType", data => {
        document.getElementById("filterType").value = data.filterType || "Wildcard";
    });

    // TODO: Should these use local storage?
    chrome.storage.sync.get("exportFormat", data => {
        document.getElementById("exportFormat").value = data.exportFormat || "JSON";
    });
});

function copyToClipboard(text) {
    // TODO: Why not just copy directly to the clipboard
    const textarea = document.createElement("textarea");

    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}

document.getElementById("muteTabs")
    .addEventListener("click", async () => {
        // TODO: Probably should replace function calls with message passing? Probably?
        muteTabs();
    });

document.getElementById("organizeTabs")
    .addEventListener("click", () => {
        organizeTabs();
    });

document.getElementById("copyTabs")
    .addEventListener("click", () => {
        chrome.tabs.query({}, tabs => {
            const urls = tabs.map(tab => tab.url).join("\n");

            showNotification({
                title: `Copying URL information for [${tabs.length}] tabs...`,
                message: tabs.slice(0, 10).map(tab => tab.url.slice(0, 75)).join("...<br/>")
            });
            copyToClipboard(urls);
        });
    });

document.getElementById("copyFilteredTabs")
    .addEventListener("click", () => {
        let filter = document.getElementById("tabFilter").value.trim();

        if (!filter) {
            showNotification({ title: "Enter a keyword/domain to filter on." });
            return;
        }

        chrome.tabs.query({}, tabs => {
            const filtered = tabs.filter(tab => tab.url.includes(filter));
            const urls = filtered.map(tab => tab.url).join("\n");

            showNotification({
                title: `Copied info for [${filtered.length}] tabs matching [${filter}]...`,
                message: filtered.slice(0, 10).map(tab => tab.url.slice(0, 75)).join("...<br/>")
            });
            copyToClipboard(urls);
        });
    });

document.getElementById("copyTabsFromGroup")
    .addEventListener("click", () => chrome.tabs.query({ currentWindow: true }, tabs => {
        const activeTab = tabs.find(tab => tab.active);

        if (activeTab.groupId === -1) {
            showNotification({ title: "No tab group found for active tab." });
            return;
        }

        const groupTabs = tabs.filter(tab => tab.groupId === activeTab.groupId);
        const urls = groupTabs.map(tab => tab.url).join("\n");

        showNotification({
            title: `Copying [${groupTabs.length}] tabs in group [${activeTab.groupId}]...`,
            message: groupTabs.map(tab => tab.url.slice(0, 75)).join("...<br/>")
        });
        copyToClipboard(urls);
    }));

document.getElementById("copySelectedTabs")
    .addEventListener("click", async () => {
        const selected = await chrome.tabs.query({
            currentWindow: true,
            highlighted: true
        });

        // TODO: Maybe add the newline in the copyToClipboard function so the message body can be trimmed easier
        const urls = selected.map(tab => tab.url).join("\n");

        showNotification({
            title: `Copied [${selected.length}] tabs to clipboard...`,
            // TODO: Move magic numbers like 75 to a constant, i.e. NOTIFICATION_LINE_LENGTH
            // TODO: Move magic numbers like 25 to a constant, i.e. NOTIFICATION_MESSAGE_LENGTH
            message: selected.slice(0, 10).map(tab => tab.url.slice(0, 75)).join("...<br/>")
        });
        copyToClipboard(urls);
    });

document.getElementById("toggleActiveTabPin")
    .addEventListener("click", () => {
        toggleActiveTabPin();
    });
