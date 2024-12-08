import type { Vector } from '../vector'
import { defineAnimation } from '../animation'
import { assign, interpolates, transitions } from '../utils'

export interface Scalable {
  scale: Vector
}

export const scale = defineAnimation((target: Scalable, diff: Vector) => {
  return assign(target, 'scale', transitions([...target.scale], diff))
})

export const scaleTo = defineAnimation((target: Scalable, to: Vector) => {
  return assign(target, 'scale', interpolates([...target.scale], to))
})
