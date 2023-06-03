import * as faceapi from "face-api.js";
import { getDetections } from "./faceDetectionSwap";
import { Loader, switchView } from "./ui";
import { createCanvasLayers } from "./drawUtils";
import { updateView } from "../main";

export async function onImageUpload(e) {
    const canvas = document.querySelector("#image--canvas");

    const file = e.target.files[0];
    const reader = new FileReader();
    const loader = new Loader();
    loader.show();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = async () => {
            const ctx = canvas.getContext("2d");
            const aspectRatio = img.width / img.height;

            // canvas.width = window.innerWidth;
            // canvas.height = canvas.width / aspectRatio;
            img.width = canvas.width = window.innerWidth;
            img.height = canvas.height = canvas.width / aspectRatio;
            ctx.save();
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            loader.hide();
        };
        img.src = e.target.result;
    };
    if (file) {
        reader.readAsDataURL(file);
        const image = await faceapi.bufferToImage(file);
        const { width, height } = canvas;

        const canvases = createCanvasLayers(image, width, height);
        await getDetections(image, canvases.detectionCanvas).then(
            (detectionObjects) => {
                // const content = {
                //     activeView: "result",
                //     detectionObjects: detectionObjects,
                //     canvases: canvases,
                //     event: null,
                // };
                switchView("home", "result");
            }
        );
    }
}
