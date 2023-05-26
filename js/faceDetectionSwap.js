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

    const detections = await faceapi
        .detectAllFaces(image)
        .withFaceLandmarks()
        .withAgeAndGender();

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

    const canvasArray = detectionObjects.map((obj) => obj.box);
    const canvases = await faceapi.extractFaces(image, canvasArray);

    detectionObjects.forEach((o) => {
        console.log(o.box);
        console.log(o.mask);

        const canvas = cropCanvas(
            image,
            o.box._x,
            o.box._y,
            o.box._width,
            o.box._height
        );
        appendCanvas(canvas);
    });

    const croppedMasks = detectionObjects.map((obj) => obj.mask);

    // appendCanvas(canvases);
    // appendCanvas(croppedMasks);
    // const canvases = await faceapi.extractFaces(image, detectionObjects.box);

    return myPrompt;
}

function moveDetectionBox(box) {
    box._x -= box._width / 2;

    box._width > box._height
        ? (box._height = box._width)
        : (box._width = box._height);

    return box;
}

function appendCanvas(canvas) {
    const div = document.querySelector("#photo--input--container");
    canvas.style.width = "60px";
    div.appendChild(canvas);
}

export async function swapFace(myPrompt) {
    const loader = new Loader();
    const canvas = document.querySelector("#image--canvas");
    const canvas64 = canvas.toDataURL();

    const maskCanvas = document.querySelector(".mask--canvas");
    const mask64 = maskCanvas.toDataURL();

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
}
