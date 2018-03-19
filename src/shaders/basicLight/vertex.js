export default `#version 300 es

layout(location=0) in vec4 position;
layout(location=1) in vec3 normal;

layout(std140) uniform CameraUniforms {
  mat4 viewMatrix;
  mat4 projectionMatrix;
};

out vec3 vPosition;
out vec3 vNormal;

void main() {
  vPosition = position.xyz;
  vNormal = normal;
  gl_Position = projectionMatrix * viewMatrix * position;
}
`
