import { handleViewChange } from "../main";
export let activeView = "home";

export function switchView(destination) {
    if (activeView == "edit-prompt") {
        document.querySelector(".popup-container").classList.remove("active");
    } else {
        let viewSelector = document.querySelector(`.${activeView}`);
        viewSelector.classList.add("hidden");
        viewSelector = document.querySelector(`.${destination}`);
        viewSelector.classList.remove("hidden");
    }
    activeView = destination;
    handleViewChange();
}

export function drawFaceBox(canvas, box, scaleFactor) {
    const ctx = canvas.getContext("2d");
    console.log(box);
    let { x, y, width, height } = box;

    let img = new Image();
    img.onload = () => {
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "blue";
        // ctx.rect(x, y, width, height);
        // ctx.rect(50, 50, 150, 80);
        ctx.stroke();

        // x -= width / 10;
        x -= width / (scaleFactor * 2.66);
        y -= width / (scaleFactor * 2.66);
        width *= scaleFactor;
        height *= scaleFactor;

        // y -= 20 * scaleFactor;
        // width += 20 * scaleFactor;
        // height += 20 * scaleFactor;
        ctx.drawImage(img, x, y, width, height);
    };
    img.src = "icons/fulcrum_frame.svg";
}

export class FaceBox {
    constructor(canvas, box) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.box = box;
        this.x = this.box._x;
        this.y = this.box._y;
        this.w = this.box._width;
        this.h = this.box._heigh;

        // this.img = document.createElement("img");
        this.img = new Image();
        // this.img.src = "icons/fulcrum_frame.svg";
        this.img.onload = () => this.drawSVG();
    }

    drawSVG() {
        console.log(this.box);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        console.log(this.img);
        this.ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }
}

export class CircleAnimation {
    constructor(x, y) {
        // Create a canvas element
        this.canvas = document.querySelector("#detections--canvas");
        this.ctx = this.canvas.getContext("2d");

        this.x = x;
        this.y = y;

        // Animation ID for requestAnimationFrame
        this.animationId = null;
    }

    startAnimation() {
        // Start the animation loop
        this.animate();
    }

    stopAnimation() {
        // Stop the animation loop
        cancelAnimationFrame(this.animationId);

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    animate() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw circles for each point

        // Calculate the radius based on a sine wave
        const radius = 20 + 10 * Math.sin(Date.now() / 200); // Adjust amplitude and frequency as desired

        // Calculate the center position
        const centerX = this._x;
        const centerY = this._y;

        // Draw the circle
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = "black";
        this.ctx.fillStyle = "transparent";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.closePath();

        // Request the next animation frame
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

export class Loader {
    constructor() {
        this.loaderDiv = document.createElement("div");
        this.loaderDiv.innerText = "Loading...";
        this.loaderDiv.style = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        color: white;
        font-size: 24px;
      `;
        document.body.appendChild(this.loaderDiv);
    }

    show() {
        this.loaderDiv.style.display = "flex";
    }

    hide() {
        this.loaderDiv.style.display = "none";
    }
}
