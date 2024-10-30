import HongImage from './ch02-bloom/hong-image';
import bloom from './ch02-bloom/bloom';

const hongImage = new HongImage('./ch02-bloom/bg.jpg');

hongImage.onLoad((hImg) => {
  console.log(hongImage);
  bloom.call(hongImage).run(0.3, 0.5);
  // boxBlur5.call(hongImage).run();
  // gausianBlur5.call(hongImage).run();
});