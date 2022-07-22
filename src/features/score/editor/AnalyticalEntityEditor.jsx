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
import { useGetAnalyticalEntitiesQuery, useGetOutgoingAnnotationsQuery } from '../../../app/services/sparql'
import { COLOR_SELECTED } from '../mei.css'
import { SelectionItem } from '../items/SelectionItem'
import { ClassItem } from '../items/ClassItem'
import { PropertyItem } from '../items/PropertyItem'
import { usePostAnalyticalEntityMutation } from '../../../app/services/sherlockApi'

export const AnalyticalEntityEditor = () => {
  const dispatch = useDispatch()
  const {
    analyticalEntityEditor: { selectionIri, propertyIri, focusedEntityIri, concepts, properties },
  } = useSelector(state => state.score)
  const { refetch: refetchAnalyticalEntities } = useGetAnalyticalEntitiesQuery(
    { selectionIri },
    { skip: !selectionIri }
  )
  const { refetch: refetchAnnotations } = useGetOutgoingAnnotationsQuery(selectionIri, { skip: !selectionIri })

  const [postAnalyticalEntity, { isLoading }] = usePostAnalyticalEntityMutation()
  const createAnalyticalEntity = async () => {
    const e13s = concepts
      .map(c => ({
        p177: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
        p141: c,
        p141_type: 'uri',
      }))
      .concat(properties.map(p => ({ p177: p.propertyIri, p141: p.entityIri, p141_type: 'uri' })))
    if (!isLoading && (concepts.length || properties.length)) {
      try {
        await postAnalyticalEntity({
          p140: selectionIri,
          p177: propertyIri,
          e13s,
        }).unwrap()
        refetchAnalyticalEntities()
        refetchAnnotations()
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

          <Tooltip title="Asign types from the concept tree">
            <ListSubheader>Assigned types</ListSubheader>
          </Tooltip>
          {concepts.map(concept => (
            <ClassItem key={concept} classIri={concept} isEntity />
          ))}

          <Tooltip title="Asign properties from the property tree by first selecting the target entity from current selection">
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
