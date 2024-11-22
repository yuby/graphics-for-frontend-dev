import { vec3 } from 'gl-matrix';
import Sphere, { SphereAttrs } from './Sphere';
import Controller from './Controller';
import Canvas from './Canvas';
import { PerspectiveRenderer } from './Renderer'
import type { PerspectiveRenderStrategy } from './Renderer';
import { Triangle } from './Triangle';
import MyObject from './MyObject';

export default class Perspective {

  private objects: MyObject[] = [];

  private canvas: Canvas;

  private renderer: PerspectiveRenderStrategy;

  constructor() {
    this.canvas = new Canvas(
      document.getElementById('canvas') as HTMLCanvasElement,
      500,
      500
    )
    this.renderer = new PerspectiveRenderer();
    this.initSphere();
    this.render();
  }

  initSphere() {
    const light = vec3.fromValues(0, 1, -1);
    const renderCallback = () => {
      this.renderer.render(this.canvas);
    };
    const sphere1 = new Sphere(vec3.fromValues(0.6, 0, 0.5), 0.4);
    const sphere1Attrs: SphereAttrs = {
      color: vec3.fromValues(1, 1, 1),
      center: vec3.fromValues(0.6, 0, 0.5),
      radius: 0.4,
      ambient: vec3.fromValues(0.1, 0.1, 0.1),
      diffusion: vec3.fromValues(1, 0.1, 0.1),
      specular: vec3.fromValues(1, 1, 1),
      alpha: 50,
      ks: 0.8,
      light,
    };
    sphere1.updateAttrs(sphere1Attrs);

    const triangle = new Triangle(
      vec3.fromValues(-2.0, -2.0, 2.0),
      vec3.fromValues(-2.0, 2.0, 2.0),
      vec3.fromValues(2.0, 2.0, 2.0),
    );

    triangle.setAttrs({
      color: vec3.fromValues(1, 1, 1),
      ambient: vec3.fromValues(0.2, 0.2, 0.2),
      diffusion: vec3.fromValues(0.5, 0.5, 0.5),
      specular: vec3.fromValues(0.5, 0.5, 0.5),
      alpha: 5,
      ks: 0.8,
      light,
    });

    this.objects.push(triangle);
    this.objects.push(sphere1);

    new Controller(sphere1, renderCallback);

    this.renderer.setObjects(this.objects);
  }

  render() {
    this.canvas.clear();
    this.renderer.render(this.canvas);
  }
}