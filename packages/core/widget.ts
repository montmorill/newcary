import type { Canvas } from 'canvaskit-wasm'
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

  animations: AnimationInstance<this, unknown>[]
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

  draw(_canvas: Canvas): void { /* Waiting for overriding... */ }

  update(canvas: Canvas, elapsed: number): void {
    canvas.save()
    canvas.translate(this.position.x, this.position.y)
    canvas.scale(this.scale.x, this.scale.y)
    this.tick(elapsed)
    this.draw(canvas)
    this.children.forEach(child => child.update(canvas, elapsed))
    canvas.restore()
  }
}
