import { getDetections } from "./faceDetection";
import { inPaint } from "./replicate";

export async function onImageUpload(e) {
    const canvases = document.querySelectorAll("#image--canvas");
    // const canvases = document.querySelectorAll(".result-canvas");
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = async () => {
            canvases.forEach(async (canvas) => {
                const ctx = canvas.getContext("2d");
                // canvas.width = img.width;
                // canvas.height = img.height;
                canvas.width = canvas.height = 512;
                ctx.save();
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            });
        };
        img.src = e.target.result;
    };
    if (file) {
        reader.readAsDataURL(file);

        let myPrompt = await getDetections(file);
        swapFace(myPrompt);
        console.log(myPrompt);
    }
}

async function swapFace(myPrompt) {
    const canvas = document.querySelector("#image--canvas");
    const canvas64 = canvas.toDataURL();

    const maskCanvas = document.querySelector("#mask--canvas");
    const mask64 = maskCanvas.toDataURL();

    // const loader = document.querySelector(".loader");
    //     e.preventDefault();
    //     // create formdata
    //     // canvas to file

    const output = await inPaint(canvas64, mask64, myPrompt, (value) => {
        console.log("progression:", value);
        // loader.classList.remove("hidden");
    }).then(window.scrollTo(0, document.body.scrollHeight));
    const img = new Image();
    img.src = output;

    // loader.classList.add("hidden");
    // loader.style.width = "0px";
    // loader.style.height = "0px";
    document.querySelector("#detections--canvas").classList.add("hidden");
    const container = document.querySelector("#photo--input--container");
    container.appendChild(img);
    // const detectionsCanvas = document.querySelector("#detections--canvas");
    // const ctx = detectionsCanvas.getContext("2d");
}
