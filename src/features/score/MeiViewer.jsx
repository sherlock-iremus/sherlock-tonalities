/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetNoteVerticalityQuery } from '../../app/services/sparql'
import { INSPECTED, SELECTED } from './constants'
import { verovioStyle } from './mei.css'
import { setInspectedEntity, setSelectedEntity } from '../../app/services/scoreSlice'
import { StyleEntities } from './style/StyleEntities'
import { StyleEntity } from './style/StyleEntity'

const createVerovio = meiUri => {
  const s = document.createElement('script')
  s.type = 'module'
  s.async = true
  const js_lines = [
    'import "https://www.verovio.org/javascript/app/verovio-app.js";',
    `window.app = new Verovio.App(document.getElementById("verovio_container"), {
      defaultView: 'document',
      enableResponsive: false,
      defaultZoom: 3,
    });`,
    `window.verovioCallback("${meiUri}");`,
  ]
  s.innerHTML = js_lines.join('\n') + '\n'
  document.body.appendChild(s)
}

const load = mei_uri => {
  fetch(mei_uri, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    mode: 'cors',
    cache: 'no-cache',
    redirect: 'follow',
  })
    .then(res => res.text())
    .then(res => { window.app.loadData(res) })
}

const getNote = node =>
  node.classList && node.classList.contains('note') ? node : node.parentNode && getNote(node.parentNode)

window.verovioCallback = load

export const MeiViewer = props => {
  useEffect(() => createVerovio(props.meiUrl), [props.meiUrl])

  const dispatch = useDispatch()
  const [rightClickedNoteIri, setRightClickedNoteIri] = useState(null)
  const { data: verticalityIri } = useGetNoteVerticalityQuery(rightClickedNoteIri, { skip: !rightClickedNoteIri })

  const { isInspectionMode, isSelectionMode, inspectedEntities, currentEntityIndex, selectedEntities } = useSelector(
    state => state.score
  )

  useEffect(
    () => 
      isInspectionMode && dispatch(setInspectedEntity({ verticalityIri, clickedNoteIri: rightClickedNoteIri })
      ),[verticalityIri, rightClickedNoteIri, dispatch, isInspectionMode, isSelectionMode]
  )

  useEffect(
    (() => isSelectionMode && verticalityIri && dispatch(setSelectedEntity({ verticalityIri, clickedNoteIri: rightClickedNoteIri }))
  ), [verticalityIri])

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
