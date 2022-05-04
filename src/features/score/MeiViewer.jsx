/** @jsxImportSource @emotion/react */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { verovioStyle } from '../meiviewer/mei.css'
import { usePrevious } from '../meiviewer/utils'
import { createVerovio, getNote, load } from '../meiviewer/verovioHelpers'
import { setInspectedNote } from '../slice/scoreSlice'

window.verovioCallback = load

export const MeiViewer = props => {
  useEffect(() => {
    createVerovio(props.meiUrl)
  }, [props.meiUrl])

  const dispatch = useDispatch()

  const { isInspectionMode, inspectedEntity } = useSelector(state => state.score)

  const previousEntity = usePrevious(inspectedEntity)

  const styleInspectedEntity = () => {
    if (inspectedEntity.noteIri)
      document.getElementById(inspectedEntity.noteIri.slice(props.scoreIri.length + 1)).classList.add('inspected')
  }

  const unStylePreviousEntity = () => {
    if (previousEntity.noteIri)
      document.getElementById(previousEntity.noteIri.slice(props.scoreIri.length + 1)).classList.remove('inspected')
  }

  if (previousEntity) unStylePreviousEntity()
  if (inspectedEntity) styleInspectedEntity()

  const handleMouseOver = e => getNote(e.target)?.classList.add('focused')

  const handleMouseLeave = e => getNote(e.target)?.classList.remove('focused')

  const handleClick = e => {
    const noteId = getNote(e.target)?.id
    if (noteId && isInspectionMode) dispatch(setInspectedNote(props.scoreIri + '_' + noteId))
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
