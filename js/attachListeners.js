import { handleViewChange } from "../main";
import { onImageUpload } from "./handleImage";
export let imageResult,
    activeView = "home";

export function attachListeners() {
    //home
    const inputElement = document.querySelector("#camera-input");
    inputElement.addEventListener("change", async (event) => {
        // imageResult = await handleImageUpload(event);
        await onImageUpload(event);
        switchView("result");
    });

    //result
    const editButton = document.querySelector("#edit-button");
    const backButton = document.querySelector("#back-button");

    editButton.addEventListener("click", () => {
        switchView("edit");
    });

    backButton.addEventListener("click", () => {
        switchView("home");
    });

    const downloadButton = document.querySelector("#download-button");
    downloadButton.addEventListener("click", () => {
        switchView("home");
    });

    const cancelButtons = document.querySelectorAll(".cancel-button");
    cancelButtons.forEach((button) => {
        button.addEventListener("click", () => {
            switch (activeView) {
                case "result":
                    switchView("home");
                    break;

                case "edit":
                    switchView("result");
                    break;
                case "edit-prompt":
                    switchView("edit");
                    break;
            }
        });
    });
    const doneButtons = document.querySelectorAll(".done-button");
    doneButtons.forEach((button) => {
        button.addEventListener("click", () => {
            switch (activeView) {
                case "result":
                    switchView("home");
                    break;

                case "edit":
                    switchView("result");
                    break;

                case "edit-prompt":
                    switchView("edit");
                    break;
            }
        });
    });

    //edit
    const popupContainer = document.querySelector(".popup-container");
    const promptButton = document.querySelector("#prompt-button");

    promptButton.addEventListener("click", async () => {
        popupContainer.classList.add("active");
        activeView = "edit-prompt";
        await handleViewChange();
    });
}

export function switchView(destination) {
    if (activeView == "edit-prompt") {
        document.querySelector(".popup-container").classList.remove("active");
    } else {
        let viewSelector = document.querySelector(`.${activeView}`);

        viewSelector.classList.add("hidden");

        viewSelector = document.querySelector(`.${destination}`);
        viewSelector.classList.remove("hidden");
    }

    activeView = destination;
    handleViewChange();
}
