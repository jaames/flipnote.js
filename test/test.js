const testEl = document.getElementById('test');

// let canvas = document.createElement("canvas");
// canvas.id = "canvas";
// document.body.appendChild(canvas);

// var player = new flipnote.player("#canvas", 512, 384);
// player.open("samples/bee.ppm");

// player.on('load', () => {
//   const note = player.note;
//   const canvas2 = document.createElement('canvas');
//   const ctx = canvas2.getContext('2d');
//   document.body.appendChild(canvas2);
//   canvas2.width = note.width;
//   canvas2.height = note.height;
//   const img = ctx.createImageData(note.width, note.height);
  
//   const src = note.getFramePixels(0);
//   const srcPalette = note.globalPalette;
//   const dst = img.data;
  
//   for (let srcPtr = 0, dstPtr = 0; srcPtr < src.length; srcPtr += 1, dstPtr += 4) {
//     const [r, g, b] = srcPalette[src[srcPtr]];
//     dst[dstPtr + 0] = r;
//     dst[dstPtr + 1] = g;
//     dst[dstPtr + 2] = b;
//     dst[dstPtr + 3] = 255;
//   }
  
//   ctx.putImageData(img, 0, 0);
// });

// window.player = player;

// flipnote.parseSource('samples/sample19.kwz').then(note => {
//   const gif = flipnote.gifEncoder.fromFlipnote(note);
//   const img = gif.getImage();
//   testEl.appendChild(img);
// })

flipnote.parseSource('samples/memoA.kwz').then(note => {
  let gif;
  console.time('frame GIF x100')
  for (let i = 0; i < 100; i++) {
    gif = flipnote.gifEncoder.fromFlipnoteFrame(note, 1);
  }
  console.timeEnd('frame GIF x100')
  const img = gif.getImage();
  testEl.appendChild(img);
})

// flipnote.parseSource('samples/memoF.kwz').then(note => {
//   console.time('animated GIF')
//   const gif = flipnote.gifEncoder.fromFlipnoteFrame(note, 2);
//   console.timeEnd('animated GIF')
//   const img = gif.getImage();
//   testEl.appendChild(img);
// })


// flipnote.parseSource('samples/bee.ppm').then(note => {
//   const gif = flipnote.gifEncoder.fromFlipnote(note);
//   const img = gif.getImage();
//   testEl.appendChild(img);
// })

// export default flipnote;