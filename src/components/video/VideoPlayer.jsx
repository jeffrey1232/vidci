import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { formatClock } from '../../utils/format.js'

export default function VideoPlayer({ src, poster, title, onStarted }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.9)
  const [fullscreen, setFullscreen] = useState(false)
  const started = useRef(false)

  useEffect(() => {
    const node = videoRef.current
    if (!node) return
    node.volume = volume
  }, [volume])

  function togglePlay() {
    const node = videoRef.current
    if (!node) return
    if (node.paused) {
      node.play()
      setPlaying(true)
      if (!started.current) {
        started.current = true
        onStarted?.()
      }
    } else {
      node.pause()
      setPlaying(false)
    }
  }

  async function toggleFullscreen() {
    const node = videoRef.current?.parentElement
    if (!node) return
    if (!document.fullscreenElement) {
      await node.requestFullscreen()
      setFullscreen(true)
    } else {
      await document.exitFullscreen()
      setFullscreen(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
      <div className="relative">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="aspect-video w-full bg-black"
          onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
          onClick={togglePlay}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={progress}
            onChange={(e) => {
              const value = Number(e.target.value)
              if (videoRef.current) videoRef.current.currentTime = value
              setProgress(value)
            }}
            className="w-full accent-brand-400"
            aria-label="Progression"
          />
          <div className="mt-2 flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <button type="button" onClick={togglePlay} className="rounded-full bg-white/10 p-2">
                {playing ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = !muted
                  setMuted(next)
                  if (videoRef.current) videoRef.current.muted = next
                }}
                className="rounded-full bg-white/10 p-2"
              >
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={muted ? 0 : volume}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  setVolume(value)
                  setMuted(value === 0)
                  if (videoRef.current) {
                    videoRef.current.volume = value
                    videoRef.current.muted = value === 0
                  }
                }}
                className="w-24 accent-brand-400"
                aria-label="Volume"
              />
              <span className="text-zinc-300">
                {formatClock(progress)} / {formatClock(duration)}
              </span>
            </div>
            <button type="button" onClick={toggleFullscreen} className="rounded-full bg-white/10 p-2">
              {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>
          </div>
        </div>
      </div>
      {title ? <div className="hidden">{title}</div> : null}
    </div>
  )
}
