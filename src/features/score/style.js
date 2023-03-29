import { css } from '@emotion/react'
import { red } from '@mui/material/colors'

export const COLOR_FOCUSED = red[200]
export const COLOR_SELECTED = red[200]
export const COLOR_INSPECTED = red[200]

export const verovioStyle = css`
  .selected {
    #bubble {
      fill: ${COLOR_SELECTED};
      stroke: ${COLOR_SELECTED};
    }
  }
  user-select: none
`
