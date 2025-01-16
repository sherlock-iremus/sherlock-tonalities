import { Alert, Backdrop, CircularProgress, IconButton, Slider, Snackbar, Stack, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Pause, PlayArrow } from '@mui/icons-material'
import { SplendidGrandPiano } from 'smplr'
import MidiPlayer from 'midi-player-js'

const base64ToArrayBuffer = base64 => Uint8Array.from(atob(base64), c => c.charCodeAt(0))
const formatTime = time => new Date(1000 * time).toTimeString().slice(4, 8)

export const Player = ({ pageCount }) => {
  const [time, setTime] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const context = new AudioContext()
  const pianoApi = useRef(null)
  const [midiApi] = useState(
    () =>
      new MidiPlayer.Player(e => {
        if (e.name.includes('Note on'))
          pianoApi.current.start({ note: e.noteName, velocity: e.velocity, time: 5, duration: 1 })
        setTime(100 - midiApi.getSongPercentRemaining())
        setIsPlaying(midiApi.isPlaying())
      })
  )

  const setTimePosition = (e, time) => {
    setTime(time)
    setIsPlaying(midiApi.isPlaying())
    midiApi.skipToPercent(time)
  }

  const loadPiano = async () => {
    pianoApi.current = await new SplendidGrandPiano(context).load
    setIsOpen(true)
  }

  useEffect(() => {
    if (pageCount) {
      const base64 = window.tk.renderToMIDI()
      const buffer = base64ToArrayBuffer(base64)
      midiApi.loadArrayBuffer(buffer)
    }
  }, [pageCount])

  useEffect(() => {
    if (!pianoApi.current) loadPiano()
  }, [])

  if (midiApi)
    return (
      <>
        <Backdrop open={!isOpen}>
          <CircularProgress />
        </Backdrop>
        <Snackbar open={isOpen} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert
            sx={{
              borderRadius: 3,
              boxShadow: 1,
              bgcolor: 'secondary.light',
              '& .MuiAlert-icon': { display: 'none' },
            }}
          >
            <Stack width={300} spacing={2} direction="row" alignItems="center">
              <IconButton
                onClick={() => {
                  try {
                    setIsPlaying(!isPlaying)
                    context.resume()
                    midiApi.play()
                  } catch (error) {
                    midiApi.pause()
                  }
                }}
              >
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
              <Typography>{formatTime(midiApi.getSongTime() - midiApi.getSongTimeRemaining())}</Typography>
              <Slider value={time} onChange={setTimePosition} />
              <Typography>-{formatTime(midiApi.getSongTimeRemaining())}</Typography>
            </Stack>
          </Alert>
        </Snackbar>
      </>
    )
}
