/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { v4 as uuid } from 'uuid'
import { createVerovio, getNodeNote, drawVerticalities, load } from './verovioHelpers'
import { containerStyle, mainAreaStyle, panelStyle, verovioStyle } from './mei.css'
import { sameMembers } from './utils'
import { DriveFileRenameOutline, LocationSearching } from '@mui/icons-material'

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
    if (inspectedElement) inspectedElement.classList.remove('selected')
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
        inspectedElement.classList.add('selected')
        break
      case SELECTION_MODE:
        inspectedElement.classList.remove('selected')
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
          <ToggleButtonGroup color='primary' value={mode} exclusive onChange={handleChangeMode} size='small' style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
            <ToggleButton value={INSPECTION_MODE}>
              <LocationSearching /> Inspect
            </ToggleButton>
            <ToggleButton value={SELECTION_MODE}>
              <DriveFileRenameOutline /> Select
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        {inspectedElement && mode === INSPECTION_MODE &&
          <div>
            <h1>Inspection d'élément</h1>
            {inspectedElement.id}
          </div>
        }
        {selection && mode === SELECTION_MODE &&
          <div>
            <h1>Sélection d'éléments</h1>
            <ul>{selection.map(e =>
              <li key={e.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {e.id}
                  <button onClick={() => _setSelection(e)}>❌</button>
                </div>
              </li>)}
            </ul>
            {!!selection.length &&
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <button onClick={() => createScoreSelections(selection)}>Créer une sélection</button>
              </div>
            }
          </div>
        }
        <h1>Sélections créées</h1>
        <ul>{scoreSelections.map(e =>
          <li key={e.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div onClick={() => mode === SELECTION_MODE && _setSelection(e)} style={{ cursor: 'pointer' }}>{e.id}</div>
              {mode === SELECTION_MODE && <button onClick={() => removeScoreSelections(e)}>❌</button>}
            </div>
          </li>)}
        </ul>
      </div>
    </div>
  )
}

export default MeiViewer
