import { type EffectBucket, pauseTracking, resetTracking, track, trigger } from './effect'

export type Setter<T> = (newValue: T) => void
export type Mapper<T> = (mapfn: (value: T) => T) => void
export type Accessor<T> = () => T
export type Signal<T> = [Accessor<T>, Setter<T>, Mapper<T>]

export interface SignalOptions<T = unknown> { equals?: false | ((x: unknown, y: unknown) => boolean) | ((x: T, y: T) => boolean) }

export function signal<T>(initialValue: T, { equals = Object.is }: SignalOptions<T> = {}): Signal<T> {
  const bucket: EffectBucket = new Set()
  let value: T = initialValue

  // todo: should we merge the setter and the mapper
  const setter: Setter<T> = (x) => {
    if (equals && equals(x, value))
      return
    value = x
    trigger(bucket)
  }

  const accessor: Accessor<T> = () => {
    track(bucket)
    return value
  }

  const mapper: Mapper<T> = f => setter(f(value))

  return [accessor, setter, mapper]
}

export function peek<T>(accessor: Accessor<T>): T {
  try {
    pauseTracking()
    return accessor()
  }
  finally {
    resetTracking()
  }
}
