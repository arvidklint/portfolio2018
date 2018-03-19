export default `#version 300 es
precision highp float;

layout(std140) uniform CameraUniforms {
  mat4 viewMatrix;
  mat4 projectionMatrix;
};

layout(std140) uniform LightUniforms {
  vec3 lightPosition;
};

in vec3 vPosition;
in vec3 vNormal;

out vec4 fragColor;
void main() {
  fragColor = vec4(vPosition, 1.0);
  int mode = 3;
  vec3 ambientColor = vec3(1.0, 0.5, 0.1);
  vec3 diffuseColor = vec3(1.0, 0.2, 0.1);
  vec3 specularColor = vec3(1.0, 1.0, 1.0);
  float shininessVal = 4.0;
  float Ka = 1.0;
  float Kd = 1.0;
  float Ks = 1.0;

  vec3 N = normalize(vNormal);
  vec3 L = normalize(lightPosition - vPosition);

  // Lambert's cosine law
  float lambertian = max(dot(N, L), 0.0);

  float specular = 0.0;

  if(lambertian > 0.0) {
    vec3 R = reflect(-L, N); // Reflected light vector
    vec3 V = normalize(-vPosition); // Vector to viewer

    // Compute the specular term
    float specAngle = max(dot(R, V), 0.0);
    specular = pow(specAngle, shininessVal);
  }
  fragColor = vec4(Ka * ambientColor +
                  Kd * lambertian * diffuseColor +
                  Ks * specular * specularColor, 1.0);

  // only ambient
  if(mode == 2) fragColor = vec4(Ka * ambientColor, 1.0);
  // only diffuse
  if(mode == 3) fragColor = vec4(Kd * lambertian * diffuseColor, 1.0);
  // only specular
  if(mode == 4) fragColor = vec4(Ks * specular * specularColor, 1.0);
}
`