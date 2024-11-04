import { vec2, vec3, vec4 } from 'gl-matrix';

export default class Controller {
  private center = vec3.create();

  private light = vec3.create();

  private color = vec4.fromValues(255, 255, 255, 255);

  private ambient = vec3.fromValues(0, 0, 0);
  private diffusion = vec3.fromValues(0, 0, 0);
  private specular = vec3.fromValues(0, 0, 0);
  private alpha = 10;
  private ks = 0.8;

  private xRange = [0, 100];

  private yRange = [0, 100];

  private zRange = [0.0, 1.0];

  private radiusRange = [0, 100];

  private radius = 0;

  private onChange: (e: Event) => void;

  constructor({
    callback,
    xRange,
    yRange,
    zRange,
    radiusRange,
    center,
    radius,
    light,
    ambient,
    diffusion,
    specular,
    alpha,
    ks,
  }: {
    callback: (e: Event) => void
    xRange: [number, number],
    yRange: [number, number],
    zRange: [number, number],
    radiusRange: [number, number],
    center: vec3,
    radius: number,
    light: vec3,
    ambient: vec3,
    diffusion: vec3,
    specular: vec3,
    alpha: number,
    ks: number,
  }) {
    this.center = center;
    this.xRange = xRange;
    this.yRange = yRange;
    this.zRange = zRange;
    this.radiusRange = radiusRange;
    this.radius = radius;
    this.onChange = callback;

    this.light = light;
    this.ambient = ambient;
    this.diffusion = diffusion;
    this.specular = specular;
    this.alpha = alpha;
    this.ks = ks;
  }

  getProps() {
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
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.left = '20px';
    container.style.padding = '20px';
    container.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';

    const centerXControl = this.createControl('centerX', this.xRange[0], this.xRange[1], this.center[0]);
    container.appendChild(centerXControl);

    const centerYControl = this.createControl('centerY', this.yRange[0], this.yRange[1], this.center[1]);
    container.appendChild(centerYControl);

    const centerZControl = this.createControl('centerZ', this.zRange[0], this.yRange[1], this.center[2]);
    container.appendChild(centerZControl);

    const redControl = this.createControl('R', 0, 255, this.color[0]);
    container.appendChild(redControl);

    const greenControl = this.createControl('G', 0, 255, this.color[1]);
    container.appendChild(greenControl);

    const blueControl = this.createControl('B', 0, 255, this.color[2]);
    container.appendChild(blueControl);

    const radiusControl = this.createControl('Radius', this.radiusRange[0], this.radiusRange[1], this.radius);
    container.appendChild(radiusControl);

    document.body.appendChild(container);
  }

  createControl(label: string, min: number, max: number, value: number) {
    const callback = this.onChange;
    const controlContainer = document.createElement('div');
    controlContainer.style.marginBottom = '10px';

    const labelElement = document.createElement('div');
    labelElement.textContent = `${label}: ${value}`;
    labelElement.style.marginBottom = '5px';

    const input = document.createElement('input');
    const key = label.toLowerCase();
    input.type = 'range';
    input.name = key;
    input.step = '0.1';
    if (key === 'r' || key === 'g' || key === 'b') {
      input.step = '1';
    }
    input.min = min.toString();
    input.max = max.toString();
    input.value = value.toString();
    input.style.width = '200px';

    input.addEventListener('input', (e: Event) => {
      if (!e.target) return;
      const target = e.target as HTMLInputElement;
      callback(e);
      labelElement.textContent = `${label}: ${target.value}`;

      if (label === 'centerX') this.center[0] = Number(target.value);
      if (label === 'centerY') this.center[1] = Number(target.value);
      if (label === 'centerZ') this.center[2] = Number(target.value);

      if (label === 'R') this.color[0] = Number(target.value);
      if (label === 'G') this.color[1] = Number(target.value);
      if (label === 'B') this.color[2] = Number(target.value);

      if (label === 'Radius') this.radius = Number(target.value);
    });

    controlContainer.appendChild(labelElement);
    controlContainer.appendChild(input);

    return controlContainer;
  }
}
