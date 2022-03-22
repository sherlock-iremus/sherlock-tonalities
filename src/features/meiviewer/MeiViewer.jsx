/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react'
import { Button, IconButton, ToggleButton, ToggleButtonGroup, Chip, CircularProgress, Typography } from '@mui/material'
import { TreeView } from '@mui/lab'
import { v4 as uuid } from 'uuid'
import {
  createVerovio,
  load,
  addInspectionStyle,
  removeInspectionStyle,
  addSelectionStyle,
  removeSelectionStyle,
  getNote,
} from './verovioHelpers'
import {
  containerStyle,
  mainAreaStyle,
  panelStyle,
  rowStyle,
  verovioStyle,
  flexEndStyle,
  scoreSelectionStyle,
  noDataStyle,
  COLOR_INSPECTED,
  topPanelStyle,
  centerStyle,
} from './mei.css'
import { sameMembers } from './utils'
import { Colorize, RemoveRedEye, Close, ExpandMore, ChevronRight } from '@mui/icons-material'
import { INSPECTION, SELECTION } from './constants'
import { Inspector } from './Inspector'
import { useCountTriplesQuery } from '../../app/services/sparqlLocal'
import { useGetNotesOnFirstBeatQuery } from '../../app/services/sparqlLocal'

window.verovioCallback = load

const MeiViewer = ({
  meiUrl = 'http://data-iremus.huma-num.fr/files/mei/e2492d45-b068-4954-8781-9d5653deb8f5.mei',
  scoreIri = 'http://data-iremus.huma-num.fr/id/e2492d45-b068-4954-8781-9d5653deb8f5',
}) => {
  const [mode, setMode] = useState(INSPECTION)
  const [inspectedElement, setInspectedElement] = useState(null)
  const [selection, setSelection] = useState([])
  const [rightClickedNoteId, setRightClickedNoteId] = useState(null)
  const [scoreSelections, setScoreSelections] = useState([])

  const sparql = useCountTriplesQuery()

  const verticalityData = useGetNotesOnFirstBeatQuery(`${scoreIri}_${rightClickedNoteId}`, {
    skip: !rightClickedNoteId,
  })

  useEffect(() => {
    createVerovio(meiUrl) // github.com/rism-digital/verovio-app-react/blob/master/src/App.js
  }, [])

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
    if (n) {
      if (e.ctrlKey) return setRightClickedNoteId(n.id)
      switch (mode) {
        case INSPECTION:
          _setInspectedElement(n)
          break
        case SELECTION:
          _setSelection(n)
          break
      }
    }
  }

  const handleChangeMode = (event, newMode) => newMode && setMode(newMode)

  const getVerticalityElement = () => {
    setRightClickedNoteId(null)
    return {
      id: verticalityData.data.results.bindings[0].beat.value.slice(scoreIri.length + 1),
      referenceNote: document.getElementById(
        verticalityData.data.results.bindings[0].selectedNote.value.slice(scoreIri.length + 1)
      ),
      selection: verticalityData.data.results.bindings.map(binding =>
        document.getElementById(binding.notes.value.slice(scoreIri.length + 1))
      ),
    }
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
        <div css={topPanelStyle}>
          <ToggleButtonGroup value={mode} exclusive onChange={handleChangeMode} css={centerStyle} size="small">
            <ToggleButton value={INSPECTION}>
              <RemoveRedEye />
            </ToggleButton>
            <ToggleButton value={SELECTION}>
              <Colorize />
            </ToggleButton>
          </ToggleButtonGroup>

          {mode === INSPECTION && (
            <div>
              {verticalityData.isSuccess &&
                !verticalityData.isFetching &&
                _setInspectedElement(getVerticalityElement())}
              <Typography variant="button" component="h2">
                Inspection
              </Typography>
              {inspectedElement ? (
                <TreeView defaultCollapseIcon={<ExpandMore />} defaultExpandIcon={<ChevronRight />}>
                  <Inspector
                    inspectedElement={inspectedElement}
                    scoreIri={scoreIri}
                    onClickRemove={() => _setInspectedElement(inspectedElement)}
                  />
                </TreeView>
              ) : (
                <div css={noDataStyle}>Nothing to inspect, start by picking an element on the score</div>
              )}
            </div>
          )}

          {mode === SELECTION && (
            <div>
              {verticalityData.isSuccess && !verticalityData.isFetching && _setSelection(getVerticalityElement())}
              <Typography variant="button" component="h2">
                Selection
              </Typography>
              {!selection.length && (
                <div css={noDataStyle}>
                  No element was added to the current selection, start by picking elements on the score
                </div>
              )}
              <TreeView defaultCollapseIcon={<ExpandMore />} defaultExpandIcon={<ChevronRight />}>
                {selection.map(e => (
                  <Inspector
                    key={e.id}
                    inspectedElement={e}
                    scoreIri={scoreIri}
                    onClickRemove={() => _setSelection(e)}
                  />
                ))}
              </TreeView>
              <div css={flexEndStyle}>
                <Button onClick={() => createScoreSelections(selection)} disabled={!selection.length} size="small">
                  Create selection
                </Button>
              </div>
            </div>
          )}
        </div>

        <div>
          <Typography variant="button" component="h2">
            Previous selections
          </Typography>
          {!scoreSelections.length && <div css={noDataStyle}>There is no created selection, start by creating one</div>}
          <TreeView
            onNodeSelect={(e, node) => (mode === SELECTION ? _setSelection(node) : _setInspectedElement(node))}
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
          >
            {scoreSelections.map(e => (
              <Inspector
                key={e.id}
                inspectedElement={e}
                scoreIri={scoreIri}
                onClickRemove={() => removeScoreSelections(e)}
              />
            ))}
          </TreeView>
          {sparql.isSuccess ? (
            sparql.data.results.bindings.map(binding => (
              <div key={binding.triples.value} css={centerStyle}>
                <Chip label={`There are ${binding.triples.value} triples on the local database`} />
              </div>
            ))
          ) : (
            <div css={centerStyle}>
              <CircularProgress />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MeiViewer
