attribute vec4 position;
attribute vec2 texcoord;
varying vec2 v_texel;
varying vec2 v_uv;
varying float v_scale;
uniform bool u_flipY;
uniform vec2 u_textureSize;
uniform vec2 u_screenSize;

void main() {
  gl_Position = position * vec4(1, u_flipY ? -1 : 1, 1, 1);
  v_uv = texcoord;
  v_scale = floor(u_screenSize.y / u_textureSize.y + 0.01);
}