import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthResponse, UserData, UserInfo } from "../../types/types";
import authService from "../services/authServices";

interface AuthState {
  loggedUserInfo: UserInfo | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  fetchingLoginState: boolean;
}

const initialState: AuthState = {
  loggedUserInfo: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  fetchingLoginState: true,
};

export const register = createAsyncThunk<
  AuthResponse,
  UserData,
  { rejectValue: string }
>("auth/register", async (user: UserData, thunkAPI) => {
  try {
    return await authService.register(user);
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const login = createAsyncThunk<
  AuthResponse,
  UserData,
  { rejectValue: string }
>("auth/login", async (user: UserData, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const getLoginStatus = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>("auth/getLoginStatus", async (_, thunkAPI) => {
  try {
    return await authService.getLoginStatus();
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>("auth/logout", async (_, thunkAPI) => {
  try {
    return await authService.logout();
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.fetchingLoginState = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.loggedUserInfo = action.payload.userInfo;
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ? action.payload : "";
        state.loggedUserInfo = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.loggedUserInfo = action.payload.userInfo;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ? action.payload : "";
        state.loggedUserInfo = null;
      })
      .addCase(getLoginStatus.rejected, (state) => {
        state.fetchingLoginState = false;
        state.loggedUserInfo = null;
      })
      .addCase(getLoginStatus.pending, (state) => {
        state.fetchingLoginState = true;
      })
      .addCase(
        getLoginStatus.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loggedUserInfo = action.payload.userInfo;
          state.fetchingLoginState = false;
          state.isSuccess = true;
        }
      )
      .addCase(logout.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loggedUserInfo = null;
        state.isLoading = false;
        state.isSuccess = true;
      });
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
