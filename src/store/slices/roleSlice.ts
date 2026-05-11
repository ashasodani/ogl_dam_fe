import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { apiService } from '@shared/services/apiService'

// Define the shape of the cart state
interface RoleState {
  roles: any[]
  loading: boolean
  roleDetail: any[]
}

const initialState: RoleState = {
  roles: [],
  loading: false,
  roleDetail: []
}

export const viewRole = createAsyncThunk('viewRole', async () => {
  const response = await apiService.get(`admin/roles`, true)

  return response.data
})

export const roleAssign = createAsyncThunk('roleAssign', async (params: any) => {
  const response = await apiService.post(`roleAssign/${params.id}`, params, true)

  return response
})

export const createRole = createAsyncThunk('createRole', async (params: any) => {
  const response = await apiService.post(`role`, params, true)

  return response
})

export const editRole = createAsyncThunk('editRole', async (params: any) => {
  const response = await apiService.put(`role`, params, params.id, true)

  return response
})

export const deleteRole = createAsyncThunk('deleteRole', async (params: any) => {
  const response = await apiService.delete(`role`, params, true)

  return response
})

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(viewRole.pending, state => {
        state.loading = true
      })
      .addCase(viewRole.fulfilled, (state: any, action) => {
        state.loading = false
        state.roles = action.payload
      })
      .addCase(viewRole.rejected, state => {
        state.loading = false
      })
  }
})

export default roleSlice.reducer

export const getRoleList = ({ role }: { role: any }) => role?.roles
