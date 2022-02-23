import { TreeItem } from '@mui/lab'

export const Inspector = props =>
  props.inspectedElement.selection
    ? <TreeItem nodeId={props.inspectedElement.id} label={props.inspectedElement.id}> {props.inspectedElement.selection.map(e => <Inspector key={e.id} inspectedElement={e} />)}</TreeItem>
    : <TreeItem nodeId={props.inspectedElement.id} label={props.inspectedElement.id} />
