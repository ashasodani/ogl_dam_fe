import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { apiService } from '@shared/services/apiService'

interface CodingTestManageState {
  params: any
  loading: boolean
  codingTestManageList: any[]
}

const initialState: CodingTestManageState = {
  params: {},
  loading: false,
  codingTestManageList: [],
}

export const getCodingTestManage = createAsyncThunk('getCodingTestManage', async (params: any, { dispatch }) => {
  const response = await apiService.get(`candidate/my-assessments`, true, params)

  dispatch(setTemplatesData({ params: params }))

  return response.data
})





const codingTestSlice = createSlice({
  name: 'codingTestReducer',
  initialState,
  reducers: {
    setTemplatesData: (state, action) => {
      const { params } = action.payload

      state.params = params
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getCodingTestManage.pending, state => {
        console.log('pending')
        state.loading = true
      })
      .addCase(getCodingTestManage.fulfilled, (state: any, action) => {
        state.loading = false
        state.codingTestManageList = action.payload
      })
      .addCase(getCodingTestManage.rejected, state => {
        console.log('rejected')
        state.loading = false
      })
  }
})

export default codingTestSlice.reducer

export const { setTemplatesData} = codingTestSlice.actions
export const getCodingTestManageList = ({ coding }: { coding: any }) => coding?.codingTestManageList
export const getCodingTestLoader = ({ coding }: { coding: any }) => coding?.loading
