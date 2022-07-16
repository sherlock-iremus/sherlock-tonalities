import { Avatar, Tooltip } from '@mui/material'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { useGetContributorQuery } from '../../../app/services/sparql'
import { withDispatch } from './withDispatch'

const BaseContributorItem = ({ contributorIri, dispatch, baseUrlLength }) => {
  const { data: contributor } = useGetContributorQuery(contributorIri)
  return (
    (contributor && (
      <Avatar
        onClick={() => dispatch(setInspectedEntity({ contributorIri }))}
        sx={{ width: 24, height: 24, bgcolor: contributor.color, cursor: 'pointer' }}
      >
        {contributor.emoji}
      </Avatar>
    )) ||
    null
  )
}

export const ContributorItem = withDispatch(BaseContributorItem)
