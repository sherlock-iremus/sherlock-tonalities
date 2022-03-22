import { TreeItem } from '@mui/lab'
import { CircularProgress, IconButton } from '@mui/material'
import { useGetNoteInfoQuery } from '../../app/services/sparqlLocal'
import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material'

const CustomizedTreeItem = styled(TreeItem)`
  & .MuiTreeItem-content {
    cursor: default;
    flex-direction: row-reverse;
    & .MuiTreeItem-iconContainer {
      cursor: pointer;
  }
`

export const Inspector = props => {
  const noteInfo = useGetNoteInfoQuery(`${props.scoreIri}_${props.inspectedElement.id}`, {
    skip: props.inspectedElement.referenceNote,
  })

  const getNoteLabel = () => {
    const {
      data: {
        results: {
          bindings: [
            {
              pname: { value: pname },
              oct: { value: oct },
              accid,
            },
          ],
        },
      },
    } = noteInfo

    let alteration = ''
    if (accid) {
      switch (accid.value) {
        case 'f':
          alteration = '♭'
          break
        case 's':
          alteration = '#'
          break
        case 'n':
          alteration = '♮'
          break
      }
    }

    return pname.toUpperCase() + oct + alteration
  }

  if (props.inspectedElement.selection)
    // inspect a selection
    return (
      <TreeItem nodeId={props.inspectedElement.id} label={props.inspectedElement.id}>
        {props.inspectedElement.selection.map(e => (
          <Inspector key={e.id} inspectedElement={e} scoreIri={props.scoreIri} />
        ))}
      </TreeItem>
    )
  else if (props.inspectedElement.referenceNote)
    // inspect a verticality
    return <TreeItem nodeId={props.inspectedElement.id} label={props.inspectedElement.id} />
  else if (noteInfo.isSuccess)
    // inspect a note
    return (
      <CustomizedTreeItem
        nodeId={props.inspectedElement.id}
        label={getNoteLabel()}
        icon={<Close onClick={props.onClickRemove} />}
      />
    )
  return <CircularProgress />
}
