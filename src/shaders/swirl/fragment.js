export default `#version 300 es
precision highp float;

in vec4 vColor;

out vec4 fragColor;
void main() {
  fragColor = vec4(vColor.rgb * vColor.a, vColor.a);
}
`