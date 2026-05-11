import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { apiService } from '@shared/services/apiService'

interface CandidateManageState {
  params: any
  loading: boolean
  candidateManageList: any[]
  candidateManagesDetail: any
  isButtonsDisabled: boolean
  totalAssignedTest: number
}

const initialState: CandidateManageState = {
  params: {},
  loading: false,
  candidateManageList: [],
  candidateManagesDetail: {},
  isButtonsDisabled: false,
  totalAssignedTest: 0
}

export const getCandidateManage = createAsyncThunk('getCandidateManage', async (params: any, { dispatch }) => {
  const response = await apiService.get(`admin/users`, true, params)

  dispatch(setTemplatesData({ params: params }))

  return response.data
})

export const getCandidateManageDetail = createAsyncThunk('getCandidateManageDetail', async (id: any,{ getState, dispatch }) => {
  const response = await apiService.get(`users/${id}`, true)

   dispatch(setTemplatesData({ id }));
  

  return response.data
})

export const createCandidateManage = createAsyncThunk('createCandidateManage', async (params: any) => {
  const response = await apiService.post(`users`, params, true)

  return response
})

export const assignCandidateTest = createAsyncThunk('assignCandidateTest', async (params: any,{ dispatch }) => {
  const response = await apiService.post(`assign-test`, params, true)
  const candidateId = params.candidate_id;

  await dispatch(getCandidateManageDetail(candidateId));

  return response
})

export const editCandidateManage = createAsyncThunk(
  'editCandidateManage',
  async (post: any, { getState, dispatch }) => {
    const id = (getState() as any).candidate.candidateManagesDetail.id;

    const response = await apiService.put(`users`, id, post, true)

    const { params } = (getState() as any).candidate.candidateManageList;

    dispatch(getCandidateManage({ ...params, sort_order: 'desc', sort_by: 'created_at' }))

    return response
  }
)

export const editCandidate = createAsyncThunk('editCandidateManage', async (post: any) => {
  const { id, data } = post
  const response = await apiService.put(`candidateManages`, id, data, true)

  return response
})

export const resumeDownloadCandidate = createAsyncThunk('resumeDownloadCandidate', async (post: any) => {
  const { id } = post
  const response = await apiService.get(`users/download-resume`, post, true)

  return response
})

export const deleteCandidateManage = createAsyncThunk(
  "deleteCandidateManage",
  async (id: number, { getState, dispatch }) => {
    await apiService.delete(`users`, id, true);
    const { params } = (getState() as any).candidate.candidateManageList;

    dispatch(getCandidateManage({ ...params, sort_order: 'desc', sort_by: 'created_at' }));

    return id;
  }
);

// export const deleteCandidateManage = createAsyncThunk(
//   'deleteCandidateManage',
//   async (post: any, { getState, dispatch }) => {

//     dispatch(getCandidateManage({ ...params, sort_order: 'desc', sort_by: 'created_at' }))

//     return response
//   }
// )

const candidateSlice = createSlice({
  name: 'candidateReducer',
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
      .addCase(getCandidateManage.pending, state => {
        console.log('pending')
        state.loading = true
      })
      .addCase(getCandidateManage.fulfilled, (state: any, action) => {
        state.loading = false
        state.candidateManageList = action.payload
      })
      .addCase(getCandidateManage.rejected, state => {
        console.log('rejected')
        state.loading = false
      })

      .addCase(getCandidateManageDetail.pending, state => {
        console.log('pending')
        state.loading = true
      })
      .addCase(getCandidateManageDetail.fulfilled, (state: any, action) => {
        state.loading = false
        state.candidateManagesDetail = action.payload
      })
      .addCase(getCandidateManageDetail.rejected, state => {
        console.log('rejected')
        state.loading = false
      })

      .addCase(resumeDownloadCandidate.pending, state => {
        console.log('pending')
        state.loading = true
      })
      .addCase(resumeDownloadCandidate.fulfilled, (state: any, action) => {
        state.loading = false
        state.candidateResume = action.payload
      })
      .addCase(resumeDownloadCandidate.rejected, state => {
        state.loading = false
      })
  }
})

export default candidateSlice.reducer

export const { setTemplatesData, setButtonsDisabled, setTotalAssignedTest } = candidateSlice.actions
export const getCandidateManageList = ({ candidate }: { candidate: any }) => candidate?.candidateManageList
export const getCandidateManagesDetail = ({ candidate }: { candidate: any }) => candidate?.candidateManagesDetail
export const getCandidateManageLoader = ({ candidate }: { candidate: any }) => candidate?.loading
export const candidateDetail = ({ candidate }: { candidate: any }) => candidate?.candidateDetail
export const getCandidateResume = ({ candidate }: { candidate: any }) => candidate?.candidateResume
export const getButtonsDisabled = ({ candidate }: { candidate: any }) => candidate?.isButtonsDisabled
export const getTotalAssignedTest = ({ candidate }: { candidate: any }) => candidate?.totalAssignedTest
