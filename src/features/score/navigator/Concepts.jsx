import { Button, List, ListSubheader } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setInspectedConcept } from '../../slice/scoreSlice'
import { Concept } from './Concept'

export const Concepts = props => {
  const [filteredTree, setFilteredTree] = useState(props.treatise)
  const { inspectedEntities, currentEntityIndex, baseUrl } = useSelector(state => state.score)
  const inspectedEntity = inspectedEntities[currentEntityIndex]

  const dispatch = useDispatch()

  const _setFilteredTree = (node, newFilter) => {
    if (node.rootClasses)
      return { ...node, rootClasses: node.rootClasses.map(c => _setFilteredTree(c, newFilter)).filter(Boolean) }
    else if (node.subClasses) {
      const filteredNode = {
        ...node,
        subClasses: node.subClasses.map(c => _setFilteredTree(c, newFilter)).filter(Boolean),
      }
      if (filteredNode.subClasses.length) return filteredNode
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
      {filteredTree.rootClasses.length &&
        filteredTree.rootClasses.map(concept => (
          <Concept
            key={concept.iri}
            selectedConcept={inspectedEntity.conceptIri}
            concept={concept}
            setInspection={clickedConcept => dispatch(setInspectedConcept(clickedConcept))}
          />
        ))}
    </List>
  )
}
