import { defineAnimation } from '../animation'
import { assign, interpolate } from '../utils'

export interface Creatable {
  progress: number
}

export const create = defineAnimation((target: Creatable, { from = 0, to = 1 }) => {
  return assign(target, 'progress', interpolate(from, to))
})

export const destroy = defineAnimation((target: Creatable, { from = 1, to = 0 }) => {
  return assign(target, 'progress', interpolate(from, to))
})
