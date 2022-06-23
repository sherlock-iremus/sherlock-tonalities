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
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setInspectionMode } from '../../../app/services/scoreSlice'
import { usePostSelectionMutation } from '../../../app/services/sherlockApi'
import { useGetScoreSelectionsQuery } from '../../../app/services/sparql'
import { Item } from '../items/Item'
import { COLOR_SELECTED } from '../mei.css'
import { findKey } from '../utils'
import { AlertMessage } from './AlertMessage'

export const SelectionEditor = () => {
  const dispatch = useDispatch()
  const { selectedEntities, isSelectionMode, baseUrl, scoreIri } = useSelector(state => state.score)
  const [confirmationMessage, setConfirmationMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { refetch } = useGetScoreSelectionsQuery(scoreIri)
  const [postSelection, { isLoading }] = usePostSelectionMutation()

  const createSelection = async () => {
    if (selectedEntities.length && !isLoading) {
      try {
        const children = selectedEntities.map(findKey)
        const document_contexts = [scoreIri]
        await postSelection({ children, document_contexts }).unwrap()
        setConfirmationMessage('Annotation was successfully created')
        refetch()
        dispatch(setInspectionMode())
      } catch {
        setErrorMessage('An error occured while creating the selection')
      }
    }
  }

  return (
    <Drawer open={isSelectionMode} anchor="right" variant="persistent" SlideProps={{ direction: 'up' }}>
      <Box sx={{ width: 400 }}>
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
              <Tab label="New selection" icon={<BubbleChart />} />
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
            onClick={createSelection}
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
        <AlertMessage {...{ confirmationMessage, errorMessage }} />
      </Box>
    </Drawer>
  )
}
