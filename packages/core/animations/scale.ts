import { defineAnimation } from '../animation'
import { interpolateVector, transitionVector } from '../interpolate'
import { copy, type Vector } from '../vector'

export interface Scalable {
  scale: Vector
}

export const scale = defineAnimation(
  (target: Scalable, diff: Vector) => {
    return transitionVector(copy(target.scale), diff, target.scale)
  },
)

export const scaleTo = defineAnimation(
  (target: Scalable, to: Vector) => {
    return interpolateVector(copy(target.scale), to, target.scale)
  },
)
