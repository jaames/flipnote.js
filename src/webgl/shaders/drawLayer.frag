precision highp float;
varying vec2 v_uv;
uniform sampler2D u_palette;
uniform sampler2D u_bitmap;
uniform float u_paletteOffset;
const vec4 transparent = vec4(0, 0, 0, 0);

void main() {
  float index = texture2D(u_bitmap, v_uv).a * 255.;
  if (index > 0.)
  {
    gl_FragColor = texture2D(u_palette, vec2((u_paletteOffset + index) / 8., .5));
  } 
  else
  {
    gl_FragColor = transparent;
  }
}