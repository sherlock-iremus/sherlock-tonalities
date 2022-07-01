import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { drawPositionnedNote } from '../draw'
import { StyleNote } from './StyleNote'

export const StylePositionnedNote = props => {
  const { scoreIri } = useSelector(state => state.score)
  const positionnedNoteNode = document.getElementById(props.positionnedNoteIri)
  const noteNode = document.getElementById(props.clickedNoteIri.slice(scoreIri.length + 1))

  useEffect(() => {
    positionnedNoteNode
      ? (positionnedNoteNode.style.display = 'block')
      : drawPositionnedNote(props.positionnedNoteIri, noteNode, props.mode)
    return () => positionnedNoteNode && (positionnedNoteNode.style.display = 'none')
  }, [noteNode, positionnedNoteNode, props.mode, props.positionnedNoteIri])

  return <StyleNote noteIri={props.attachedNoteIri} mode={props.mode} />
}
