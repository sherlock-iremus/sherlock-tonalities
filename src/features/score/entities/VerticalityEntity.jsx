import { AddComment } from '@mui/icons-material'
import { SpeedDial, SpeedDialAction } from '@mui/material'
import { Box } from '@mui/system'
import { VERTICALITY } from '../constants'
import { VerticalityItem } from '../items/VerticalityItem'
import { setAnnotationEditor } from '../../../app/services/scoreSlice'
import { withDispatch } from '../items/withDispatch'
import { OutgoingAnnotations } from '../annotations/OutgoingAnnotations'
import actions from '../../../app/services/p140_p177.json'
import { useSelector } from 'react-redux'

const BaseVerticalityEntity = ({ verticalityIri, dispatch, baseUrl }) => {
  const { treatiseIri } = useSelector(state => state.score)
  const filteredActions = [
    ...(treatiseIri in actions[VERTICALITY] ? actions[VERTICALITY][treatiseIri] : []),
    ...actions[VERTICALITY].common,
  ]

  return (
    <Box>
      <VerticalityItem {...{ verticalityIri }} isEntity />

      <OutgoingAnnotations {...{ verticalityIri }} />

      <SpeedDial ariaLabel="New" sx={{ position: 'fixed', bottom: 16, right: 16 }} icon={<AddComment />}>
        {filteredActions.map(action => (
          <SpeedDialAction
            key={action.iri}
            onClick={() => dispatch(setAnnotationEditor({ subject: { verticalityIri }, predicat: action }))}
            tooltipTitle={action.label || action.iri.slice(baseUrl.length)}
            icon={action.icon}
          />
        ))}
      </SpeedDial>
    </Box>
  )
}

export const VerticalityEntity = withDispatch(BaseVerticalityEntity)
