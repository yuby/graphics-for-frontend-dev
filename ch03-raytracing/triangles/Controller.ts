import { vec2, vec3, vec4 } from 'gl-matrix';
import Sphere, { SphereAttrs } from './Sphere';

export default class Controller {
  constructor(
    private obj: Sphere,
    private callback?: () => void
  ) {
    this.attach();
  }

  getAttrs() {
    return this.obj.getAttrs();
  }

  attach() {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.flex = '1';
    container.style.alignItems = 'left';
    container.style.justifyContent = 'center';
    container.style.padding = '10px';
    container.style.fontSize = '12px';
    const sphereCenterWarp = this.warpControl();
    if (!this.obj.getAttrs()) return;
    const {
      center, color, radius,
      ambient, diffusion, specular,
      alpha, ks, light,
    } = this.obj.getAttrs();
    const centerXControl = this.createControl('centerX', -1, 1, center[0]);
    sphereCenterWarp.appendChild(centerXControl);
    const centerYControl = this.createControl('centerY', -1, 1, center[1]);
    sphereCenterWarp.appendChild(centerYControl);
    const centerZControl = this.createControl('centerZ', -1, 1, center[2]);
    sphereCenterWarp.appendChild(centerZControl);
    container.appendChild(sphereCenterWarp);

    const colorWarp = this.warpControl();
    const redControl = this.createControl('R', 0, 1, color[0]);
    colorWarp.appendChild(redControl);

    const greenControl = this.createControl('G', 0, 1, color[1]);
    colorWarp.appendChild(greenControl);

    const blueControl = this.createControl('B', 0, 1, color[2]);
    colorWarp.appendChild(blueControl);

    container.appendChild(colorWarp);

    const radiusControl = this.createControl('Radius', 0, 1, radius);
    container.appendChild(radiusControl);

    const ambientWarp = this.warpControl();
    const ambientRControl = this.createControl('Ambient_R', 0, 1, ambient[0]);
    ambientWarp.appendChild(ambientRControl);
    const ambientGControl = this.createControl('Ambient_G', 0, 1, ambient[1]);
    ambientWarp.appendChild(ambientGControl);
    const ambientBControl = this.createControl('Ambient_B', 0, 1, ambient[2]);
    ambientWarp.appendChild(ambientBControl);
    container.appendChild(ambientWarp);

    const diffuseWarp = this.warpControl();
    const diffuseRControl = this.createControl('Diffuse_R', 0, 1, diffusion[0]);
    diffuseWarp.appendChild(diffuseRControl);
    const diffuseGControl = this.createControl('Diffuse_G', 0, 1, diffusion[1]);
    diffuseWarp.appendChild(diffuseGControl);
    const diffuseBControl = this.createControl('Diffuse_B', 0, 1, diffusion[2]);
    diffuseWarp.appendChild(diffuseBControl);
    container.appendChild(diffuseWarp);

    const specularWarp = this.warpControl();
    const specularRControl = this.createControl('Specular_R', 0, 1, specular[0]);
    specularWarp.appendChild(specularRControl);
    const specularGControl = this.createControl('Specular_G', 0, 1, specular[1]);
    specularWarp.appendChild(specularGControl);
    const specularBControl = this.createControl('Specular_B', 0, 1, specular[2]);
    specularWarp.appendChild(specularBControl);
    container.appendChild(specularWarp);

    const alphaControl = this.createControl('Specular_Power', 0, 100, alpha);
    container.appendChild(alphaControl);

    const ksControl = this.createControl('Specular_Coefficient', 0, 1, ks);
    container.appendChild(ksControl);


    const lightWrap = this.warpControl();
    const lightRControl = this.createControl('Light_X', -10, 10, light[0]);
    lightWrap.appendChild(lightRControl);
    const lightGControl = this.createControl('Light_Y', -10, 10, light[1]);
    lightWrap.appendChild(lightGControl);
    const lightBControl = this.createControl('Light_Z', -10, 10, light[2]);
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
    const controlContainer = document.createElement('div');
    controlContainer.style.marginBottom = '10px';

    const labelElement = document.createElement('div');
    labelElement.textContent = `${label}: ${+value.toFixed(2)}`;
    labelElement.style.marginBottom = '5px';

    const input = document.createElement('input');
    const key = label.toLowerCase();
    input.type = 'range';
    input.name = key;
    input.step = '0.1';
    input.min = min.toString();
    input.max = max.toString();
    input.value = value.toString();
    input.style.width = '200px';

    input.addEventListener('input', (e: Event) => {
      if (!e.target) return;
      const target = e.target as HTMLInputElement;
      labelElement.textContent = `${label}: ${(+target.value).toFixed(2)}`;
      const { center } = this.obj.getAttrs();

      if (label === 'centerX') this.obj.setAttrs({ center: vec3.fromValues(Number(target.value), center[1], center[2]) });
      if (label === 'centerY') this.obj.setAttrs({ center: vec3.fromValues(center[0], Number(target.value), center[2]) });
      if (label === 'centerZ') this.obj.setAttrs({ center: vec3.fromValues(center[0], center[1], Number(target.value),) });

      if (label === 'R') this.obj.setAttrs({ color: vec3.fromValues(Number(target.value), this.obj.getAttrs().color[1], this.obj.getAttrs().color[2]) });
      if (label === 'G') this.obj.setAttrs({ color: vec3.fromValues(this.obj.getAttrs().color[0], Number(target.value), this.obj.getAttrs().color[2]) });
      if (label === 'B') this.obj.setAttrs({ color: vec3.fromValues(this.obj.getAttrs().color[0], this.obj.getAttrs().color[1], Number(target.value)) });

      if (label === 'Ambient_R') this.obj.setAttrs({ ambient: vec3.fromValues(Number(target.value), this.obj.getAttrs().ambient[1], this.obj.getAttrs().ambient[2]) });
      if (label === 'Ambient_G') this.obj.setAttrs({ ambient: vec3.fromValues(this.obj.getAttrs().ambient[0], Number(target.value), this.obj.getAttrs().ambient[2]) });
      if (label === 'Ambient_B') this.obj.setAttrs({ ambient: vec3.fromValues(this.obj.getAttrs().ambient[0], this.obj.getAttrs().ambient[1], Number(target.value)) });

      if (label === 'Diffuse_R') this.obj.setAttrs({ diffusion: vec3.fromValues(Number(target.value), this.obj.getAttrs().diffusion[1], this.obj.getAttrs().diffusion[2]) });
      if (label === 'Diffuse_G') this.obj.setAttrs({ diffusion: vec3.fromValues(this.obj.getAttrs().diffusion[0], Number(target.value), this.obj.getAttrs().diffusion[2]) });
      if (label === 'Diffuse_B') this.obj.setAttrs({ diffusion: vec3.fromValues(this.obj.getAttrs().diffusion[0], this.obj.getAttrs().diffusion[1], Number(target.value)) });

      if (label === 'Specular_R') this.obj.setAttrs({ specular: vec3.fromValues(Number(target.value), this.obj.getAttrs().specular[1], this.obj.getAttrs().specular[2]) });
      if (label === 'Specular_G') this.obj.setAttrs({ specular: vec3.fromValues(this.obj.getAttrs().specular[0], Number(target.value), this.obj.getAttrs().specular[2]) });
      if (label === 'Specular_B') this.obj.setAttrs({ specular: vec3.fromValues(this.obj.getAttrs().specular[0], this.obj.getAttrs().specular[1], Number(target.value)) });

      if (label === 'Specular_Power') this.obj.setAttrs({ alpha: Number(target.value) });
      if (label === 'Specular_Coefficient') this.obj.setAttrs({ ks: Number(target.value) });

      if (label === 'Light_X') this.obj.setAttrs({ light: vec3.fromValues(Number(target.value), this.obj.getAttrs().light[1], this.obj.getAttrs().light[2]) });
      if (label === 'Light_Y') this.obj.setAttrs({ light: vec3.fromValues(this.obj.getAttrs().light[0], Number(target.value), this.obj.getAttrs().light[2]) });
      if (label === 'Light_Z') this.obj.setAttrs({ light: vec3.fromValues(this.obj.getAttrs().light[0], this.obj.getAttrs().light[1], Number(target.value)) });

      if (label === 'Radius') this.obj.setAttrs({
        radius: Number(target.value),
      });
      if (this.callback) this.callback();
    });

    controlContainer.appendChild(labelElement);
    controlContainer.appendChild(input);

    return controlContainer;
  }
}
