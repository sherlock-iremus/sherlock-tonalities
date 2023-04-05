import { Avatar } from '@mui/material'
import { useGetContributorQuery } from '../../app/services/sparql'

export const ContributorItem = ({ contributorIri, small }) => {
  const { data: contributor } = useGetContributorQuery(contributorIri)
  const size = small ? 28 : 32
  if (contributor)
    return <Avatar sx={{ height: size, width: size, bgcolor: contributor.color }}>{contributor.emoji}</Avatar>
  else return <Avatar sx={{ height: size, width: size }} />
}
