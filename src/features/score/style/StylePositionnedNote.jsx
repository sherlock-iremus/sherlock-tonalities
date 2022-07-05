import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { drawPositionnedNote } from '../draw'
import { StyleNote } from './StyleNote'

export const StylePositionnedNote = props => {
  const { scoreIri } = useSelector(state => state.score)
  const noteNode = document.getElementById(props.clickedNoteIri.slice(scoreIri.length + 1))

  useEffect(() => {
    !document.getElementById(props.positionnedNoteIri) && drawPositionnedNote(props.positionnedNoteIri, noteNode, props.mode)
    return () => document.getElementById(props.positionnedNoteIri)?.remove()
  }, [noteNode, props.mode, props.positionnedNoteIri])

  return <StyleNote noteIri={props.attachedNoteIri} mode={props.mode} />
}
