document.getElementById("inputConfigFile")
    .addEventListener("change", getConfigInput);

function handleApplyConfig() {
    console.log("Applying configuration...");

    let content = {};
    const fileInput = document.getElementById("inputConfigFile");

    if (fileInput.files.length > 0) {
        const reader = new FileReader();

        console.log(`Loading config from file '${fileInput.files[0].name}'...`);

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
    console.log("Showing current configuration...");
    const loadedConfig = await loadConfig();
    console.log(`handleShowConfig: ${JSON.stringify(loadedConfig)}`);
}

function getConfigInput(event) {
    const reader = new FileReader();

    if (event.target.files.length > 0) {
        console.log(`Loading config from file '${event.target.files[0].name}'...`);

        reader.readAsText(event.target.files[0]);
        reader.onloadend = function () {
            try {
                const content = JSON.parse(reader.result);

                validateConfig(content);

                // TODO: Open modal with preview (and options to apply config or cancel)

                console.log(content);
            }

            catch (error) {
                console.error("Error reading file: ", error);
            }
        };
    }
}
