import type { Accessor } from './signal'
import { effect, type EffectBucket, track, trigger } from './effect'

export function memo<T>(accessor: Accessor<T>): Accessor<T> {
  const bucket: EffectBucket = new Set()
  let value: T
  let dirty = true

  const f = effect(accessor, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true
        trigger(bucket)
      }
    },
  })

  return () => {
    if (dirty) {
      value = f() as T
      dirty = false
    }

    track(bucket)
    return value
  }
}
