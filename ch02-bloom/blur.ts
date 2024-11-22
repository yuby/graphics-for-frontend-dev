abstract class BlurEffect {
  protected self: any;
  protected width: number;
  protected height: number;
  protected kernelSize: number;

  constructor(image: any, kernelSize: number = 5) {
    this.self = image;
    this.width = image.width;
    this.height = image.height;
    this.kernelSize = kernelSize;
  }

  protected abstract horizontalIter(): void;
  protected abstract verticalIter(): void;

  public run(iterations: number = 10): void {
    for (let cnt = 0; cnt < iterations; cnt++) {
      this.verticalIter();
      this.horizontalIter();
    }
    this.self.redraw();
  }

  protected getPixelSafely(x: number, y: number) {
    return this.self.getPixel(x, y) || { r: 0, g: 0, b: 0, a: 0 };
  }

  protected swapPixel(x: number, y: number, values: number[]) {
    this.self.swapPixel(x, y, values[0], values[1], values[2], values[3]);
  }
}

export class BoxBlur5 extends BlurEffect {
  protected horizontalIter(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const sum = [0, 0, 0, 0];
        for (let curr = x - 2; curr <= x + 2; curr++) {
          const pixel = this.getPixelSafely(curr, y);
          sum[0] += pixel.r;
          sum[1] += pixel.g;
          sum[2] += pixel.b;
          sum[3] += pixel.a;
        }
        const mean = sum.map(v => Math.round(v / 5));
        this.swapPixel(x, y, mean);
      }
    }
  }

  protected verticalIter(): void {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const sum = [0, 0, 0, 0];
        for (let curr = y - 2; curr <= y + 2; curr++) {
          const pixel = this.getPixelSafely(x, curr);
          sum[0] += pixel.r;
          sum[1] += pixel.g;
          sum[2] += pixel.b;
          sum[3] += pixel.a;
        }
        const mean = sum.map(v => Math.round(v / 5));
        this.swapPixel(x, y, mean);
      }
    }
  }
}

export class GaussianBlur5 extends BlurEffect {
  private readonly weights: number[];

  constructor(image: any) {
    super(image);
    this.weights = [0.0545, 0.2442, 0.4026, 0.0545, 0.2442];
  }

  protected horizontalIter(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const weightedValue = [0, 0, 0, 0];
        for (let i = 0; i < 5; i++) {
          const curr = x - 2 + i;
          const pixel = this.getPixelSafely(curr, y);
          const weight = this.weights[i];

          weightedValue[0] += pixel.r * weight;
          weightedValue[1] += pixel.g * weight;
          weightedValue[2] += pixel.b * weight;
          weightedValue[3] += pixel.a * weight;
        }
        this.swapPixel(x, y, weightedValue);
      }
    }
  }

  protected verticalIter(): void {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const weightedValue = [0, 0, 0, 0];
        for (let i = 0; i < 5; i++) {
          const curr = y - 2 + i;
          const pixel = this.getPixelSafely(x, curr);
          const weight = this.weights[i];

          weightedValue[0] += pixel.r * weight;
          weightedValue[1] += pixel.g * weight;
          weightedValue[2] += pixel.b * weight;
          weightedValue[3] += pixel.a * weight;
        }
        this.swapPixel(x, y, weightedValue);
      }
    }
  }
}
