import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useGetVerticalityPositionnedNotesQuery } from '../../../app/services/sparql'
import { drawVerticality } from '../draw'
import { StyleNote } from './StyleNote'

export const StyleVerticality = props => {
  const { scoreIri } = useSelector(state => state.score)

  const noteNode = document.getElementById(props.clickedNoteIri.slice(scoreIri.length + 1))
  useEffect(() => drawVerticality(props.verticalityIri, noteNode), [noteNode])

  const verticalityNode = document.getElementById(props.verticalityIri)
  useEffect(() => () => verticalityNode?.remove(), [verticalityNode])

  const { data: positionnedNotes } = useGetVerticalityPositionnedNotesQuery(props.verticalityIri)
  return (
    positionnedNotes?.map(e => <StyleNote key={e.attachedNoteIri} noteIri={e.attachedNoteIri} mode="inspected" />) ||
    null
  )
}
