/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react'
import { Button, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { v4 as uuid } from 'uuid'
import { createVerovio, getNodeNote, drawVerticalities, load } from './verovioHelpers'
import { containerStyle, mainAreaStyle, panelStyle, verovioStyle } from './mei.css'
import { sameMembers } from './utils'
import { Colorize, RemoveRedEye, Close } from '@mui/icons-material'

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


  const _setInspectedElement = element => {
    if (inspectedElement && inspectedElement.classList) inspectedElement.classList.remove('selected')
    setInspectedElement(inspectedElement !== element ? element : null)
  }

  const _setSelection = element => {
    if (!selection.includes(element)) setSelection([...selection, element])
    else {
      setSelection(selection.filter(e => e !== element))
      if (element.classList) element.classList.remove('selected')
    }
  }

  const createScoreSelections = newSelection => {
    for (const scoreSelection of scoreSelections) if (sameMembers(scoreSelection.selection.map(e => e.id), newSelection.map(e => e.id))) return
    setScoreSelections([...scoreSelections, { id: uuid(), selection: newSelection }])
    selection.forEach(e => e.classList && e.classList.remove('selected'))
    setSelection([])
  }

  const removeScoreSelections = s => {
    if (selection.includes(s)) setSelection(selection.filter(e => e !== s))
    setScoreSelections(scoreSelections.filter(e => e !== s))
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

  if (inspectedElement) {
    switch (mode) {
      case INSPECTION_MODE:
        inspectedElement.classList && inspectedElement.classList.add('selected')
        break
      case SELECTION_MODE:
        inspectedElement.classList && inspectedElement.classList.remove('selected')
        break
    }
  }

  if (selection) {
    switch (mode) {
      case INSPECTION_MODE:
        selection.map(e => e.classList && e.classList.remove('selected'))
        break
      case SELECTION_MODE:
        selection.map(e => e.classList && e.classList.add('selected'))
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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup value={mode} exclusive onChange={handleChangeMode} style={{ display: 'flex', justifyContent: 'center'}}>
            <ToggleButton value={INSPECTION_MODE}>
              <RemoveRedEye />
            </ToggleButton>
            <ToggleButton value={SELECTION_MODE}>
              <Colorize />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        {mode === INSPECTION_MODE &&
          <div>
            <h4>Inspection d'élément</h4>
            {inspectedElement && inspectedElement.id}
          </div>
        }
        {selection && mode === SELECTION_MODE &&
          <div>
            <h4>Sélection d'éléments</h4>
            <ul>{selection.map(e =>
              <li key={e.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {e.id}
                  <IconButton onClick={() => _setSelection(e)}><Close /></IconButton>
                </div>
              </li>)}
            </ul>
            {!!selection.length &&
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <Button onClick={() => createScoreSelections(selection)} size='small'>Créer une sélection</Button>
              </div>
            }
          </div>
        }
        <h4>Sélections créées</h4>
        <ul>{scoreSelections.map(e =>
          <li key={e.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div onClick={() => mode === SELECTION_MODE ? _setSelection(e) : _setInspectedElement(e)} style={{ cursor: 'pointer' }}>{e.id}</div>
              {mode === SELECTION_MODE && <IconButton onClick={() => removeScoreSelections(e)}><Close /></IconButton>}
            </div>
          </li>)}
        </ul>
      </div>
    </div>
  )
}

export default MeiViewer
