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
  const clickedNote = data && document.getElementById(data.clickedNoteIri.slice(scoreIri.length + 1))
  const attachedNote = data && document.getElementById(data.attachedNoteIri.slice(scoreIri.length + 1))
  useEffect(() => {
    data && !document.getElementById(positionnedNoteIri) && drawPositionnedNote(positionnedNoteIri, clickedNote, attachedNote, mode)
    return () => document.getElementById(positionnedNoteIri)?.remove()
  }, [clickedNote, mode, positionnedNoteIri, attachedNote, data])

  return (data && <StyleNote noteIri={data.attachedNoteIri} mode={mode} />) || null
}
