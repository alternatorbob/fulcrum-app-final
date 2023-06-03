import * as faceapi from "face-api.js";
import {
    pushValues,
    distanceBetweenPoints,
    isInArray,
    removeFromArray,
    clearCanvas,
} from "./utils";
import { swapFace, detectionObjects } from "./faceDetectionSwap";

import { activeView } from "./ui";
import { updateView } from "../main";
// let pointIndexes = pushValues(17, 26).concat([
//     45, 64, 55, 56, 57, 58, 59, 60, 36, 17,
// ]);
let pointIndexes = pushValues(17, 26).concat([64, 55, 56, 57, 58, 59, 60, 17]);
let resultCanvas, detectionCanvas;

export function drawDetectionBoxes(objects) {
    objects.forEach((object) => {
        if (!object.isShowing.detection) return;

        let { _x, _y, _width, _height } = object.detectionBox;
        const ctx = detectionCanvas.getContext("2d");
        let img = new Image();

        img.onload = () => {
            ctx.drawImage(img, _x, _y, _width, _height);
        };
        img.src = "icons/fulcrum_frame.svg";
    });
}

export function drawResults(objects) {
    objects.forEach((object) => {
        if (!object.isShowing.result) return;

        const { _x, _y, _width, _height } = object.squareBox;
        const ctx = resultCanvas.getContext("2d");

        ctx.drawImage(object.result, _x, _y, _width, _height);
    });
}

export function wasDetectionClicked(e) {
    detectionObjects.forEach((object) => {
        const { _x, _y, _width, _height } = object.detectionBox;

        if (
            e.offsetX > _x &&
            e.offsetX < _x + _width &&
            e.offsetY > _y &&
            e.offsetY < _y + _height
        ) {
            object.isShowing.detection = !object.isShowing.detection;
            object.isShowing.result = !object.isShowing.result;
            console.log("TOUCH BOX");
            return true;
        } else {
            return false;
        }
    });
    updateCanvases(detectionObjects);
}

export function updateCanvases(detectionObjects) {
    clearCanvas([resultCanvas, detectionCanvas]);
    drawDetectionBoxes(detectionObjects);
    drawResults(detectionObjects);
}

export async function regenerateFace(object) {
    const { canvas, mask, myPrompt } = object;
    let swappedFace = await swapFace(canvas, mask, myPrompt).then(
        (swappedFace) => {
            object.result = swappedFace;
            updateCanvases();
        }
    );
}

export function createCanvasLayers(image, width, height) {
    const container = document.querySelector("#photo--input--container");

    resultCanvas = faceapi.createCanvasFromMedia(image);
    resultCanvas.classList.add("result-layer");
    resultCanvas.id = "result--canvas";
    const resCtx = resultCanvas.getContext("2d");
    resCtx.clearRect(0, 0, width, height);

    detectionCanvas = faceapi.createCanvasFromMedia(image);
    detectionCanvas.classList.add("result-layer");
    detectionCanvas.id = "detections--canvas";
    detectionCanvas.addEventListener("click", (e) => {
        wasDetectionClicked(e);
    });

    resultCanvas.width = width;
    resultCanvas.height = height;
    detectionCanvas.width = width;
    detectionCanvas.height = height;

    container.append(resultCanvas, detectionCanvas);

    return { detectionCanvas, resultCanvas };
}

export function adjustDetectionBoxes(box) {
    const scaleFactor = 1.5;
    let detectionBox = { ...box };
    let squareBox = { ...box };

    detectionBox._x -= detectionBox._width / (scaleFactor * 2.66);
    detectionBox._y -= (detectionBox._width / (scaleFactor * 2.66)) * 1.4;
    detectionBox._width *= scaleFactor;
    detectionBox._height *= scaleFactor;

    //squareBox
    squareBox._x -= squareBox._width / 3;
    squareBox._y -= squareBox._width / 4;

    squareBox._width > squareBox._height
        ? (squareBox._height = squareBox._width)
        : (squareBox._width = squareBox._height);

    squareBox._width *= 1.3;
    squareBox._height *= 1.3;

    return [detectionBox, squareBox];
}

