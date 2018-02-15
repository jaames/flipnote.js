export default `
attribute vec4 a_position;
varying vec2 v_texcoord;
void main() {
  gl_Position = a_position;
  v_texcoord = a_position.xy * vec2(0.5, -0.5) + 0.5;
}`