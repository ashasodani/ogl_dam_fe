import axios from 'axios'

import { deleteCookie, getCookie, setCookie } from 'cookies-next'

import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { apiService } from '@shared/services/apiService'

export interface loginPayload {
  email: string
  password: string
}

export const login = createAsyncThunk('signin', async (payload: loginPayload, { dispatch }) => {
  const response: any = await apiService.post(`signin`, payload)

  if (response?.status_code === 200) {
    localStorage.setItem('loginTime', new Date().toISOString())
    dispatch(setUserDetails(response.data))
    setCookie('userAuthToken', response?.data?.access_token)
    setCookie('isUserAuthenticated', true)
    setCookie('userRole', response.data.user.role)
    dispatch(setIsUserAuthorized(true))
  }

  return response
})
interface registerPayload {
  name: string
  email: string
  password: string
}
export const register = createAsyncThunk('register', async (payload: registerPayload) => {
  const response: any = await apiService.post(`register`, payload)

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
    localStorage.removeItem('user')
    delete axios.defaults.headers.common.Authorization

    // Then make the API call
    const response: any = await apiService.post(`auth/logout`, payload, true)

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

interface forgotPayload {
  email: string
}

export const forgotWithEmail = createAsyncThunk('forgotWithEmail', async (payload: forgotPayload) => {
  const response = await apiService.post(`/auth/forgot`, payload)

  return response
})
interface resetPayload {
  token: string
  email: string
  password: string
}
export const resetPassword = createAsyncThunk('resetPassword', async (payload: resetPayload) => {
  const response: any = await apiService.post(`/auth/reset`, payload)

  return response
})

export const checkTokenExpire = () => {
  const checkSession = () => {
    const loginTime = localStorage.getItem('loginTime')

    if (loginTime) {
      const elapsed = new Date().getTime() - new Date(loginTime).getTime()
      const AUTO_LOGOUT_DURATION = 3 * 60 * 60 * 1000

      if (elapsed > AUTO_LOGOUT_DURATION) store.dispatch(logout({}))
    }
  }

  let intervalId: any = ''

  if (getCookie('isUserAuthenticated')) intervalId = setInterval(checkSession, 60 * 1000)
  else clearInterval(intervalId)
}

export const onboardVerify = createAsyncThunk('assignInvite', async (params: any) => {
  const response = await apiService.post(`onboard/verify`, params)

  return response.data
})

export const setOnboard = createAsyncThunk('assignInvite', async (params: any, { dispatch }) => {
  const response: any = await apiService.post(`onboard`, params)

  if (response?.status_code === 200) {
    localStorage.setItem('loginTime', new Date().toISOString())
    dispatch(setUserDetails(response.data))
    setCookie('userAuthToken', response?.data?.access_token)
    setCookie('isUserAuthenticated', true)
    setCookie('userRole', response.data.user.role)
    dispatch(setIsUserAuthorized(true))
  }

  return response
})

// Define the shape of the user state
interface UserState {
  user: any
  email: string
  loading: boolean
  authorized: boolean
}

// Define the initial state
const initialState: UserState = {
  user: {},
  email: '',
  loading: false,
  authorized: false
}

const userSlice = createSlice({
  name: 'user',
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
    builder
      .addCase(forgotWithEmail.pending, state => {
        state.loading = true
      })
      .addCase(forgotWithEmail.fulfilled, (state: any) => {
        state.loading = false
      })
      .addCase(forgotWithEmail.rejected, state => {
        state.loading = false
      })
    builder
      .addCase(onboardVerify.pending, state => {
        state.loading = true
      })
      .addCase(onboardVerify.fulfilled, (state: any, action: any) => {
        state.email = action.payload
        state.loading = false
      })
      .addCase(onboardVerify.rejected, state => {
        state.loading = false
      })
  }
})

export default userSlice.reducer

export const { setUserDetails, resetUserDetails, setIsUserAuthorized, setLoaderOff } = userSlice.actions
export const getUserEmail = ({ user }: { user: any }) => user.email
export const getUserDetails = ({ user }: { user: any }) => user.user

// export const getuserLoader = ({ user }: { user: any }) => user.loading
export const getIsUserAuthorized = ({ user }: { user: any }) => user.authorized
