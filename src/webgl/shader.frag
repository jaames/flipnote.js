precision highp float;
varying vec2 v_texel;
varying float v_scale;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform sampler2D u_bitmap;
uniform bool u_isSmooth;
uniform vec2 u_textureSize;
uniform vec2 u_screenSize;

void main() {
  vec2 texel_floored = floor(v_texel);
  vec2 s = fract(v_texel);
  float region_range = 0.5 - 0.5 / v_scale;
  vec2 center_dist = s - 0.5;
  vec2 f = (center_dist - clamp(center_dist, -region_range, region_range)) * v_scale + 0.5;
  vec2 mod_texel = texel_floored + f;
  vec2 coord = mod_texel.xy / u_textureSize.xy;
  vec2 colorWeights = texture2D(u_bitmap, coord).ra;
  gl_FragColor = u_color1.rgba * colorWeights.y + u_color2.rgba * colorWeights.x;
}