export type Interpolater<T> = (progress: number) => T

export function assign<T, K extends keyof T>(
  target: T,
  key: K,
  intepoloter: Interpolater<T[K]>,
): Interpolater<T[K]> {
  return (progress) => {
    const value = intepoloter(progress)
    target[key] = value
    return value
  }
}

export function transition(from: number, diff: number): Interpolater<number> {
  return progress => from + diff * progress
}

export function interpolate(from: number, to: number): Interpolater<number> {
  return transition(from, to - from)
}

type FixedArray<T, N extends number, A extends T[] = []> =
  A['length'] extends N ? A : FixedArray<T, N, [...A, T]>
type ArrayLike<T extends any[]> = FixedArray<T[number], T['length']>

export function transitions<const A extends number[]>(
  from: A,
  diff: ArrayLike<A>,
): Interpolater<A> {
  const intepoloters = from.map((from, index) => transition(from, diff[index]))
  return progress => intepoloters.map(intepoloter => intepoloter(progress)) as A
}

export function interpolates<const A extends number[]>(
  from: A,
  to: ArrayLike<A>,
): Interpolater<A> {
  const diff = (to as number[]).map((to, index) => to - from[index])
  return transitions(from, diff as ArrayLike<A>)
}
