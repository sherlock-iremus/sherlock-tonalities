/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetNoteVerticalityQuery } from '../../app/services/sparql'
import { verovioStyle } from '../meiviewer/mei.css'
import { createVerovio, getNote, load } from '../meiviewer/verovioHelpers'
import { setInspectedNote, setInspectedVerticality, setSelectedNote } from '../slice/scoreSlice'
import { StyleAnnalyticalEntity } from './style/StyleAnnalyticalEntity'
import { StyleCurrentSelection } from './style/StyleCurrentSelection'
import { StyleNote } from './style/StyleNote'
import { StylePositionnedNote } from './style/StylePositionnedNote'
import { StyleSelection } from './style/StyleSelection'
import { StyleVerticality } from './style/StyleVerticality'

window.verovioCallback = load

export const MeiViewer = props => {
  useEffect(() => createVerovio(props.meiUrl), [props.meiUrl])

  const [rightClickedNoteIri, setRightClickedNoteIri] = useState(null)
  const { data: verticalityIri } = useGetNoteVerticalityQuery(rightClickedNoteIri, { skip: !rightClickedNoteIri })
  const dispatch = useDispatch()
  useEffect(
    () => isInspectionMode && dispatch(setInspectedVerticality({ verticalityIri, rightClickedNoteIri })),
    [verticalityIri]
  )

  const { isInspectionMode, isSelectionMode, inspectedEntities, currentEntityIndex, selectedEntities } = useSelector(
    state => state.score
  )
  const inspectedEntity = inspectedEntities[currentEntityIndex]

  const handleMouseOver = e => getNote(e.target)?.classList.add('focused')
  const handleMouseLeave = e => getNote(e.target)?.classList.remove('focused')
  const handleClick = e => {
    const noteId = getNote(e.target)?.id
    if (noteId) {
      const noteIri = props.scoreIri + '_' + noteId
      if (e.ctrlKey || e.altKey) setRightClickedNoteIri(noteIri)
      else if (isInspectionMode) dispatch(setInspectedNote(noteIri))
      else if (isSelectionMode) dispatch(setSelectedNote(noteIri))
    }
  }

  return (
    <>
      <div
        css={verovioStyle}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseLeave}
        id="verovio_container"
      />
      {isInspectionMode && inspectedEntity.noteIri && <StyleNote noteIri={inspectedEntity.noteIri} mode="inspected" />}
      {isInspectionMode && inspectedEntity.verticalityIri && inspectedEntity.clickedNoteIri && (
        <StyleVerticality
          verticalityIri={inspectedEntity.verticalityIri}
          clickedNoteIri={inspectedEntity.clickedNoteIri}
        />
      )}
      {isInspectionMode && inspectedEntity.positionnedNoteIri && (
        <StylePositionnedNote
          positionnedNoteIri={inspectedEntity.positionnedNoteIri}
          clickedNoteIri={inspectedEntity.clickedNoteIri}
          attachedNoteIri={inspectedEntity.attachedNoteIri}
        />
      )}
      {isInspectionMode && inspectedEntity.selectionIri && (
        <StyleSelection selectionIri={inspectedEntity.selectionIri} />
      )}
      {isInspectionMode && inspectedEntity.annotationIri && (
        <StyleAnnalyticalEntity annotationIri={inspectedEntity.annotationIri} />
      )}
      {isSelectionMode && selectedEntities.length && <StyleCurrentSelection items={selectedEntities} />}
    </>
  )
}
