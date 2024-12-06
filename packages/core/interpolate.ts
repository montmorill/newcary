import type { FixedArray } from './utils'

export function transition(from: number, diff: number): (progress: number) => number {
  return (progress: number) => from + diff * progress
}

export function interpolate(from: number, to: number): (progress: number) => number {
  return transition(from, to - from)
}

export function transitions<const A extends number[]>(
  from: A,
  diff: FixedArray<A[number], A['length']>,
  target?: FixedArray<A[number], A['length']>,
): (progress: number) => FixedArray<A[number], A['length']> {
  return (progress: number) => from.map((from, index) => {
    const result = from + diff[index] * progress
    if (target)
      target[index] = result
    return result
  }) as any
}

export function interpolates<const A extends number[]>(
  from: A,
  to: FixedArray<A[number], A['length']>,
  target?: FixedArray<A[number], A['length']>,
): (progress: number) => FixedArray<A[number], A['length']> {
  const diff = (to as number[]).map((to, index) => to - from[index])
  return transitions(from, diff as any, target as any) as any
}
