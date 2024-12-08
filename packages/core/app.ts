import type { Canvas, CanvasKit } from 'canvaskit-wasm'
import type { Widget } from './widget'

export interface App {
  root: Widget
  play: () => void
  stop: () => void
}

export function createApp(sk: CanvasKit, canvas: Canvas, root: Widget): App {
  let playing: boolean = false
  let startAt: DOMHighResTimeStamp
  let handle: number
  const app: App = {
    root,
    play() {
      if (!playing) {
        playing = true
        handle = requestAnimationFrame(update)
      }
    },
    stop() {
      if (playing) {
        playing = false
        cancelAnimationFrame(handle)
      }
    },
  }
  function update(timestamp: DOMHighResTimeStamp): void {
    if (!startAt) {
      startAt = timestamp
    }
    const elapsed = timestamp - startAt
    app.root.update(sk, canvas, elapsed)
    if (playing)
      handle = requestAnimationFrame(update)
  }
  return app
}
