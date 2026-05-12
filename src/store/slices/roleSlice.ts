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

export const viewRole = createAsyncThunk('viewRole', async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.get(`role`, true)

    return response.data
  } catch (error: any) {
    return rejectWithValue(error)
  }
})

export const getPermissionGroup = createAsyncThunk('getPermissionGroup', async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.get(`getpermissiongroup`, true)

    return response.data
  } catch (error: any) {
    return rejectWithValue(error)
  }
})

export const roleAssign = createAsyncThunk('roleAssign', async (params: any, { rejectWithValue }) => {
  try {
    const response = await apiService.post(`roleAssign`, params, true)

    return response
  } catch (error: any) {
    return rejectWithValue(error)
  }
})

export const createRole = createAsyncThunk('createRole', async (params: any, { rejectWithValue }) => {
  try {
    const response = await apiService.post(`role`, params, true)

    return response
  } catch (error: any) {
    return rejectWithValue(error)
  }
})

export const editRole = createAsyncThunk('editRole', async (params: any, { rejectWithValue }) => {
  try {
    const response = await apiService.put(`role`, params, params.id, true)

    return response
  } catch (error: any) {
    return rejectWithValue(error)
  }
})

export const deleteRole = createAsyncThunk('deleteRole', async (params: any, { rejectWithValue }) => {
  try {
    const response = await apiService.delete(`role`, params, true)

    return response
  } catch (error: any) {
    return rejectWithValue(error)
  }
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
      .addCase(getPermissionGroup.pending, state => {
        state.loading = true
      })
      .addCase(getPermissionGroup.fulfilled, (state: any, action) => {
        state.loading = false
        state.roleDetail = action.payload
      })
      .addCase(getPermissionGroup.rejected, state => {
        state.loading = false
      })
      .addCase(createRole.pending, state => {
        state.loading = true
      })
      .addCase(createRole.fulfilled, state => {
        state.loading = false
      })
      .addCase(createRole.rejected, state => {
        state.loading = false
      })
      .addCase(editRole.pending, state => {
        state.loading = true
      })
      .addCase(editRole.fulfilled, state => {
        state.loading = false
      })
      .addCase(editRole.rejected, state => {
        state.loading = false
      })
      .addCase(deleteRole.pending, state => {
        state.loading = true
      })
      .addCase(deleteRole.fulfilled, state => {
        state.loading = false
      })
      .addCase(deleteRole.rejected, state => {
        state.loading = false
      })
      .addCase(roleAssign.pending, state => {
        state.loading = true
      })
      .addCase(roleAssign.fulfilled, state => {
        state.loading = false
      })
      .addCase(roleAssign.rejected, state => {
        state.loading = false
      })
  }
})

export default roleSlice.reducer

export const getRoleList = ({ role }: { role: any }) => role?.roles
