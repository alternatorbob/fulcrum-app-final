import { attachListeners } from "./js/attachListeners";
import { activeView, EditMessage, moveCanvasLayers } from "./js/ui";

export function handleViewChange() {
    switch (activeView) {
        case "home":
            console.log(`Current View: ${activeView}`);
            break;

        case "result":
            console.log(`Current View: ${activeView}`);
            // moveCanvasLayers("result");
            break;

        case "edit":
            console.log(`Current View: ${activeView}`);

            const editMessage = new EditMessage();
            editMessage.show();
            break;

        case "edit-prompt":
            console.log(`Current View: ${activeView}`);
            break;
    }
}

attachListeners();
