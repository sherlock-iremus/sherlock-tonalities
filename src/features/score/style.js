import { css } from '@emotion/react'

export const verovioStyle = color => css`
  .selected {
    #bubble {
      fill: ${color} !important;
      stroke: ${color} !important;
    }
  }
  .focused {
    #bubble {
      fill: grey;
      stroke: grey;
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
