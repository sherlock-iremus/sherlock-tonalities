/* eslint-disable react-hooks/exhaustive-deps */
import { Backdrop, CircularProgress, List } from '@mui/material'
import { useEffect, useState } from 'react'
import { Concept } from './Concept'
import { useSelector } from 'react-redux'
import { useGetModelQuery } from '../../services/model'

export const Concepts = () => {
  const [filter] = useState('')
  const { selectedModelIndex } = useSelector(state => state.globals)
  const { data, isLoading } = useGetModelQuery(selectedModelIndex)
  const [filteredTree, setFilteredTree] = useState(data)

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
    data && setFilteredTree(filter ? filterTree(data, filter) : data)
  }, [filter, data])

  return (
    filteredTree && (
      <List disablePadding dense>
        {!!filteredTree.length && filteredTree.map(concept => <Concept key={concept.iri} concept={concept} />)}
        <Backdrop open={isLoading}>
          <CircularProgress />
        </Backdrop>
      </List>
    )
  )
}
