import { attachListeners } from "./js/attachListeners";
import { activeView, EditMessage, moveCanvasLayers } from "./js/ui";
import {
    drawDetectionBoxes,
    drawResults,
    updateCanvases,
    wasDetectionClicked,
} from "./js/drawUtils";
import { clearCanvas } from "./js/utils";
// const editMessage = new EditMessage();
// editMessage.hide();

import { detectionObjects } from "./js/faceDetectionSwap";

export let activeState = "home";

export function switchState(activeState) {
    switch (activeState) {
        case "home":
            console.log(`Current View: ${activeState}`);
            //home
            const inputElement = document.querySelector("#camera-input");
            inputElement.addEventListener("change", async (event) => {
                // imageResult = await handleImageUpload(event);
                await onImageUpload(event);
            });
            
            break;
        case "detection":
            console.log(`Current View: ${activeState}`);
            
            break;
        case "result":
            console.log(`Current View: ${activeState}`);
            break;
        case "edit-select":
            console.log(`Current View: ${activeState}`);
            break;
        case "edit-face":
            console.log(`Current View: ${activeState}`);
            break;
        case "edit-prompt":
            console.log(`Current View: ${activeState}`);
            break;
    }
}

export function updateView(activeView) {
    // const { activeView, detectionObjects, canvases } = content;

    switch (activeView) {
        case "home":
            console.log(`Current View: ${activeView}`);
            break;

        case "result":
            // const { detectionCanvas, resultCanvas } = canvases;

            console.log(`Current View: ${activeView}`);
            moveCanvasLayers("result");

            // editMessage.hide();

            drawDetectionBoxes(detectionObjects);
            drawResults(detectionObjects);

            break;

        case "edit":
            console.log(`Current View: ${activeView}`);

            detectionObjects.forEach((object) => {
                object.isShowing.detection = false;
            });
            updateCanvases(detectionObjects);

            // editMessage.show();
            // detectionObjects.forEach((object) => {
            //     if (!object.isShowing.detection && !object.isShowing.result)
            //         return;

            //     drawResults(object);
            //     detCtx.clearRect(
            //         0,
            //         0,
            //         detectionCanvas.width,
            //         detectionCanvas.height
            //     );

            //     if (!object.isShowing.detection) {
            //         drawDetectionBoxes(object);
            //         object.isShowing.detection = true;
            //     }
            // });

            break;

        case "edit-prompt":
            console.log(`Current View: ${activeView}`);
            break;
    }
}

attachListeners();
