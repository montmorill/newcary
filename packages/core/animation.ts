export type TimingFuction = (x: number) => number
export type Animator = (progress: number, done: boolean) => void
export type Animation<T, A> = (target: T, context: A) => Animator
export interface AnimationInstance<T, A> {
  target: T
  context: A
  startAt: number
  duration: number
  by: TimingFuction
  animation: Animation<T, A>
  animator?: Animator
}

export function defineAnimation<U extends unknown[]>(
  animation: (...args: U) => Animator,
): U extends [infer T, infer A] ? Animation<T, A>
    : U extends [infer T] ? Animation<T, object> : never {
  return animation as any
}

/**
 * Tick an animation and tell whether to keep the animation.
 * @param {AnimationInstance<T, A>} animation
 * @param {number} elapsed
 * @returns {boolean} keep
 */
export function tick<T, A>(
  animation: AnimationInstance<T, A>,
  elapsed: number,
): boolean {
  if (animation.startAt + animation.duration > elapsed)
    return false

  if (animation.startAt <= elapsed) {
    if (animation.animator) {
      const progress = (elapsed - animation.startAt) / animation.duration
      const done = progress >= 1
      animation.animator(animation.by(Math.min(progress, 1)), done)
    }
    else {
      animation.animator = animation.animation(animation.target, animation.context)
      animation.animator(0, false)
    }
  }

  return true
}
