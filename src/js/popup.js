

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
                message: JSON.stringify(tabs)
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
                title: `Copying URL information for [${filtered.length}] filtered tabs...`,
                message: JSON.stringify(filtered)
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
            message: JSON.stringify(groupTabs)
        });
        copyToClipboard(urls);
    }));

document.getElementById("toggleActiveTabPin")
    .addEventListener("click", () => {
        toggleActiveTabPin();
    });
