attribute vec4 position;
attribute vec2 texcoord;
varying vec2 v_texel;
varying vec2 v_uv;
varying float v_scale;
uniform bool u_flipY;
uniform vec2 u_textureSize;
uniform vec2 u_screenSize;

void main() {
  v_uv = texcoord;
  v_scale = floor(u_screenSize.y / u_textureSize.y + 0.01);
  gl_Position = position;
  if (u_flipY) {
    gl_Position.y *= -1.;
  }
}