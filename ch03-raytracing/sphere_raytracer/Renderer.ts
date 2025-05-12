import { vec3 } from 'gl-matrix';
import Sphere from './Sphere';
import Canvas from './Canvas';
import Hit from './Hit';

export interface RenderStrategy {
  render(sphere: Sphere, canvas: Canvas): void;
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

    const b = vec3.dot(rayDir, o_c); // 광선 방향과 (시작점-구 중심) 벡터의 내적
    // (시작점-구 중심) 벡터의 제곱 크기에서 반지름 제곱을 뺀 값
    // 광선 시작점이 구와 얼마나 떨어져 있는지
    const c_ = vec3.dot(o_c, o_c) - radius * radius;
    const nabla = b * b - c_; // 판별식 (이차방정식의 해가 존재하는지 판단하는 값)

    // nabla < 0 => 구와 광선이 만나지 않음
    // nabla = 0 => 구와 광선이 한 점에서 만나는 경우
    // nabla > 0 => 구와 광선이 두 점에서 만나는 경우

    if (nabla >= 0) { // 구와 광선이 만나는 경우
      const d1 = -b + Math.sqrt(nabla);
      const d2 = -b - Math.sqrt(nabla);
      if (d1 < 0 && d2 < 0) return null;
      
       // 광선이 구의 두개의 점과 충돌하는경우 먼저 충돌하는 점을 찾음, 뒤에 점은 안보이는 부분임
       // 광선의 시작점에서 충돌지점까지의 거리
      const closestDist = Math.min(
        d1 < 0 ? Infinity : d1,
        d2 < 0 ? Infinity : d2
      );

      // 충돌 위치 계산: 시작점(start) + 광선방향(rayDir) * 충돌까지의 거리(closestDist)
      // 1. vec3.scale: 광선 방향 벡터에 거리를 곱해 이동 벡터 생성
      // 2. vec3.add: 시작점에 이동 벡터를 더해 충돌 위치 계산
      // 각 픽셀에서 광선을 쏴서 실제 물체와 충돌하는지를 보는것이다.
      // start는 광선의 시작점
      // P = P₀ + t·D
      // P₀는 광선의 시작점
      // t는 광선의 시작점에서 충돌지점까지의 거리
      // D는 광선의 방향
      // P는 충돌지점
      // 광선의 직선방정식임
      const hitPoint = vec3.add(
        vec3.create(),
        start,
        vec3.scale(vec3.create(), rayDir, closestDist) // 광선의 시작점에서 충돌지점까지의 이동 벡터
      );

      // 법선 벡터 계산: 구의 중심에서 충돌 지점으로 향하는 벡터를 정규화
      // 1. vec3.subtract: 충돌 지점(hitPoint)에서 구의 중심(center)을 뺀 벡터 계산
      //    → 이 벡터는 구의 중심에서 충돌 지점으로 향하는 방향을 가짐
      // 2. vec3.normalize: 벡터의 길이를 1로 정규화하여 단위 벡터로 변환
      //    → 이것이 충돌 지점에서의 법선 벡터가 됨 (구의 표면에 수직인 방향)
      const normal = vec3.normalize(
        vec3.create(),
        vec3.subtract(vec3.create(), hitPoint, center) // 구의 중심에서 충돌 지점으로 향하는 벡터 -> 충돌지점에 수직임
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