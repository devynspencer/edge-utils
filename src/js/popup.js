function updateNotificationMessage(message) {
    const messageElement = document.getElementById("message");

    messageElement.textContent = message;
}

document.getElementById("pinActiveTab")
    .addEventListener("click", () => {
        updateNotificationMessage("Pinning active tab ...");
        toggleActiveTabPin();
    });
