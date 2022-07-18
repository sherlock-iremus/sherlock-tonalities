import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  useGetOutgoingAnnotationsQuery,
  useGetVerticalityCoordinatesQuery,
  useGetVerticalityPositionnedNotesQuery,
} from '../../../app/services/sparql'
import { INSPECTED, SELECTED } from '../constants'
import { drawVerticality } from '../draw'
import { StyleNote } from './StyleNote'
import options from '../../../app/services/p177_p141.json'

export const StyleVerticality = ({ verticalityIri, clickedNoteIri }) => {
  const { scoreIri } = useSelector(state => state.score)
  const { isInspectionMode, isSelectionMode } = useSelector(state => state.score)
  const mode = (isInspectionMode && INSPECTED) || (isSelectionMode && SELECTED)
  const { data: positionnedNotes } = useGetVerticalityPositionnedNotesQuery(verticalityIri)
  const { data: annotations } = useGetOutgoingAnnotationsQuery(verticalityIri)
  const fundamentals = annotations
    ?.filter(a => options[a.predicat])
    ?.map(a => options[a.predicat].filter(o => o.iri === a.object)[0]?.label)

  const { data } = useGetVerticalityCoordinatesQuery(verticalityIri, { skip: clickedNoteIri })
  const noteNode =
    (clickedNoteIri && document.getElementById(clickedNoteIri.slice(scoreIri.length + 1))) ||
    (data && document.getElementById(data.slice(scoreIri.length + 1)))

  useEffect(() => {
    !document.getElementById(verticalityIri) &&
      noteNode &&
      fundamentals &&
      drawVerticality(verticalityIri, noteNode, mode, fundamentals)
    return () => document.getElementById(verticalityIri)?.remove()
  }, [noteNode, verticalityIri, mode, annotations])

  return (
    positionnedNotes?.map(e => <StyleNote key={e.attachedNoteIri} noteIri={e.attachedNoteIri} mode={mode} />) || null
  )
}
