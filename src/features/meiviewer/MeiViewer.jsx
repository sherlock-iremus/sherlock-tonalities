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
  Collapse,
  Divider,
  InputAdornment,
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
import { Lyrics, FindInPage, Close, Sell, Edit, ExpandMore, ChevronRight, SpeakerNotes } from '@mui/icons-material'
import { ANNOTATION, CONCEPTS, INSPECTION, SELECTION, SELECTIONS } from './constants'
import { useGetNotesOnFirstBeatQuery } from '../../app/services/sparqlLocal'
import { ScoreItem } from './ScoreItem'
import treatise from '../../app/treatises/Zarlino_1588.json'
import { SearchBar } from './SearchField'
import { ConceptItem } from './ConceptItem'

window.verovioCallback = load

const MeiViewer = ({
  meiUrl = 'http://data-iremus.huma-num.fr/files/mei/e2492d45-b068-4954-8781-9d5653deb8f5.mei',
  scoreIri = 'http://data-iremus.huma-num.fr/id/e2492d45-b068-4954-8781-9d5653deb8f5',
}) => {
  const [mode, setMode] = useState(INSPECTION)
  const [inspectedElement, setInspectedElement] = useState(null)
  const [selection, setSelection] = useState([])
  const [currentAnnotation, setCurrentAnnotation] = useState({ concept: null, selection: [] })
  const [rightClickedNoteId, setRightClickedNoteId] = useState(null)
  const [scoreSelections, setScoreSelections] = useState([])
  const [confirmationMessage, setConfirmationMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [infoDisplay, setInfoDisplay] = useState(true)
  const [selectionName, setSelectionName] = useState('')
  const [isBeingEdited, setIsBeingEdited] = useState(null)
  const [openedList, setOpenedList] = useState(null)
  const [filter, setFilter] = useState('')
  const [filteredTree, setFilteredTree] = useState(treatise)

  const verticalityData = useGetNotesOnFirstBeatQuery(`${scoreIri}_${rightClickedNoteId}`, {
    skip: !rightClickedNoteId,
  })

  useEffect(() => {
    createVerovio(meiUrl) // github.com/rism-digital/verovio-app-react/blob/master/src/App.js
  }, [])

  const _setFilter = newFilter => {
    setFilter(newFilter)
    setFilteredTree(newFilter ? _setFilteredTree(treatise, newFilter) : treatise)
  }

  const _setFilteredTree = (node, newFilter) => {
    if (node.rootClasses)
      return { ...node, rootClasses: node.rootClasses.map(c => _setFilteredTree(c, newFilter)).filter(Boolean) }
    else if (node.subClasses) {
      const filteredNode = {
        ...node,
        subClasses: node.subClasses.map(c => _setFilteredTree(c, newFilter)).filter(Boolean),
      }
      if (filteredNode.subClasses.length) return filteredNode
    }
    if (node.label && node.label.toLowerCase().includes(newFilter.toLowerCase())) return node
    return null
  }

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
    setOpenedList(SELECTIONS)
    setSelectionName('')
  }

  const removeScoreSelections = s => {
    if (selection.includes(s)) _setSelection(s)
    if (inspectedElement === s) _setInspectedElement(s)
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
      if (e.ctrlKey || e.altKey) {
        setInfoDisplay(false)
        return setRightClickedNoteId(n.id)
      }
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
        <div css={{ display: 'flex', flexDirection: 'column' }}>
          <ToggleButtonGroup value={mode} exclusive onChange={handleChangeMode} css={centerStyle}>
            <ToggleButton value={INSPECTION}>
              <Tooltip title="Inspection mode">
                <FindInPage />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={SELECTION}>
              <Tooltip title="Selection mode">
                <SpeakerNotes />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value={ANNOTATION}>
              <Tooltip title="Annotation mode">
                <Lyrics />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          {mode === INSPECTION && (
            <List
              subheader={
                <ListSubheader>
                  <b>Current inspection</b>
                  {infoDisplay && (
                    <Alert severity="info" onClose={() => setInfoDisplay(false)} sx={{ marginBottom: 2 }}>
                      To select a verticality, Alt+click a note
                    </Alert>
                  )}
                </ListSubheader>
              }
              sx={{
                overflow: 'auto',
              }}
            >
              {verticalityData.isSuccess &&
                !verticalityData.isFetching &&
                _setInspectedElement(getVerticalityElement())}
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
                  <b>Current selection</b>
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

          {mode === ANNOTATION && (
            <List
              subheader={
                <ListSubheader>
                  <b>Current annotation</b>
                  <div css={flexEndStyle}>
                    <TextField
                      required
                      label="Concept"
                      value={currentAnnotation.concept ? currentAnnotation.concept.label : ''}
                      size="small"
                      sx={{ alignSelf: 'center' }}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setCurrentAnnotation({ ...currentAnnotation, concept: null })}
                              disabled={!currentAnnotation.concept}
                            >
                              <Close />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                </ListSubheader>
              }
              sx={{
                overflow: 'auto',
              }}
            >
              {currentAnnotation.selection.length ? (
                currentAnnotation.selection.map(e => (
                  <ScoreItem
                    key={e.id}
                    item={e}
                    scoreIri={scoreIri}
                    secondaryAction={
                      <IconButton>
                        <Close />
                      </IconButton>
                    }
                  />
                ))
              ) : (
                <div css={noDataStyle}>
                  Current annotation is empty, start by selection a concept or a previous selection
                </div>
              )}
            </List>
          )}
        </div>
        <div css={{ display: 'flex', flexDirection: 'column' }}>
          <Divider />
          <List
            sx={{
              overflow: 'auto',
              minHeight: 48,
            }}
            subheader={
              <ListSubheader sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <div
                  onClick={() => (openedList === CONCEPTS ? setOpenedList(null) : setOpenedList(CONCEPTS))}
                  css={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {openedList === CONCEPTS ? <ExpandMore /> : <ChevronRight />}
                  Theorical concepts
                </div>
                {openedList === CONCEPTS && <SearchBar value={filter} onChange={e => _setFilter(e.target.value)} />}
              </ListSubheader>
            }
          >
            <Collapse in={openedList === CONCEPTS} timeout="auto" unmountOnExit sx={{ pl: 4 }}>
              {filteredTree.rootClasses.length ? (
                filteredTree.rootClasses.map(concept => (
                  <ConceptItem
                    key={concept.iri}
                    concept={concept}
                    setConcept={concept =>
                      mode === ANNOTATION &&
                      setCurrentAnnotation({
                        ...currentAnnotation,
                        concept: currentAnnotation.concept === concept ? null : concept,
                      })
                    }
                  />
                ))
              ) : (
                <div css={noDataStyle}>No matching concept for this filter</div>
              )}
            </Collapse>
          </List>

          <List
            sx={{
              overflow: 'auto',
              minHeight: 48,
            }}
            subheader={
              <ListSubheader
                onClick={() => (openedList === SELECTIONS ? setOpenedList(null) : setOpenedList(SELECTIONS))}
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              >
                {openedList === SELECTIONS ? <ExpandMore /> : <ChevronRight />}
                <b>Previous selection</b>
              </ListSubheader>
            }
          >
            <Collapse in={openedList === SELECTIONS} timeout="auto" unmountOnExit>
              {scoreSelections.length ? (
                scoreSelections.map(e => (
                  <ListItem
                    key={e.id}
                    dense
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
            </Collapse>
          </List>
        </div>
      </div>
      <Snackbar
        open={!!confirmationMessage}
        autoHideDuration={6000}
        onClose={() => setConfirmationMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success">{confirmationMessage}</Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="warning">{errorMessage}</Alert>
      </Snackbar>
    </div>
  )
}

export default MeiViewer
