import flipnote from "./flipnote";

let canvas = document.createElement("canvas");
canvas.id = "canvas";
document.body.appendChild(canvas);

var player = new flipnote.player("#canvas", 512, 384);
player.open("demo/bee.ppm");

window.player = player;

// flipnote.parseSource('demo/comment.kwc').then(note => {
//   const gif = flipnote.gifEncoder.fromFlipnoteFrame(note, note.thumbFrameIndex);
//   const img = gif.getImage();
//   document.body.appendChild(img);
// })

export default flipnote;