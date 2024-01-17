import { css } from '@emotion/react'

export const verovioStyle = color => css`
  .selected {
    #bubble {
      fill: ${color} !important;
      stroke: ${color} !important;
      opacity: 0.6;
    }
  }
  .focused {
    #bubble {
      fill: grey;
      stroke: grey;
      opacity: 0.4;
    }
  }
  .hovered {
    #bubble {
      fill: ${color};
      stroke: ${color};
      opacity: 0.6;
    }
  }
  .sub-select {
    #bubble {
      fill: grey;
      stroke: grey;
      opacity: 0.4;
    }
  }
  user-select: none;
`
