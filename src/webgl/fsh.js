export default `
precision mediump float;
varying vec2 v_texcoord;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform sampler2D u_bitmap;
uniform bool u_isSmooth;
void main() {
  float weightColor1 = texture2D(u_bitmap, v_texcoord).a;
  float weightColor2 = texture2D(u_bitmap, v_texcoord).r;
  float alpha = 1.0;
  if (u_isSmooth) {
    weightColor1 = smoothstep(0.0, .9, weightColor1);
    weightColor2 = smoothstep(0.0, .9, weightColor2);
    float alpha = weightColor1 + weightColor2;
  }
  gl_FragColor = vec4(u_color1.rgb, alpha) * weightColor1 + vec4(u_color2.rgb, alpha) * weightColor2;
}`
