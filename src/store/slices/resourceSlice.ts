import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { apiService } from '@shared/services/apiService'

// Define the shape of the cart state
interface StatesState {
  states: any[]
  loading: boolean
  city: any[]
}

const initialState: StatesState = {
  states: [],
  loading: false,
  city: []
}

export interface techPayload {
  id: any[]
}

export const viewState = createAsyncThunk('viewState', async () => {
  const response = await apiService.get(`admin/states`, true)

  return response.data
})
export const viewCity = createAsyncThunk('viewCity', async (id: any) => {
  // const response = await apiService.get(`portals/${id}`, true);
  // return response.data;
  const timestamp = new Date().getTime()
  const response = await apiService.get(`admin/cities/${id}?t=${timestamp}`, true)

  return response.data
})

export const viewTechnology = createAsyncThunk('viewTechnology', async () => {
  const response = await apiService.get(`admin/technologies`, true)

  return response.data
})
export const viewTest = createAsyncThunk('viewTest', async (payload: techPayload) => {

  // const response = await apiService.get(`portals/${id}`, true);
  const response = await apiService.post(`admin/assessments/filter`, payload, true)

  return response.data
})

const resourceSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(viewState.pending, state => {
        state.loading = true
      })
      .addCase(viewState.fulfilled, (state: any, action) => {
        state.loading = false
        state.states = action.payload
      })
      .addCase(viewState.rejected, state => {
        state.loading = false
      })
      .addCase(viewTechnology.pending, technology => {
        technology.loading = true
      })
      .addCase(viewTechnology.fulfilled, (technology: any, action) => {
        technology.loading = false
        technology.technologies = action.payload
      })
      .addCase(viewTechnology.rejected, technology => {
        technology.loading = false
      })
      .addCase(viewCity.pending, city => {
        city.loading = true
      })
      .addCase(viewCity.fulfilled, (city: any, action) => {
        city.loading = false
        city.city = action.payload
      })
      .addCase(viewCity.rejected, city => {
        city.loading = false
      })
      .addCase(viewTest.pending, test => {
        test.loading = true
      })
      .addCase(viewTest.fulfilled, (test: any, action) => {
        test.loading = false
        test.test = action.payload
      })
      .addCase(viewTest.rejected, test => {
        test.loading = false
      })
  }
})

export default resourceSlice.reducer

export const getStateList = ({ state }: { state: any }) => state?.states
export const getTechnologyList = ({ state }: { state: any }) => state?.technologies
export const getCityList = ({ state }: { state: any }) => state?.city
export const getTestList = ({ state }: { state: any }) => state?.test
