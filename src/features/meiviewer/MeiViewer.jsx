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
  Alert,
  IconButton,
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
import { Lyrics, FindInPage, Close, Sell, Edit } from '@mui/icons-material'
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
  const [confirmationMessage, setConfirmationMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [infoDisplay, setInfoDisplay] = useState(true)
  const [selectionName, setSelectionName] = useState('')
  const [isBeingEdited, setIsBeingEdited] = useState(null)

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

  const _setSelection = (element, replacingElement) => {
    if (replacingElement) {
      setSelection([...selection.filter(e => e !== element), replacingElement])
      removeSelectionStyle(element)
    } else if (!selection.includes(element)) setSelection([...selection, element])
    else {
      setSelection(selection.filter(e => e !== element))
      removeSelectionStyle(element)
    }
  }

  const _setIsBeingEdited = element => {
    if (mode === INSPECTION) setMode(SELECTION)
    if (element) {
      // TODO avertir de la suppression du contenu de sélection ?
      setSelection([...element.selection])
      setSelectionName(element.name)
      setIsBeingEdited(element)
    } else {
      setSelection([])
      setSelectionName('')
      setIsBeingEdited(null)
    }
  }

  const createScoreSelection = () => {
    if (isBeingEdited) {
      setScoreSelections([
        ...scoreSelections.filter(e => e !== isBeingEdited),
        { id: isBeingEdited.id, name: selectionName, selection: selection },
      ])
      setIsBeingEdited(null)
      setConfirmationMessage('The selection was successfully updated')
    } else {
      for (const scoreSelection of scoreSelections)
        if (
          sameMembers(
            scoreSelection.selection.map(e => e.id),
            selection.map(e => e.id)
          )
        )
          return setErrorMessage('Selection content already exists, please edit or reuse previous selection')
      setScoreSelections([...scoreSelections, { id: uuid(), name: selectionName, selection: selection }])
      setConfirmationMessage('The selection was successfully created')
    }
    removeSelectionStyle({ selection: selection })
    setSelection([])
    setSelectionName('')
  }

  const removeScoreSelections = s => {
    if (selection.includes(s)) setSelection(selection.filter(e => e !== s))
    if (inspectedElement === s) setInspectedElement(null)
    setScoreSelections(scoreSelections.filter(e => e !== s))
    setConfirmationMessage('The selection was successfully deleted')
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
              <Lyrics />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>

        {mode === INSPECTION && (
          <List
            subheader={
              <ListSubheader>
                Current inspection
                {infoDisplay && (
                  <Alert severity="info" onClose={() => setInfoDisplay(false)} sx={{ marginBottom: 2 }}>
                    To select a verticality, Ctrl+click a note
                  </Alert>
                )}
              </ListSubheader>
            }
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
                onNoteSelect={note =>
                  _setInspectedElement({
                    ...inspectedElement,
                    id: inspectedElement.id + note.id,
                    selection: [note],
                    noteOnBeat: true,
                  })
                }
                secondaryAction={
                  <IconButton onClick={() => _setInspectedElement(inspectedElement)}>
                    <Close />
                  </IconButton>
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
                {isBeingEdited && (
                  <Alert
                    severity="warning"
                    icon={<Edit />}
                    onClose={() => _setIsBeingEdited()}
                    sx={{ marginBottom: 2 }}
                  >
                    Currently editing a previous selection
                  </Alert>
                )}
                <div css={flexEndStyle}>
                  <TextField
                    required
                    label="Name"
                    value={selectionName}
                    onChange={e => setSelectionName(capitalize(e.target.value))}
                    size="small"
                    sx={{ alignSelf: 'center' }}
                  />
                  <Button onClick={() => createScoreSelection()} disabled={!selection.length || !selectionName}>
                    {isBeingEdited ? 'Update selection' : 'Create selection'}
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
                  onNoteSelect={note =>
                    _setSelection(e, { ...e, id: e.id + note.id, selection: [note], noteOnBeat: true })
                  }
                  secondaryAction={
                    <IconButton onClick={() => _setSelection(e)}>
                      <Close />
                    </IconButton>
                  }
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
                secondaryAction={
                  <div>
                    <IconButton onClick={() => _setIsBeingEdited(e)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => removeScoreSelections(e)}>
                      <Close />
                    </IconButton>
                  </div>
                }
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

        <Snackbar open={!!confirmationMessage} autoHideDuration={6000} onClose={() => setConfirmationMessage('')}>
          <Alert severity="success">{confirmationMessage}</Alert>
        </Snackbar>

        <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage('')}>
          <Alert severity="warning">{errorMessage}</Alert>
        </Snackbar>
      </div>
    </div>
  )
}

export default MeiViewer
