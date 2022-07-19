import { CompareArrows, HistoryEdu } from '@mui/icons-material'
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tooltip,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { TretiseLibrary } from '../TreatiseLibrary'
import { Concept } from './Concept'

export const Classes = props => {
  const [filteredTree, setFilteredTree] = useState(props.treatise)
  const [isTreatySelectorOpen, setIsTreatySelectorOpen] = useState(false)
  const { inspectedEntities, currentEntityIndex, tonalityBaseUrl } = useSelector(state => state.score)
  const inspectedEntity = inspectedEntities[currentEntityIndex]

  const dispatch = useDispatch()

  const _setFilteredTree = (node, newFilter) => {
    if (node.classes) return { ...node, classes: node.classes.map(c => _setFilteredTree(c, newFilter)).filter(Boolean) }
    else if (node.children) {
      const filteredNode = {
        ...node,
        children: node.children.map(c => _setFilteredTree(c, newFilter)).filter(Boolean),
      }
      if (filteredNode.children.length) return filteredNode
    }
    if (node.label && node.label.toLowerCase().includes(newFilter.toLowerCase())) return node
    return null
  }

  useEffect(() => {
    setFilteredTree(props.filter ? _setFilteredTree(props.treatise, props.filter) : props.treatise)
  }, [props.filter, props.treatise])

  return (
    <>
      <TretiseLibrary isOpen={isTreatySelectorOpen} onClose={() => setIsTreatySelectorOpen(false)} />
      <ListSubheader>Current treatise</ListSubheader>
      <ListItem
        disablePadding
        secondaryAction={
          <Tooltip title="Change treaty">
            <IconButton onClick={() => setIsTreatySelectorOpen(true)}>
              <CompareArrows />
            </IconButton>
          </Tooltip>
        }
      >
        <ListItemButton>
          <ListItemIcon>
            <HistoryEdu />
          </ListItemIcon>
          <ListItemText
            primary={props.treatise.iri.slice(tonalityBaseUrl.length)}
            secondary={props.treatise.iri.slice(0, tonalityBaseUrl.length)}
          />
        </ListItemButton>
      </ListItem>
      <List subheader={<ListSubheader>Classes</ListSubheader>}>
        {!!filteredTree.classes.length &&
          filteredTree.classes.map(concept => (
            <Concept
              key={concept.iri}
              selectedConcept={inspectedEntity.conceptIri}
              concept={concept}
              setInspection={conceptIri => dispatch(setInspectedEntity({ conceptIri }))}
            />
          ))}
      </List>
    </>
  )
}
