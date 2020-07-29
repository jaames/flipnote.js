precision highp float;
varying vec2 v_uv;
uniform sampler2D u_tex;
varying float v_scale;
uniform vec2 u_textureSize;
uniform vec2 u_screenSize;

void main() {
  vec2 v_texel = v_uv * u_textureSize;
  vec2 texel_floored = floor(v_texel);
  vec2 s = fract(v_texel);
  float region_range = 0.5 - 0.5 / v_scale;
  vec2 center_dist = s - 0.5;
  vec2 f = (center_dist - clamp(center_dist, -region_range, region_range)) * v_scale + 0.5;
  vec2 mod_texel = texel_floored + f;
  vec2 coord = mod_texel.xy / u_textureSize.xy;
  gl_FragColor = texture2D(u_tex, coord);
}