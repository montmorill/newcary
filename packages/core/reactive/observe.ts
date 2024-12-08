import type { DisposeFn } from '../shared'
import type { Accessor } from './signal'
import { cleanup, clearScope, createScope, type Effect, effect, type EffectOptions, runInScope } from './effect'

export type ObserveFn = (onInvalidate: (fn: () => void) => void) => void

export function observe(fn: ObserveFn, options?: Omit<EffectOptions, 'lazy'>): DisposeFn {
  // todo: composable api
  const invalidateFn = new Set<() => void>()
  const onInvalidate = (fn: () => void): void => {
    invalidateFn.add(fn)
  }
  const e = effect(() => {
    if (invalidateFn.size > 0) {
      invalidateFn.forEach(f => f())
      invalidateFn.clear()
    }
    fn(onInvalidate)
  }, options)

  const dispose: DisposeFn = () => {
    if (invalidateFn.size > 0) {
      invalidateFn.forEach(f => f())
      invalidateFn.clear()
    }
    cleanup(e)
  }

  return dispose
}
