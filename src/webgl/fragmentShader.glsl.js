export default [
  "precision mediump float;",
  "varying vec2 v_texcoord;",
  "uniform sampler2D u_palette;", 
  "uniform sampler2D u_layer_1;",
  "uniform sampler2D u_layer_2;",    
  "void main() {",
      "float layer1 = texture2D(u_layer_1, v_texcoord).a * 255.0;",
      "float layer2 = texture2D(u_layer_2, v_texcoord).a * 255.0;",
      "float pixel = (layer1 == 0.0) ? (layer2 == 0.0) ? 0.0 : 2.0 : 1.0;",
      "gl_FragColor = texture2D(u_palette, vec2((pixel + 0.5) / 256.0, 0.5));",
  "}"
].join("\n");
