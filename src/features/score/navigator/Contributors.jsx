import { Logout } from '@mui/icons-material'
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tooltip,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useGetContributorsQuery } from '../../../app/services/sparql'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { useGetUserIdQuery } from '../../../app/services/sherlockApi'
import { ContributorItem } from '../items/ContributorItem'
import { LoadingEntity } from '../entities/LoadingEntity'

export const Contributors = () => {
  const { data: contributors } = useGetContributorsQuery()
  const { data: userId } = useGetUserIdQuery()
  const { inspectedEntities, currentEntityIndex, baseUrl } = useSelector(state => state.score)
  const { contributorIri: inspectedContributor } = inspectedEntities[currentEntityIndex]
  const dispatch = useDispatch()
  const profile = contributors?.filter(c => c.contributorIri.slice(baseUrl.length) === userId)?.[0]

  const removeCookie = () => {
  }

  return (
    <>
      <List subheader={<ListSubheader>Personal profile</ListSubheader>}>
        {profile ? (
          <ListItem
            key={profile.contributorIri}
            disablePadding
            secondaryAction={
              <Tooltip title="Logout">
                <IconButton onClick={removeCookie}>
                  <Logout />
                </IconButton>
              </Tooltip>
            }
          >
            <ListItemButton
              onClick={() => dispatch(setInspectedEntity({ contributorIri: profile.contributorIri }))}
              selected={profile.contributorIri === inspectedContributor}
            >
              <ListItemIcon>
                <ContributorItem contributorIri={profile.contributorIri} />
              </ListItemIcon>
              <ListItemText
                primary={`${profile.annotations} personal contribution${profile.annotations > 1 ? 's' : ''}`}
                secondary={profile.contributorIri.slice(baseUrl.length)}
              />
            </ListItemButton>
          </ListItem>
        ) : (
          <LoadingEntity />
        )}
      </List>

      <List subheader={<ListSubheader>Other contributors</ListSubheader>}>
        {contributors
          ?.filter(c => c.contributorIri.slice(baseUrl.length) !== userId)
          .map(({ contributorIri, annotations }) => (
            <ListItem key={contributorIri} disablePadding>
              <ListItemButton
                onClick={() => dispatch(setInspectedEntity({ contributorIri }))}
                selected={contributorIri === inspectedContributor}
              >
                <ListItemIcon>
                  <ContributorItem {...{ contributorIri }} />
                </ListItemIcon>
                <ListItemText
                  primary={`${annotations} contribution${annotations > 1 ? 's' : ''}`}
                  secondary={contributorIri.slice(baseUrl.length)}
                />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </>
  )
}
