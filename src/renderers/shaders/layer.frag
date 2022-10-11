precision highp float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform int u_3d_mode;

void main() {
  vec4 col = texture2D(u_tex, v_uv);
  if (col.a == 0.0) {
    discard;
  }
  gl_FragColor = col;
}