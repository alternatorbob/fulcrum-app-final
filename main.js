import { attachListeners } from "./js/attachListeners";
import { activeView, EditMessage, moveCanvasLayers } from "./js/ui";
import { hiddenDetectionObjects } from "./js/drawUtils";
const editMessage = new EditMessage();
// editMessage.hide();

export function handleViewChange() {
    switch (activeView) {
        case "home":
            console.log(`Current View: ${activeView}`);
            break;

        case "result":
            console.log(`Current View: ${activeView}`);
            // console.log(hiddenDetectionObjects);
            // editMessage.hide();

            // moveCanvasLayers("result");

            break;

        case "edit":
            console.log(`Current View: ${activeView}`);
            // console.log(hiddenDetectionObjects);

            // editMessage.show();
            break;

        case "edit-prompt":
            console.log(`Current View: ${activeView}`);
            break;
    }
}

attachListeners();
