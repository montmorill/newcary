import type { Vector } from '../vector'
import { defineAnimation } from '../animation'
import { interpolates, transitions } from '../interpolate'

export interface Scalable {
  scale: Vector
}

export const scale = defineAnimation(
  (target: Scalable, diff: Vector) => {
    return transitions([...target.scale], diff, target.scale)
  },
)

export const scaleTo = defineAnimation(
  (target: Scalable, to: Vector) => {
    return interpolates([...target.scale], to, target.scale)
  },
)