function drawEllipse(ctx, x, y, width, height) {
    ctx.ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
}

export function createMaskCanvas(img, width, height, points, id) {
    const container = document.querySelector("#photo--input--container");
    const maskCanvas = document.createElement("canvas");
    maskCanvas.class = `mask--canvas`;
    maskCanvas.id = `mask--canvas--${id}`;
    maskCanvas.width = width;
    maskCanvas.height = height;
    maskCanvas.classList.add("hidden");

    const ctx = maskCanvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.fillRect(0, 0, width, height);
    drawMask(maskCanvas, points);

    container.append(maskCanvas);

    return maskCanvas;
}

export function drawMask(canvas, points) {
    const ctx = canvas.getContext("2d");
    // let pointIndexes = pushValues(17, 26).concat(pushValues(16, 0));

    const mouthWidth = distanceBetweenPoints(points[60], points[64]) * 0.9;
    const mouthHeight = mouthWidth * 0.5;

    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 20;
    ctx.save();
    ctx.moveTo(points[66]._x, points[66]._y);

    ctx.beginPath();
    drawEllipse(ctx, points[66]._x, points[66]._y, mouthWidth, mouthHeight);
    drawEllipse(
        ctx,
        points[38]._x,
        points[38]._y,
        mouthWidth * 0.7,
        mouthHeight
    );

    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    drawEllipse(
        ctx,
        points[43]._x,
        points[43]._y,
        mouthWidth * 0.7,
        mouthHeight
    );
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(points[17]._x, points[17]._y);
    pointIndexes.forEach((index) => {
        const { x, y } = points[index];
        ctx.lineTo(x, y);
    });

    ctx.closePath();
    ctx.fill();

    // ctx.ellipse(
    //     points[66]._x,
    //     points[66]._y,
    //     mouthWidth,
    //     mouthHeight,
    //     0,
    //     0,
    //     2 * Math.PI
    // );

    // ctx.ellipse(
    //     points[38]._x,
    //     points[38]._y,
    //     mouthWidth,
    //     mouthHeight,
    //     0,
    //     0,
    //     2 * Math.PI
    // );

    // ctx.stroke();
}

export function cropToSquare(canvas) {
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const size = Math.min(width, height);
}

export function invertColors(canvas) {
    const { width, height } = canvas;

    // Create a new canvas element
    const invertedCanvas = document.createElement("canvas");
    const invertedContext = invertedCanvas.getContext("2d");
    invertedCanvas.width = width;
    invertedCanvas.height = height;

    // Apply the 'invert' filter to invert the colors
    // invertedContext.filter = "invert(100%)";

    // Draw the original canvas onto the inverted canvas with the filter applied
    invertedContext.drawImage(canvas, 0, 0);

    // Add randomly sized and positioned semi-transparent blue rectangles
    const numRectangles = Math.floor(Math.random() * 15) + 5; // Random number of rectangles between 1 and 10
    const maxRectangleSize = 30; // Maximum size of each rectangle

    for (let i = 0; i < numRectangles; i++) {
        const rectangleSize = Math.floor(Math.random() * maxRectangleSize) + 1; // Random size between 1 and maxRectangleSize
        const x = Math.floor(Math.random() * (width - rectangleSize));
        const y = Math.floor(Math.random() * (height - rectangleSize));

        const red = Math.floor(Math.random() * 256); // Random red value between 0 and 255
        const green = Math.floor(Math.random() * 256); // Random green value between 0 and 255
        const blue = Math.floor(Math.random() * 256); // Random blue value between 0 and 255

        invertedContext.fillStyle = `rgba(${red}, ${green}, ${blue}, ${0.9}`; // Random semi-transparent blue color
        invertedContext.fillRect(x, y, rectangleSize, rectangleSize);
    }

    // Return the inverted canvas
    return invertedCanvas;
}
