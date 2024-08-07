document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
        $el.classList.add('is-active');
    }

    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            closeAllModals();
        }
    });
});

document.getElementById("validateConfig")
    .addEventListener("click", handleValidateConfig);

document.getElementById("applyConfig")
    .addEventListener("click", handleApplyConfig);

document.getElementById("showConfig")
    .addEventListener("click", handleShowConfig);

const fileInput = document.querySelector("#config-file-input-field input[type=file]");
fileInput.onchange = () => {
    if (fileInput.files.length > 0) {
        const fileName = document.querySelector("#config-file-input-field .file-name");
        fileName.textContent = fileInput.files[0].name;
    }
};

function handleValidateConfig() {
    let content = {};
    const fileInput = document.getElementById("inputConfigFile");

    if (fileInput.files.length > 0) {
        const reader = new FileReader();

        reader.readAsText(fileInput.files[0]);
        reader.onloadend = () => {
            try {
                content = JSON.parse(reader.result);
            }

            catch (error) {
                console.error("Error reading file: ", error);
            }
        };
    }
}


function handleApplyConfig() {
    let content = {};
    const fileInput = document.getElementById("inputConfigFile");

    if (fileInput.files.length > 0) {
        const reader = new FileReader();

        reader.readAsText(fileInput.files[0]);
        reader.onloadend = () => {
            try {
                content = JSON.parse(reader.result);

                validateConfig(content);
                applyConfig(content);
            }

            catch (error) {
                console.error("Error reading file: ", error);
            }
        };
    }
}

async function handleShowConfig() {
    const modalBody = document.querySelector("#configPreviewModal > div.modal-content > div > p");
    const config = await loadConfig();
    const content = syntaxHighlight(JSON.stringify(config, undefined, 2));
    modalBody.textContent = "";
    modalBody.appendChild(document.createElement('pre')).innerHTML = content;
}

function getConfigInput(event) {
    const reader = new FileReader();

    if (event.target.files.length > 0) {

        reader.readAsText(event.target.files[0]);
        reader.onloadend = function () {
            try {
                const content = JSON.parse(reader.result);

                validateConfig(content);

                // TODO: Open modal with preview (and options to apply config or cancel)
            }

            catch (error) {
                console.error("Error reading file: ", error);
            }
        };
    }
}
