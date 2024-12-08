interface InjectionConstraint<_> {}
export type InjectionKey<T> = symbol & InjectionConstraint<T>

export type Context = Map<symbol, unknown> & { parent?: Context }

export const rootContext = createContext(true)
let activeContext: Context = rootContext

export function createContext(detached = false): Context {
  const context = new Map() as Context
  context.parent = detached ? void 0 : activeContext
  return context
}

export function getCurrentContext(): Context {
  return activeContext
}

export function runInContext<T>(context: Context, body: () => T): T {
  const prevContext = activeContext
  activeContext = context
  try {
    return body()
  }
  finally {
    activeContext = prevContext
  }
}

function lookup<T>(key: InjectionKey<T>): Context | undefined {
  let context: Context | undefined = activeContext
  while (context != null && !context.has(key)) {
    context = context.parent
  }

  return context
}

export function provide<T>(key: InjectionKey<T>, value: T): void {
  if (activeContext.has(key)) {
    // todo: should it overwrite or throw the new value
    // todo: warn: a key should not be provided in an identical context multiple times
    return
  }

  activeContext.set(key, value)
}

export function inject<T>(key: InjectionKey<T>): T | undefined {
  return lookup<T>(key)?.get(key) as T
}
