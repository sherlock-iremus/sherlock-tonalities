/* eslint-disable react-hooks/exhaustive-deps */
import { List, ListSubheader } from '@mui/material'
import { useEffect, useState } from 'react'
import { useGetCadencesGuillotelQuery } from '../../app/services/ontologies'
import { Concept } from './Concept'

export const Concepts = () => {
  const [filter] = useState('')
  const { data: cadencesGuillotel } = useGetCadencesGuillotelQuery()
  const [filteredTree, setFilteredTree] = useState(cadencesGuillotel)

  const filterTree = (node, newFilter) => {
    if (node.classes) return { ...node, classes: node.classes.map(c => filterTree(c, newFilter)).filter(Boolean) }
    else if (node.children) {
      const filteredNode = {
        ...node,
        children: node.children.map(c => filterTree(c, newFilter)).filter(Boolean),
      }
      if (filteredNode.children.length) return filteredNode
    }
    if (node.label && node.label.toLowerCase().includes(newFilter.toLowerCase())) return node
    return null
  }

  useEffect(() => {
    cadencesGuillotel && setFilteredTree(filter ? filterTree(cadencesGuillotel, filter) : cadencesGuillotel)
  }, [filter, cadencesGuillotel])

  if (filteredTree)
    return (
      <List subheader={<ListSubheader>Assign concepts</ListSubheader>}>
        {!!filteredTree.length && filteredTree.map(concept => <Concept key={concept.iri} concept={concept} />)}
      </List>
    )
}
