import { defineAnimation } from '../animation'
import { interpolate } from '../interpolate'

export interface Creatable {
  progress: number
}

export const create = defineAnimation((target: Creatable, { from = 0, to = 1 }) => {
  const interpolater = interpolate(from, to)
  return (progress) => {
    target.progress = interpolater(progress)
  }
})

export const destroy = defineAnimation((target: Creatable) => {
  return (progress) => {
    target.progress = 1 - progress
  }
})
