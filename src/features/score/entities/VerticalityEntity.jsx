import { AddComment, Piano } from '@mui/icons-material'
import { SpeedDial, SpeedDialAction } from '@mui/material'
import { Box } from '@mui/system'
import { VERTICALITY } from '../../meiviewer/constants'
import actions from '../../../app/services/p140_p177.json'
import { VerticalityItem } from '../items/VerticalityItem'

export const VerticalityEntity = ({ verticalityIri, baseUrl, clickedNoteIri }) => (
  <Box>
    <VerticalityItem {...{ verticalityIri, baseUrl, clickedNoteIri }} isEntity />
    <SpeedDial ariaLabel="New" sx={{ position: 'fixed', bottom: 16, right: 16 }} icon={<AddComment />}>
      {actions[VERTICALITY].map(action => (
        <SpeedDialAction
          key={action.iri}
          tooltipTitle={action.label || action.iri.slice(baseUrl.length)}
          icon={<Piano />}
        />
      ))}
    </SpeedDial>
  </Box>
)
