/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react'
import {
  Button,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListSubheader,
  ListItemButton,
  ListItemText,
  ListItem,
  ListItemIcon,
  Snackbar,
  Tooltip,
  TextField,
  capitalize,
} from '@mui/material'
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
  verovioStyle,
  flexEndStyle,
  noDataStyle,
  centerStyle,
} from './mei.css'
import { sameMembers } from './utils'
import { AddLocationAlt, FindInPage, Close, Sell } from '@mui/icons-material'
import { INSPECTION, SELECTION } from './constants'
import { useGetNotesOnFirstBeatQuery } from '../../app/services/sparqlLocal'
import { ScoreItem } from './ScoreItem'

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
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)
  const [createConfirmation, setCreateConfirmation] = useState(false)
  const [selectionName, setSelectionName] = useState('')

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
    setScoreSelections([...scoreSelections, { id: uuid(), name: selectionName, selection: newSelection }])
    removeSelectionStyle({ selection: selection })
    setSelection([])
    setSelectionName('')
    setCreateConfirmation(true)
  }

  const removeScoreSelections = s => {
    if (selection.includes(s)) setSelection(selection.filter(e => e !== s))
    if (inspectedElement === s) setInspectedElement(null)
    setScoreSelections(scoreSelections.filter(e => e !== s))
    setDeleteConfirmation(true)
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
        <ToggleButtonGroup value={mode} exclusive onChange={handleChangeMode} css={centerStyle}>
          <ToggleButton value={INSPECTION}>
            <Tooltip title="Inspection mode">
              <FindInPage />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={SELECTION}>
            <Tooltip title="Selection mode">
              <AddLocationAlt />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>

        {mode === INSPECTION && (
          <List
            subheader={<ListSubheader>Current inspection</ListSubheader>}
            sx={{
              overflow: 'auto',
              height: '40%',
            }}
          >
            {verticalityData.isSuccess && !verticalityData.isFetching && _setInspectedElement(getVerticalityElement())}
            {inspectedElement ? (
              <ScoreItem
                item={inspectedElement}
                scoreIri={scoreIri}
                secondaryAction={
                  <Close onClick={() => _setInspectedElement(inspectedElement)} css={{ cursor: 'pointer' }} />
                }
              />
            ) : (
              <div css={noDataStyle}>
                Nothing to inspect, start by picking an element on the score or from previous selections
              </div>
            )}
          </List>
        )}

        {mode === SELECTION && (
          <List
            subheader={
              <ListSubheader>
                Current selection
                <div css={flexEndStyle}>
                  <TextField
                    required
                    label="Name"
                    value={selectionName}
                    onChange={e => setSelectionName(capitalize(e.target.value))}
                    size="small"
                  />
                  <Button onClick={() => createScoreSelections(selection)} disabled={!selection.length || !selectionName}>
                    Create selection
                  </Button>
                </div>
              </ListSubheader>
            }
            sx={{
              overflow: 'auto',
              height: '40%',
            }}
          >
            {verticalityData.isSuccess && !verticalityData.isFetching && _setSelection(getVerticalityElement())}

            {selection.length ? (
              selection.map(e => (
                <ScoreItem
                  key={e.id}
                  item={e}
                  scoreIri={scoreIri}
                  secondaryAction={<Close onClick={() => _setSelection(e)} css={{ cursor: 'pointer' }} />}
                />
              ))
            ) : (
              <div css={noDataStyle}>
                No element was added to the current selection, start by picking elements on the score or from previous
                selections
              </div>
            )}
          </List>
        )}

        <List subheader={<ListSubheader>Previous selections</ListSubheader>}>
          {scoreSelections.length ? (
            scoreSelections.map(e => (
              <ListItem
                key={e.id}
                disablePadding
                secondaryAction={<Close onClick={() => removeScoreSelections(e)} css={{ cursor: 'pointer' }} />}
              >
                <ListItemButton
                  onClick={() => (mode === SELECTION ? _setSelection(e) : _setInspectedElement(e))}
                  selected={mode === SELECTION ? selection.includes(e) : inspectedElement === e}
                  css={{ cursor: 'default' }}
                >
                  <ListItemIcon>
                    <Sell />
                  </ListItemIcon>
                  <ListItemText primary={e.name} secondary={`${e.selection.length} elements`} />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <div css={noDataStyle}>There is no created selection, start by creating one</div>
          )}
        </List>

        <Snackbar
          open={deleteConfirmation}
          autoHideDuration={6000}
          message="The selection was successfully deleted"
          onClose={() => setDeleteConfirmation(false)}
        />
        <Snackbar
          open={createConfirmation}
          autoHideDuration={6000}
          message="The selection was successfully created"
          onClose={() => setCreateConfirmation(false)}
        />
      </div>
    </div>
  )
}

export default MeiViewer
