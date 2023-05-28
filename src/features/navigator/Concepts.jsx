/* eslint-disable react-hooks/exhaustive-deps */
import { Backdrop, CircularProgress, List } from '@mui/material'
import { useEffect, useState } from 'react'
import { Concept } from './Concept'
import { useDispatch, useSelector } from 'react-redux'
import { useGetModelQuery } from '../../services/model'
import { usePostAnnotationMutation } from '../../services/service'
//import { ANALYTICAL_ENTITY } from 'sherlock-sparql-queries/src/queries/constants'
import { useGetAnnotationsQuery } from '../../services/sparql'
import { setSelectedNotes } from '../../services/globals'
import { ANALYTICAL_ENTITY } from '../../services/queries'
import { removeBaseIri } from '../../utils'

export const Concepts = ({ filter }) => {
  const { selectedModelIndex, selectedNotes, scoreIri, projectIri } = useSelector(state => state.globals)
  const { data } = useGetModelQuery(selectedModelIndex)
  const [filteredTree, setFilteredTree] = useState(data)
  const dispatch = useDispatch()

  // console.log(filteredTree)
  // const filterTree = (subClasses, iri = '') => {
  //   if (subClasses) return subClasses.map(c => filterTree(c.subClasses, c.iri)).filter(e => !e?.length)
  //   if (iri.toLowerCase().includes(filter.toLowerCase())) console.log('yo')
  //   return null
  // }
  console.log(filteredTree)
  const filterTree = node => {
    if (node.subClasses) return { ...node, subClasses: node.subClasses.map(c => filterTree(c, filter)).filter(Boolean) }
    if (node.iri && removeBaseIri(node.iri).toLowerCase().includes(filter.toLowerCase())) return node
    return null
  }

  const [postAnnotation, { isLoading }] = usePostAnnotationMutation()
  const { refetch: refetchAnnotations } = useGetAnnotationsQuery({ scoreIri, projectIri })

  const createAnnotation = async concept => {
    try {
      const offsets = selectedNotes.map(note => window.tk.getTimeForElement(note))
      const firstNote = selectedNotes[offsets.findIndex(e => e === Math.min(offsets))]
      const page = window.tk.getPageWithElement(firstNote) || 1

      const body = {
        p140: selectedNotes.map(note => scoreIri + '_' + note),
        p177: 'crm:P67_refers_to',
        new_p141: { rdf_type: ['crm:E28_Conceptual_Object'], p2_type: [ANALYTICAL_ENTITY] },
        p141_type: 'new resource',
        document_context: scoreIri + '_' + page,
        analytical_project: projectIri,
      }

      const response = await postAnnotation(body).unwrap()
      const annotation = response.find(e =>
        e['@type']?.includes('http://www.cidoc-crm.org/cidoc-crm/E28_Conceptual_Object')
      )

      const body2 = {
        p140: annotation['@id'],
        p177: 'crm:P2_has_type',
        p141: concept,
        p141_type: 'uri',
        document_context: scoreIri,
        analytical_project: projectIri,
      }
      await postAnnotation(body2).unwrap()
      dispatch(setSelectedNotes())
      refetchAnnotations()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (filter) {
      const mytest = filterTree({ subClasses: data })
      setFilteredTree(mytest.subClasses)
    } else setFilteredTree(data)
  }, [filter, data])

  return (
    filteredTree && (
      <List disablePadding dense>
        {!!filteredTree.length &&
          filteredTree.map(concept => <Concept key={concept.iri} {...{ concept, createAnnotation }} />)}
        <Backdrop open={isLoading}>
          <CircularProgress />
        </Backdrop>
      </List>
    )
  )
}
