import type { Vector } from '../vector'
import { defineAnimation } from '../animation'
import { assign, interpolates, transitions } from '../utils'

export interface Positional {
  position: Vector
}

export const move = defineAnimation((target: Positional, diff: Vector) => {
  return assign(target, 'position', transitions([...target.position], diff))
})

export const moveTo = defineAnimation((target: Positional, to: Vector) => {
  return assign(target, 'position', interpolates([...target.position], to))
})
