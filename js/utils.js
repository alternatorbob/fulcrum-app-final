export function cropCanvas(sourceCanvas, x, y, width, height) {
    const croppedCanvas = document.createElement("canvas");
    // Calculate the new width and height to ensure they are multiples of 8
    const newWidth = 512;
    const newHeight = 512;
    // const newWidth = Math.ceil(width / 8) * 8;
    // const newHeight = Math.ceil(height / 8) * 8;
    croppedCanvas.width = newWidth;
    croppedCanvas.height = newHeight;

    const ctx = croppedCanvas.getContext("2d");
    ctx.drawImage(sourceCanvas, x, y, width, height, 0, 0, newWidth, newHeight);

    return croppedCanvas;
}

export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function highlightPoints(canvas, point) {
    const ctx = canvas.getContext("2d");
    const radius = 10;
    const { x, y } = point;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
}

export function pushValues(start, end) {
    let tempArray = [];
    if (start < end) {
        for (let i = start; i <= end; i++) {
            tempArray.push(i);
        }
    } else if (start > end) {
        for (let i = start; i >= end; i--) {
            tempArray.push(i);
        }
    }
    return tempArray;
}

export function distanceBetweenPoints(point1, point2) {
    return Math.sqrt(
        Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
}

export function appendElem(elem) {
    const div = document.querySelector("#photo--input--container");
    elem.style.width = "60px";
    div.appendChild(elem);
}
