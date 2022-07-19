import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useGetContributorAnnotationsQuery } from '../../../app/services/sparql'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { ConceptItem } from '../items/ConceptItem'
import { ContributorItem } from '../items/ContributorItem'
import { Close, Comment } from '@mui/icons-material'

export const ContributorEntity = ({ contributorIri }) => {
  const dispatch = useDispatch()
  const baseUrlLength = useSelector(state => state.score.baseUrl.length)
  const { data: annotations } = useGetContributorAnnotationsQuery(contributorIri)

  return (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton onClick={() => dispatch(setInspectedEntity({ contributorIri }))}>
            <Close />
          </IconButton>
        }
      >
        <ListItemButton sx={{ cursor: 'default' }}>
          <ListItemIcon>
            <ContributorItem />
          </ListItemIcon>
          <ListItemText primary="Contributor" secondary={contributorIri.slice(baseUrlLength)} />
        </ListItemButton>
      </ListItem>

      {!!annotations?.length && (
        <List subheader={<ListSubheader>Carried out annotations</ListSubheader>} dense disablePadding>
          {annotations?.map(({ annotationIri, predicat, object, date }) => (
            <ListItem
              key={annotationIri}
              disablePadding
              secondaryAction={<Typography variant="caption">{new Date(date).toLocaleDateString('en-GB')}</Typography>}
            >
              <ListItemButton onClick={() => dispatch(setInspectedEntity({ annotationIri }))}>
                <ListItemIcon>
                  <Comment />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <>
                      <ConceptItem conceptIri={predicat} />
                      <ConceptItem conceptIri={object} />
                    </>
                  }
                  secondary={annotationIri.slice(baseUrlLength)}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </>
  )
}
