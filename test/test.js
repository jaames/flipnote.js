let canvas = document.createElement("canvas");
canvas.id = "canvas";
document.body.appendChild(canvas);

var player = new flipnote.player("#canvas", 512, 384);
player.open("samples/bee.ppm");

player.on('load', () => {
  const note = player.note;
  const canvas2 = document.createElement('canvas');
  const ctx = canvas2.getContext('2d');
  document.body.appendChild(canvas2);
  canvas2.width = note.width;
  canvas2.height = note.height;
  const img = ctx.createImageData(note.width, note.height);
  
  const src = note.getFramePixels(0);
  const srcPalette = note.globalPalette;
  const dst = img.data;
  
  for (let srcPtr = 0, dstPtr = 0; srcPtr < src.length; srcPtr += 1, dstPtr += 4) {
    const [r, g, b] = srcPalette[src[srcPtr]];
    dst[dstPtr + 0] = r;
    dst[dstPtr + 1] = g;
    dst[dstPtr + 2] = b;
    dst[dstPtr + 3] = 255;
  }
  
  ctx.putImageData(img, 0, 0);
});

window.player = player;

// flipnote.parseSource('demo/comment.kwc').then(note => {
//   const gif = flipnote.gifEncoder.fromFlipnoteFrame(note, note.thumbFrameIndex);
//   const img = gif.getImage();
//   document.body.appendChild(img);
// })

// export default flipnote;