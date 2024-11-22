import Sphere, { SphereAttrs } from './Sphere';
import Controller from './Controller';
import { Raytracer } from './Raytracer';
import Canvas from './Canvas';
import { RaytracerRenderer } from './Renderer'
import type { RenderStrategy } from './Renderer';

export default class SphereRaytracer {

  private sphere: Sphere;

  private controller:Controller;

  private raytracer: Raytracer;

  private canvas: Canvas;

  private renderer: RenderStrategy

  constructor() {
    this.canvas = new Canvas(
      document.getElementById('canvas') as HTMLCanvasElement,
      500,
      500
    )
    this.initController();
    this.initSphere();
    this.render();
  }

  initSphere() {
    this.sphere = new Sphere();
    this.sphere.updateAttrs(this.controller.getAttrs())
  }

  onChangeConfig(attrs: SphereAttrs) {
    this.sphere.updateAttrs(attrs)
    this.renderer.render(this.sphere, this.canvas);
  }

  initController() {
    this.controller = new Controller(this.onChangeConfig.bind(this));

    this.controller.attach();
  }

  render() {
    this.renderer = new RaytracerRenderer();
    this.renderer.render(this.sphere, this.canvas);
  }
}