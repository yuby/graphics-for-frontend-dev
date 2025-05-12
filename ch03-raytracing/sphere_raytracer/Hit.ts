import { vec3 } from 'gl-matrix';

export default class Hit {
  dist: number; // 광선 시작부터 충돌점까지의 거리
  normal: vec3; // 충돌점에서 표면의 수직 벡터
  hitPoint: vec3; // 충돌점

  constructor(dist: number, normal: vec3, hitPoint: vec3) {
    this.dist = dist;
    this.normal = normal;
    this.hitPoint = hitPoint;
  }
}