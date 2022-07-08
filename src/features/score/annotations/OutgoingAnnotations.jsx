import {
  Chip,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import { useGetOutgoingAnnotationsQuery } from '../../../app/services/sparql'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { ContributorItem } from '../items/ContributorItem'
import { findKey, findType } from '../utils'
import predicats from '../../../app/services/p140_p177.json'
import { useState } from 'react'
import { ChevronRight, ExpandMore } from '@mui/icons-material'
import { ConceptItem } from '../items/ConceptItem'

export const OutgoingAnnotations = props => {
  const [isOpen, setIsOpen] = useState(true)
  const { data: annotations } = useGetOutgoingAnnotationsQuery(findKey(props))
  const dispatch = useDispatch()
  const baseUrlLength = useSelector(state => state.score.baseUrl.length)
  return (
    !!annotations?.length && (
      <>
        <ListSubheader>Annotations</ListSubheader>
        {predicats[findType(props)].map(predicat => (
          <Box key={predicat.iri}>
            <ListItem
              disablePadding
              secondaryAction={!isOpen && <Chip label={annotations.filter(a => a.predicat === predicat.iri).length} />}
            >
              <IconButton disableRipple onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <ExpandMore /> : <ChevronRight />}
              </IconButton>
              <ListItemIcon>{predicat.icon}</ListItemIcon>
              <ListItemText primary={predicat.label || predicat.iri.slice(baseUrlLength)} />
            </ListItem>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List dense disablePadding>
                {annotations
                  .filter(a => a.predicat === predicat.iri)
                  .map(({ annotationIri, date, contributorIri, object }) => (
                    <ListItem
                      key={annotationIri}
                      disablePadding
                      secondaryAction={
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          <ContributorItem {...{ contributorIri }} />
                          <Typography variant="caption">{new Date(date).toLocaleDateString('en-GB')}</Typography>
                        </Box>
                      }
                    >
                      <ListItemButton onClick={() => dispatch(setInspectedEntity({ annotationIri }))}>
                        <ListItemText
                          primary={<ConceptItem conceptIri={object} />}
                          secondary={annotationIri.slice(baseUrlLength)}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </>
    )
  )
}
