import { vec2, vec3, vec4 } from 'gl-matrix';
import MyObject from './MyObject';
import Hit from './Hit';

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

export default class Sphere extends MyObject {
  constructor(
    private center: vec3,
    private radius: number,
  ) {
    super();
  }

  getRadius() {
    return this.radius;
  }

  getCenter() {
    return this.center;
  }

  setAttrs(attr: Partial<SphereAttrs>): void {
    const { center, radius, ...rest } = attr;
    if (center) this.center = center;
    if (radius) this.radius = radius;
    super.setAttrs(rest);
  }

  getAttrs() {
    const attrs =  super.getAttrs() as SphereAttrs;

    return {
      ...attrs,
      center: this.center,
      radius: this.radius,
    }
  }

  updateAttrs(attr: Partial<SphereAttrs>) {
    const { center, radius, ...rest } = attr;
    if (center) this.center = center;
    if (radius) this.radius = radius;
    this.setAttrs(rest);
  }

  checkRayCollision(start: vec3, rayDir: vec3): Hit | null {
    const o_c = vec3.subtract(vec3.create(), start, this.center);
    const b = vec3.dot(rayDir, o_c);
    const c_ = vec3.dot(o_c, o_c) - this.radius * this.radius;
    const nabla = b * b - c_;

    if (nabla >= 0) {
      const d1 = -b + Math.sqrt(nabla);
      const d2 = -b - Math.sqrt(nabla);
      if (d1 < 0 && d2 < 0) return null;
      const closestDist = Math.min(
        d1 < 0 ? Infinity : d1,
        d2 < 0 ? Infinity : d2
      );
      const hitPoint = vec3.add(
        vec3.create(),
        start,
        vec3.scale(vec3.create(), rayDir, closestDist)
      );
      const normal = vec3.normalize(
        vec3.create(),
        vec3.subtract(vec3.create(), hitPoint, this.center)
      );

      return {
        dist: closestDist,
        hitPoint,
        normal,
        obj: null,
      }
    }

    return null;
  }
}