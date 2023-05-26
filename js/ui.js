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
