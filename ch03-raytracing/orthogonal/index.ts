import { vec3 } from 'gl-matrix';
import Sphere, { SphereAttrs } from './Sphere';
import Controller from './Controller';
import Canvas from './Canvas';
import { PerspectiveRenderer } from './Renderer'
import type { PerspectiveRenderStrategy } from './Renderer';

export default class Orthogonal {

  private objects: Sphere[] = [];

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
    const sphere1 = new Sphere(vec3.fromValues(0.5, 0, 0.5), 0.4);
    const sphere1Attrs: SphereAttrs = {
      color: vec3.fromValues(1, 1, 1),
      center: vec3.fromValues(0.5, 0, 0.5),
      radius: 0.4,
      ambient: vec3.fromValues(0.2, 0.2, 0.2),
      diffusion: vec3.fromValues(1, 0.2, 0.2),
      specular: vec3.fromValues(0.5, 0.5, 0.5),
      alpha: 10,
      ks: 0.8,
      light,
    };
    sphere1.updateAttrs(sphere1Attrs);

    const sphere2 = new Sphere(vec3.fromValues(0, 0, 1), 0.4);
    const sphere2Attrs: SphereAttrs = {
      color: vec3.fromValues(1, 1, 1),
      center: vec3.fromValues(0, 0, 1),
      radius: 0.4,
      ambient: vec3.fromValues(0.2, 0.2, 0.2),
      diffusion: vec3.fromValues(0.2, 1, 0.2),
      specular: vec3.fromValues(0.5, 0.5, 0.5),
      alpha: 10,
      ks: 0.8,
      light,
    };
    sphere2.updateAttrs(sphere2Attrs);

    const sphere3 = new Sphere(vec3.fromValues(-0.5, 0, 1.5), 0.4);
    const sphere3Attrs: SphereAttrs = {
      color: vec3.fromValues(1, 1, 1),
      center: vec3.fromValues(-0.5, 0, 1.5),
      radius: 0.4,
      ambient: vec3.fromValues(0.2, 0.2, 0.2),
      diffusion: vec3.fromValues(0.2, 0.2, 1),
      specular: vec3.fromValues(0.5, 0.5, 0.5),
      alpha: 10,
      ks: 0.8,
      light,
    };
    sphere3.updateAttrs(sphere3Attrs);

    this.objects.push(sphere3);
    this.objects.push(sphere2);
    this.objects.push(sphere1);


    new Controller(sphere1, renderCallback);
    new Controller(sphere2, renderCallback);

    this.renderer.setObjects(this.objects);
  }

  render() {
    this.canvas.clear();
    this.renderer.render(this.canvas);
  }
}