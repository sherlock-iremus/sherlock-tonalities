/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetNoteVerticalityQuery } from '../../app/services/sparql'
import { verovioStyle } from '../meiviewer/mei.css'
import { createVerovio, getNote, load } from '../meiviewer/verovioHelpers'
import { setInspectedNote, setInspectedVerticality } from '../slice/scoreSlice'
import { StyleAnnalyticalEntity } from './style/StyleAnnalyticalEntity'
import { StyleNote } from './style/StyleNote'
import { StyleSelection } from './style/StyleSelection'
import { StyleVerticality } from './style/StyleVerticality'

window.verovioCallback = load

export const MeiViewer = props => {
  const dispatch = useDispatch()
  const [rightClickedNoteIri, setRightClickedNoteIri] = useState(null)
  const { data: verticalityIri } = useGetNoteVerticalityQuery(rightClickedNoteIri, { skip: !rightClickedNoteIri })

  useEffect(() => {
    createVerovio(props.meiUrl)
  }, [props.meiUrl])

  useEffect(() => {
    dispatch(setInspectedVerticality({ verticalityIri, rightClickedNoteIri }))
  }, [verticalityIri])

  const { isInspectionMode, inspectedEntities, currentEntityIndex } = useSelector(state => state.score)
  const inspectedEntity = inspectedEntities[currentEntityIndex]

  const handleMouseOver = e => getNote(e.target)?.classList.add('focused')
  const handleMouseLeave = e => getNote(e.target)?.classList.remove('focused')
  const handleClick = e => {
    const noteId = getNote(e.target)?.id
    if (noteId && isInspectionMode) {
      if (e.ctrlKey || e.altKey) setRightClickedNoteIri(props.scoreIri + '_' + noteId)
      else dispatch(setInspectedNote(props.scoreIri + '_' + noteId))
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
      {inspectedEntity.annotationIri && <StyleAnnalyticalEntity annotationIri={inspectedEntity.annotationIri} />}
      {inspectedEntity.selectionIri && <StyleSelection selectionIri={inspectedEntity.selectionIri} />}
      {inspectedEntity.noteIri && <StyleNote noteIri={inspectedEntity.noteIri} />}
      {inspectedEntity.verticalityIri && <StyleVerticality verticalityIri={inspectedEntity.verticalityIri} />}
    </>
  )
}
