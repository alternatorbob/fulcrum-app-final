import * as faceapi from "face-api.js";
import { CircleAnimation, Loader } from "./ui";
import {
    createMaskCanvas,
    createCanvasLayers,
    adjustDetectionBoxes,
    invertColors,
    updateResult,
} from "./drawUtils";
import { cropCanvas, appendElem } from "./utils";
import { inPaint } from "./replicate";
import { getPrompt } from "./getPrompt";

export let detectionObjects = [];

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
    const image = await faceapi.bufferToImage(img);
    const imageCanvas = document.querySelector("#image--canvas");
    const { width, height } = imageCanvas;
    const detectionsCanvas = createCanvasLayers(image, width, height);
    const displaySize = { width: width, height: height };
    
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

        //nose = 27-30-35

        const mask = createMaskCanvas(image, width, height, points, index);

        detectionObjects.push({
            image: cropCanvas(image, box._x, box._y, box._width, box._height),
            detectionBox: adjustDetectionBoxes(box)[0],
            squareBox: adjustDetectionBoxes(box)[1],
            mask: mask,
            points: points,
            gender: gender,
            age: age,
            isShowing: true,
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
        const { _x, _y, _width, _height } = object.squareBox;
        console.log(object.squareBox);
        updateResult();

        // console.log(object.image);
        // document
        //     .querySelector("#photo--input--container")
        //     .appendChild(object.image);

        const canvas = cropCanvas(image, _x, _y, _width, _height);
        object.mask = cropCanvas(object.mask, _x, _y, _width, _height);

        const promptDetails = { gender: object.gender, age: object.age };
        let myPrompt = getPrompt(promptDetails);

        let swappedFace = await swapFace(canvas, object.mask, myPrompt).then(
            (swappedFace) => {
                object.result = swappedFace;
                // appendElem(swappedFace);
                updateResult();
                // createCanvasFromImage(swappedFace);
            }
        );
    });
}

async function swapFace(canvas, mask, myPrompt) {
    const canvas64 = canvas.toDataURL();
    const mask64 = mask.toDataURL();

    const output = invertColors(canvas);

    // const output = await inPaint(canvas64, mask64, myPrompt, (value) => {
    //     const lines = value.split("\n").filter(Boolean);
    //     const lastLine = lines[lines.length - 1];
    //     let number = 0;
    //     if (lastLine) number = Number(lastLine.split("%")[0]);
    //     // console.log("number: ", number);
    //     console.log("value: ", value);
    // });

    const img = new Image();
    img.src = output;
    // img.src = canvas;

    return output;
}
