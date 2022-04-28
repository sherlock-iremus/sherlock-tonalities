/** @jsxImportSource @emotion/react */
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setInspectedNoteId } from '../inspection/inspectedEntitySlice'
import { verovioStyle } from '../meiviewer/mei.css'
import { createVerovio, getNote, load, styleInspectedEntity } from '../meiviewer/verovioHelpers'

window.verovioCallback = load

export const MeiViewer = props => {
  useEffect(() => {
    createVerovio(props.meiUrl)
  }, [])

  const dispatch = useDispatch()

  const isInspectionMode = useSelector(state => state.inspectedEntity.isInspectionMode)

  const inspectedVerticalityId = useSelector(state => state.inspectedEntity.inspectedVerticalityId)
  const inspectedNoteId = useSelector(state => state.inspectedEntity.inspectedNoteId)
  const inspectedPositionnedNoteId = useSelector(state => state.inspectedEntity.inspectedPositionnedNoteId)
  const inspectedSelectionId = useSelector(state => state.inspectedEntity.inspectedSelectionId)
  const inspectedEntity =
    inspectedNoteId || inspectedPositionnedNoteId || inspectedSelectionId || inspectedVerticalityId

  const styleInspectedEntity = () => {
    if (inspectedNoteId)
      document.getElementById(inspectedNoteId.slice(props.scoreIri.length + 1)).classList.add('inspected')
    // ...
  }

  const unStyleInspectedEntity = () => {
    if (inspectedNoteId)
      document.getElementById(inspectedNoteId.slice(props.scoreIri.length + 1)).classList.remove('inspected')
    // ...
  }

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
    if (n && isInspectionMode) {
      if (inspectedEntity) unStyleInspectedEntity()
      dispatch(setInspectedNoteId(props.scoreIri + '_' + n.id))
    }
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
