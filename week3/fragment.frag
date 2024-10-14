precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_colorScheme;
varying vec2 vTexCoord;

void main() {
  vec2 st = vTexCoord * u_resolution / min(u_resolution.x, u_resolution.y);
  float dist = length(st - vec2(0.5));
  float angle = atan(st.y - 0.5, st.x - 0.5);
  float colorFactor = 0.5 + 0.5 * cos(u_time + dist * 10.0 + angle * 5.0);

  vec3 color;
  if (u_colorScheme < 0.5) {
    // Default color scheme
    color = vec3(colorFactor, 0.5 + 0.5 * sin(u_time + dist * 5.0), 1.0 - dist);
  } else {
    // Alternate color scheme
    color = vec3(1.0 - dist, 0.5 + 0.5 * sin(u_time + angle * 5.0), colorFactor);
  }

  gl_FragColor = vec4(color, 1.0);
}
