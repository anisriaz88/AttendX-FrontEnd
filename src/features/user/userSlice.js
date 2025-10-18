import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "./userService.js";

// Initial state for the user slice
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  role: (JSON.parse(localStorage.getItem("user")) || {})?.role || null,
  isLoggedIn: !!JSON.parse(localStorage.getItem("user")),
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
  updatingProfile: false,
  updateProfileError: null,
  updateProfileSuccess: false,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, thunkApi) => {
    try {
      const result = await userService.registerUser(userData);
      console.log(result.data);

      return result.data;
    } catch (error) {
      const message =
        error.response.data.message || error.message || error.toString();
      return thunkApi.rejectWithValue(message);
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, thunkApi) => {
    try {
      const result = await userService.loginUser(userData);
      return result;
    } catch (error) {
      const message =
        error.response.data.message || error.message || error.toString();
      return thunkApi.rejectWithValue(message);
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, thunkApi) => {
    try {
      const result = await userService.logoutUser();
      return result;
    } catch (error) {
      const message =
        error.response.data.message || error.message || error.toString();
      return thunkApi.rejectWithValue(message);
    }
  }
);

// Async thunk for Refreshing Access Token
export const refreshAccessToken = createAsyncThunk(
  "user/refreshAccessToken",
  async (_, thunkApi) => {
    try {
      const result = await userService.refreshAccessToken();
      return result;
    } catch (error) {
      const message =
        error.response.data.message || error.message || error.toString();
      return thunkApi.rejectWithValue(message);
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (updateData, thunkApi) => {
    try {
      const result = await userService.updateUserProfile(updateData);
      return result;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || error.toString();
      return thunkApi.rejectWithValue(message);
    }
  }
);

// User Slice
const userSlice = createSlice({
  name: "user",
  initialState: initialState,

  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.data;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.data;
        localStorage.setItem("user", JSON.stringify(action.payload.data));
        state.role = action.payload.data.role;
        state.isLoggedIn = true;

      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;
        localStorage.removeItem("user");
        state.isLoggedIn = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Refresh Access Token
      .addCase(refreshAccessToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.data;
        localStorage.setItem("user", JSON.stringify(action.payload.data));
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        localStorage.removeItem("user");
        state.isLoggedIn = false;
      })

      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.updatingProfile = true;
        state.updateProfileError = null;
        state.updateProfileSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updatingProfile = false;
        state.updateProfileSuccess = true;
        if (action.payload?.data) {
          state.user = action.payload.data;
          state.role = action.payload.data.role;
          localStorage.setItem("user", JSON.stringify(action.payload.data));
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updatingProfile = false;
        state.updateProfileError = action.payload || "Profile update failed";
      });
  },
});

export const { reset } = userSlice.actions;

export default userSlice.reducer;
