import { AddComment } from '@mui/icons-material'
import { SpeedDial, SpeedDialAction } from '@mui/material'
import { Box } from '@mui/system'
import { setAnnotationEditor } from '../../../app/services/scoreSlice'
import { withDispatch } from '../items/withDispatch'
import { OutgoingAnnotations } from '../annotations/OutgoingAnnotations'
import actions from '../../../app/services/p140_p177.json'
import { ScoreItem } from '../items/ScoreItem'
import { SCORE } from '../constants'
import { useSelector } from 'react-redux'

const BaseScoreEntity = ({ scoreIri, dispatch, baseUrlLength }) => {
  const { treatiseIri } = useSelector(state => state.score)
  const filteredActions = [
    ...(treatiseIri in actions[SCORE] ? actions[SCORE][treatiseIri] : []),
    ...actions[SCORE].common,
  ]
  return (
    <Box>
      <ScoreItem {...{ scoreIri }} isEntity />

      <OutgoingAnnotations {...{ scoreIri }} />

      <SpeedDial ariaLabel="New" sx={{ position: 'fixed', bottom: 16, right: 16 }} icon={<AddComment />}>
        {filteredActions.map(action => (
          <SpeedDialAction
            key={action.iri}
            onClick={() => dispatch(setAnnotationEditor({ subject: { scoreIri }, predicat: action }))}
            tooltipTitle={action.label || action.iri.slice(baseUrlLength)}
            icon={action.icon}
          />
        ))}
      </SpeedDial>
    </Box>
  )
}

export const ScoreEntity = withDispatch(BaseScoreEntity)
