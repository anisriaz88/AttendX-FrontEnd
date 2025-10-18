import { sessionService } from "./sessionService.js";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  session: null,
  isSessionActive: !!JSON.parse(localStorage.getItem("session")),
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Create Session
export const createSession = createAsyncThunk(
  "session/create",
  async ({ classId, sessionName }, thunkApi) => {
    try {
      const response = await sessionService.createSession(classId, sessionName);
      return response; // service already returns data
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// Get Active Session by Class ID
export const getActiveSessionByClassId = createAsyncThunk(
  "session/getActiveByClassId",
  async (classId, thunkApi) => {
    try {
      const response = await sessionService.getActiveSessionByClassId(classId);
      return response; // service already returns data
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

// End Session
export const endSession = createAsyncThunk(
  "session/end",
  async (classId, thunkApi) => {
    try {
      const response = await sessionService.endSession(classId);
      return response; // service already returns data
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const sessionSlice = createSlice({
  name: "session",
  initialState: initialState,
  reducers: {
    reset: (state) => {
      state.session = null;
      state.isSessionActive = !!JSON.parse(localStorage.getItem("session"));
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Session
      .addCase(createSession.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.session = action.payload;
        state.isSessionActive = true;
      })
      .addCase(createSession.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to create session";
      })

      // Get Active Session by Class ID
      .addCase(getActiveSessionByClassId.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getActiveSessionByClassId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.session = action.payload;
        state.isSessionActive = !!action.payload;
      })
      .addCase(getActiveSessionByClassId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // End Session
      .addCase(endSession.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(endSession.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.session = null;
        state.isSessionActive = false;
      })
      .addCase(endSession.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = sessionSlice.actions;

export default sessionSlice.reducer;
