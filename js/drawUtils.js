import * as faceapi from "face-api.js";
import { pushValues, distanceBetweenPoints } from "./utils";
import { detectionObjects } from "./faceDetectionSwap";
// let pointIndexes = pushValues(17, 26).concat([
//     45, 64, 55, 56, 57, 58, 59, 60, 36, 17,
// ]);
let pointIndexes = pushValues(17, 26).concat([64, 55, 56, 57, 58, 59, 60, 17]);
let resultCanvas, detectionsCanvas;

export function updateResult(clear = false) {
    const resCtx = resultCanvas.getContext("2d");
    resCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);

    const detCtx = detectionsCanvas.getContext("2d");
    detCtx.clearRect(0, 0, detectionsCanvas.width, detectionsCanvas.height);

    if (!clear) {
        detectionObjects.forEach((object) => {
            if (object.isShowing) {
                drawDetectionBox(object);
                if (object.result !== undefined) drawResult(object);
            }
        });
    }
}

function drawDetectionBox(object) {
    let { _x, _y, _width, _height } = object.detectionBox;
    const ctx = detectionsCanvas.getContext("2d");

    let img = new Image();

    img.onload = () => {
        ctx.drawImage(img, _x, _y, _width, _height);
    };

    img.src = "icons/fulcrum_frame.svg";
}

export function drawResult(object) {
    const { _x, _y, _width, _height } = object.squareBox;
    const ctx = resultCanvas.getContext("2d");

    ctx.drawImage(object.result, _x, _y, _width, _height);
}

function wasDetectionClicked(e) {
    if (detectionObjects !== undefined && detectionObjects.length > 0) {
        console.log(e.offsetX, e.offsetY);
        detectionObjects.forEach((object) => {
            const { _x, _y, _width, _height } = object.detectionBox;
            console.log(_x, _y);
            if (
                e.offsetX > _x &&
                e.offsetX < _x + _width &&
                e.offsetY > _y &&
                e.offsetY < _y + _height
            ) {
                object.isShowing = !object.isShowing;
                console.log("TOUCH BOX");
                updateResult();
                return true;
            } else {
                return false;
            }
        });
    }
}

export function createCanvasLayers(image) {
    const container = document.querySelector("#photo--input--container");

    resultCanvas = faceapi.createCanvasFromMedia(image);
    resultCanvas.classList.add("result-layer");
    resultCanvas.id = "result--canvas";
    const resCtx = resultCanvas.getContext("2d");
    resCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);

    detectionsCanvas = faceapi.createCanvasFromMedia(image);
    detectionsCanvas.id = "detections--canvas";
    detectionsCanvas.classList.add("result-layer");
    detectionsCanvas.addEventListener("click", (e) => wasDetectionClicked(e));

    container.append(resultCanvas, detectionsCanvas);

    return detectionsCanvas;
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

export function createMaskCanvas(img, points, id) {
    const container = document.querySelector("#photo--input--container");
    const maskCanvas = document.createElement("canvas");
    maskCanvas.class = `mask--canvas`;
    maskCanvas.id = `mask--canvas--${id}`;
    maskCanvas.width = img.width;
    maskCanvas.height = img.height;
    maskCanvas.classList.add("hidden");

    const ctx = maskCanvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
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
    invertedCanvas.width = width;
    invertedCanvas.height = height;
    const invertedContext = invertedCanvas.getContext("2d");

    // Apply the 'invert' filter to invert the colors
    invertedContext.filter = "blur(20px)";
    // invertedContext.filter = "grayscale(70%)";
    // invertedContext.filter = "invert(100%)";

    // Draw the original canvas onto the inverted canvas with the filter applied
    invertedContext.drawImage(canvas, 0, 0);

    // Return the inverted canvas
    return invertedCanvas;
}
