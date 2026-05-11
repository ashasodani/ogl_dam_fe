import axios from 'axios'

import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { deleteCookie, setCookie } from 'cookies-next'

import { apiService } from '@shared/services/apiService'

export interface loginPayload {
  email: string
  password: string
}

export const login = createAsyncThunk('login', async (payload: loginPayload, { dispatch }) => {
  const response: any = await apiService.post(`signin`, payload)
  
  // if (response?.status_code === 200) {
  if (response.status) {
    localStorage.setItem('loginTime', new Date().toISOString())
    localStorage.setItem('user', JSON.stringify(response.data.user))
    dispatch(setUserDetails(response.data))
    setCookie('userAuthToken', response?.data?.access_token)
   
    setCookie('isUserAuthenticated', true)
    setCookie('userRole', response.data.user.role?.name || 'user')
    dispatch(setIsUserAuthorized(true))

    //   await __NEXTAUTH._getSession({ event: 'storage' })
  }else{
     return response
  }

  return response
})

export const logout = createAsyncThunk('logout', async (payload: any, { dispatch }) => {
  try {
    // First reset all local state
    deleteCookie('userRole')
    dispatch(resetUserDetails())
    dispatch(setIsUserAuthorized(false))
    

    deleteCookie('isUserAuthenticated')
    localStorage.removeItem('loginTime')
    localStorage.removeItem('customerDetails')
    delete axios.defaults.headers.common.Authorization

    // Then make the API call
    const response: any = await apiService.post(`logout`, payload, true)

    if (response?.status_code === 200) {
      deleteCookie('userAuthToken')
    }

    // Finally redirect after state is updated
    return response
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  } finally {
    // Ensure redirect happens after everything else is done
    window.location.href = '/login'
  }
})
interface UserState {
  user: any
  email: string
  loading: boolean
  authorized: boolean
}

const initialState: UserState = {
  user: {},
  email: '',
  loading: false,
  authorized: false
}

const signInSlice = createSlice({
  name: 'signIn',
  initialState,
  reducers: {
    setIsUserAuthorized: (state, action) => {
      state.authorized = action.payload
    },
    setUserDetails: (state, action) => {
      state.user = action.payload.user
    },
    resetUserDetails: state => {
      state.user = {}
    },
    setLoaderOff: state => {
      state.loading = false
    }
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true
      })
      .addCase(login.fulfilled, (state: UserState, action: PayloadAction<any>) => {
        state.loading = false
        state.authorized = action.payload.status_code === 200
      })
      .addCase(login.rejected, state => {
        state.loading = false
      })
    builder
      .addCase(logout.pending, state => {
        state.loading = true
      })
      .addCase(logout.fulfilled, (state: any) => {
        state.loading = false
        state.authorized = false
      })
      .addCase(logout.rejected, state => {
        state.loading = false
      })
  }
})

export default signInSlice.reducer
export const { setUserDetails, resetUserDetails, setIsUserAuthorized, setLoaderOff } = signInSlice.actions
export const getUserEmail = ({ signIn }: { signIn: any }) => signIn.email
export const getUserDetails = ({ signIn }: { signIn: any }) => signIn.user
export const getuserLoader = (state: UserState) => state.loading
export const getIsUserAuthorized = ({ signIn }: { signIn: any }) => signIn.authorized
