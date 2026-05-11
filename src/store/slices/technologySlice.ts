import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { apiService } from '@shared/services/apiService'

interface technologyState {
  params: any
  loading: boolean
  technologyList: any[]
}

const initialState: technologyState = {
  params: {},
  loading: false,
  technologyList: [],
}

export const fetchTechnology = createAsyncThunk('fetchTechnology', async (params: any, { dispatch }) => {
  const response = await apiService.get(`admin/technologies`, true, params)

  dispatch(setTemplatesData({ params: params }))

  return response.data
})




export const createTechnology = createAsyncThunk('createTechnology', async (post: configurationPost) => {

  const response = await apiService.post(`admin/technologies`, post, true)
  // const { id, configration } = post

  return response
})

export const deleteTechnology = createAsyncThunk('deleteTechnology', async (id: string) => {

  const response = await apiService.delete(`admin/technologies`, id, true)
  // const { id, configration } = post

  return response
})


const technologySlice = createSlice({
  name: 'technology',
  initialState,
  reducers: {
    setTemplatesData: (state, action) => {
      const { params } = action.payload

      state.params = params
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTechnology.pending, state => {
        console.log('pending')
        state.loading = true
      })
      .addCase(fetchTechnology.fulfilled, (state: any, action) => {
        state.loading = false
        state.technologyList = action.payload
      })
      .addCase(fetchTechnology.rejected, state => {
        console.log('rejected')
        state.loading = false
      })
  }
})

export default technologySlice.reducer

export const { setTemplatesData } = technologySlice.actions
export const getTechnologyList = ({ technology }: { technology: any }) => technology?.technologyList
export const getTechnologyLoader = ({ technology }: { technology: any }) => technology?.loading
