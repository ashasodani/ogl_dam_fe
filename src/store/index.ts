// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import signInReducer from '@store/slices/loginSlice'
import userReducer from '@store/slices/userSlice'
import candidate from '@store/slices/candidateSlice'
import state from '@store/slices/resourceSlice'
import role from '@store/slices/roleSlice'
import testAssess from '@store/slices/testAssesSlice'
import mcqAssess from '@store/slices/mcqAssesSlice'
import setting from '@store/slices/settingSlice'
import technology from '@store/slices/technologySlice'
import candidateDashboard from '@store/slices/candidateDashboardSlice'
import jdoodle from '@store/slices/jdoodleSlice'
import coding from '@store/slices/codingTestSlice'
import company from '@store/slices/companySlice'

export const store = configureStore({
  reducer: {
    signInReducer,
    userReducer,
    candidate,
    candidateDashboard,
    role,
    state,
    testAssess,
    mcqAssess,
    setting,
    technology,
    jdoodle,
    coding,
    company
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
