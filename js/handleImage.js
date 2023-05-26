import { getDetections, swapFace } from "./faceDetectionSwap";
import { Loader } from "./ui";

export async function onImageUpload(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    const loader = new Loader();
    loader.show();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = async () => {
            const canvas = document.querySelector("#image--canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.save();
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            loader.hide();
        };
        img.src = e.target.result;
    };
    if (file) {
        reader.readAsDataURL(file);

        let myPrompt = await getDetections(file);
        // swapFace(myPrompt);
    }
}
