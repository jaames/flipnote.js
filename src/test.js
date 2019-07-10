import flipnote from "./flipnote";

let canvas = document.createElement("canvas");
canvas.id = "canvas";
document.body.appendChild(canvas);

var player = new flipnote.Player("#canvas", 640, 480);
player.open("demo/bee.ppm");

window.player = player;

// flipnote.parse('demo/bee.ppm').then(note => {
//   window.test = note;
//   console.log(note);
// })

export default flipnote;