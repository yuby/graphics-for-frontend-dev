import { GaussianBlur5 } from './Blur';

const clamp = (val: number, min: number, max: number): number =>
  Math.min(Math.max(val, min), max);

// Bloom effect class
export class BloomEffect {
  private self: any; // Replace 'any' with proper HongImage type
  private threshold: number;
  private weight: number;
  private gaussianBlur: any; // Replace with proper type from previous implementation

  constructor(image: any) {
    this.self = image;
    this.threshold = 0;
    this.weight = 1;
    this.gaussianBlur = new GaussianBlur5(image);
  }

  private calculateRelativeLuminance(r: number, g: number, b: number): number {
    return 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
  }

  private applyDarkThreshold(): void {
    for (let y = 0; y < this.self.height; y++) {
      for (let x = 0; x < this.self.width; x++) {
        const { r, g, b, a } = this.self.getPixel(x, y);
        const relativeLuminance = this.calculateRelativeLuminance(r, g, b);

        if (relativeLuminance < this.threshold) {
          this.self.swapPixel(x, y, 0, 0, 0, a);
        }
      }
    }
  }

  private applyBloom(): void {
    for (let y = 0; y < this.self.height; y++) {
      for (let x = 0; x < this.self.width; x++) {
        const { r, g, b, a } = this.self.getPixel(x, y);
        const originalPixel = this.self.getOriginPixel(x, y);

        if (originalPixel && 'r' in originalPixel && 'g' in originalPixel && 'b' in originalPixel) {
          const bloomR = clamp(r * this.weight + originalPixel.r, 0, 255);
          const bloomG = clamp(g * this.weight + originalPixel.g, 0, 255);
          const bloomB = clamp(b * this.weight + originalPixel.b, 0, 255);

          this.self.swapPixel(x, y, bloomR, bloomG, bloomB, a);
        }
      }
    }
  }

  public run(threshold: number = 0, weight: number = 1, blurIterations: number = 20): void {
    this.threshold = threshold;
    this.weight = weight;

    this.applyDarkThreshold();
    this.gaussianBlur.run(blurIterations);
    this.applyBloom();
    this.self.redraw();
  }

  // Getter/Setter methods for more control
  public setThreshold(threshold: number): void {
    this.threshold = clamp(threshold, 0, 1);
  }

  public setWeight(weight: number): void {
    this.weight = weight;
  }

  public getThreshold(): number {
    return this.threshold;
  }

  public getWeight(): number {
    return this.weight;
  }
}
