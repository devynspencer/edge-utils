function updateNotificationMessage(message) {
    const messageElement = document.getElementById("message");

    messageElement.textContent = message;
}

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
document.getElementById("toggleActiveTabPin")
    .addEventListener("click", () => {
        updateNotificationMessage("Pinning active tab ...");
        toggleActiveTabPin();
    });
