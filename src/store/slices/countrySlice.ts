import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { apiService } from '@shared/services/apiService'

interface countryState {
  params: any
  loading: boolean
  countryList: any[]
}

const initialState: countryState = {
  params: {},
  loading: false,
  countryList: [],
}

export const fetchCountry = createAsyncThunk('fetchCountry', async (params: any, { dispatch }) => {
  const response = await apiService.get(`admin/technologies`, true, params)

  dispatch(setTemplatesData({ params: params }))

  return response.data
})




export const createCountry = createAsyncThunk('createCountry', async (post: configurationPost) => {

  const response = await apiService.post(`admin/technologies`, post, true)
  // const { id, configration } = post

  return response
})

export const deleteCountry = createAsyncThunk('deleteCountry', async (id: string) => {

  const response = await apiService.delete(`admin/technologies`, id, true)
  // const { id, configration } = post

  return response
})


const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {
    setTemplatesData: (state, action) => {
      const { params } = action.payload

      state.params = params
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCountry.pending, state => {
        console.log('pending')
        state.loading = true
      })
      .addCase(fetchCountry.fulfilled, (state: any, action) => {
        state.loading = false
        state.countryList = action.payload
      })
      .addCase(fetchCountry.rejected, state => {
        console.log('rejected')
        state.loading = false
      })
  }
})

export default countrySlice.reducer

export const { setTemplatesData } = countrySlice.actions
export const getCountryList = ({ country }: { country: any }) => country?.countryList
export const getCountryLoader = ({ country }: { country: any }) => country?.loading
