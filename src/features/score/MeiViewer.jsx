/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetNoteVerticalityQuery } from '../../app/services/sparql'
import { INSPECTED, SELECTED } from './constants'
import { verovioStyle } from './mei.css'
import { setInspectedEntity, setSelectedEntity } from '../../app/services/scoreSlice'
import { StyleEntities } from './style/StyleEntities'
import { StyleEntity } from './style/StyleEntity'

const getNote = node =>
  node.classList && node.classList.contains('note') ? node : node.parentNode && getNote(node.parentNode)

export const MeiViewer = ({ meiUrl, scoreIri }) => {
  const [pageCount, setPageCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (1 <= currentPage && currentPage <= pageCount) {
      const svg = window.tk.renderToSVG(currentPage)
      document.getElementById("notation").innerHTML = svg;
    }
  }, [currentPage])

  useEffect(() => fetch(meiUrl)
    .then(r => r.text())
    .then(r => {
      let svg = window.tk.renderData(r, {});
      document.getElementById("notation").innerHTML = svg;
      setPageCount(window.tk.getPageCount())
    }), [meiUrl])

  const dispatch = useDispatch()
  const [rightClickedNoteIri, setRightClickedNoteIri] = useState(null)
  const { data: verticalityIri } = useGetNoteVerticalityQuery(rightClickedNoteIri, { skip: !rightClickedNoteIri })

  const { isInspectionMode, isSelectionMode, inspectedEntities, currentEntityIndex, selectedEntities } = useSelector(
    state => state.score
  )

  useEffect(
    () =>
      isInspectionMode && dispatch(setInspectedEntity({ verticalityIri, clickedNoteIri: rightClickedNoteIri })
      ), [verticalityIri, rightClickedNoteIri, dispatch, isInspectionMode, isSelectionMode]
  )

  useEffect(
    (() => isSelectionMode && verticalityIri && dispatch(setSelectedEntity({ verticalityIri, clickedNoteIri: rightClickedNoteIri }))
    ), [verticalityIri])

  const handleMouseOver = e => getNote(e.target)?.classList.add('focused')
  const handleMouseLeave = e => getNote(e.target)?.classList.remove('focused')
  const handleClick = e => {
    const noteId = getNote(e.target)?.id
    if (noteId) {
      const noteIri = scoreIri + '_' + noteId
      if (e.ctrlKey || e.altKey) setRightClickedNoteIri(noteIri)
      else if (isInspectionMode) dispatch(setInspectedEntity({ noteIri }))
      else if (isSelectionMode) dispatch(setSelectedEntity({ noteIri }))
    }
  }

  return (
    <>
      {window.tk && <>
        <button onClick={e => {
          if (currentPage >= 2) setCurrentPage(currentPage - 1)
        }}>previous</button>
        <button>{currentPage}/{pageCount}</button>
        <button onClick={e => {
          if (currentPage < pageCount) setCurrentPage(currentPage + 1)
        }}>next</button>
      </>
      }
      <div
        css={verovioStyle}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseLeave}
        id="notation"
      />
      {isInspectionMode && <StyleEntity {...inspectedEntities[currentEntityIndex]} mode={INSPECTED} />}
      {isSelectionMode && selectedEntities.length && <StyleEntities items={selectedEntities} mode={SELECTED} />}
    </>
  )
}
