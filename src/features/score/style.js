import { css } from '@emotion/react'

export const verovioStyle = css`
  .selected {
    #bubble {
      fill: var(--mui-palette-primary-main);
      stroke: var(--mui-palette-primary-main);
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
