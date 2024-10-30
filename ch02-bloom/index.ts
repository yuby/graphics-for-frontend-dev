import HongImage from './hong-image';
import bloom from './bloom';

export default function run() {
  const hongImage = new HongImage('bg.jpg');

  hongImage.onLoad((hImg) => {
    bloom.call(hongImage).run(0.3, 1);
    // boxBlur5.call(hongImage).run();
    // gausianBlur5.call(hongImage).run();
  });
}