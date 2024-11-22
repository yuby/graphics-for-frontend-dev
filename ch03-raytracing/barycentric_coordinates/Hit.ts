import { vec3 } from 'gl-matrix';

export interface Hit {
  dist: number;
  normal: vec3;
  hitPoint: vec3;
  obj: any;
  w0?: number;
  w1?: number;
}