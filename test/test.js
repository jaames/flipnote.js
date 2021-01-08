// var player = new flipnote.Player("#canvas", 640, 480);

// player.on('any', (type, ...args) => {
//   console.log('EVENT', type, args);
// });

// player.load("samples/bee.ppm");

// let canvas = document.createElement("canvas");
// canvas.id = "canvas";
// document.body.appendChild(canvas);



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

// fetch('samples/pekira_beach.kwz')
// .then(resp => resp.arrayBuffer())
// .then(data => {
//   console.time('kwz parse')
//   flipnote.parseSource(data, {
//     dsiGalleryNote: true,
//     quickParse: true,
//   }).then(note => {
//     console.timeEnd('kwz parse')
//     let gif;
//     console.time('animated GIF export')
//     gif = flipnote.GifImage.fromFlipnote(note);
//     console.timeEnd('animated GIF export')
//     let img = gif.getImage();
//     testEl.appendChild(img);
//   })
// })


// flipnote.parseSource('samples/comment.kwc').then(note => {
  // const canvas2 = document.createElement('canvas');
  // const ctx = canvas2.getContext('2d');
  // document.body.appendChild(canvas2);
  // canvas2.width = note.imageWidth;
  // canvas2.height = note.imageHeight;
  // const img = ctx.createImageData(note.imageWidth, note.imageHeight);
  
  // const src = note.getFramePixels(0);
  // const srcPalette = note.globalPalette;
  // const dst = img.data;
  
  // for (let srcPtr = 0, dstPtr = 0; srcPtr < src.length; srcPtr += 1, dstPtr += 4) {
  //   const [r, g, b] = srcPalette[src[srcPtr]];
  //   dst[dstPtr + 0] = r;
  //   dst[dstPtr + 1] = g;
  //   dst[dstPtr + 2] = b;
  //   dst[dstPtr + 3] = 255;
  // }
  
  // ctx.putImageData(img, 0, 0);
// });

// flipnote.parseSource('samples/bee.ppm').then(note => {
//   const gif = flipnote.gifEncoder.fromFlipnote(note);
//   const img = gif.getImage();
//   testEl.appendChild(img);
// })

// export default flipnote;