import { Button, List, ListSubheader } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setInspectedEntity } from '../../../app/services/scoreSlice'
import { Concept } from './Concept'

export const Properties = props => {
  const [filteredTree, setFilteredTree] = useState(props.treatise)
  const { inspectedEntities, currentEntityIndex, baseUrl } = useSelector(state => state.score)
  const inspectedEntity = inspectedEntities[currentEntityIndex]

  const dispatch = useDispatch()

  const _setFilteredTree = (node, newFilter) => {
    if (node.properties)
      return { ...node, properties: node.properties.map(c => _setFilteredTree(c, newFilter)).filter(Boolean) }
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
  }, [props.filter])

  return (
    <List
      subheader={
        <ListSubheader sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {props.treatise.iri.slice(baseUrl.length + 3)}
          <Button size="small" variant="text" disabled>
            Change treaty
          </Button>
        </ListSubheader>
      }
    >
      {filteredTree.properties.length &&
        filteredTree.properties.map(concept => (
          <Concept
            key={concept.iri}
            selectedConcept={inspectedEntity.conceptIri}
            concept={concept}
            setInspection={conceptIri => dispatch(setInspectedEntity({ conceptIri }))}
          />
        ))}
    </List>
  )
}
