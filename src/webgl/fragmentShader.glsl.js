export default [
  "precision lowp float;",
  "varying vec2 v_texcoord;",
  "uniform vec4 u_paperColor;", 
  "uniform vec4 u_layer1Color;", 
  "uniform vec4 u_layer2Color;", 
  "uniform sampler2D u_layer1Bitmap;",
  "uniform sampler2D u_layer2Bitmap;",    
  "void main() {",
      "float layer1 = texture2D(u_layer1Bitmap, v_texcoord).a;",
      "float layer2 = texture2D(u_layer2Bitmap, v_texcoord).a;",
      // combine the two layer bitmaps together
      // each pixel will either be 0.0 if it is "transparent", or (1/255) if it is used
      // layer 1 is on top of layer 2, anything else should be paper color
      "gl_FragColor = (layer1 == 0.0) ? (layer2 == 0.0) ? u_paperColor : u_layer2Color : u_layer1Color;",
  "}"
].join("\n");
