/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

import { createVerovio, getNodeNote, drawVerticalities, load } from './verovioHelpers'
import { annotationsPanelStyle, containerStyle, mainAreaStyle, panelStyle, verovioStyle } from './mei.css'

const INSPECTION_MODE = 'INSPECTION_MODE'
const SELECTION_MODE = 'SELECTION_MODE'

window.verovioCallback = load

const meiUri =
  'https://raw.githubusercontent.com/guillotel-nothmann/Zarlino_1558/main/meiOldClefsAnalyse/Hellinck_Beati.mei'

const MeiViewer = () => {
  const [mode, setMode] = useState(INSPECTION_MODE)
  const [selection, setSelection] = useState([])

  useEffect(() => {
    createVerovio(meiUri) // github.com/rism-digital/verovio-app-react/blob/master/src/App.js
  }, [meiUri])

  const handleMouseOver = e => {
    const n = getNodeNote(e)
    if (n) {
      n.noteNode.classList.add('hovered')
      console.log('handleMouseOver', n)
    }
  }

  const handleMouseLeave = e => {
    const n = getNodeNote(e)
    if (n) {
      n.noteNode.classList.remove('hovered')
      console.log('handleMouseLeave', n)
    }
  }

  const handleClick = e => {
    const n = getNodeNote(e)
    console.log('handleClick', n)
  }

  const handleChangeMode = (event, newMode) => {
    setMode(newMode)
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
          <ToggleButton value={INSPECTION_MODE}>Inspection</ToggleButton>
          <ToggleButton value={SELECTION_MODE}>Selection</ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  )
}

export default MeiViewer
