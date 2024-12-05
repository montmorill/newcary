import { defineAnimation } from '../animation'
import { interpolateVector, transitionVector } from '../interpolate'
import { copy, type Vector } from '../vector'

export interface Positional {
  position: Vector
}

export const move = defineAnimation(
  (target: Positional, diff: Vector) => {
    return transitionVector(copy(target.position), diff, target.position)
  },
)

export const moveTo = defineAnimation(
  (target: Positional, to: Vector) => {
    return interpolateVector(copy(target.position), to, target.position)
  },
)
