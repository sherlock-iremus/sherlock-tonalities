/** @jsxImportSource @emotion/react */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setInspectedNoteId } from '../inspection/inspectedEntitySlice'
import { verovioStyle } from '../meiviewer/mei.css'
import { usePrevious } from '../meiviewer/utils'
import { createVerovio, getNote, load } from '../meiviewer/verovioHelpers'

window.verovioCallback = load

export const MeiViewer = props => {
  useEffect(() => {
    createVerovio(props.meiUrl)
  }, [])

  const dispatch = useDispatch()

  const {
    isInspectionMode,
    inspectedNoteId,
    inspectedVerticalityId,
    inspectedPositionnedNoteId,
    inspectedSelectionId,
    inspectedConceptId,
  } = useSelector(state => state.inspectedEntity)

  const inspectedEntity =
    inspectedNoteId || inspectedPositionnedNoteId || inspectedSelectionId || inspectedVerticalityId || inspectedConceptId

  const previousEntity = usePrevious(inspectedEntity)

  const styleInspectedEntity = () => {
    if (inspectedNoteId)
      document.getElementById(inspectedNoteId.slice(props.scoreIri.length + 1)).classList.add('inspected')
    // ...
  }

  const unStylePreviousEntity = () => {
    document.getElementById(previousEntity.slice(props.scoreIri.length + 1)).classList.remove('inspected')
  }

  if (previousEntity) unStylePreviousEntity()
  if (inspectedEntity) styleInspectedEntity()

  const handleMouseOver = e => {
    const n = getNote(e.target)
    if (n) n.classList.add('focused')
  }

  const handleMouseLeave = e => {
    const n = getNote(e.target)
    if (n) n.classList.remove('focused')
  }

  const handleClick = e => {
    const n = getNote(e.target)
    if (n && isInspectionMode) dispatch(setInspectedNoteId(props.scoreIri + '_' + n.id))
  }

  return (
    <div
      css={verovioStyle}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseLeave}
      id="verovio_container"
    />
  )
}
