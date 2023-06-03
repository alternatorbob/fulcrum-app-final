import { updateView } from "../main";
import { regenerateFace } from "./drawUtils";
import { onImageUpload } from "./handleImage";
import { activeView, switchView, moveCanvasLayers, EditMessage } from "./ui";

export function attachListeners() {
    //home
    const inputElement = document.querySelector("#camera-input");
    inputElement.addEventListener("change", async (event) => {
        // imageResult = await handleImageUpload(event);
        await onImageUpload(event);
    });

    //result
    const editButton = document.querySelector("#edit-button");
    const backButton = document.querySelector("#back-button");

    editButton.addEventListener("click", () => {
        switchView("result", "edit");
        moveCanvasLayers("edit");
    });

    backButton.addEventListener("click", () => {
        switchView("result", "home");
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
                    switchView("result", "home");
                    break;

                case "edit":
                    switchView("edit", "result");
                    moveCanvasLayers("result");
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
            console.log("done");
            console.log(activeView);
            switch (activeView) {
                case "result":
                    switchView("result", "home");
                    console.log("done result");
                    break;

                case "edit":
                    console.log("should switch to edit");
                    switchView("edit", "result");
                    moveCanvasLayers("result");

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
    const regenerateButton = document.querySelector("#regenerate-button");

    promptButton.addEventListener("click", async () => {
        popupContainer.classList.add("active");
        // activeView = "edit-prompt";
        switchView("edit-prompt");
        updateView();
    });

    // regenerateButton.addEventListener("click", () => {
    //     regenerateFace(activeObject);
    // });
}
