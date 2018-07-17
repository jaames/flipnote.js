export default `
precision mediump float;
varying vec2 v_texcoord;
uniform float u_layerIndex;
uniform sampler2D u_bitmap;
uniform sampler2D u_palette;
void main() {
  float index = texture2D(u_bitmap, v_texcoord).a * 255.0;
  float alpha = min(index, 1.0);
  index += u_layerIndex * 2.0;
  vec4 color = texture2D(u_palette, vec2((index + 0.5) / 256.0, 0.5));
  gl_FragColor = mix(vec4(0,0,0,0), color, alpha);
}`
