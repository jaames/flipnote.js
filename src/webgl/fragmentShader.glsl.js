export default `
precision mediump float;
varying vec2 v_texcoord;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform sampler2D u_bitmap;
void main() {
  float index = texture2D(u_bitmap, v_texcoord).a * 255.0;
  float weightColor1 = smoothstep(0.0, 1.0, index);
  float weightColor2 = smoothstep(1.0, 2.0, index);
  gl_FragColor = mix(vec4(0, 0, 0, 0), mix(u_color1, u_color2, weightColor2), weightColor1);
}`
