/* eslint-disable react-hooks/exhaustive-deps */
import { Backdrop, CircularProgress, List } from '@mui/material'
import { useEffect, useState } from 'react'
import { Concept } from './Concept'
import { useDispatch, useSelector } from 'react-redux'
import { usePostAnnotationMutation } from '../../services/service'
import { useGetAnnotationsQuery, useGetAssignmentsQuery } from '../../services/sparql'
import { setSelectedAnnotation, setSelectedNotes } from '../../services/globals'
import { removeBaseIri } from '../../utils'
import { assignConcept, createEntity } from '../../helper'

export const Concepts = ({ data, filter }) => {
  const { selectedNotes, scoreIri, projectIri, selectedAnnotation } = useSelector(state => state.globals)
  const [filteredTree, setFilteredTree] = useState(data)
  const [entity, setEntity] = useState(null)
  const dispatch = useDispatch()

  const filterTree = node => {
    if (node.iri && removeBaseIri(node.iri).toLowerCase().includes(filter.toLowerCase())) return node
    if (node.subClasses) {
      const subClasses = node.subClasses.map(c => filterTree(c)).filter(Boolean)
      if (subClasses.length) return { ...node, subClasses }
    }
    return null
  }

  const [postAnnotation, { isLoading }] = usePostAnnotationMutation()
  const { refetch: refetchAnnotations } = useGetAnnotationsQuery({ scoreIri, projectIri })
  const { refetch: refetchAssignments } = useGetAssignmentsQuery(entity, { skip: !entity })

  const createAnnotation = async conceptIri => {
    const entityIri = await createEntity({ selectedNotes, scoreIri, projectIri, postAnnotation })
    await assignConcept({ entityIri, conceptIri, scoreIri, projectIri, postAnnotation })
    dispatch(setSelectedNotes())
    refetchAnnotations()
  }

  const addAssignment = async (conceptIri, entityIri) => {
    setEntity(entityIri)
    await assignConcept({ entityIri, conceptIri, scoreIri, projectIri, postAnnotation })
    dispatch(
      setSelectedAnnotation({
        ...selectedAnnotation,
        assignments: [...selectedAnnotation.assignments, { concept: conceptIri }],
      })
    )
    refetchAssignments()
  }

  useEffect(() => {
    if (filter) setFilteredTree(filterTree({ subClasses: data })?.subClasses)
    else setFilteredTree(data)
  }, [filter, data])

  return (
    filteredTree && (
      <List disablePadding dense sx={{ overflow: 'auto' }}>
        {!!filteredTree.length &&
          filteredTree.map(concept => <Concept key={concept.iri} {...{ concept, createAnnotation, addAssignment }} />)}
        <Backdrop open={isLoading}>
          <CircularProgress />
        </Backdrop>
      </List>
    )
  )
}
