import type { Canvas, CanvasKit } from 'canvaskit-wasm'
import type { Animation, AnimationInstance } from './animation'
import type { Positional } from './animations/move'
import type { Scalable } from './animations/scale'
import type { Vector } from './vector'
import { tick } from './animation'
import { vector } from './vector'

export class Widget implements Positional, Scalable {
  position: Vector = vector()
  scale: Vector = vector(1)

  parent?: Widget
  children: Widget[] = []
  add(...children: Widget[]): this {
    children.forEach(child => child.parent = this)
    this.children.push(...children)
    return this
  }

  animations: AnimationInstance<this, unknown>[] = []
  animate<A>(
    animation: Animation<this, A>,
    context: Omit<AnimationInstance<this, A>, 'animation' | 'target'>,
  ): this {
    (this.animations as AnimationInstance<this, A>[]).push({
      ...context,
      animation,
      target: this,
    })
    return this
  }

  private tick(elapsed: number): void {
    this.animations = this.animations.filter(
      <A>(animation: AnimationInstance<this, A>) =>
        tick(animation, elapsed),
    )
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  draw(canvas: Canvas, sk: CanvasKit): void {
    // Waiting for overriding...
  }

  update(sk: CanvasKit, canvas: Canvas, elapsed: number): void {
    canvas.save()
    canvas.translate(...this.position)
    canvas.scale(...this.scale)
    this.tick(elapsed)
    this.draw(canvas, sk)
    this.children.forEach(child => child.update(sk, canvas, elapsed))
    canvas.restore()
  }
}
