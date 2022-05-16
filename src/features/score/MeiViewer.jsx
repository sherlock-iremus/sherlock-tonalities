/** @jsxImportSource @emotion/react */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetChildSelectionsQuery } from '../../app/services/sparql'
import { verovioStyle } from '../meiviewer/mei.css'
import { usePrevious } from '../meiviewer/utils'
import { createVerovio, getNote, load } from '../meiviewer/verovioHelpers'
import { setInspectedNote } from '../slice/scoreSlice'
import { drawSelection } from './draw'

window.verovioCallback = load

export const MeiViewer = props => {
  useEffect(() => {
    createVerovio(props.meiUrl)
  }, [props.meiUrl])

  const dispatch = useDispatch()

  const { isInspectionMode, inspectedEntities, currentEntityIndex } = useSelector(state => state.score)

  const inspectedEntity = inspectedEntities[currentEntityIndex]
  const previousEntity = inspectedEntities[currentEntityIndex - 1] || inspectedEntities[0]

  const { data: currentSelection } = useGetChildSelectionsQuery(inspectedEntity.selectionIri, {
    skip: !inspectedEntity.selectionIri,
  })

  const { data: previousSelection } = useGetChildSelectionsQuery(previousEntity?.selectionIri, {
    skip: !previousEntity?.selectionIri,
  })

  const styleInspectedEntity = entity => {
    if (entity.noteIri)
      document.getElementById(entity.noteIri.slice(props.scoreIri.length + 1))?.classList.add('inspected')
    if (entity.selectionIri) currentSelection?.map(child => styleInspectedEntity(child))
  }

  const unStylePreviousEntity = entity => {
    if (entity.noteIri)
      document.getElementById(entity.noteIri.slice(props.scoreIri.length + 1))?.classList.remove('inspected')
    if (entity.selectionIri) {
      console.log(previousSelection)
      previousSelection?.map(child => unStylePreviousEntity(child))
    }
  }

  if (previousEntity) unStylePreviousEntity(previousEntity)
  if (inspectedEntity) styleInspectedEntity(inspectedEntity)

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
