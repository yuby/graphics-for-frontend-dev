import { vec3 } from 'gl-matrix';
import Ray from './Ray';
import Hit from './Hit';
import { SphereAttrs } from './sphere';


function trayceRay(
  start: vec3, rayDir: vec3, shpereAttrs
): Hit | null {
  let temp = vec3.create();
  const { center , radius } = shpereAttrs;
  const o_c = vec3.subtract(temp, start, center);

  const b = vec3.dot(rayDir, o_c);
  const c_ = vec3.dot(o_c, o_c) - radius * radius;
  const nabla = b * b - c_;

   if (nabla >= 0) {
    const d1 = -b + Math.sqrt(nabla);
    const d2 = -b - Math.sqrt(nabla);

    const closestDist = Math.min(d1, d2);

    const hitPoint = vec3.add(temp, start, vec3.scale(temp, rayDir, closestDist));
    const normal = vec3.normalize(temp, vec3.subtract(temp, hitPoint, center));
    // const dirToLight = vec3.normalize(temp, vec3.subtract(temp, light, point));

    // const _ambient = ambient;
    // const _diffusion = vec3.scale(temp, diffusion, Math.max(0, vec3.dot(normal, dirToLight)));
    // const specular =  1;

    return {
      dist: closestDist,
      // phongReflection: _diffusion,
      hitPoint,
      normal,
    }
   }

   return null;
}

export function rayTracer() {
  const ctx = this.canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
  const data = imageData.data;

  let currentPx = vec3.create();
  const rayDir = vec3.fromValues(0, 0, 1);
  const shpereAttrs = this.shpereAttrs;

  for (let x = 0; x < this.canvasWidth; x += 1) {
    for (let y = 0; y < this.canvasHeight; y += 1) {
      const { wX, wY, wZ } = this.transformScreenToWorld(x, y);
      const hit = trayceRay(
        vec3.set(currentPx, wX, wY, wZ), rayDir, shpereAttrs
      );

      if (hit) {
        const index = (y * this.canvasWidth + x) * 4;
        const { dist } = hit;
        data[index] = this.shpereAttrs.color[0] * dist;
        data[index + 1] = this.shpereAttrs.color[1] * dist;
        data[index + 2] = this.shpereAttrs.color[2] * dist;
        data[index + 3] = this.shpereAttrs.color[3];
        // data[index] = phongReflection[0] * 255;
        // data[index + 1] = phongReflection[1] * 255;
        // data[index + 2] = phongReflection[2] * 255;
        // data[index + 3] = this.shpereAttrs.color[3];

      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}


export class Raytracer {

  attributes: SphereAttrs | null = null;

  constructor() {

  }

  updateAttrs(attr: SphereAttrs) {
    this.attributes = { ...this.attributes, ...attr };
  }

  trace(ray: Ray) {

  }
}