import { vec3 } from 'gl-matrix';

interface Hit {
  dist: number
  point: vec3,
  normal: vec3,
}

function trayceRay(start: vec3, rayDir: vec3, center: vec3, radius: number): Hit | null {
  // https://en.wikipedia.org/wiki/Line%E2%80%93sphere_intersection
  let temp = vec3.create();
  const o_c = vec3.subtract(temp, start, center);

  const b = vec3.dot(rayDir, o_c);
  const c_ = vec3.dot(o_c, o_c) - radius * radius;
  const nabla = b * b - c_;

   if (nabla >= 0) {
    const d1 = -b + Math.sqrt(nabla);
    const d2 = -b - Math.sqrt(nabla);

    const point = vec3.add(temp, start, vec3.scale(temp, rayDir, d1));
    const normal = vec3.normalize(temp, vec3.subtract(temp, point, center));

    return {
      dist: Math.min(d1, d2),
      point,
      normal,
    }
   }

   return null;
}

export default function rayTracer() {
  const ctx = this.canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
  const data = imageData.data;

  let currentPx = vec3.create();
  const rayDir = vec3.fromValues(0, 0, 1);
  const centerOfSphere = this.shpereAttrs.center;
  const radiusOfSphere = this.shpereAttrs.radius;

  for (let x = 0; x < this.canvasWidth; x += 1) {
    for (let y = 0; y < this.canvasHeight; y += 1) {
      const { wX, wY, wZ } = this.transformScreenToWorld(x, y);
      const hit = trayceRay(vec3.set(currentPx, wX, wY, wZ), rayDir, centerOfSphere, radiusOfSphere);

      if (hit) {
        const index = (y * this.canvasWidth + x) * 4;
        const { dist } = hit;
        data[index] = this.shpereAttrs.color[0] * dist;
        data[index + 1] = this.shpereAttrs.color[1] * dist;
        data[index + 2] = this.shpereAttrs.color[2] * dist;
        data[index + 3] = this.shpereAttrs.color[3];

      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}