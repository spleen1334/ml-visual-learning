import type { ButtonHTMLAttributes } from 'react'
import './PlaybackButton.css'

type PlaybackAction = 'previous' | 'next' | 'play' | 'pause' | 'stop' | 'replay'
type PlaybackButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  action: PlaybackAction
  label: string
}

const paths: Record<PlaybackAction, string> = {
  previous: 'M6 5v14M18 5l-9 7 9 7V5Z',
  next: 'M18 5v14M6 5l9 7-9 7V5Z',
  play: 'm8 5 11 7-11 7V5Z',
  pause: 'M8 5v14M16 5v14',
  stop: 'M6 6h12v12H6Z',
  replay: 'M4 10a8 8 0 1 1 1 8M4 4v6h6',
}

export function PlaybackButton({ action, label, className = '', type = 'button', ...props }: PlaybackButtonProps) {
  return <button {...props} type={type} className={`playback-button ${className}`.trim()} title={label} aria-label={label}>
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path d={paths[action]} />
    </svg>
  </button>
}
