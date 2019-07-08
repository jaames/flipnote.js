import flipnote from "./flipnote";

let canvas = document.createElement("canvas");
canvas.id = "canvas";
document.body.appendChild(canvas);

var player = new flipnote.player("#canvas", 640, 480);
player.open("demo/bee.ppm");

window.player = player;

export default flipnote;