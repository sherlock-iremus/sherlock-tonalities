import { Avatar, Tooltip, Typography } from '@mui/material'
import { useGetContributorQuery } from '../../services/sparql'

export const ContributorItem = ({ contributorIri, small }) => {
  const { data: contributor } = useGetContributorQuery(contributorIri)
  const size = small ? 28 : 32
  if (contributor)
    return (
      <Tooltip title={contributor.name} placement="top">
        <Avatar sx={{ fontSize: 16, height: size, width: size, bgcolor: contributor.color }}>
          <Typography>{contributor.emoji}</Typography>
        </Avatar>
      </Tooltip>
    )
  else return <Avatar sx={{ height: size, width: size }} />
}
