import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { apiService } from '@shared/services/apiService'

interface testAssessManageState {
  params: any
  loading: boolean
  testAssessManageList: any[]
  testAssessManagesDetail: any
}

const initialState: testAssessManageState = {
  params: {},
  loading: false,
  testAssessManageList: [],
  testAssessManagesDetail: {}
}

export const getTestAssessManage = createAsyncThunk('getTestAssessManage', async (params: any, { dispatch }) => {
  const response = await apiService.get(`assessments`, true, params)

  dispatch(setTemplatesData({ params: params }))

  return response.data
})

export const testAssessManagesDetail = createAsyncThunk('testAssessManagesDetail', async (id: any) => {
  const response = await apiService.get(`assessments/${id}`, true)

  return response.data
})

export const createTestAssessManage = createAsyncThunk('createTestAssessManage', async (params: any) => {
  const response = await apiService.post(`assessments`, params, true)

  return response
})



export const editTestAssessManage = createAsyncThunk(
  'editTestAssessManage', 
  async ({id, post}: {id: number, post: any}) => {
    const response = await apiService.put(`assessments`, id, post, true)
    
   
  // const response = await apiService.put(`assessments`,id,post,true)

  return response
})

export const deleteTestAssessManage = createAsyncThunk(
  "deleteTestAssessManage",
  async (id: number, { getState, dispatch }) => {
    await apiService.delete(`assessments`, id, true); // Pass only the ID, no object
    const { params } = (getState() as any).testAssess.testAssessManageList;

   dispatch(getTestAssessManage(params))

    return id;
  }
);

// export const deleteCandidateManage = createAsyncThunk(
//   'deleteCandidateManage',
//   async (post: any, { getState, dispatch }) => {
//     const response = await apiService.delete(`users/`, post, true)
//     const { params } = (getState() as any).candidateManage

//     dispatch(getCandidateManage({ ...params, sort_order: 'desc', sort_by: 'created_at' }))

//     return response
//   }
// )

const testAssessSlice = createSlice({
  name: 'testAssessReducer',
  initialState,
  reducers: {
    setTemplatesData: (state, action) => {
      const { params } = action.payload

      state.params = params
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getTestAssessManage.pending, state => {
        console.log('pending')
        state.loading = true
      })
      .addCase(getTestAssessManage.fulfilled, (state: any, action) => {
        state.loading = false
        state.testAssessManageList = action.payload
      })
      .addCase(getTestAssessManage.rejected, state => {
        console.log('rejected')
        state.loading = false
      })
  }
})

export default testAssessSlice.reducer

export const { setTemplatesData } = testAssessSlice.actions
export const getTestAssessManageList = ({ testAssess }: { testAssess: any }) => testAssess?.testAssessManageList
export const getTestAssessManageLoader = ({ testAssess }: { testAssess: any }) => testAssess?.loading
