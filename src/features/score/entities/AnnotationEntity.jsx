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
import { setAnnotationEditor, setInspectedEntity } from '../../../app/services/scoreSlice'
import { useGetAnnotationQuery } from '../../../app/services/sparql'
import { OutgoingAnnotations } from '../annotations/OutgoingAnnotations'
import { ANNOTATION } from '../constants'
import { AnnotationItem } from '../items/AnnotationItem'
import { AnnotationValueItem } from '../items/AnnotationValueItem'
import { ContributorItem } from '../items/ContributorItem'
import { PropertyItem } from '../items/PropertyItem'
import { LoadingEntity } from './LoadingEntity'

export const AnnotationEntity = ({ annotationIri }) => {
  const dispatch = useDispatch()
  const baseUrlLength = useSelector(state => state.score.baseUrl.length)
  const { data } = useGetAnnotationQuery(annotationIri)
  return (
    (data && (
      <>
        <AnnotationItem {...{ annotationIri }} isEntity />
        
        <ListSubheader>Contributor</ListSubheader>
        <ListItem disablePadding>
          <ListItemButton onClick={() => dispatch(setInspectedEntity({ contributorIri: data.contributorIri }))}>
            <ListItemIcon>
              <ContributorItem contributorIri={data.contributorIri} />
            </ListItemIcon>
            <ListItemText
              primary={`Created on ${new Date(data.date).toLocaleDateString('en-GB')}`}
              secondary={data.contributorIri.slice(baseUrlLength)}
            />
          </ListItemButton>
        </ListItem>

        <ListSubheader>Target entity</ListSubheader>
        <AnnotationValueItem {...data.subject} />

        <ListSubheader>Assigned property</ListSubheader>
        <PropertyItem propertyIri={data.predicat} />

        <ListSubheader>Assigned value</ListSubheader>
        <AnnotationValueItem {...data.object} />

        
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
    )) || <LoadingEntity />
  )
}
