import { vec2, vec3, vec4 } from 'gl-matrix';
import Controller from './controller';
import rayTracer from './raytracer';

export default class Sphere {
  private canvas: HTMLCanvasElement | null = null;

  private canvasWidth = 0;

  private canvasHeight = 0;

  private controller:Controller;

  private shpereAttrs = {
    center: vec3.create(),
    radius: 0,
    color: vec4.fromValues(125, 125, 125, 255),
  };

  private aspectRatio = 0;

  constructor() {
    this.initCanvas();
    this.aspectRatio = this.canvasWidth / this.canvasHeight;
    this.controller = new Controller({
      callback: this.onChange.bind(this),
      xRange: [-this.aspectRatio, this.aspectRatio],
      yRange: [-1, 1],
      zRange: [0, 1],
      radiusRange: [0, 1],
      center: vec3.fromValues(0, 0, 0.5),
      radius: 0.5,
    });

    this.controller.attach();
    this.shpereAttrs = this.controller.getProps();
    this.draw();
  }

  onChange(e) {
    this.shpereAttrs = this.controller.getProps();
    this.draw();
  }

  initCanvas() {
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;

    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
  }

  transformScreenToWorld(x: number, y: number) {
    // x / this.canvasWidth => 0 ~ 1
    // * 2 => 0 ~ 2
    // -1 ~ 1 => -1 ~ 1
    x = ((x / this.canvasWidth) * 2 - 1) * this.aspectRatio;
    // y / this.canvasHeight => 0 ~ 1
    // * 2 => 0 ~ 2
    // -1 ~ 1 => -1 ~ 1
    y = 1 - (y / this.canvasHeight) * 2;
    // => 전체 범위를 -1 ~1의 공간으로 바꿈

    return {
      wX: x,
      wY: y,
      wZ: 0,
    };
  }

  intersectionRayCollision() {

  }

  isInside(resp:vec2, currentPx:vec2 ,x: number, y: number): boolean {
    const { wX, wY } = this.transformScreenToWorld(x, y);

    // gl-matrix를 통한 길이 연산
    // vec2.set(currentPx, wX, wY);
    // const leng = vec2.length(vec2.subtract(resp, currentPx, this.circleAttrs.center));

    const dx = this.shpereAttrs.center[0] - wX;
    const dy = this.shpereAttrs.center[1] - wY;
    const leng = Math.sqrt(dx * dx + dy * dy);

    // gl-matrix는 복잡한 3D 변환, 대규모 행렬 연산, SIMD 최적화가 필요한 경우에 사용하면 원하는 성능을 기대할수있다.
    // 반면 단순한 2D 연산, 작은 규모의 반복 연산, 기본적인 벡터 계산의 경우에는 직접 코딩을 하는게 좋다.
    // 단순 연산이 많은 2D 작업에서는 직접 구현이, 복잡한 3D 엔진 개발에서는 gl-matrix가 더 적합할 수 있다.

    return this.shpereAttrs.radius > leng;
  }

  draw() {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    ctx.fillStyle = 'black';  // 또는 '#000000'
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    ctx.fillStyle = 'none';

    rayTracer.call(this);
  }
}