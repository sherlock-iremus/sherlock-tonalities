import sparql from './sparql'
import model from './models'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { setSelectedModelIndex } from './globals'

export const findModel = createAsyncThunk('globals/findModel', async (_, { getState, dispatch }) => {
  const state = getState()
  const { projectIri } = state.globals
  const annotationsResult = await dispatch(sparql.endpoints.getFlatAnnotations.initiate(projectIri))
  const annotations = annotationsResult.data || []

  const modelsResult = await dispatch(model.endpoints.getModels.initiate())
  const models = modelsResult.data || []

  const isAnnotationUsingAModel = (annotation, model) =>
    annotation.concepts?.toLowerCase().includes(model.baseIri.toLowerCase())

  const firstAnnotationUsingAModel = annotations.find(annotation =>
    models.find(model => isAnnotationUsingAModel(annotation, model))
  )

  if (firstAnnotationUsingAModel)
    dispatch(
      setSelectedModelIndex(models.findIndex(model => isAnnotationUsingAModel(firstAnnotationUsingAModel, model)))
    )
})
