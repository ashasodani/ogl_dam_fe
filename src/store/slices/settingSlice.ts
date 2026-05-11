import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { apiService } from '@shared/services/apiService'

interface settingState {
  params: any
  loading: boolean
  settingList: any[]
}

const initialState: settingState = {
  params: {},
  loading: false,
  settingList: [],
}

export const fetchSetting = createAsyncThunk('fetchSetting', async (params: any, { dispatch }) => {
  const response = await apiService.get(`admin/configurations`, true, params)

  dispatch(setTemplatesData({ params: params }))

  return response.data
})




export const updateSetting = createAsyncThunk('updateSetting', async (post: configurationPost) => {

  const configData = {
    configuration:post
  }
  
  // const { id, configration } = post
  const response = await apiService.post(`admin/configurations`, configData, true)

  return response
})



const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setTemplatesData: (state, action) => {
      const { params } = action.payload

      state.params = params
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSetting.pending, state => {
        console.log('pending')
        state.loading = true
      })
      .addCase(fetchSetting.fulfilled, (state: any, action) => {
        state.loading = false
        state.settingList = action.payload
      })
      .addCase(fetchSetting.rejected, state => {
        console.log('rejected')
        state.loading = false
      })
  }
})

export default settingSlice.reducer

export const { setTemplatesData } = settingSlice.actions
export const getSettingList = ({ setting }: { setting: any }) => setting?.settingList
export const getSettingLoader = ({ setting }: { setting: any }) => setting?.loading
