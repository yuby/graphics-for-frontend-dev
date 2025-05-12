import { vec3 } from 'gl-matrix';

export type SphereAttrs = {
  color: vec3;
  center: vec3;
  radius: number;
  light: vec3;
  ambient: vec3;
  diffusion: vec3;
  specular: vec3;
  alpha: number;
  ks: number;
}

export default class Sphere {
  attributes: SphereAttrs | null = null;

  getAttributes() {
    return this.attributes;
  }

  updateAttrs(attr: SphereAttrs) {
    this.attributes = { ...this.attributes, ...attr };
  }
}