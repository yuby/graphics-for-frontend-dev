import { vec2, vec3, vec4 } from 'gl-matrix';
import Hit from './Hit';
import Ray from './Ray';

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
  private center = vec3.create();

  private radius = 0.5;

  attributes: SphereAttrs | null = null;

  getAttributes() {
    return this.attributes;
  }

  updateAttrs(attr: SphereAttrs) {
    this.attributes = { ...this.attributes, ...attr };
  }
}