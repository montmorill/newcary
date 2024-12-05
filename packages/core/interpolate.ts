import { add, mul, sub, type Vector } from './vector'

export function transition(from: number, diff: number) {
  return (progress: number) => from + diff * progress
}

// eslint-disable-next-line ts/explicit-function-return-type
export function interpolate(from: number, to: number) {
  return transition(from, to - from)
}

export function transitionVector(from: Vector, diff: Vector, target?: Vector) {
  return (progress: number) => {
    const vec = add(from, mul(diff, progress))
    if (target) {
      target.x = vec.x
      target.y = vec.y
    }
    return vec
  }
}

// eslint-disable-next-line ts/explicit-function-return-type
export function interpolateVector(from: Vector, to: Vector, target?: Vector) {
  return transitionVector(from, sub(to, from), target)
}
