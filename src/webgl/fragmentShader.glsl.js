export default `
precision mediump float;
varying vec2 v_texcoord;
uniform vec4 u_paperColor;
uniform vec4 u_layer1Color;
uniform vec4 u_layer2Color;
uniform bool u_layer1Visibility;
uniform bool u_layer2Visibility;
uniform sampler2D u_layer1Bitmap;
uniform sampler2D u_layer2Bitmap;
uniform sampler2D u_palette;
void main() {
  float layer1 = u_layer1Visibility ? texture2D(u_layer1Bitmap, v_texcoord).a * 255.0 : 0.0;
  // float layer2 = u_layer2Visibility ? texture2D(u_layer2Bitmap, v_texcoord).a * 255.0 : 0.0;
  gl_FragColor = texture2D(u_palette, vec2((layer1 + 0.5) / 255.0, 0.5));
}`
