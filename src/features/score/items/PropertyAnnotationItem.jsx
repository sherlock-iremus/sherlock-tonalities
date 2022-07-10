import { ChevronRight, Comment, ExpandMore, Sell } from '@mui/icons-material'
import { Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { useGetEntityTypeQuery, useGetPredicatLabelQuery } from '../../../app/services/sparql'
import { getConceptLabel, getTreatiseIri } from '../../../app/treatises/treatises'
import { LoadingEntity } from '../entities/LoadingEntity'
import { Item } from './Item'

export const PropertyAnnotationItem = ({ propertyIri, annotation }) => {
  const dispatch = useDispatch()
  const { data: label } = useGetPredicatLabelQuery(propertyIri)
  const [isOpen, setIsOpen] = useState(false)
  const { tonalityBaseUrl } = useSelector(state => state.score)
  const { data } = useGetEntityTypeQuery(annotation.entityIri)

  return (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton onClick={() => dispatch(setInspectedEntity({ annotationIri: annotation.annotationIri }))}>
            <Comment />
          </IconButton>
        }
      >
        <IconButton disableRipple onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ExpandMore /> : <ChevronRight />}
        </IconButton>
        <ListItemButton onClick={() => dispatch(setInspectedEntity({ propertyIri }))}>
          <ListItemIcon>
            <Sell />
          </ListItemIcon>
          <ListItemText
            primary={label || getConceptLabel(propertyIri)}
            secondary={getTreatiseIri(propertyIri).slice(tonalityBaseUrl.length)}
          />
        </ListItemButton>
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List sx={{ pl: 2 }} dense disablePadding>
          {(data && <Item {...data} />) || <LoadingEntity />}
        </List>
      </Collapse>
    </>
  )
}
