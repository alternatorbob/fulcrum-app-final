import { updateView } from "../main";
export let activeView = "home";

// export function switchView(content) {
//     const destination = content.activeView;
//     let viewSelector = document.querySelector(`.${activeView}`);

//     viewSelector.classList.add("hidden");
//     viewSelector = document.querySelector(`.${destination}`);
//     viewSelector.classList.remove("hidden");

//     activeView = destination;

//     updateView(content);
// }

export function switchView(activeView, destination) {
    const activeViewElement = document.querySelector(`.${activeView}`);
    const destinationElement = document.querySelector(`.${destination}`);

    activeViewElement.classList.add("hidden");
    destinationElement.classList.remove("hidden");

    updateView(destination);
}

export function moveCanvasLayers(destination) {
    const photoContainer = document.querySelector("#photo--input--container");
    const containerParent = photoContainer.parentNode;
    const destinationDiv = document.querySelector(`.${destination}`);

    destinationDiv.appendChild(photoContainer);
    // containerParent.removeChild(photoContainer);
}

export class EditMessage {
    constructor() {
        this.messageDiv = document.createElement("div");
        this.messageDiv.id = "#message--div";
        this.messageDiv.innerText = "Touch a face to edit";
        this.messageDiv.style = `
            position: absolute;
            border-radius: 4px;
            top: 10%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 10%;
            z-index: 9999;
            background-color: rgba(0, 0, 0);
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        document
            .querySelector("#photo--input--container")
            .appendChild(this.messageDiv);
    }

    show() {
        this.messageDiv.classList.remove("hidden");
    }

    hide() {
        this.messageDiv.classList.add("hidden");
        console.log("should be hidden");
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
