import type { Canvas } from 'canvaskit-wasm'
import type { Widget } from './widget'

export interface App {
  root: Widget
  play: () => void
  stop: () => void
}

export function createApp(canvas: Canvas, root: Widget): App {
  const startAt = performance.now()
  let playing: boolean = false
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
    const elapsed = timestamp - startAt
    app.root.update(canvas, elapsed)
    if (playing)
      handle = requestAnimationFrame(update)
  }
  return app
}
