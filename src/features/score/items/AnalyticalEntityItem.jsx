import { Close, Lyrics } from '@mui/icons-material'
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { useGetAnalyticalEntityQuery } from '../../../app/services/sparql'
import { LoadingEntity } from '../entities/LoadingEntity'
import { ContributorItem } from './ContributorItem'
import { withDispatch } from './withDispatch'

const BaseAnalyticalEntityItem = ({ analyticalEntityIri, baseUrlLength, dispatch, isEntity }) => {
  const { data } = useGetAnalyticalEntityQuery(analyticalEntityIri)
  return (
    (data && (
      <ListItem
        disablePadding
        secondaryAction={
          isEntity ? (
            <IconButton onClick={() => dispatch(setInspectedEntity({ analyticalEntityIri }))}>
              <Close />
            </IconButton>
          ) : (
            <ContributorItem contributorIri={data.contributorIri} />
          )
        }
      >
        <ListItemButton
          onClick={() => !isEntity && dispatch(setInspectedEntity({ analyticalEntityIri }))}
          sx={isEntity && { cursor: 'default' }}
        >
          <ListItemIcon>
            <Lyrics />
          </ListItemIcon>
          <ListItemText primary="Analytical entity" secondary={analyticalEntityIri.slice(baseUrlLength)} />
        </ListItemButton>
      </ListItem>
    )) || <LoadingEntity />
  )
}

export const AnalyticalEntityItem = withDispatch(BaseAnalyticalEntityItem)
