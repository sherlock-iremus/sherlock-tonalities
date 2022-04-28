/** @jsxImportSource @emotion/react */

import { useSelector } from 'react-redux'
import { containerStyle } from '../meiviewer/mei.css'
import { Inspector } from './Inspector'
import { MeiViewer } from './meiViewer'

export const ScoreAnnotator = () => {
  const meiUrl = useSelector(state => state.inspectedEntity.meiUrl)
  const scoreIri = useSelector(state => state.inspectedEntity.scoreIri)

  return (
    <div css={{ width: '100%' }}>
      <MeiViewer meiUrl={meiUrl} scoreIri={scoreIri} />
      <Inspector scoreIri={scoreIri} />
    </div>
  )
}
