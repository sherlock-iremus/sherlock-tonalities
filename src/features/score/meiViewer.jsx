/** @jsxImportSource @emotion/react */
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setInspectedNoteId } from '../inspection/inspectedEntitySlice'
import { mainAreaStyle, verovioStyle } from '../meiviewer/mei.css'
import { createVerovio, getNote, load } from '../meiviewer/verovioHelpers'

window.verovioCallback = load

export const MeiViewer = props => {
  useEffect(() => {
    createVerovio(props.meiUrl) // github.com/rism-digital/verovio-app-react/blob/master/src/App.js
  }, [])

  const dispatch = useDispatch()

  const isInspectionMode = useSelector(state => state.inspectedEntity.isInspectionMode)

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
    n && isInspectionMode && dispatch(setInspectedNoteId(props.scoreIri + '_' + n.id))
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
