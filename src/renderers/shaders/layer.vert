attribute vec4 position;
attribute vec2 texcoord;
varying vec2 v_uv;
uniform bool u_flipY;
uniform vec2 u_textureSize;
uniform int u_3d_eye;
uniform float u_3d_depth;
uniform float u_3d_strength;

void main() {
  vec4 pos = position;
  float depthDirection = u_3d_eye == 0 ? -1.0 : 1.0;
  float depthShift = floor(u_3d_depth * u_3d_strength) / (u_textureSize.x / 2.0) * depthDirection;
  pos.x += depthShift;
  pos.y *= u_flipY ? -1.0 : 1.0;
  v_uv = texcoord;
  gl_Position = pos;
}