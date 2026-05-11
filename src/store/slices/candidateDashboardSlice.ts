import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { apiService } from '@shared/services/apiService'
import { deleteCookie, setCookie } from 'cookies-next'

interface CandidateDashboardManageState {
  params: any
  loading: boolean
  candidateDashboardManageList: any[]
  candidateDashboardManagesDetail: any
}

const initialState: CandidateDashboardManageState = {
  params: {},
  loading: false,
  candidateDashboardManageList: [],
  candidateDashboardManagesDetail: {}
}

export const getCandidateDashboardManage = createAsyncThunk('getCandidateManage', async (params: any, { dispatch }) => {
  const response = await apiService.get(`candidate/my-assessments-generalized`, true, params)

  dispatch(setTemplatesData({ params: params }))

  return response.data
})

export const getCandidateManageDetail = createAsyncThunk('getCandidateManageDetail', async (id: any,{ getState, dispatch }) => {
  const response = await apiService.get(`users/${id}`, true)

   dispatch(setTemplatesData({ id }));
  

  return response.data
})



// export const deleteCandidateManage = createAsyncThunk(
//   'deleteCandidateManage',
//   async (post: any, { getState, dispatch }) => {

//     dispatch(getCandidateManage({ ...params, sort_order: 'desc', sort_by: 'created_at' }))

//     return response
//   }
// )

const candidateDashboardSlice = createSlice({
  name: 'candidateDashboardReducer',
  initialState,
  reducers: {
    setTemplatesData: (state, action) => {
      const { params } = action.payload

      state.params = params
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getCandidateDashboardManage.pending, state => {
        console.log('pending')
        state.loading = true
      })
      .addCase(getCandidateDashboardManage.fulfilled, (state: any, action) => {
        state.loading = false
        state.candidateDashboardManageList = action.payload.assessments
        state.candidateUserList = action.payload.user
      })
      .addCase(getCandidateDashboardManage.rejected, state => {
        console.log('rejected')
        state.loading = false
      })

      .addCase(getCandidateManageDetail.pending, state => {
        console.log('pending')
        state.loading = true
      })
      .addCase(getCandidateManageDetail.fulfilled, (state: any, action) => {
        state.loading = false
        state.candidateDashboardManagesDetail = action.payload
      })
      .addCase(getCandidateManageDetail.rejected, state => {
        console.log('rejected')
        state.loading = false
      })
  }
})

export default candidateDashboardSlice.reducer

export const { setTemplatesData } = candidateDashboardSlice.actions
export const getCandidateDashboardManageList = ({ candidateDashboard }: { candidateDashboard: any }) => candidateDashboard?.candidateDashboardManageList
export const getCandidateDashboardUserList = ({ candidateDashboard }: { candidateDashboard: any }) => candidateDashboard?.candidateUserList
export const getCandidateDashboardManagesDetail = ({ candidateDashboard }: { candidateDashboard: any }) => candidateDashboard?.candidateDashboardManagesDetail
export const getCandidateDashboardManageLoader = ({ candidateDashboard }: { candidateDashboard: any }) => candidateDashboard?.loading
export const candidateDashboardDetail = ({ candidateDashboard }: { candidateDashboard: any }) => candidateDashboard?.candidateDetail
