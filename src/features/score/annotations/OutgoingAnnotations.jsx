import {
  Chip,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
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
import options from '../../../app/services/p177_p141.json'
import { useState } from 'react'
import { ChevronRight, Comment, ExpandMore, HistoryEdu, Piano } from '@mui/icons-material'

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
          <>
            <ListItem
              disablePadding
              secondaryAction={!isOpen && <Chip label={annotations.filter(a => a.predicat === predicat.iri).length} />}
            >
              <IconButton disableRipple onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <ExpandMore /> : <ChevronRight />}
              </IconButton>
              <ListItemText primary={predicat.label || predicat.iri.slice(baseUrlLength)} />
            </ListItem>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List key={predicat.iri} dense disablePadding>
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
                          primary={
                            <Chip
                              label={
                                options[predicat.iri].filter(a => a.iri === object)[0]?.label ||
                                object.slice(baseUrlLength)
                              }
                            />
                          }
                          secondary={annotationIri.slice(baseUrlLength)}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
              </List>
            </Collapse>
          </>
        ))}
      </>
    )
  )
}

// WITHOUT GROUPBY PREDICAT

// return (
//   (!!annotations?.length && (
//     <List subheader={<ListSubheader>Outgoing annotations</ListSubheader>} dense disablePadding>
//       {annotations.map(({ annotationIri, date, contributorIri, object, predicat }) => (
//         <ListItem
//           key={annotationIri}
//           disablePadding
//           secondaryAction={
//             <Box
//               sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//               }}
//             >
//               <ContributorItem {...{ contributorIri }} />
//               <Typography variant="caption">{new Date(date).toLocaleDateString('en-GB')}</Typography>
//             </Box>
//           }
//         >
//           <ListItemButton onClick={() => dispatch(setInspectedEntity({ annotationIri }))}>
//             <ListItemText
//               primary={actions[findType(props)]
//                 .filter(a => a.iri === predicat)
//                 .map(a => a.label)}
//               secondary={options[predicat]
//                 .filter(a => a.iri === object)
//                 .map(a => (
//                   <Chip label={a.label} />
//                 ))}
//             />
//           </ListItemButton>
//         </ListItem>
//       ))}
//     </List>
//   )) ||
//   null
// )
// }
