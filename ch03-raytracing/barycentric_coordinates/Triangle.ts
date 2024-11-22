import { vec3 } from 'gl-matrix';
import MyObject from './MyObject';
import { Hit } from './Hit';

interface Intersect {
  t: number;
  u: number;
  v: number;
  hitPoint: vec3;
  faceNormal: vec3;
  w0?: number;
  w1?: number;
}

export class Triangle extends MyObject {
  constructor(
    private v0: vec3,
    private v1: vec3,
    private v2: vec3,
  ) {
    super();
  }

  intersectRayTriangle(
    start: vec3,
    rayDir: vec3,
    v0: vec3,
    v1: vec3,
    v2: vec3
  ): Intersect | null {
    const edge1 = vec3.create();
    const edge2 = vec3.create();
    const edgeCross = vec3.create();
    const faceNormal = vec3.create();
    const negativeRayDir = vec3.create()

    vec3.subtract(edge1, v1, v0);
    vec3.subtract(edge2, v2, v0);
    vec3.cross(edgeCross, edge1, edge2);
    vec3.normalize(faceNormal, edgeCross);
    vec3.scale(negativeRayDir, rayDir, -1);
    const backfaceCulling = vec3.dot(negativeRayDir, faceNormal);

    if (backfaceCulling < 0) {
      return null;
    }

    const denominator = vec3.dot(rayDir, faceNormal);
    const isParallel = Math.abs(denominator) < Number.EPSILON;
    if (isParallel) return null;

    const dist = (vec3.dot(v0, faceNormal) - vec3.dot(start, faceNormal)) / denominator;

    if (dist < 0) return null;

    const hitPoint =vec3.add(vec3.create(), start, vec3.scale(vec3.create(), rayDir, dist));

    const v2p  = vec3.create();
    const v2v1 = vec3.create();
    vec3.subtract(v2p, hitPoint, v2);
    vec3.subtract(v2v1, v1, v2);
    const cross0 = vec3.create();
    const noraml0 = vec3.create();
    vec3.cross(cross0,v2p, v2v1);
    vec3.normalize(noraml0, cross0);

    const v0p = vec3.create();
    const v0v2 = vec3.create();
    vec3.subtract(v0p, hitPoint, v0);
    vec3.subtract(v0v2, v2, v0);
    const cross1 = vec3.create();
    const noraml1 = vec3.create();
    vec3.cross(cross1,v0p, v0v2);
    vec3.normalize(noraml1, cross1);

    const v1p = vec3.create();
    const v1v0 = vec3.create();
    vec3.subtract(v1p, hitPoint, v1);
    vec3.subtract(v1v0, v0, v1);
    const cross2 = vec3.create();
    const noraml2 = vec3.create();
    vec3.cross(cross2,v1p, v1v0);
    vec3.normalize(noraml2, cross2);

    if (vec3.dot(noraml0, noraml1) < 0 || vec3.dot(noraml1, noraml2) < 0 || vec3.dot(noraml2, noraml0) < 0) {
      return null;
    }

    const area0 = vec3.length(cross0) * 0.5;
    const area1 = vec3.length(cross1) * 0.5;
    const area2 = vec3.length(cross2) * 0.5;
    const sumArea = area0 + area1 + area2;
    const w0 = area0 / sumArea;
    const w1 = area1 / sumArea;

    const u = 1;
    const v = 1;

    return {
      t: dist,
      u,
      v,
      hitPoint,
      faceNormal,
      w0,
      w1
    };
  }

  checkRayCollision(start: vec3, rayDir: vec3): Hit | null {
    const intersect = this.intersectRayTriangle(
      start,
      rayDir,
      this.v0,
      this.v1,
      this.v2
    )
    if (intersect) {
      const resp: Hit = {
        dist: intersect.t,
        hitPoint: intersect.hitPoint,
        normal: intersect.faceNormal,
        obj: this,
      };

      if (intersect.w0) {
        resp.w0 = intersect.w0;
      }
      if (intersect.w1) {
        resp.w1 = intersect.w1;
      }

      return resp;
    }

    return null;
  }
}