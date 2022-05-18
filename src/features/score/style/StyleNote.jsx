import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { usePrevious } from '../../meiviewer/utils'

export const StyleNote = props => {
  const { scoreIri } = useSelector(state => state.score)
  const currentNote = document.getElementById(props.noteIri.slice(scoreIri.length + 1))
  currentNote.classList.add('inspected')
  const previousNote = usePrevious(currentNote)

  useEffect(() => () => currentNote.classList.remove('inspected'), [previousNote])

  return null
}
