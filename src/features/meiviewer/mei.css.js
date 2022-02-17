import { css } from '@emotion/react'

export const COLOR_FOCUS = 'turquoise'

export const annotationsPanelStyle = theme => css`
  background-color: ${theme.palette.background.default};
  height: 100vh;
  overflow-y: scroll;
  position: fixed;
  right: 0;
  width: 34%;
`

export const containerStyle = css`
  display: flex;

  @keyframes condemed_blink_effect {
    0% {
      fill: aqua;
    }
    100% {
      fill: black;
    }
  }
`

export const mainAreaStyle = css`
  background-color: white;
  cursor: default;
  width: 75%;
`

export const modeSelectorStyle = css`
  border-bottom: 1px solid black;
`

export const verovioStyle = css`
  min-height: 100vh;

  .vrv-ui-toolbar {
    font-family: monospace;
  }

  .hovered {
    fill: ${COLOR_FOCUS};
  }

  g.selected {
    fill: ${COLOR_FOCUS};
  }

  g.focused {
    animation: 0.3s linear infinite condemed_blink_effect;
  }
`

export const panelStyle = css`
  
`
