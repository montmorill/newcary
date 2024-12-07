import type { Vector } from '../vector'
import { defineAnimation } from '../animation'
import { interpolates, transitions } from '../interpolate'

export interface Positional {
  position: Vector
}

export const move = defineAnimation((target: Positional, diff: Vector) => {
  return transitions([...target.position], diff, target.position)
})

export const moveTo = defineAnimation((target: Positional, to: Vector) => {
  return interpolates([...target.position], to, target.position)
})
