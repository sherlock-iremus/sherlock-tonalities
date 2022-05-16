/** @jsxImportSource @emotion/react */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { verovioStyle } from '../meiviewer/mei.css'
import { createVerovio, getNote, load } from '../meiviewer/verovioHelpers'
import { setInspectedNote } from '../slice/scoreSlice'
import { StyleAnnalyticalEntity } from './style/StyleAnnalyticalEntity'
import { StyleNote } from './style/StyleNote'
import { StyleSelection } from './style/StyleSelection'

window.verovioCallback = load

export const MeiViewer = props => {
  useEffect(() => {
    createVerovio(props.meiUrl)
  }, [props.meiUrl])
  const dispatch = useDispatch()

  const { isInspectionMode, inspectedEntities, currentEntityIndex } = useSelector(state => state.score)
  const inspectedEntity = inspectedEntities[currentEntityIndex]

  const handleMouseOver = e => getNote(e.target)?.classList.add('focused')
  const handleMouseLeave = e => getNote(e.target)?.classList.remove('focused')
  const handleClick = e => {
    const noteId = getNote(e.target)?.id
    if (noteId && isInspectionMode) dispatch(setInspectedNote(props.scoreIri + '_' + noteId))
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
    </>
  )
}
