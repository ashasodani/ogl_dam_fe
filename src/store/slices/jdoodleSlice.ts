import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { jdoodleService } from '@/shared/services/jdoodleService';


interface ExecuteCodeParams {
  script: string;
  language: string;
  stdin?: string;
  compileOnly?: boolean;
}

export const authenticateJDoodle = createAsyncThunk('jdoodle/authenticate', async () => {
  return await jdoodleService.authenticate();
});

export const executeJDoodleCode = createAsyncThunk('jdoodle/execute', async (params: ExecuteCodeParams) => {
  return await jdoodleService.executeCode(params);
});

interface JDoodleState {
  output: Record<string, string>;
  loading: boolean;
  executeLoading: boolean;
}

const initialState: JDoodleState = {
  output: {},
  loading: false,
  executeLoading: false
};

const jdoodleSlice = createSlice({
  name: 'jdoodle',
  initialState,
  reducers: {
    setOutput: (state, action) => {
      state.output = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      // .addCase(authenticateJDoodle.pending, state => {
      //   state.loading = true;
      // })
      // .addCase(authenticateJDoodle.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.output = JSON.stringify(action.payload, null, 2);
      // })
      // .addCase(authenticateJDoodle.rejected, state => {
      //   state.loading = false;
      //   state.output = 'Authentication failed';
      // })
      .addCase(executeJDoodleCode.pending, state => {
        state.loading = true;
      })
      .addCase(executeJDoodleCode.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload)
        state.output = action.payload;
      })
      .addCase(executeJDoodleCode.rejected, state => {
        state.loading = false;
        // state.output = 'Code execution failed';
      });
  }
});

export default jdoodleSlice.reducer;
export const { setOutput } = jdoodleSlice.actions;
export const getJDoodleOutput = (state: { jdoodle: JDoodleState }) => state.jdoodle.output;
export const getJDoodleLoading = (state: { jdoodle: JDoodleState }) => state.jdoodle.loading;
export const getJDoodleExecuteLoading = (state: { jdoodle: JDoodleState }) => state.jdoodle.executeLoading;