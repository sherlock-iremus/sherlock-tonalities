import { List, ListSubheader } from '@mui/material'
import { useState } from 'react'
import treatise from '../../app/treatises/Zarlino_1588.json'
import { ConceptItem } from '../meiviewer/ConceptItem'
import { SearchBar } from '../meiviewer/SearchField'

export const ConceptTree = props => {
  const [filter, setFilter] = useState('')
  const [filteredTree, setFilteredTree] = useState(treatise)

  const _setFilter = newFilter => {
    setFilter(newFilter)
    setFilteredTree(newFilter ? _setFilteredTree(treatise, newFilter) : treatise)
  }

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
    <List
      sx={{
        overflow: 'auto',
        minHeight: 48,
      }}
      subheader={
        <ListSubheader>
          <SearchBar value={filter} onChange={e => _setFilter(e.target.value)} />
        </ListSubheader>
      }
    >
      {filteredTree.rootClasses.length &&
        filteredTree.rootClasses.map(concept => (
          <ConceptItem
            key={concept.iri}
            concept={concept}
            setInspection={clickedConcept => console.log(clickedConcept)}
          />
        ))}
    </List>
  )
}
