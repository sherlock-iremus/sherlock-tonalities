/* eslint-disable react-hooks/exhaustive-deps */
import { Backdrop, CircularProgress, List } from '@mui/material'
import { useEffect, useState } from 'react'
import { Concept } from './Concept'
import { useDispatch, useSelector } from 'react-redux'
import { usePostAnnotationMutation } from '../../services/service'
import { useGetAnnotationsQuery, useGetAssignmentsQuery } from '../../services/sparql'
import { setSelectedAnnotation, setSelectedNotes } from '../../services/globals'
import { removeBaseIri } from '../../utils'
import { assignConcept, assignSubEntity, createEntity } from '../../helper'

export const Concepts = ({ data, filter }) => {
  const { selectedNotes, scoreIri, projectIri, selectedAnnotation, isSubSelecting } = useSelector(
    state => state.globals
  )
  const [filteredTree, setFilteredTree] = useState(data)
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
  const { refetch: refetchAssignments } = useGetAssignmentsQuery(selectedAnnotation?.entity, {
    skip: !selectedAnnotation,
  })

  const createAnnotation = async conceptIri => {
    const entityIri = await createEntity({ selectedNotes, scoreIri, projectIri, postAnnotation })
    await assignConcept({ entityIri, conceptIri, scoreIri, projectIri, postAnnotation })
    dispatch(setSelectedNotes())
    if (isSubSelecting) {
      await assignSubEntity({
        parentEntity: selectedAnnotation.entity,
        childEntity: entityIri,
        predicate: 'guillotel:has_line',
        scoreIri,
        projectIri,
        postAnnotation,
      })
      refetchAssignments()
    }
    refetchAnnotations()
  }

  const addAssignment = async conceptIri => {
    await assignConcept({ entityIri: selectedAnnotation?.entity, conceptIri, scoreIri, projectIri, postAnnotation })
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
