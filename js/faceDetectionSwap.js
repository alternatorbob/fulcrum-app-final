import * as faceapi from "face-api.js";
import { CircleAnimation, Loader, FaceBox, drawFaceBox } from "./ui";
import { createMaskCanvas, createDetectionsCanvas } from "./drawUtils";
import { cropCanvas } from "./utils";
import { inPaint } from "./replicate";
import { getPrompt } from "./getPrompt";

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
    let detectionObjects = [];
    let swappedFaces = [];

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

        // points.forEach((point) => {
        //     // console.log(point);
        //     const circleAnimation = new CircleAnimation(point._x, point._y);
        //     circleAnimation.startAnimation();
        // });

        //draws face boxes
        // faceapi.draw.drawDetections(detectionsCanvas, result);
        //draws face landmarks
        // faceapi.draw.drawFaceLandmarks(detectionsCanvas, result, {
        //     drawLines: true,
        // });

        const scaleFactor = 1.5;
        drawFaceBox(detectionsCanvas, box, scaleFactor);

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
        const { _x, _y, _width, _height } = object.box;
        const canvas = cropCanvas(image, _x, _y, _width, _height);
        object.mask = cropCanvas(object.mask, _x, _y, _width, _height);

        const promptDetails = { gender: object.gender, age: object.age };
        let myPrompt = getPrompt(promptDetails);

        let swappedFace = await swapFace(canvas, object.mask, myPrompt).then(
            (swappedFace) => {
                appendElem(swappedFace);
                // createCanvasFromImage(swappedFace);
            }
        );
    });
}

async function swapFace(canvas, mask, myPrompt) {
    const canvas64 = canvas.toDataURL();
    const mask64 = mask.toDataURL();

    // const output = await inPaint(canvas64, mask64, myPrompt, (value) => {
    //     const lines = value.split("\n").filter(Boolean);
    //     const lastLine = lines[lines.length - 1];
    //     let number = 0;
    //     if (lastLine) number = Number(lastLine.split("%")[0]);
    //     // console.log("number: ", number);
    //     console.log("value: ", value);
    // });

    const img = new Image();
    img.src = canvas;
    // img.src = output;

    return img;
}

function createCanvasFromImage(img) {
    const div = document.querySelector("#photo--input--container");

    if (div) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        // Set canvas dimensions to match image dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        context.drawImage(img, 0, 0);

        // Append the canvas to the div
        div.appendChild(canvas);
        console.error("Was appended");
    } else {
        console.error("Image or div element not found.");
    }
}

function drawSwappedFace(object) {
    const img = new Image();
    img.src = object.image;

    const { _x, _y, _width, _height } = object.box;
    const canvas = document.querySelector("#image--canvas");
    const ctx = canvas.getContext("2d");
    // ctx.drawImage(object.image, _x, _y, _width, _height);
    ctx.drawImage(object.image, 50, 50, 100, 100);
    ctx.save();
    ctx.lineWidth = "10";
    ctx.strokeStyle = "blue";
    // ctx.rect(50, 50, 150, 80);
    ctx.drawImage(img, _x, _y, _width, _height);
    // ctx.rect(_x, _y, _width, _height);
    ctx.restore();
}

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
