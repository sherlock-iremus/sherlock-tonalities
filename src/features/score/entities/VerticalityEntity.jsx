import { AddComment, Piano } from '@mui/icons-material'
import { SpeedDial, SpeedDialAction } from '@mui/material'
import { Box } from '@mui/system'
import { VERTICALITY } from '../constants'
import { VerticalityItem } from '../items/VerticalityItem'
import { setAnnotationEditor } from '../../../app/services/scoreSlice'
import { withDispatch } from '../items/withDispatch'
import { OutgoingAnnotations } from '../annotations/OutgoingAnnotations'
import actions from '../../../app/services/p140_p177.json'

const BaseVerticalityEntity = ({ verticalityIri, clickedNoteIri, dispatch, baseUrl }) => (
  <Box>
    <VerticalityItem {...{ verticalityIri, baseUrl, clickedNoteIri }} isEntity />

    <OutgoingAnnotations {...{ verticalityIri }} />

    <SpeedDial ariaLabel="New" sx={{ position: 'fixed', bottom: 16, right: 16 }} icon={<AddComment />}>
      {actions[VERTICALITY].map(action => (
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

export const VerticalityEntity = withDispatch(BaseVerticalityEntity)
