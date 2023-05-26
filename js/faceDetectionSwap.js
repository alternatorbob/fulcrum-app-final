import * as faceapi from "face-api.js";
import { Loader } from "./ui";
import {
    drawMask,
    createMaskCanvas,
    createDetectionsCanvas,
} from "./drawUtils";

import { inPaint } from "./replicate";

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
    faceapi.nets.ageGenderNet.loadFromUri("/models"),
]).then(start);

function start() {
    console.log("models were loaded");
}

export async function getDetections(img) {
    let myPrompt;
    const image = await faceapi.bufferToImage(img);
    const detectionsCanvas = createDetectionsCanvas(image);
    const displaySize = { width: image.width, height: image.height };
    faceapi.matchDimensions(detectionsCanvas, displaySize);

    const detections = await faceapi
        .detectAllFaces(image)
        .withFaceLandmarks()
        .withAgeAndGender();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    resizedDetections.forEach((result) => {
        const { age, gender } = result;
        const box = result.detection.box;

        const drawBox = new faceapi.draw.DrawBox(box, {
            label: `${gender}, ${Math.round(age, 0)} years`,
        });

        faceapi.draw.drawFaceLandmarks(detectionsCanvas, result, {
            drawLines: true,
        });

        //nose = 27-30-35
        const points = result.landmarks.positions;
        //create array in which you push each drawbox
        const drawBoxes = [];
        drawBoxes.push(drawBox);

        /*
        //brow left
        //brow left
        highlightPoints(detectionsCanvas, points[17]);
        highlightPoints(detectionsCanvas, points[21]);

        //brow right
        highlightPoints(detectionsCanvas, points[22]);
        highlightPoints(detectionsCanvas, points[26]);

        //nose top
        highlightPoints(detectionsCanvas, points[27]);
        // highlightPoints(detectionsCanvas, points[35]);

        //left eye outer
        highlightPoints(detectionsCanvas, points[36]);
        //left eye center
        highlightPoints(detectionsCanvas, points[38]);
        
        //righ eye outer
        highlightPoints(detectionsCanvas, points[45]);
        //righ eye middle
        highlightPoints(detectionsCanvas, points[44]);

        //mouth left
        highlightPoints(detectionsCanvas, points[60]);
        //mouth right
        highlightPoints(detectionsCanvas, points[64]);
        //mout middle middle
        highlightPoints(detectionsCanvas, points[66]);
        //mouth middle bottom
        highlightPoints(detectionsCanvas, points[57]);
        */

        drawMask(detectionsCanvas, points);
        createMaskCanvas(image, points);

        myPrompt =
            gender === "male"
                ? `A photorealistic man's portrait, he`
                : `A photorealistic woman's portrait, she`;

        myPrompt += `is around ${Math.round(
            age
        )} of age, <1>, looking at the camera, (((masterpiece))), (((bestquality))), ((ultra-detailed)), (beautifuldetailedeyes), (detailedlight), 
        RAW photo, 8k, uhd, dslr, 
        ::Shot on a Canon EOS 5D Mark IV with a 200mm f/1.4L IS USM lens, 
        capturing rich tonality, exceptional sharpness, 
        ::1 High-resolution ::Wallpaper ratio, high-resolution, 
        --ar 16:9 --q 5 --v 5 --s 750`;

        // A photorealistic portrait of  woman

        // myPrompt = gender === "male" ? `A man's face` : `A woman's face`;
    });

    return myPrompt;
}

export async function swapFace(myPrompt) {
    const loader = new Loader();
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

        loader.show();
    }).then(window.scrollTo(0, document.body.scrollHeight));
    const img = new Image();
    img.src = output;
    loader.hide();

    document.querySelector("#detections--canvas").classList.add("hidden");
    const container = document.querySelector("#photo--input--container");
    container.appendChild(img);
    // const detectionsCanvas = document.querySelector("#detections--canvas");
    // const ctx = detectionsCanvas.getContext("2d");
}
