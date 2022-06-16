import { List, ListItem, ListItemButton, ListItemText, ListSubheader, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useGetIncomingAnnotationsQuery } from '../../../app/services/sparql'
import { setInspectedEntity } from '../../slice/scoreSlice'

export const IncomingAnnotations = ({ entityIri }) => {
  const { data: annotations } = useGetIncomingAnnotationsQuery(entityIri)
  const dispatch = useDispatch()
  const baseUrlLength = useSelector(state => state.score.baseUrl.length)
  return (
    (!!annotations?.length && (
      <List subheader={<ListSubheader>Incoming annotations</ListSubheader>} dense disablePadding>
        {annotations.map(({ annotationIri, date, contributor }) => (
          <ListItem
            key={annotationIri}
            disablePadding
            secondaryAction={<Typography>{new Date(date).toLocaleDateString('en-GB')}</Typography>}
          >
            <ListItemButton onClick={() => dispatch(setInspectedEntity({ annotationIri }))}>
              <ListItemText primary="test" secondary={annotationIri.slice(baseUrlLength)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    )) ||
    null
  )
}
