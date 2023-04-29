import { css } from '@emotion/react'
import { PRIMARY_COLOR } from '../../theme'
import { grey } from '@mui/material/colors'

export const verovioStyle = css`
  .selected {
    #bubble {
      fill: ${PRIMARY_COLOR} !important;
      stroke: ${PRIMARY_COLOR} !important;
    }
  }
  .hovered {
    #bubble {
      fill: ${grey[500]};
      stroke: ${grey[500]};
    }
  }
  user-select: none;
`
