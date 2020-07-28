precision highp float;
varying vec2 v_uv;
uniform sampler2D u_bitmap;
uniform vec2 u_textureSize;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform bool u_debugWireframe;
const vec4 transparentColor = vec4(0, 0, 0, 0);
const vec4 wireframeColor = vec4(1, .2, 0, 1);

void main() {
  float index = texture2D(u_bitmap, v_uv).a * 255.;
  gl_FragColor = wireframeColor;
  if (u_debugWireframe) {
    gl_FragColor = wireframeColor;
  }
  // TODO: palette lookup instead of... whatever the hell this is
  else if (index == 1.) {
    gl_FragColor = u_color1;
  }
  else if (index == 2.) {
    gl_FragColor = u_color2;
  }
  else {
    gl_FragColor = transparentColor;
  }
}