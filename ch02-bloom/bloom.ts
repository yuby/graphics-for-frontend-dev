import { gausianBlur5 } from './blur';

export default function bloom() {
    const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

    const self = this;
    let threashold = 0;
    let weight = 1;

    const toDark = () => {
      console.log(self);
      for (let y = 0; y <= self.height; y += 1) {
        for (let x = 0; x <= self.width; x += 1) {
          const { r, g, b, a } = self.getPixel(x, y);
          const relativeLuminace = 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);

          if (relativeLuminace < threashold) {
            self.swapPixel(x, y, 0, 0, 0, a);
          }
        }
      }
    }

    const _bloom = () => {
      for (let y = 0; y <= self.height; y += 1) {
        for (let x = 0; x <= self.width; x += 1) {
          const { r, g, b, a } = self.getPixel(x, y);
          const { r: or, g: og, b: ob } = self.getOriginPixel(x, y);

          const bloomR = clamp(r * weight + or, 0, 255);
          const bloomG = clamp(g * weight + og, 0, 255);
          const bloomB = clamp(b * weight + ob, 0, 255);

          self.swapPixel(x, y, bloomR, bloomG, bloomB, a);
        }
      }
    }



    return {
      run(th, wh) {
        threashold = th;
        weight = wh;
        console.log(self)


        toDark();
        gausianBlur5.call(self).run(20);
        _bloom();
        self.redraw();
      }
    }
  }