import { css } from '@emotion/react'

export const verovioStyle = color => css`
  .selected {
    #bubble {
      fill: ${color};
      stroke: ${color};
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
