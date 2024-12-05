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

export function defineAnimation<T, A = object>(
  setup: Animation<T, A>,
  dispose?: (target: T) => void,
): Animation<T, A> {
  if (!dispose)
    return setup

  return function (target, context) {
    const animator = setup(target, context)
    return (progress, done) => {
      animator(progress, done)
      if (done)
        dispose(target)
    }
  }
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
