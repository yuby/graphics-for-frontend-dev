export default class HongImage {

  private img: HTMLImageElement | null = null;

  width: number;

  height: number;

  imageData: ImageData | null = null;

  originImageData: ImageData | null = null;

  newImageData: Uint8ClampedArray;

  canvas: HTMLCanvasElement | null = null;

  ctx: CanvasRenderingContext2D | null = null;

  callback: ((hImg: HongImage) => void) | null = null;

  constructor(path) {
    this.img = new Image();
    this.width = 0;
    this.height = 0;
    this.imageData = null;
    this.originImageData = null;
    this.newImageData = new Uint8ClampedArray();
    this.canvas = null;
    this.ctx = null;
    this.callback = null;
    this.img.src = path;
  }

  async onLoad(callback) {
    if (!this.img) return;
    this.callback = callback;
    this.img.onload = () => {
      this.attachImageToCanvas(this.img);
      if (this.callback) this.callback(this);
    }
  }

  attachImageToCanvas(img) {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) throw new Error('canvas context is null');
    if (!this.canvas) throw new Error('canvas is null');;
    const width = img.width;
    const height = img.height;

     this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;


    if (!this.ctx) throw new Error('ctx is null');
    this.newImageData = this.ctx.createImageData(width, height).data;
    this.ctx.drawImage(img, 0, 0, width, height);
    this.imageData = this.ctx.getImageData(0, 0, width, height);
    this.originImageData = this.ctx.getImageData(0, 0, width, height);
    this.ctx.putImageData(this.imageData, 0, 0);
  }

  getPixel(x, y) {
    if (!this.imageData) {
      return;
    }
    if (x < 0) x = 0;
    if (x >= this.width) x = this.width - 1;
    if (y < 0) y = 0;
    if (y >= this.height) y = this.height - 1;

    const index = (y * this.width + x) * 4;

    return {
      r: this.imageData.data[index],
      g: this.imageData.data[index + 1],
      b: this.imageData.data[index + 2],
      a: this.imageData.data[index + 3],
    }
  }

  getOriginPixel(x, y) {
    if (!this.originImageData) return;
    if (x < 0) x = 0;
    if (x >= this.width) x = this.width - 1;
    if (y < 0) y = 0;
    if (y >= this.height) y = this.height - 1;

    const index = (y * this.width + x) * 4;

    return {
      r: this.originImageData.data[index],
      g: this.originImageData.data[index + 1],
      b: this.originImageData.data[index + 2],
      a: this.originImageData.data[index + 3],
    }
  }

  swapPixel(x, y, r, g, b, a) {
    if (!this.imageData) return;
    const index = (y * this.width + x) * 4;
    this.imageData.data[index] = r;
    this.imageData.data[index + 1] = g;
    this.imageData.data[index + 2] = b;
    this.imageData.data[index + 3] = a;
  }

  redraw() {
    if (!this.imageData) return;
    if (!this.ctx) throw new Error('ctx is null');
    this.ctx.putImageData(this.imageData, 0, 0);
  }
}