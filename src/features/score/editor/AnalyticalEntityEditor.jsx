import { AddComment, Close, Done } from '@mui/icons-material'
import {
  AppBar,
  CircularProgress,
  Drawer,
  IconButton,
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
import { setAlert, setAnalyticalEntityEditor } from '../../../app/services/scoreSlice'
import { useState } from 'react'
import { useGetAnalyticalEntitiesQuery } from '../../../app/services/sparql'
import { COLOR_SELECTED } from '../mei.css'
import { SelectionItem } from '../items/SelectionItem'
import { ClassItem } from '../items/ClassItem'
import { PropertyItem } from '../items/PropertyItem'

export const AnalyticalEntityEditor = () => {
  const dispatch = useDispatch()
  const {
    analyticalEntityEditor: { selectionIri, propertyIri, focusedEntityIri, concepts, properties },
  } = useSelector(state => state.score)
  const { refetch } = useGetAnalyticalEntitiesQuery({ selectionIri }, { skip: !selectionIri })
  const isLoading = false

  const createAnalyticalEntity = async () => {
    if (isLoading(concepts.length || properties.length)) {
      try {
        // POST ROUTE
        refetch()
        dispatch(setAnalyticalEntityEditor())
        dispatch(setAlert({ confirmation: 'Analytical entity was successfully created' }))
      } catch {
        dispatch(setAlert({ error: 'An error occured while creating the analytical entity' }))
      }
    }
  }

  return (
    <Drawer open={!!selectionIri} anchor="right" variant="persistent" SlideProps={{ direction: 'up' }}>
      {selectionIri && (
        <Box sx={{ width: 450 }}>
          <AppBar position="sticky" sx={{ bgcolor: COLOR_SELECTED }}>
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Analytical entity editor
              </Typography>
              <Tooltip title="Close">
                <IconButton edge="end" color="inherit" onClick={() => dispatch(setAnalyticalEntityEditor())}>
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
                <Tab label="New analytical entity" icon={<AddComment />} />
              </Tabs>
            </Toolbar>
          </AppBar>

          <ListSubheader>Assigned property</ListSubheader>
          <PropertyItem propertyIri={propertyIri} />

          <Tooltip title="Asign types to this analytical entity from the concept tree">
            <ListSubheader>Assigned types</ListSubheader>
          </Tooltip>
          {concepts.map(concept => (
            <ClassItem key={concept} classIri={concept} isEntity />
          ))}

          <Tooltip title="Asign properties from the property tree by selecting a specific entity from the target selection">
            <ListSubheader>Target selection</ListSubheader>
          </Tooltip>
          <SelectionItem {...{ selectionIri, focusedEntityIri, concepts: properties }} />

          <Tooltip title="Validate">
            <SpeedDial
              onClick={createAnalyticalEntity}
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
      )}
    </Drawer>
  )
}
