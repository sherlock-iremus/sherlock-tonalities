/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react'
import { Button, IconButton, ToggleButton, ToggleButtonGroup, Chip, CircularProgress } from '@mui/material'
import { TreeView } from '@mui/lab'
import { v4 as uuid } from 'uuid'
import {
  createVerovio,
  getNodeNote,
  drawVerticalities,
  load,
  addInspectionStyle,
  removeInspectionStyle,
  addSelectionStyle,
  removeSelectionStyle,
} from './verovioHelpers'
import {
  containerStyle,
  mainAreaStyle,
  panelStyle,
  rowStyle,
  toggleButtonStyle,
  verovioStyle,
  flexEndStyle,
  scoreSelectionStyle,
  noDataStyle,
  COLOR_INSPECTED,
} from './mei.css'
import { sameMembers } from './utils'
import { Colorize, RemoveRedEye, Close, ExpandMore, ChevronRight } from '@mui/icons-material'
import { INSPECTION, SELECTION } from './constants'
import { Inspector } from './Inspector'
import { useCountTriplesQuery } from '../../app/services/sparqlLocal'
import { useGetNotesOnFirstBeatQuery } from '../../app/services/sparqlLocal'

window.verovioCallback = load

const meiUri = 'http://data-iremus.huma-num.fr/files/mei/e2492d45-b068-4954-8781-9d5653deb8f5.mei'

const MeiViewer = () => {
  const [mode, setMode] = useState(INSPECTION)
  const [inspectedElement, setInspectedElement] = useState(null)
  const [selection, setSelection] = useState([])
  const [rightClickedNoteId, setRightClickedNoteId] = useState(null)
  const [scoreSelections, setScoreSelections] = useState([])

  const verticalityData = useGetNotesOnFirstBeatQuery(rightClickedNoteId, { skip: !rightClickedNoteId })

  const _setInspectedElement = element => {
    if (inspectedElement) removeInspectionStyle(inspectedElement)
    setInspectedElement(inspectedElement !== element ? element : null)
  }

  const _setSelection = element => {
    if (!selection.includes(element)) setSelection([...selection, element])
    else {
      setSelection(selection.filter(e => e !== element))
      removeSelectionStyle(element)
    }
  }

  const createScoreSelections = newSelection => {
    for (const scoreSelection of scoreSelections)
      if (
        sameMembers(
          scoreSelection.selection.map(e => e.id),
          newSelection.map(e => e.id)
        )
      )
        return
    setScoreSelections([...scoreSelections, { id: uuid(), selection: newSelection }])
    removeSelectionStyle({ selection: selection })
    setSelection([])
  }

  const removeScoreSelections = s => {
    if (selection.includes(s)) setSelection(selection.filter(e => e !== s))
    if (inspectedElement === s) setInspectedElement(null)
    setScoreSelections(scoreSelections.filter(e => e !== s))
  }

  useEffect(() => {
    createVerovio(meiUri) // github.com/rism-digital/verovio-app-react/blob/master/src/App.js
  }, [])

  const sparql = useCountTriplesQuery()

  const handleMouseOver = e => {
    const n = getNodeNote(e)
    if (n) n.noteNode.classList.add('focused')
  }

  const handleMouseLeave = e => {
    const n = getNodeNote(e)
    if (n) n.noteNode.classList.remove('focused')
  }

  const handleClick = e => {
    const n = getNodeNote(e)
    if (n) {
      switch (mode) {
        case INSPECTION:
          if (e.ctrlKey) setRightClickedNoteId(n.noteNode.id)
          else _setInspectedElement(n.noteNode)
          break
        case SELECTION:
          _setSelection(n.noteNode)
          break
      }
    }
  }

  const handleChangeMode = (event, newMode) => newMode && setMode(newMode)

  const inspectVerticality = () => {
    _setInspectedElement({
      id: verticalityData.data.results.bindings[0].firstBeat.value.slice(meiUri.length- 10),
      selection: verticalityData.data.results.bindings.map(binding =>
        document.getElementById(binding.notesInBeat.value.slice(meiUri.length - 10))
      ),
    })
    setRightClickedNoteId(null)
  }

  if (inspectedElement) {
    switch (mode) {
      case INSPECTION:
        addInspectionStyle(inspectedElement)
        break
      case SELECTION:
        removeInspectionStyle(inspectedElement)
        break
    }
  }

  if (selection) {
    switch (mode) {
      case INSPECTION:
        removeSelectionStyle({ selection: selection })
        break
      case SELECTION:
        addSelectionStyle({ selection: selection })
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
        <ToggleButtonGroup value={mode} exclusive onChange={handleChangeMode} css={toggleButtonStyle} size="small">
          <ToggleButton value={INSPECTION}>
            <RemoveRedEye />
          </ToggleButton>
          <ToggleButton value={SELECTION}>
            <Colorize />
          </ToggleButton>
        </ToggleButtonGroup>
        {mode === INSPECTION && (
          <div>
            {verticalityData.isSuccess && !verticalityData.isFetching && inspectVerticality()}
            <h4>Inspection d'élément</h4>
            {inspectedElement ? (
              <TreeView defaultCollapseIcon={<ExpandMore />} defaultExpandIcon={<ChevronRight />}>
                <Inspector inspectedElement={inspectedElement} />
              </TreeView>
            ) : (
              <div css={noDataStyle}>Aucun élément à inspecter, commencez par en sélectionner un</div>
            )}
          </div>
        )}
        {mode === SELECTION && (
          <div>
            <h4>Sélection d'éléments</h4>
            {!selection.length && <div css={noDataStyle}>Aucun élément ajouté, commencez par en sélectionner</div>}
            <ul>
              {selection.map(e => (
                <li key={e.id}>
                  <div css={rowStyle}>
                    {e.id}
                    <IconButton onClick={() => _setSelection(e)}>
                      <Close />
                    </IconButton>
                  </div>
                </li>
              ))}
            </ul>
            <div css={flexEndStyle}>
              <Button onClick={() => createScoreSelections(selection)} disabled={!selection.length} size="small">
                Créer une sélection
              </Button>
            </div>
          </div>
        )}
        <h4>Sélections créées</h4>
        {!scoreSelections.length && <div css={noDataStyle}>Aucune sélection créée, commencez par en créer une</div>}
        <ul>
          {scoreSelections.map(e => (
            <li key={e.id}>
              <div css={rowStyle}>
                <div
                  onClick={() => (mode === SELECTION ? _setSelection(e) : _setInspectedElement(e))}
                  css={
                    mode === INSPECTION && inspectedElement === e
                      ? { ...scoreSelectionStyle, color: COLOR_INSPECTED }
                      : scoreSelectionStyle
                  }
                >
                  {e.id}
                </div>
                {mode === SELECTION && (
                  <IconButton onClick={() => removeScoreSelections(e)}>
                    <Close />
                  </IconButton>
                )}
              </div>
            </li>
          ))}
        </ul>
        {sparql.isLoading ? (
          <CircularProgress />
        ) : (
          !sparql.error &&
          sparql.data.results.bindings.map(binding => (
            <div key={binding.triples.value} css={toggleButtonStyle}>
              <Chip label={`Il y a ${binding.triples.value} triplets sur la base locale !`} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MeiViewer
