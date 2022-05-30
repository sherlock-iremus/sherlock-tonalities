import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useGetVerticalityPositionnedNotesQuery } from '../../../app/services/sparql'
import { drawVerticality } from '../draw'
import { StyleNote } from './StyleNote'

export const StyleVerticality = props => {
  const { scoreIri } = useSelector(state => state.score)
  const { data: positionnedNotes } = useGetVerticalityPositionnedNotesQuery(props.verticalityIri)
  const verticalityNode = document.getElementById(props.verticalityIri)
  const noteNode = document.getElementById(props.clickedNoteIri.slice(scoreIri.length + 1))

  useEffect(() => {
    verticalityNode ? (verticalityNode.style.display = 'block') : drawVerticality(props.verticalityIri, noteNode)
    return () => verticalityNode && (verticalityNode.style.display = 'none')
  }, [verticalityNode])

  return (
    positionnedNotes?.map(e => <StyleNote key={e.attachedNoteIri} noteIri={e.attachedNoteIri} mode="inspected" />) ||
    null
  )
}
