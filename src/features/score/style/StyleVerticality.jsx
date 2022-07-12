import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useGetVerticalityCoordinatesQuery, useGetVerticalityPositionnedNotesQuery } from '../../../app/services/sparql'
import { INSPECTED, SELECTED } from '../constants'
import { drawVerticality } from '../draw'
import { StyleNote } from './StyleNote'

export const StyleVerticality = ({ verticalityIri, clickedNoteIri }) => {
  const { scoreIri } = useSelector(state => state.score)
  const { isInspectionMode, isSelectionMode } = useSelector(state => state.score)
  const mode = (isInspectionMode && INSPECTED) || (isSelectionMode && SELECTED)
  const { data: positionnedNotes } = useGetVerticalityPositionnedNotesQuery(verticalityIri)
  const { data } = useGetVerticalityCoordinatesQuery(verticalityIri, { skip: clickedNoteIri })
  const noteNode =
    (clickedNoteIri && document.getElementById(clickedNoteIri.slice(scoreIri.length + 1))) ||
    (data && document.getElementById(data.slice(scoreIri.length + 1)))

  useEffect(() => {
    !document.getElementById(verticalityIri) && noteNode && drawVerticality(verticalityIri, noteNode, mode)
    return () => document.getElementById(verticalityIri)?.remove()
  }, [noteNode, verticalityIri, mode])

  return (
    positionnedNotes?.map(e => <StyleNote key={e.attachedNoteIri} noteIri={e.attachedNoteIri} mode={mode} />) || null
  )
}
