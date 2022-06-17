/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetNoteVerticalityQuery } from '../../app/services/sparql'
import { INSPECTED, SELECTED } from './constants'
import { verovioStyle } from './mei.css'
import { createVerovio, getNote, load } from '../meiviewer/verovioHelpers'
import { setInspectedEntity, setSelectedEntity } from '../../app/services/scoreSlice'
import { StyleEntities } from './style/StyleEntities'
import { StyleEntity } from './style/StyleEntity'

window.verovioCallback = load

export const MeiViewer = props => {
  useEffect(() => createVerovio(props.meiUrl), [props.meiUrl])

  const dispatch = useDispatch()
  const [rightClickedNoteIri, setRightClickedNoteIri] = useState(null)
  const { data: verticalityIri } = useGetNoteVerticalityQuery(rightClickedNoteIri, { skip: !rightClickedNoteIri })
  
  useEffect(
    () =>
      (isInspectionMode && dispatch(setInspectedEntity({ verticalityIri, clickedNoteIri: rightClickedNoteIri }))) ||
      (isSelectionMode && dispatch(setSelectedEntity({ verticalityIri, clickedNoteIri: rightClickedNoteIri }))),
    [verticalityIri]
  )

  const { isInspectionMode, isSelectionMode, inspectedEntities, currentEntityIndex, selectedEntities } =
    useSelector(state => state.score)

  const handleMouseOver = e => getNote(e.target)?.classList.add('focused')
  const handleMouseLeave = e => getNote(e.target)?.classList.remove('focused')
  const handleClick = e => {
    const noteId = getNote(e.target)?.id
    if (noteId) {
      const noteIri = props.scoreIri + '_' + noteId
      if (e.ctrlKey || e.altKey) setRightClickedNoteIri(noteIri)
      else if (isInspectionMode) dispatch(setInspectedEntity({ noteIri }))
      else if (isSelectionMode) dispatch(setSelectedEntity({ noteIri }))
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
      {isInspectionMode && <StyleEntity {...inspectedEntities[currentEntityIndex]} mode={INSPECTED} />}
      {isSelectionMode && selectedEntities.length && <StyleEntities items={selectedEntities} mode={SELECTED} />}
    </>
  )
}
