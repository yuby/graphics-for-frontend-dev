import { vec3 } from 'gl-matrix';
import type { SphereAttrs } from './Sphere';
import Hit from './Hit';

export interface ObjectAttrs {
  ambient: vec3
  diffusion: vec3
  specular: vec3
  color: vec3
  light: vec3
  alpha: number
  ks: number
}

export default abstract class MyObject {
  private color = vec3.fromValues(1, 1, 1);
  private ambient = vec3.fromValues(0, 0, 0);
  private diffusion = vec3.fromValues(0, 0, 0);
  private specular = vec3.fromValues(0, 0, 0);
  private light = vec3.fromValues(0, 0, 0);
  private alpha = 10;
  private ks = 0.8;

  getAttrs() {
    return {
      color: this.color,
      ambient: this.ambient,
      diffusion: this.diffusion,
      specular: this.specular,
      alpha: this.alpha,
      ks: this.ks,
      light: this.light,
    }
  }

  setAttrs(attr: Partial<ObjectAttrs>) {
    if (attr.ambient) {
      this.ambient = vec3.fromValues(attr.ambient[0], attr.ambient[1], attr.ambient[2]);
    }
    if (attr.diffusion) {
      this.diffusion = vec3.fromValues(attr.diffusion[0], attr.diffusion[1], attr.diffusion[2]);
    }
    if (attr.specular) {
      this.specular = vec3.fromValues(attr.specular[0], attr.specular[1], attr.specular[2]);
    }
    if (attr.alpha) {
      this.alpha = attr.alpha;
    }
    if (attr.ks) {
      this.ks = attr.ks;
    }
    if (attr.color) {
      this.color = vec3.fromValues(attr.color[0], attr.color[1], attr.color[2]);
    }
    if (attr.light) {
      this.light = vec3.fromValues(attr.light[0], attr.light[1], attr.light[2]);
    }
  }

  abstract checkRayCollision?(start: vec3, rayDir: vec3): Hit | null
}