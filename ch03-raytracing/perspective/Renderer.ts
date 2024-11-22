import { vec3 } from 'gl-matrix';
import Sphere, { SphereAttrs } from './Sphere';
import Canvas from './Canvas';
import Hit from './Hit';

export interface RenderStrategy {
  render(sphere: Sphere, canvas: Canvas): void;
}
export interface PerspectiveRenderStrategy {
  render(canvas: Canvas): void;
  setObjects(objects: Sphere[]): void;
  findClosestCollision(start: vec3, rayDir: vec3): Hit | null;
}

export class PerspectiveRenderer implements PerspectiveRenderStrategy {
  private objects: Sphere[] = [];

  setObjects(objects: Sphere[]) {
    this.objects = objects;
  }

  findClosestCollision(start: vec3, rayDir: vec3): Hit | null {
    let closestHit: Hit | null = null;
    let closestDist = Infinity;

    this.objects.forEach((sphere) => {
      const hit = sphere.checkRayCollision(start, rayDir);

      if (hit && hit.dist >= 0 && hit.dist < closestDist) {
        closestDist = hit.dist;
        closestHit = hit;
        closestHit.obj = sphere;
      }
    });

    return closestHit;
  }
  // findClosestCollision(start: vec3, rayDir: vec3): Hit | null {
  //   for (const sphere of this.objects) {
  //     const hit = sphere.checkRayCollision(start, rayDir);
  //     if (hit && hit.dist >= 0) {
  //         hit.obj = sphere;
  //         return hit;
  //     }
  //   }
  //   return null;
  // }

  trayceRay(start: vec3, rayDir: vec3) {
    const hit = this.findClosestCollision(start, rayDir);

    if (hit && hit.dist >= 0) {
      const { light, ambient, diffusion, specular, ks, alpha } = hit.obj;
      const { normal } = hit;
      const dirToLight = vec3.normalize(
        vec3.create(),
        vec3.subtract(vec3.create(), light, hit.hitPoint)
      );
      const diffuseIntensity = Math.max(0, vec3.dot(normal, dirToLight));
      const diffuse = vec3.scale(vec3.create(), diffusion, diffuseIntensity);

      const refectDir = vec3.subtract(
        vec3.create(),
        vec3.scale(vec3.create(), normal, 2 * vec3.dot(normal, dirToLight)),
        dirToLight
      );

      const toEye = vec3.scale(vec3.create(), rayDir, -1);
      const specularIntensity = Math.max(0, vec3.dot(toEye, refectDir));
      const specularPower = Math.pow(specularIntensity, alpha);
      const _specular = vec3.scale(vec3.create(), vec3.scale(vec3.create(), specular, specularPower), ks);

      return vec3.add(vec3.create(), vec3.add(vec3.create(), ambient, diffuse), _specular);
    }

    return vec3.fromValues(0, 0, 0);
  }

  render(canvas: Canvas) {
    canvas.clear();
    const imageData = canvas.getImageData();
    const data = imageData.data;
    const eyePos = vec3.fromValues(0, 0, -1);
    // const rayDir = vec3.fromValues(0, 0, 1);

    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    for (let x = 0; x < canvasWidth; x += 1) {
      for (let y = 0; y < canvasHeight; y += 1) {
        const { wX, wY, wZ } = this.transformScreenToWorld(x, y, canvasWidth, canvasHeight, canvas.getAspectRatio());
        const rayDir = vec3.normalize(vec3.create(), vec3.subtract(vec3.create(), vec3.set(vec3.create(), wX, wY, wZ), eyePos));
        const color = this.trayceRay(vec3.set(vec3.create(), wX, wY, wZ), rayDir);
        const index = (y * canvasWidth + x) * 4;
        data[index] = color[0] * 255;
        data[index + 1] = color[1] * 255;
        data[index + 2] = color[2] * 255;
        data[index + 3] = 255;
      }
    }

    canvas.putImageData(imageData);
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