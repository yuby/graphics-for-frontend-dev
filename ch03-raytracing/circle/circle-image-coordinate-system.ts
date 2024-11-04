import { vec2, vec4 } from 'gl-matrix';
import Controller from './controller';

export default class Circle {
  private canvas: HTMLCanvasElement | null = null;

  private canvasWidth = 0;

  private canvasHeight = 0;

  private controller:Controller;

  private circleAttrs = {
    center: vec2.create(),
    radius: 0,
    color: vec4.fromValues(0, 0, 0, 255),
  };

  constructor() {
    this.initCanvas();
    this.controller = new Controller({
      callback: this.onChange.bind(this),
      xRange: [0, this.canvasWidth],
      yRange: [0, this.canvasHeight],
      radiusRange: [0, 100],
      center: vec2.fromValues(this.canvasWidth / 2, this.canvasHeight / 2),
      radius: 50,
    });

    this.controller.attach();
    this.circleAttrs = this.controller.getProps();
    this.draw();
  }

  onChange(e) {
    this.circleAttrs = this.controller.getProps();
    this.draw();
  }

  initCanvas() {
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;

    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
  }

  isInside(resp:vec2, currentPx:vec2 ,x: number, y: number): boolean {
    // vec2.set(currentPx, x, y);
    // const leng = vec2.length(vec2.subtract(resp, currentPx, this.circleAttrs.center));

    const dx = this.circleAttrs.center[0] - x;
    const dy = this.circleAttrs.center[1] - y;
    const leng = Math.sqrt(dx * dx + dy * dy);

    // gl-matrix는 복잡한 3D 변환, 대규모 행렬 연산, SIMD 최적화가 필요한 경우에 사용하면 원하는 성능을 기대할수있다.
    // 반면 단순한 2D 연산, 작은 규모의 반복 연산, 기본적인 벡터 계산의 경우에는 직접 코딩을 하는게 좋다.
    // 단순 연산이 많은 2D 작업에서는 직접 구현이, 복잡한 3D 엔진 개발에서는 gl-matrix가 더 적합할 수 있다.

    return this.circleAttrs.radius > leng;
  }

  draw() {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    const imageData = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    const data = imageData.data;
    const resp = vec2.create();
    const currentPx = vec2.create();


    for (let x = 0; x < this.canvasWidth; x += 1) {
      for (let y = 0; y < this.canvasHeight; y += 1) {
        const index = (y * this.canvasWidth + x) * 4;
        // vec2.set(currentPx, x, y);
        // const leng = vec2.length(vec2.subtract(resp, currentPx, this.circleAttrs.center));
        if (this.isInside(resp, currentPx, x, y)) {
          data[index] = this.circleAttrs.color[0];
          data[index + 1] = this.circleAttrs.color[1];
          data[index + 2] = this.circleAttrs.color[2];
          data[index + 3] = this.circleAttrs.color[3];
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }
}