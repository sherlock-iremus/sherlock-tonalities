import { Chip, ListItem, ListItemButton, ListItemText, ListSubheader, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useDispatch, useSelector } from 'react-redux'
import { useGetAnalyticalEntitiesQuery } from '../../../app/services/sparql'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { ContributorItem } from '../items/ContributorItem'

export const AnalyticalEntities = props => {
  const { data: analyticalEntities } = useGetAnalyticalEntitiesQuery(props)
  const dispatch = useDispatch()
  const baseUrlLength = useSelector(state => state.score.baseUrl.length)
  const { treatiseIri } = useSelector(state => state.score)

  return (
    !!analyticalEntities?.length && (
      <>
        <ListSubheader>Analytical entities</ListSubheader>
        {analyticalEntities.map(({ analyticalEntityIri, contributorIri, propertyIri, date, assignments }) => (
          <ListItem
            key={analyticalEntityIri}
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
            <ListItemButton onClick={() => dispatch(setInspectedEntity({ analyticalEntityIri }))}>
              <ListItemText
                primary={
                  (props.conceptIri &&
                    `${props.conceptIri.slice(treatiseIri.length)} with ${assignments} annotations`) ||
                  (props.selectionIri &&
                    `Analytical entity with ${assignments} annotations`) || (
                    <>
                      Is <Chip label={propertyIri.slice(treatiseIri.length)} /> in analytical entity
                    </>
                  )
                }
                secondary={analyticalEntityIri.slice(baseUrlLength)}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </>
    )
  )
}
