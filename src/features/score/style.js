import { css } from '@emotion/react'
import { PRIMARY_COLOR } from '../../theme'

export const verovioStyle = css`
  .selected {
    #bubble {
      fill: ${PRIMARY_COLOR[500]} !important;
      stroke: ${PRIMARY_COLOR[500]} !important;
    }
  }
  .hovered {
    #bubble {
      fill: grey;
      stroke: grey;
    }
  }
  user-select: none;
`
