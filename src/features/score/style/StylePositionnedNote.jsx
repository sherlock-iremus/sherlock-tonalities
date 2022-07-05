import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useGetPositionnedNoteInfoQuery } from '../../../app/services/sparql'
import { INSPECTED, SELECTED } from '../constants'
import { drawPositionnedNote } from '../draw'
import { StyleNote } from './StyleNote'

export const StylePositionnedNote = ({ positionnedNoteIri }) => {
  const { scoreIri } = useSelector(state => state.score)
  const { isInspectionMode, isSelectionMode } = useSelector(state => state.score)
  const mode = (isInspectionMode && INSPECTED) || (isSelectionMode && SELECTED)
  const { data } = useGetPositionnedNoteInfoQuery(positionnedNoteIri)
  const noteNode = data && document.getElementById(data.clickedNoteIri.slice(scoreIri.length + 1))
  useEffect(() => {
    data && !document.getElementById(positionnedNoteIri) && drawPositionnedNote(positionnedNoteIri, noteNode, mode)
    return () => document.getElementById(positionnedNoteIri)?.remove()
  }, [noteNode, mode, positionnedNoteIri, data])

  return (data && <StyleNote noteIri={data.attachedNoteIri} mode={mode} />) || null
}
