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

  // intersectionRayCollision() {

  // }

  // transformScreenToWorld(x: number, y: number) {
  //   // x / this.canvasWidth => 0 ~ 1
  //   // * 2 => 0 ~ 2
  //   // -1 ~ 1 => -1 ~ 1
  //   x = ((x / this.canvasWidth) * 2 - 1) * this.aspectRatio;
  //   // y / this.canvasHeight => 0 ~ 1
  //   // * 2 => 0 ~ 2
  //   // -1 ~ 1 => -1 ~ 1
  //   y = 1 - (y / this.canvasHeight) * 2;
  //   // => 전체 범위를 -1 ~1의 공간으로 바꿈

  //   return {
  //     wX: x,
  //     wY: y,
  //     wZ: 0,
  //   };
  // }

  // intersectRayCollision(ray: Ray) {
  //   if (!this.attributes) return;
  //   let temp = vec3.create();
  //   const { center, radius } = this.attributes;
  //   const o_c = vec3.subtract(temp, ray.start, center);

  //   const b = vec3.dot(ray.rayDir, o_c);
  //   const c_ = vec3.dot(o_c, o_c) - radius * radius;
  //   const nabla = b * b - c_;

  //   const dist = 1;
  //   const normal = vec3.create();
  //   const hitPoint = vec3.create();

  //   return new Hit(dist, normal, hitPoint);
  // }

  // isInside(resp:vec3, currentPx:vec3 ,wX: number, wY: number, wZ: number, radius: number, center: vec3): boolean {
  //   // gl-matrix를 통한 길이 연산
  //   vec3.set(currentPx, wX, wY, wZ);
  //   const leng = vec3.length(vec3.subtract(resp, currentPx, center));

  //   // const dx = center[0] - wX;
  //   // const dy = center[1] - wY;
  //   // const leng = Math.sqrt(dx * dx + dy * dy);

  //   // gl-matrix는 복잡한 3D 변환, 대규모 행렬 연산, SIMD 최적화가 필요한 경우에 사용하면 원하는 성능을 기대할수있다.
  //   // 반면 단순한 2D 연산, 작은 규모의 반복 연산, 기본적인 벡터 계산의 경우에는 직접 코딩을 하는게 좋다.
  //   // 단순 연산이 많은 2D 작업에서는 직접 구현이, 복잡한 3D 엔진 개발에서는 gl-matrix가 더 적합할 수 있다.

  //   return radius > leng;
  // }

  // render(renderer: any) {
  //   if (!this.ctx) return;
  //   if (!this.attributes) return;
  //   this.clearCanvas();

  //   const imageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
  //   const data = imageData.data;
  //   const resp = vec3.create();
  //   const currentPx = vec3.create();
  //   const { center, radius, color } = this.attributes;

  //   for (let x = 0; x < this.canvasWidth; x += 1) {
  //     for (let y = 0; y < this.canvasHeight; y += 1) {
  //       const index = (y * this.canvasWidth + x) * 4;
  //       const { wX, wY, wZ } = this.transformScreenToWorld(x, y);

  //       if (this.isInside(resp, currentPx, wX, wY, wZ, radius, center)) {
  //         data[index] = color[0] * 255;
  //         data[index + 1] = color[1] * 255;
  //         data[index + 2] = color[2] * 255;
  //         data[index + 3] = 255;
  //       }
  //     }
  //   }

  //   this.ctx.putImageData(imageData, 0, 0);
  // }
}