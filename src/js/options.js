document.getElementById("inputConfigFile")
    .addEventListener("change", getConfigInput);

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
