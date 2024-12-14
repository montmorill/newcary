import type { Canvas, CanvasKit } from 'canvaskit-wasm'
import type { Widget } from './widget'

export interface App {
  root: Widget
  play: () => void
  stop: () => void
}

export function createApp(sk: CanvasKit, canvas: Canvas, root: Widget): App {
  let playing: boolean = false
  let updated: DOMHighResTimeStamp
  let elapsed: number = 0
  let handle: number
  const app: App = {
    root,
    play() {
      if (!playing) {
        playing = true
        handle = requestAnimationFrame((timestamp: DOMHighResTimeStamp) => {
          updated = timestamp
          update(timestamp)
        })
      }
    },
    stop() {
      if (playing) {
        cancelAnimationFrame(handle)
        playing = false
      }
    },
  }
  function update(timestamp: DOMHighResTimeStamp): void {
    elapsed += timestamp - updated
    updated = timestamp
    app.root.update(sk, canvas, elapsed)
    handle = requestAnimationFrame(update)
  }
  return app
}
