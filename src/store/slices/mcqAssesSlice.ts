import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { apiService } from '@shared/services/apiService'

interface testAssessManageState {
  params: any
  loading: boolean
  mcqAssessManageList: any[]
  mcqAssessManagesDetail: any
}

const initialState: testAssessManageState = {
  params: {},
  loading: false,
  mcqAssessManageList: [],
  mcqAssessManagesDetail: {}
}

export const getMcqAssessManage = createAsyncThunk('getMcqAssessManage', async (params: any, { dispatch }) => {
  const response = await apiService.get(`mcq-questions`, true, params)

  dispatch(setTemplatesData({ params: params }))

  return response.data
})

export const getMcqAssessManagesDetail = createAsyncThunk('getMcqAssessManagesDetail', async (id: any) => {
  const response = await apiService.get(`mcq-questions/${id}`, true)

  return response.data
})

export const createMcqManage = createAsyncThunk('createMcqManage', async (params: any) => {
  const response = await apiService.post(`mcq-questions/bulk`, params, true)

  return response
})

export const editTestAssessManage = createAsyncThunk('editTestAssessManage', async (post: any) => {
  const { id, data } = post
  const response = await apiService.put(`testAssessManages`, id, data, true)

  return response
})

export const deleteMcqManage = createAsyncThunk('deleteMcqManage', async (id: number, { getState, dispatch }) => {
  await apiService.delete(`mcq-questions`, id, true) // Pass only the ID, no object
  const { params } = (getState() as any).mcqAssess

  dispatch(getMcqAssessManage(params))

  return id
})

// export const deleteCandidateManage = createAsyncThunk(
//   'deleteCandidateManage',
//   async (post: any, { getState, dispatch }) => {
//     const response = await apiService.delete(`users/`, post, true)
//     const { params } = (getState() as any).candidateManage

//     dispatch(getCandidateManage({ ...params, sort_order: 'desc', sort_by: 'created_at' }))

//     return response
//   }
// )

const mcqAssessSlice = createSlice({
  name: 'mcqAssessReducer',
  initialState,
  reducers: {
    setTemplatesData: (state, action) => {
      const { params } = action.payload

      state.params = params
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getMcqAssessManage.pending, state => {
        console.log('pending')
        state.loading = true
      })
      .addCase(getMcqAssessManage.fulfilled, (state: any, action) => {
        state.loading = false
        state.mcqAssessManageList = action.payload
      })
      .addCase(getMcqAssessManage.rejected, state => {
        console.log('rejected')
        state.loading = false
      })

      .addCase(getMcqAssessManagesDetail.pending, state => {
        console.log('pending')
        state.loading = true
      })
      .addCase(getMcqAssessManagesDetail.fulfilled, (state: any, action) => {
        state.loading = false
        state.mcqAssessManagesDetail = action.payload
      })
      .addCase(getMcqAssessManagesDetail.rejected, state => {
        console.log('rejected')
        state.loading = false
      })
  }
})

export default mcqAssessSlice.reducer

export const { setTemplatesData } = mcqAssessSlice.actions
export const getMcqAssessManageList = ({ mcqAssess }: { mcqAssess: any }) => mcqAssess?.mcqAssessManageList
export const getMcqAssessManageDetail = ({ mcqAssess }: { mcqAssess: any }) => mcqAssess?.mcqAssessManagesDetail
export const getMcqAssessManageLoader = ({ mcqAssess }: { mcqAssess: any }) => mcqAssess?.loading
