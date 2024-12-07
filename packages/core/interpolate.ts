import type { ArrayLike } from './utils'

type Interpolater<T> = (progress: number) => T

export function transition(from: number, diff: number): Interpolater<number> {
  return (progress: number) => from + diff * progress
}

export function interpolate(from: number, to: number): Interpolater<number> {
  return transition(from, to - from)
}

export function transitions<const A extends number[]>(
  from: A,
  diff: ArrayLike<A>,
  target?: ArrayLike<A>,
): Interpolater<ArrayLike<A>> {
  return (progress: number) => from.map((from, index) => {
    const result = from + diff[index] * progress
    if (target)
      target[index] = result
    return result
  }) as any
}

export function interpolates<const A extends number[]>(
  from: A,
  to: ArrayLike<A>,
  target?: ArrayLike<A>,
): Interpolater<ArrayLike<A>> {
  const diff = (to as number[]).map((to, index) => to - from[index])
  return transitions(from, diff as any, target as any) as any
}
