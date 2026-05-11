import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { apiService } from '@shared/services/apiService'

interface CompanyManageState {
  params: any
  loading: boolean
  countryLoading: boolean
  cityLoading: boolean
  CompanyManageList: any[]
  DirectoryManageList :any[]
  CompanyManagesDetail: any
  isButtonsDisabled: boolean
  totalAssignedTest: number
}

const initialState: CompanyManageState = {
  params: {},
  loading: false,
  countryLoading: false,
  cityLoading: false,
  CompanyManageList: [],
  DirectoryManageList: [],
  CompanyManagesDetail: {},
  isButtonsDisabled: false,
  totalAssignedTest: 0
}

export const getCompanyManage = createAsyncThunk('getCompanyManage', async (params: any, { dispatch }) => {
  const response = await apiService.get(`getdirectory`, true, params)

  dispatch(setTemplatesData({ params: params }))

  return response.data
})

export const getDirectoryManage = createAsyncThunk('getDirectoryManage', async (params: any, { dispatch }) => {
  const response = await apiService.get(`getdirectory`, true, params)

  dispatch(setTemplatesData({ params: params }))

  return response.data
})

export const getCountryListManage = createAsyncThunk('getCountryListManage', async (params: any, { dispatch }) => {
  debugger;
  const response = await apiService.get(`getcountry`, true, params)

  //dispatch(setTemplatesData({ params: params }))

  return response.data
})

export const getCityListManage = createAsyncThunk('getCityListManage', async (countryId: any) => {
  const response = await apiService.get(`getcity/${countryId}`, true)
  return response.data
})

export const getCompanyManageDetail = createAsyncThunk('getCompanyManageDetail', async (id: any,{ getState, dispatch }) => {
  const response = await apiService.get(`companies/${id}`, true)
  debugger;
   dispatch(setTemplatesData({ id }));
  

  return response.data
})

export const createCompanyManage = createAsyncThunk('createCompanyManage', async (params: any) => {
  const response = await apiService.post(`companies`, params, true)

  return response
})

export const assignCompanyTest = createAsyncThunk('assignCompanyTest', async (params: any,{ dispatch }) => {
  const response = await apiService.post(`assign-test`, params, true)
  const CompanyId = params.Company_id;

  await dispatch(getCompanyManageDetail(CompanyId));

  return response
})

export const editCompanyManage = createAsyncThunk(
  'editCompanyManage',
  async (post: any, { getState, dispatch }) => {
    const id = (getState() as any).Company.CompanyManagesDetail.id;

    const response = await apiService.put(`users`, id, post, true)

    const { params } = (getState() as any).Company.CompanyManageList;

    dispatch(getCompanyManage({ ...params, sort_order: 'desc', sort_by: 'created_at' }))

    return response
  }
)

export const editCompany = createAsyncThunk('editCompanyManage', async (post: any) => {
  const { id, data } = post
  const response = await apiService.put(`CompanyManages`, id, data, true)

  return response
})

export const resumeDownloadCompany = createAsyncThunk('resumeDownloadCompany', async (post: any) => {
  const { id } = post
  const response = await apiService.get(`users/download-resume`, post, true)

  return response
})

export const deleteCompanyManage = createAsyncThunk(
  "deleteCompanyManage",
  async (id: number, { getState, dispatch }) => {
    await apiService.delete(`users`, id, true);
    const { params } = (getState() as any).Company.CompanyManageList;

    dispatch(getCompanyManage({ ...params, sort_order: 'desc', sort_by: 'created_at' }));

    return id;
  }
);

// export const deleteCompanyManage = createAsyncThunk(
//   'deleteCompanyManage',
//   async (post: any, { getState, dispatch }) => {

//     dispatch(getCompanyManage({ ...params, sort_order: 'desc', sort_by: 'created_at' }))

//     return response
//   }
// )

const CompanySlice = createSlice({
  name: 'CompanyReducer',
  initialState,
  reducers: {
    setTemplatesData: (state, action) => {
      const { params } = action.payload

      state.params = params
    },
    setButtonsDisabled: (state, action) => {
      state.isButtonsDisabled = action.payload
    },

    setTotalAssignedTest : (state, action) => {
      state.totalAssignedTest = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getCompanyManage.pending, state => {
        console.log('pending')
        state.loading = true
      })
      .addCase(getCompanyManage.fulfilled, (state: any, action) => {
      
        state.loading = false
        state.CompanyManageList = action.payload
      })
      .addCase(getCompanyManage.rejected, state => {
        console.log('rejected')
        state.loading = false
      })

      .addCase(getDirectoryManage.pending, state => {
        console.log('pending')
        state.loading = true
      })
      .addCase(getDirectoryManage.fulfilled, (state: any, action) => {
      
        state.loading = false
        state.DirectoryManageList = action.payload
      })
      .addCase(getDirectoryManage.rejected, state => {
        console.log('rejected')
        state.loading = false
      })

      .addCase(getCountryListManage.pending, state => {
        state.countryLoading = true
      })
      .addCase(getCountryListManage.fulfilled, (state: any, action) => {
        state.countryLoading = false
        state.CountryListManage = action.payload
      })
      .addCase(getCountryListManage.rejected, state => {
        state.countryLoading = false
      })

      .addCase(getCityListManage.pending, state => {
        state.cityLoading = true
      })
      .addCase(getCityListManage.fulfilled, (state: any, action) => {
        state.cityLoading = false
        state.CityListManage = action.payload
      })
      .addCase(getCityListManage.rejected, state => {
        state.cityLoading = false
      })

      

      .addCase(getCompanyManageDetail.pending, state => {
        console.log('pending')
        state.loading = true
      })
      .addCase(getCompanyManageDetail.fulfilled, (state: any, action) => {
        state.loading = false
        state.CompanyManagesDetail = action.payload
      })
      .addCase(getCompanyManageDetail.rejected, state => {
        console.log('rejected')
        state.loading = false
      })

      .addCase(resumeDownloadCompany.pending, state => {
        console.log('pending')
        state.loading = true
      })
      .addCase(resumeDownloadCompany.fulfilled, (state: any, action) => {
        state.loading = false
        state.CompanyResume = action.payload
      })
      .addCase(resumeDownloadCompany.rejected, state => {
        state.loading = false
      })
  }
})

export default CompanySlice.reducer

export const { setTemplatesData, setButtonsDisabled, setTotalAssignedTest } = CompanySlice.actions
export const getCompanyManageList = ({ company }: { company: any }) => company?.CompanyManageList
export const getDirectoryManageList = ({ company }: { company: any }) => company?.DirectoryManageList
export const getCountryListManages = ({ company }: { company: any }) => company?.CountryListManage
export const getCityListManages = ({ company }: { company: any }) => company?.CityListManage

export const getCompanyManagesDetail = ({ company }: { company: any }) => company?.CompanyManagesDetail
export const getCompanyManageLoader = ({ company }: { company: any }) => company?.loading
export const getCountryLoader = ({ company }: { company: any }) => company?.countryLoading
export const getCityLoader = ({ company }: { company: any }) => company?.cityLoading
export const CompanyDetail = ({ company }: { company: any }) => company?.CompanyDetail
export const getCompanyResume = ({ company }: { company: any }) => company?.CompanyResume
export const getButtonsDisabled = ({ company }: { company: any }) => company?.isButtonsDisabled
export const getTotalAssignedTest = ({ company }: { company: any }) => company?.totalAssignedTest
