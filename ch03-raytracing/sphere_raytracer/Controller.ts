import { vec3 } from 'gl-matrix';
import { SphereAttrs } from './Sphere';

export default class Controller {
  private center = vec3.fromValues(0, 0, 0);

  private light = vec3.fromValues(0, 0, 0);

  private color = vec3.fromValues(1, 1, 1);

  private ambient = vec3.fromValues(0, 0, 0);
  private diffusion = vec3.fromValues(0, 0, 0);
  private specular = vec3.fromValues(0, 0, 0);
  private alpha = 10;
  private ks = 0.8;

  private radius = 0.5;

  private onChange: (props: SphereAttrs) => void;

  constructor(callback: (props: SphereAttrs) => void) {
    this.onChange = callback;
  }

  getAttrs() {
    return {
      center: this.center,
      color: this.color,
      radius: this.radius,
      light: this.light,
      ambient: this.ambient,
      diffusion: this.diffusion,
      specular: this.specular,
      alpha: this.alpha,
      ks: this.ks,
    }
  }

  attach() {
    const container = document.createElement('div');
    const sphereCenterWarp = this.warpControl();
    const centerXControl = this.createControl('centerX', -1, 1, this.center[0]);
    sphereCenterWarp.appendChild(centerXControl);
    const centerYControl = this.createControl('centerY', -1, 1, this.center[1]);
    sphereCenterWarp.appendChild(centerYControl);
    const centerZControl = this.createControl('centerZ', -1, 1, this.center[2]);
    sphereCenterWarp.appendChild(centerZControl);
    container.appendChild(sphereCenterWarp);

    const colorWarp = this.warpControl();
    const redControl = this.createControl('R', 0, 1, this.color[0]);
    colorWarp.appendChild(redControl);

    const greenControl = this.createControl('G', 0, 1, this.color[1]);
    colorWarp.appendChild(greenControl);

    const blueControl = this.createControl('B', 0, 1, this.color[2]);
    colorWarp.appendChild(blueControl);

    container.appendChild(colorWarp);

    const radiusControl = this.createControl('Radius', 0, 1, this.radius);
    container.appendChild(radiusControl);

    const ambientWarp = this.warpControl();
    const ambientRControl = this.createControl('Ambient_R', 0, 1, this.ambient[0]);
    ambientWarp.appendChild(ambientRControl);
    const ambientGControl = this.createControl('Ambient_G', 0, 1, this.ambient[1]);
    ambientWarp.appendChild(ambientGControl);
    const ambientBControl = this.createControl('Ambient_B', 0, 1, this.ambient[2]);
    ambientWarp.appendChild(ambientBControl);
    container.appendChild(ambientWarp);

    const diffuseWarp = this.warpControl();
    const diffuseRControl = this.createControl('Diffuse_R', 0, 1, this.diffusion[0]);
    diffuseWarp.appendChild(diffuseRControl);
    const diffuseGControl = this.createControl('Diffuse_G', 0, 1, this.diffusion[1]);
    diffuseWarp.appendChild(diffuseGControl);
    const diffuseBControl = this.createControl('Diffuse_B', 0, 1, this.diffusion[2]);
    diffuseWarp.appendChild(diffuseBControl);
    container.appendChild(diffuseWarp);

    const specularWarp = this.warpControl();
    const specularRControl = this.createControl('Specular_R', 0, 1, this.specular[0]);
    specularWarp.appendChild(specularRControl);
    const specularGControl = this.createControl('Specular_G', 0, 1, this.specular[1]);
    specularWarp.appendChild(specularGControl);
    const specularBControl = this.createControl('Specular_B', 0, 1, this.specular[2]);
    specularWarp.appendChild(specularBControl);
    container.appendChild(specularWarp);

    const alphaControl = this.createControl('Alpha', 0, 30, this.alpha);
    container.appendChild(alphaControl);

    const ksControl = this.createControl('Ks', 0, 1, this.ks);
    container.appendChild(ksControl);


    const lightWrap = this.warpControl();
    const lightRControl = this.createControl('Light_X', -2, 2, this.light[0]);
    lightWrap.appendChild(lightRControl);
    const lightGControl = this.createControl('Light_Y', -2, 2, this.light[1]);
    lightWrap.appendChild(lightGControl);
    const lightBControl = this.createControl('Light_Z', -2, 2, this.light[2]);
    lightWrap.appendChild(lightBControl);
    container.appendChild(lightWrap);

    document.getElementById('config')?.appendChild(container);
  }

  warpControl() {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'row';

    return container;
  }

  createControl(label: string, min: number, max: number, value: number) {
    const callback = this.onChange;
    const controlContainer = document.createElement('div');
    // controlContainer.style.marginBottom = '10px';

    const labelElement = document.createElement('div');
    labelElement.style.fontSize = '12px';
    labelElement.textContent = `${label}: ${value}`;
    // labelElement.style.marginBottom = '5px';

    const input = document.createElement('input');
    const key = label.toLowerCase();
    input.type = 'range';
    input.name = key;
    input.step = '0.1';
    input.min = min.toString();
    input.max = max.toString();
    input.value = value.toString();
    // input.style.width = '200px';

    input.addEventListener('input', (e: Event) => {
      if (!e.target) return;
      const target = e.target as HTMLInputElement;
      labelElement.textContent = `${label}: ${target.value}`;

      if (label === 'centerX') this.center[0] = Number(target.value);
      if (label === 'centerY') this.center[1] = Number(target.value);
      if (label === 'centerZ') this.center[2] = Number(target.value);

      if (label === 'R') this.color[0] = Number(target.value);
      if (label === 'G') this.color[1] = Number(target.value);
      if (label === 'B') this.color[2] = Number(target.value);

      if (label === 'Ambient_R') this.ambient[0] = Number(target.value);
      if (label === 'Ambient_G') this.ambient[1] = Number(target.value);
      if (label === 'Ambient_B') this.ambient[2] = Number(target.value);

      if (label === 'Diffuse_R') this.diffusion[0] = Number(target.value);
      if (label === 'Diffuse_G') this.diffusion[1] = Number(target.value);
      if (label === 'Diffuse_B') this.diffusion[2] = Number(target.value);

      if (label === 'Specular_R') this.specular[0] = Number(target.value);
      if (label === 'Specular_G') this.specular[1] = Number(target.value);
      if (label === 'Specular_B') this.specular[2] = Number(target.value);

      if (label === 'Alpha') this.alpha = Number(target.value);
      if (label === 'Ks') this.ks = Number(target.value);
      if (label === 'Light') this.light[0] = Number(target.value);

      if (label === 'Radius') this.radius = Number(target.value);

      callback(this.getAttrs());
    });

    controlContainer.appendChild(labelElement);
    controlContainer.appendChild(input);

    return controlContainer;
  }
}
