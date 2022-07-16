import { Avatar, Tooltip } from '@mui/material'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { useGetContributorQuery } from '../../../app/services/sparql'
import { withDispatch } from './withDispatch'

const BaseContributorItem = ({ contributorIri, dispatch, baseUrlLength }) => {
  const { data: contributor } = useGetContributorQuery(contributorIri)
  return (
    (contributor && (
      <Tooltip
        title={contributorIri.slice(baseUrlLength)}
        onClick={() => dispatch(setInspectedEntity({ contributorIri }))}
      >
        <Avatar sx={{ width: 24, height: 24, bgcolor: contributor.color }}>{contributor.emoji}</Avatar>
      </Tooltip>
    )) ||
    null
  )
}

export const ContributorItem = withDispatch(BaseContributorItem)
