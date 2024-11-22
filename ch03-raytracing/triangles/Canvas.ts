export default class Canvas {
  private ctx: CanvasRenderingContext2D;

  aspectRatio: number;

  constructor(
    private canvas: HTMLCanvasElement,
    private width: number,
    private height: number
  ) {
    if (!canvas) throw new Error('canvas is null');
    this.canvas.width = width;
    this.canvas.height = height;
    if (!this.canvas.getContext('2d')) return;
    this.ctx = this.canvas.getContext('2d')!;
    this.aspectRatio = width / height;
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  getImageData(): ImageData {
    return this.ctx.getImageData(0, 0, this.width, this.height);
  }

  putImageData(imageData: ImageData): void {
    this.ctx.putImageData(imageData, 0, 0);
  }

  getAspectRatio() { return this.aspectRatio; }

  getWidth(): number { return this.width; }
  getHeight(): number { return this.height; }
}