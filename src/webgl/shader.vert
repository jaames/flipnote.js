attribute vec4 a_position;
varying vec2 v_texcoord;
varying vec2 v_texel;
varying float v_scale;
uniform vec2 u_textureSize;
uniform vec2 u_screenSize;

void main() {
  gl_Position = a_position;
  v_texcoord = a_position.xy * vec2(0.5, -0.5) + 0.5;
  v_texel = v_texcoord * u_textureSize;
  v_scale = floor(u_screenSize.y / u_textureSize.y + 0.01);
}