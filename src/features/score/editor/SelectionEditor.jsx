import { BubbleChart, Close, Done } from '@mui/icons-material'
import {
  AppBar,
  CircularProgress,
  Drawer,
  IconButton,
  List,
  ListSubheader,
  SpeedDial,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import { setAlert, setInspectionMode } from '../../../app/services/scoreSlice'
import { usePatchSelectionMutation, usePostSelectionMutation } from '../../../app/services/sherlockApi'
import { useGetChildSelectionsQuery, useGetScoreSelectionsQuery } from '../../../app/services/sparql'
import { Item } from '../items/Item'
import { COLOR_SELECTED } from '../mei.css'
import { findKey } from '../utils'

export const SelectionEditor = () => {
  const dispatch = useDispatch()
  const { selectedEntities, isSelectionMode, baseUrl, scoreIri, editingSelectionIri } = useSelector(
    state => state.score
  )
  const { refetch } = useGetScoreSelectionsQuery(scoreIri)
  const { refetch: refetchEditionSelection } = useGetChildSelectionsQuery(editingSelectionIri)

  const [postSelection, { isLoading: isPostLoading }] = usePostSelectionMutation()
  const [patchSelection, { isLoading: isPatchLoading }] = usePatchSelectionMutation()
  const isLoading = isPostLoading || isPatchLoading

  const createSelection = async () => {
    if (selectedEntities.length && !isLoading) {
      try {
        const children = selectedEntities.map(findKey)
        const document_contexts = [scoreIri]
        await postSelection({ children, document_contexts }).unwrap()
        refetch()
        dispatch(setInspectionMode())
        dispatch(setAlert({ confirmation: 'Annotation was successfully created' }))
      } catch {
        dispatch(setAlert({ error: 'An error occured while creating the selection' }))
      }
    }
  }

  const updateSelection = async () => {
    if (selectedEntities.length && !isLoading) {
      try {
        const children = selectedEntities.map(findKey)
        const document_contexts = [scoreIri]
        await patchSelection({ children, document_contexts, uuid: editingSelectionIri.slice(baseUrl.length) }).unwrap()
        dispatch(setAlert({ confirmation: 'Annotation was successfully updated' }))

        refetch()
        refetchEditionSelection()
        dispatch(setInspectionMode())
      } catch {
        dispatch(setAlert({ error: 'An error occured while updating the selection' }))
      }
    }
  }

  return (
    <Drawer open={isSelectionMode} anchor="right" variant="persistent" SlideProps={{ direction: 'up' }}>
      <Box sx={{ width: 450 }}>
        <AppBar position="sticky" sx={{ bgcolor: COLOR_SELECTED }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Editor
            </Typography>
            <Tooltip title="Close">
              <IconButton edge="end" color="inherit" onClick={() => dispatch(setInspectionMode())}>
                <Close />
              </IconButton>
            </Tooltip>
          </Toolbar>
          <Toolbar>
            <Tabs
              value={0}
              textColor="inherit"
              centered
              sx={{ flexGrow: 1, '& .MuiTabs-indicator': { backgroundColor: COLOR_SELECTED } }}
            >
              <Tab label={editingSelectionIri ? 'Edit selection' : 'New selection'} icon={<BubbleChart />} />
            </Tabs>
          </Toolbar>
        </AppBar>
        <List subheader={<ListSubheader>Current selection</ListSubheader>}>
          {selectedEntities.map(item => (
            <Item {...item} key={findKey(item)} baseUrl={baseUrl} isEntity />
          ))}
        </List>
        <Tooltip title="Validate">
          <SpeedDial
            onClick={editingSelectionIri ? updateSelection : createSelection}
            ariaLabel="validate"
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              '& .MuiSpeedDial-fab': { backgroundColor: COLOR_SELECTED },
            }}
            icon={isLoading ? <CircularProgress /> : <Done />}
          />
        </Tooltip>
      </Box>
    </Drawer>
  )
}
