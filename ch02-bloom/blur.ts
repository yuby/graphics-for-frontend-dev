import HongImage from './hong-image';

export function boxBlur5() {
  const self = this;
  const horizontalIter = () => {
    for (let y = 0; y < self.height; y++) {
      for (let x = 0; x < self.width; x++) {
        const sum = [0, 0, 0, 0];
        for (let curr = x - 2; curr <= x + 2; curr += 1) {
          const pixel = self.getPixel(curr, y);
          const r = pixel.r;
          const g = pixel.g;
          const b = pixel.b;
          const a = pixel.a;
          sum[0] += r;
          sum[1] += g;
          sum[2] += b;
          sum[3] += a;
        }
        const mean = sum.map(v => Math.round(v / 5));
        self.swapPixel(x, y, mean[0], mean[1], mean[2], mean[3]);
      }
    }
  }

  const veticalIter = () => {
    for (let x = 0; x < self.width; x++) {
      for (let y = 0; y < self.height; y++) {
        const sum = [0, 0, 0, 0];
        for (let curr = y - 2; curr <= y + 2; curr += 1) {
          const pixel = self.getPixel(x, curr);
          const r = pixel.r;
          const g = pixel.g;
          const b = pixel.b;
          const a = pixel.a;
          sum[0] += r;
          sum[1] += g;
          sum[2] += b;
          sum[3] += a;
        }
        const mean = sum.map(v => Math.round(v / 5));
        self.swapPixel(x, y, mean[0], mean[1], mean[2], mean[3]);
      }
    }
  }
  return {
    run() {
      for (let cnt = 0; cnt < 10; cnt += 1) {
        veticalIter();
        horizontalIter()
      }
      self.redraw();
    }
  }
}

export function gausianBlur5() {
  const self = this as HongImage;
  let iter = 10;
  const weight = [0.0545, 0.2442, 0.4026, 0.0545, 0.2442];
  const horizontalIter = () => {
    for (let y = 0; y < self.height; y++) {
      for (let x = 0; x < self.width; x++) {
        const weightedValue = [0, 0, 0, 0];
        let idx = 0;
        for (let curr = x - 2; curr <= x + 2; curr += 1) {
          let _weight = weight[idx];
          const pixel = self.getPixel(curr, y);
          if (pixel) {
            const r = pixel.r;
            const g = pixel.g;
            const b = pixel.b;
            const a = pixel.a;
            weightedValue[0] += r * _weight;
            weightedValue[1] += g * _weight;
            weightedValue[2] += b * _weight;
            weightedValue[3] += a * _weight;
          }
          idx += 1;
        }
        idx = 0;
        self.swapPixel(x, y, weightedValue[0], weightedValue[1], weightedValue[2], weightedValue[3]);
      }
    }
  }

  const veticalIter = () => {
    for (let x = 0; x < self.width; x++) {
      for (let y = 0; y < self.height; y++) {
        const weightedValue = [0, 0, 0, 0];
        let idx = 0;
        for (let curr = y - 2; curr <= y + 2; curr += 1) {
          let _weight = weight[idx];
          const pixel = self.getPixel(x, curr);
          const r = pixel.r;
          const g = pixel.g;
          const b = pixel.b;
          const a = pixel.a;
          weightedValue[0] += r * _weight;
          weightedValue[1] += g * _weight;
          weightedValue[2] += b * _weight;
          weightedValue[3] += a * _weight;
          idx += 1;
        }
      idx = 0;
      self.swapPixel(x, y, weightedValue[0], weightedValue[1], weightedValue[2], weightedValue[3]);
      }
    }
  }
  return {
    run(it) {
      iter = it;
      for (let cnt = 0; cnt < iter; cnt += 1) {
        veticalIter();
        horizontalIter()
      }
      self.redraw();
    }
  }
}
