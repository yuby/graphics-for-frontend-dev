import { vec3 } from 'gl-matrix';
import MyObject, { ObjectAttrs } from './MyObject';
import Hit from './Hit';
import { Triangle } from './Triangle';

export class Square extends MyObject {
  private triangle1: Triangle;
  private triangle2: Triangle;

  constructor(
    private v0: vec3,
    private v1: vec3,
    private v2: vec3,
    private v3: vec3,
  ) {
    super();

    this.triangle1 = new Triangle(this.v0, this.v1, this.v2);
    this.triangle2 = new Triangle(this.v0, this.v2, this.v3);
  }

  checkRayCollision(start: vec3, rayDir: vec3): Hit | null {
    const intersect1 = this.triangle1.checkRayCollision(start, rayDir);
    const intersect2 = this.triangle2.checkRayCollision(start, rayDir);

    if ((intersect1 && intersect2) && (intersect1.dist >= 0 && intersect2.dist >= 0)) {
      const targetObject = intersect1.dist < intersect2.dist ? this.triangle1 : this.triangle2;
      const targetIntersect = intersect1.dist < intersect2.dist ? intersect1 : intersect2;
      return {
        dist: targetIntersect.dist,
        hitPoint: targetIntersect.hitPoint,
        normal: targetIntersect.normal,
        obj: targetObject,
      };
    } else if (intersect1 && intersect1.dist >= 0) {
      return {
        dist: intersect1.dist,
        hitPoint: intersect1.hitPoint,
        normal: intersect1.normal,
        obj: this.triangle1,
      };
    } else if (intersect2 && intersect2.dist >= 0) {
      return {
        dist: intersect2.dist,
        hitPoint: intersect2.hitPoint,
        normal: intersect2.normal,
        obj: this.triangle2,
      };
    }

    return null;
  }
}