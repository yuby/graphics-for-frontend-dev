import HongImage from './Hong-image';
import { BloomEffect } from './Bloom';
import { BoxBlur5, GaussianBlur5 } from './Blur';

export default function run() {
  const hongImage = new HongImage('bg.jpg');

  hongImage.onLoad((hImg) => {
    // const boxBlur5 = new BoxBlur5(hImg);
    // boxBlur5.run();

    // const gausianBlur5 = new GaussianBlur5(hImg);
    // gausianBlur5.run();

    const bloomEffect = new BloomEffect(hImg);
    bloomEffect.run();
  });
}