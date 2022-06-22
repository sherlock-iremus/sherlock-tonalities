import { AddComment } from '@mui/icons-material'
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  SpeedDial,
  SpeedDialAction,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../../../app/services/p140_p177.json'
import options from '../../../app/services/p177_p141.json'
import { setAnnotationEditor } from '../../../app/services/scoreSlice'
import { useGetAnnotationQuery } from '../../../app/services/sparql'
import { OutgoingAnnotations } from '../annotations/OutgoingAnnotations'
import { ANNOTATION } from '../constants'
import { LoadingEntity } from './LoadingEntity'

export const AnnotationEntity = ({ annotationIri }) => {
  const dispatch = useDispatch()
  const baseUrlLength = useSelector(state => state.score.baseUrl.length)
  const { data: annotation } = useGetAnnotationQuery(annotationIri)
  if (annotation)
    return (
      <>
        <ListSubheader>Property</ListSubheader>
        <ListItem disablePadding>
          {console.log(annotation)}
          <ListItemText primary={annotation.predicat} />
        </ListItem>

        <ListSubheader>Subject</ListSubheader>
        <ListItem disablePadding>
          <ListItemText primary={annotation.subject} />
        </ListItem>

        <ListSubheader>Object</ListSubheader>
        <ListItem disablePadding>
          <ListItemText primary={annotation.object} />
        </ListItem>

        <OutgoingAnnotations {...{ annotationIri }} />

        <SpeedDial ariaLabel="New" sx={{ position: 'fixed', bottom: 16, right: 16 }} icon={<AddComment />}>
          {actions[ANNOTATION].map(action => (
            <SpeedDialAction
              key={action.iri}
              onClick={() => dispatch(setAnnotationEditor({ subject: { annotationIri }, predicat: action }))}
              tooltipTitle={action.label || action.iri.slice(baseUrlLength)}
              icon={action.icon}
            />
          ))}
        </SpeedDial>
      </>
    )
  return <LoadingEntity />
}
