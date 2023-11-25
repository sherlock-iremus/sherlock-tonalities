import { css } from '@emotion/react'

export const verovioStyle = color => css`
  .selected {
    #bubble {
      fill: ${color};
      stroke: ${color};
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
      fill: grey !important;
      stroke: grey !important;
    }
  }
  user-select: none;
`
