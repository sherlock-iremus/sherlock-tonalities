import { css } from '@emotion/react'
import { PRIMARY_COLOR } from '../../theme'

export const verovioStyle = css`
  .selected {
    #bubble {
      fill: ${PRIMARY_COLOR};
      stroke: ${PRIMARY_COLOR};
    }
  }
  user-select: none;
`
