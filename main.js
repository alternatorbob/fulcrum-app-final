import { attachListeners } from "./js/attachListeners";
import { activeView } from "./js/ui";

export function handleViewChange() {
    switch (activeView) {
        case "home":
            console.log(`Current View: ${activeView}`);
            break;

        case "result":
            console.log(`Current View: ${activeView}`);
            break;

        case "edit":
            console.log(`Current View: ${activeView}`);
            break;

        case "edit-prompt":
            console.log(`Current View: ${activeView}`);
            break;
    }
}

attachListeners();

// imageInput.onchange = (e) => {
//     const file = e.target.files[0];

//     // check if file empty
//     const reader = new FileReader();

//     reader.onload = (e) => {
//         const img = new Image();

//         img.onload = async () => {
//             // const min = Math.min(img.width, img.height);
//             canvas.width = canvas.height = 512;

//             // canvas.width = img.width;
//             // canvas.height = img.height;

//             console.log(canvas.width, canvas.height);
//             // canvas.width = min;
//             // canvas.height = min;
//             ctx.save();

//             const ratio = img.width / img.height;
//             // ctx.drawImage(img, 0, 0, canvas.width, canvas.height / ratio);
//             ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//             canvas64 = canvas.toDataURL();

//             myPrompt = await getDetections(file);

//             // force clear canvas by resizing it
//             // canvas.width = canvas.width;
//             // ctx.fillStyle = "white";
//             // ctx.fillRect(0, 0, canvas.width, canvas.height);

//             // ctx.beginPath();
//             // let radius = canvas.width * 0.4;
//             // ctx.arc(
//             //     canvas.width / 2,
//             //     canvas.height / 2,
//             //     radius,
//             //     0,
//             //     2 * Math.PI
//             // );
//             // ctx.fillStyle = "black";
//             // ctx.fill();
//             // ctx.restore();
//             const maskCanvas = document.querySelector("#mask--canvas");
//             mask64 = maskCanvas.toDataURL();
//         };
//         img.src = e.target.result;
//     };
//     if (file) {
//         reader.readAsDataURL(file);
//     }
// };

// form.onsubmit = async (e) => {
//     e.preventDefault();

//     // create formdata
//     // canvas to file
//     const output = await inPaint(canvas64, mask64, myPrompt, (value) => {
//         console.log("progression:", value);
//     }).then(window.scrollTo(0, document.body.scrollHeight));

//     const img = new Image();
//     img.src = output;
//     imgResults.appendChild(img);
// };
