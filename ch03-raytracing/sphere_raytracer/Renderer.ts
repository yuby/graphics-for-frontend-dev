import { vec3 } from 'gl-matrix';
import Sphere from './Sphere';
import Canvas from './Canvas';
import Hit from './Hit';

export interface RenderStrategy {
  render(sphere: Sphere, canvas: Canvas): void;
}

export class Sphere2DRenderer implements RenderStrategy {

  isInside(resp:vec3, currentPx:vec3 ,wX: number, wY: number, wZ: number, radius: number, center: vec3): boolean {
    // gl-matrix를 통한 길이 연산
    vec3.set(currentPx, wX, wY, wZ);
    const leng = vec3.length(vec3.subtract(resp, currentPx, center));

    // const dx = center[0] - wX;
    // const dy = center[1] - wY;
    // const leng = Math.sqrt(dx * dx + dy * dy);

    // gl-matrix는 복잡한 3D 변환, 대규모 행렬 연산, SIMD 최적화가 필요한 경우에 사용하면 원하는 성능을 기대할수있다.
    // 반면 단순한 2D 연산, 작은 규모의 반복 연산, 기본적인 벡터 계산의 경우에는 직접 코딩을 하는게 좋다.
    // 단순 연산이 많은 2D 작업에서는 직접 구현이, 복잡한 3D 엔진 개발에서는 gl-matrix가 더 적합할 수 있다.

    return radius > leng;
  }

  transformScreenToWorld(x: number, y: number, canvasWidth: number, canvasHeight: number, aspectRatio: number) {
    // x / canvasWidth => 0 ~ 1
    // * 2 => 0 ~ 2
    // -1 ~ 1 => -1 ~ 1
    x = ((x / canvasWidth) * 2 - 1) * aspectRatio;
    // y / canvasHeight => 0 ~ 1
    // * 2 => 0 ~ 2
    // -1 ~ 1 => -1 ~ 1
    y = 1 - (y / canvasHeight) * 2;
    // => 전체 범위를 -1 ~1의 공간으로 바꿈

    return {
      wX: x,
      wY: y,
      wZ: 0,
    };
  }
  render(sphere: Sphere, canvas: Canvas) {
    canvas.clear();
    const imageData = canvas.getImageData();
    const data = imageData.data;
    const resp = vec3.create();
    const currentPx = vec3.create();
    const sphereAttrs = sphere.getAttributes();

    if (!sphereAttrs) return;
    const { center, radius, color } = sphereAttrs;
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();


    for (let x = 0; x < canvasWidth; x += 1) {
      for (let y = 0; y < canvasHeight; y += 1) {
        const index = (y * canvasWidth + x) * 4;
        const { wX, wY, wZ } = this.transformScreenToWorld(x, y, canvasWidth, canvasHeight, canvas.getAspectRatio());

        if (this.isInside(resp, currentPx, wX, wY, wZ, radius, center)) {
          data[index] = color[0] * 255;
          data[index + 1] = color[1] * 255;
          data[index + 2] = color[2] * 255;
          data[index + 3] = 255;
        }
      }
    }

    canvas.putImageData(imageData);
  }
}

export class RaytracerRenderer implements RenderStrategy {
  render(sphere: Sphere, canvas: Canvas) {
    canvas.clear();
    const imageData = canvas.getImageData();
    const data = imageData.data;
    const currentPx = vec3.create();
    const sphereAttrs = sphere.getAttributes();
    const rayDir = vec3.fromValues(0, 0, 1);

    if (!sphereAttrs) return;
    const { center, radius, color } = sphereAttrs;
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();


    for (let x = 0; x < canvasWidth; x += 1) {
      for (let y = 0; y < canvasHeight; y += 1) {
        const { wX, wY, wZ } = this.transformScreenToWorld(x, y, canvasWidth, canvasHeight, canvas.getAspectRatio());
        const hit = this.trayceRay(vec3.set(currentPx, wX, wY, wZ), rayDir, center, radius);

        if (hit) {
          const index = (y * canvasWidth + x) * 4;
          const { dist } = hit;
          data[index] = color[0] * 255 * dist;
          data[index + 1] = color[1] * 255 * dist;
          data[index + 2] = color[2] * 255 * dist;
          data[index + 3] = 255;
        }
      }
    }

    canvas.putImageData(imageData);
  }

  trayceRay(start: vec3, rayDir: vec3, center: vec3, radius: number): Hit | null {
    const o_c = vec3.subtract(vec3.create(), start, center);

    const b = vec3.dot(rayDir, o_c);
    const c_ = vec3.dot(o_c, o_c) - radius * radius;
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
        vec3.subtract(vec3.create(), hitPoint, center)
      );

      return {
        dist: closestDist,
        hitPoint,
        normal,
      }
     }

     return null;
  }

  transformScreenToWorld(x: number, y: number, canvasWidth: number, canvasHeight: number, aspectRatio: number) {
    // x / canvasWidth => 0 ~ 1
    // * 2 => 0 ~ 2
    // -1 ~ 1 => -1 ~ 1
    x = ((x / canvasWidth) * 2 - 1) * aspectRatio;
    // y / canvasHeight => 0 ~ 1
    // * 2 => 0 ~ 2
    // -1 ~ 1 => -1 ~ 1
    y = 1 - (y / canvasHeight) * 2;
    // => 전체 범위를 -1 ~1의 공간으로 바꿈

    return {
      wX: x,
      wY: y,
      wZ: 0,
    };
  }
}