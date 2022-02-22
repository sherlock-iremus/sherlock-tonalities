import { css } from '@emotion/react'
import { COLOR_FOCUS, COLOR_HOVER } from './constants'

export const containerStyle = css`
  display: flex;
  font-family: 'Roboto';

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
  width: 70%;
`

export const modeSelectorStyle = css`
  border-bottom: 1px solid black;
`

export const verovioStyle = css`
  min-height: 100vh;

  .vrv-ui-toolbar {
    font-family: 'Roboto';
  }

  .hovered {
    fill: ${COLOR_FOCUS};
    cursor: pointer;
  }

  g.selected {
    fill: ${COLOR_FOCUS};
  }

  g.focused {
    animation: 0.3s linear infinite condemed_blink_effect;
  }
`

export const panelStyle = theme => css`
  border-left: 1px solid lightgray;
  width: 30%;
  padding: 8px
`
