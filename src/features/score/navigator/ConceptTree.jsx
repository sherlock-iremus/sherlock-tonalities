import { Button, List, ListSubheader } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setConceptId } from '../../inspection/inspectedEntitySlice'
import { ConceptItem } from './ConceptItem'

export const ConceptTree = props => {
  const [filteredTree, setFilteredTree] = useState(props.treatise)
  const { inspectedConceptId, baseUrl } = useSelector(state => state.inspectedEntity)

  const dispatch = useDispatch()

  useEffect(() => {
    setFilteredTree(props.filter ? _setFilteredTree(props.treatise, props.filter) : props.treatise)
  }, [props.filter])

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

  return (
    <List subheader={
      <ListSubheader sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {props.treatise.iri.slice(baseUrl.length + 3)}
        <Button size='small' variant="text" disabled>Change treaty</Button>
      </ListSubheader >}>
      {
        filteredTree.rootClasses.length &&
        filteredTree.rootClasses.map(concept => (
          <ConceptItem
            key={concept.iri}
            selectedConcept={inspectedConceptId}
            concept={concept}
            setInspection={clickedConcept => dispatch(setConceptId(clickedConcept))}
          />
        ))
      }
    </List>
  )
}
