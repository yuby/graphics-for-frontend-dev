import { vec3 } from 'gl-matrix';

export default class Hit {
  dist: number;
  normal: vec3;
  hitPoint: vec3;

  constructor(dist: number, normal: vec3, hitPoint: vec3) {
    this.dist = dist;
    this.normal = normal;
    this.hitPoint = hitPoint;
  }
}