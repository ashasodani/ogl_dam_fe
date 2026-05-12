import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { apiService } from '@shared/services/apiService'

interface countryState {
  params: any
  loading: boolean
  countryList: any[]
  total: number
}

const initialState: countryState = {
  params: {},
  loading: false,
  countryList: [],
  total: 0
}

export const fetchCountry = createAsyncThunk('fetchCountry', async (params: any, { rejectWithValue }) => {
  try {
    const response = await apiService.get(`getcountry`, true, params)

    return response.data
  } catch (error: any) {
    return rejectWithValue(error)
  }
})

export const createCountry = createAsyncThunk('createCountry', async (post: any, { rejectWithValue }) => {
  try {
    const response = await apiService.post(`countries`, post, true)

    return response
  } catch (error: any) {
    return rejectWithValue(error)
  }
})

export const editCountry = createAsyncThunk('editCountry', async (params: any, { rejectWithValue }) => {
  try {
    const response = await apiService.put(`countries`, params.id, params, true)

    return response
  } catch (error: any) {
    return rejectWithValue(error)
  }
})

export const deleteCountry = createAsyncThunk('deleteCountry', async (id: any, { rejectWithValue }) => {
  try {
    const response = await apiService.delete(`countries`, id, true)

    return response
  } catch (error: any) {
    return rejectWithValue(error)
  }
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
        state.loading = true
      })
      .addCase(fetchCountry.fulfilled, (state: any, action) => {
        state.loading = false
        state.countryList = action.payload.data || action.payload
        state.total = action.payload.meta?.total || action.payload.total || action.payload.length || 0
      })
      .addCase(fetchCountry.rejected, state => {
        state.loading = false
      })
      .addCase(createCountry.pending, state => {
        state.loading = true
      })
      .addCase(createCountry.fulfilled, state => {
        state.loading = false
      })
      .addCase(createCountry.rejected, state => {
        state.loading = false
      })
      .addCase(editCountry.pending, state => {
        state.loading = true
      })
      .addCase(editCountry.fulfilled, state => {
        state.loading = false
      })
      .addCase(editCountry.rejected, state => {
        state.loading = false
      })
      .addCase(deleteCountry.pending, state => {
        state.loading = true
      })
      .addCase(deleteCountry.fulfilled, state => {
        state.loading = false
      })
      .addCase(deleteCountry.rejected, state => {
        state.loading = false
      })
  }
})

export default countrySlice.reducer

export const { setTemplatesData } = countrySlice.actions
export const getCountryList = ({ country }: { country: any }) => country?.countryList
export const getCountryTotal = ({ country }: { country: any }) => country?.total
export const getCountryLoader = ({ country }: { country: any }) => country?.loading
