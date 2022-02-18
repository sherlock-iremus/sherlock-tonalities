/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

import { createVerovio, getNodeNote, drawVerticalities, load } from './verovioHelpers'
import { containerStyle, mainAreaStyle, panelStyle, verovioStyle } from './mei.css'

const INSPECTION_MODE = 'INSPECTION_MODE'
const SELECTION_MODE = 'SELECTION_MODE'

window.verovioCallback = load

const meiUri =
  'https://raw.githubusercontent.com/guillotel-nothmann/Zarlino_1558/main/meiOldClefsAnalyse/Hellinck_Beati.mei'

const MeiViewer = () => {
  const [mode, setMode] = useState(INSPECTION_MODE)
  const [inspectedElement, setInspectedElement] = useState(null)
  const [selection, setSelection] = useState([])
  const [scoreSelections, setScoreSelections] = useState([])


  const _setInspectedElement = value => {
    if (inspectedElement) inspectedElement.classList.remove('selected')
    setInspectedElement(inspectedElement !== value ? value : null)
  }

  const _setSelection = value => {
    if(!selection.includes(value)) setSelection([...selection, value])
    else {
      setSelection(selection.filter(e => e !== value))
      value.classList.remove('selected')
    }
  }

  useEffect(() => {
    createVerovio(meiUri) // github.com/rism-digital/verovio-app-react/blob/master/src/App.js
  }, [])

  const handleMouseOver = e => {
    const n = getNodeNote(e)
    if (n) {
      n.noteNode.classList.add('hovered')
    }
  }

  const handleMouseLeave = e => {
    const n = getNodeNote(e)
    if (n) {
      n.noteNode.classList.remove('hovered')
    }
  }

  const handleClick = e => {
    const n = getNodeNote(e)
    if (n) {
      switch (mode) {
        case INSPECTION_MODE:
          _setInspectedElement(n.noteNode)
          break
        case SELECTION_MODE:
          _setSelection(n.noteNode)
          break
      }
    }
  }

  const handleChangeMode = (event, newMode) => {
    setMode(newMode)
  }

  if (inspectedElement){
    switch (mode) {
      case INSPECTION_MODE:
        inspectedElement.classList.add('selected')
        break
      case SELECTION_MODE:
        inspectedElement.classList.remove('selected')
        break
    }
  }

  if (selection){
    switch (mode) {
      case INSPECTION_MODE:
        selection.map(e => e.classList.remove('selected'))
        break
      case SELECTION_MODE:
        selection.map(e => e.classList.add('selected'))
        break
    }
  }

  return (
    <div css={containerStyle}>
      <div css={mainAreaStyle}>
        <div
          css={verovioStyle}
          onClick={handleClick}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseLeave}
          id="verovio_container"
        />
      </div>
      <div css={panelStyle}>
        <ToggleButtonGroup color="primary" value={mode} exclusive onChange={handleChangeMode}>
          <ToggleButton value={INSPECTION_MODE}>🔍</ToggleButton>
          <ToggleButton value={SELECTION_MODE}>🧺</ToggleButton>
        </ToggleButtonGroup>
        {inspectedElement && mode === INSPECTION_MODE &&
          <div>{inspectedElement.id}</div>
        }
        {selection && mode === SELECTION_MODE &&
          <div>{selection.map(e =>
            <div key={e.id} style={{display: 'flex', justifyContent: 'space-between'}}>
              {e.id}
              <button onClick={() => _setSelection(e)}>❌</button>
            </div>)}
          </div>
        }
      </div>
    </div>
  )
}

export default MeiViewer
