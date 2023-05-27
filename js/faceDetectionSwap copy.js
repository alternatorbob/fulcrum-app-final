import * as faceapi from "face-api.js";
import { Loader } from "./ui";
import {
    drawMask,
    createMaskCanvas,
    createDetectionsCanvas,
} from "./drawUtils";
import { cropCanvas } from "./utils";
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
    let detectionObjects = [];

    const image = await faceapi.bufferToImage(img);
    const detectionsCanvas = createDetectionsCanvas(image);
    const displaySize = { width: image.width, height: image.height };
    faceapi.matchDimensions(detectionsCanvas, displaySize);

    let detections = await faceapi
        .detectAllFaces(image)
        .withFaceLandmarks()
        .withAgeAndGender();

    detections = detections.filter(({ detection }) => {
        return detection._score > 0.6;
    });

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    resizedDetections.forEach(async (result, index) => {
        const { gender, age } = result;
        let box = result.detection.box;
        const points = result.landmarks.positions;

        //draws face boxes
        faceapi.draw.drawDetections(detectionsCanvas, result);
        //draws face landmarks
        // faceapi.draw.drawFaceLandmarks(detectionsCanvas, result, {
        //     drawLines: false,
        // });
        //nose = 27-30-35

        const mask = createMaskCanvas(image, points, index);
        box = moveDetectionBox(box);

        detectionObjects.push({
            image: cropCanvas(image, box._x, box._y, box._width, box._height),
            box: box,
            mask: mask,
            points: points,
            gender: gender,
            age: age,
        });

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
    });

    detectionObjects.forEach(async (object) => {
        object.mask = cropCanvas(
            object.mask,
            object.box._x,
            object.box._y,
            object.box._width,
            object.box._height
        );

        const canvas = cropCanvas(
            image,
            object.box._x,
            object.box._y,
            object.box._width,
            object.box._height
        );

        // appendElem(object.mask);
        // appendElem(canvas);

        SwapFace(canvas, object.mask);
    });
}

async function SwapFace(canvas, mask) {
    const canvas64 = canvas.toDataURL();
    const mask64 = mask.toDataURL();
    const output = await inPaint(canvas64, mask64, "a man's face", (value) => {
        const lines = value.split("\n").filter(Boolean);
        const lastLine = lines[lines.length - 1];

        let number = 0;

        if (lastLine) number = Number(lastLine.split("%")[0]);

        // console.log(number);
        console.log(value);
    });

    const img = new Image();
    img.src = output;
    appendElem(img);
}

// export async function swapFace(myPrompt) {
//     const loader = new Loader();
//     const canvas = document.querySelector("#image--canvas");
//     const canvas64 = canvas.toDataURL();

//     const maskCanvas = document.querySelector(".mask--canvas");
//     const mask64 = maskCanvas.toDataURL();

//     const output = await inPaint(canvas64, mask64, myPrompt, (value) => {
//         console.log("progression:", value);

//         loader.show();
//     }).then(window.scrollTo(0, document.body.scrollHeight));
//     const img = new Image();
//     img.src = output;
//     loader.hide();

//     document.querySelector("#detections--canvas").classList.add("hidden");
//     const container = document.querySelector("#photo--input--container");
//     container.appendChild(img);
// }

function moveDetectionBox(box) {
    box._x -= box._width / 2;

    box._width > box._height
        ? (box._height = box._width)
        : (box._width = box._height);

    return box;
}

function appendElem(elem) {
    const div = document.querySelector("#photo--input--container");
    elem.style.width = "60px";
    div.appendChild(elem);
}
