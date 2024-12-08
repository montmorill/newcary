export type EffectBucket = Set<Effect>
export type EffectScheduler = (effect: Effect) => void
export type Effect = EffectMetadata & (() => unknown)

export interface EffectOptions { scheduler?: EffectScheduler, lazy?: boolean }
export interface EffectMetadata { history: EffectBucket[], scheduler?: EffectScheduler, scope?: EffectScope }

export interface EffectScope {
  children: EffectScope[]
  effects: Effect[]
}

let activeEffect: Effect | undefined = void 0
let activeScope: EffectScope | undefined = void 0
let shouldTrack = true

export function getCurrentEffect(): Effect | undefined {
  return activeEffect
}

export function getCurrentScope(): EffectScope | undefined {
  return activeScope
}

export function createScope(detached = false): EffectScope {
  const scope: EffectScope = { children: [], effects: [] }
  if (!detached && activeScope)
    activeScope.children.push(scope)
  return scope
}

export function runInScope(scope: EffectScope, body: () => void): void {
  const prevScope = activeScope
  activeScope = scope
  try {
    body()
  }
  finally {
    activeScope = prevScope
  }
}

export function clearScope(scope: EffectScope): void {
  scope.children.forEach(clearScope)
  scope.effects.forEach(cleanup)
  scope.effects.length = 0
}

export function cleanup(e: Effect): void {
  e.history.forEach(i => i.delete(e))
  e.history.length = 0
}

export function effect(fn: () => unknown, { lazy = false, scheduler }: EffectOptions = {}): Effect {
  const effectFn = (() => {
    cleanup(effectFn)
    const prevEffect = activeEffect
    activeEffect = effectFn
    try {
      return fn()
    }
    finally {
      activeEffect = prevEffect
    }
  }) as Effect

  effectFn.history = []
  effectFn.scheduler = scheduler
  effectFn.scope = activeScope

  if (activeScope != null)
    activeScope.effects.push(effectFn)

  if (!lazy)
    effectFn()

  return effectFn
}

export function track(bucket: EffectBucket): void {
  if (!activeEffect || !shouldTrack)
    return
  bucket.add(activeEffect)
  activeEffect.history.push(bucket)
}

export function trigger(bucket: EffectBucket): void {
  const effectsToRun: Effect[] = []
  bucket.forEach(v => v !== activeEffect ? effectsToRun.push(v) : void 0)
  effectsToRun.forEach(v => (v.scheduler ?? v)(v))
}

export function pauseTracking(): void {
  shouldTrack = false
}

export function resetTracking(): void {
  shouldTrack = true
}
