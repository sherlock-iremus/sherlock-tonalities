import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useGetVerticalityNotesQuery } from '../../../app/services/sparql'
import { drawVerticality } from '../draw'
import { StyleNote } from './StyleNote'

export const StyleVerticality = props => {
  const { scoreIri } = useSelector(state => state.score)

  const noteNode = document.getElementById(props.clickedNoteIri.slice(scoreIri.length + 1))
  useEffect(() => drawVerticality(props.verticalityIri, noteNode), [noteNode])

  const verticalityNode = document.getElementById(props.verticalityIri)
  useEffect(() => () => verticalityNode?.remove(), [verticalityNode])

  const { data: notes } = useGetVerticalityNotesQuery(props.verticalityIri)
  return notes?.map(note => <StyleNote key={note} noteIri={note} mode="inspected" />) || null
}
