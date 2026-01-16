import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import paymentService from "../services/paymentServices";

interface PaymentState {
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
}

const initialState: PaymentState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
};

export const createCheckoutSession = createAsyncThunk<
  { url: string },
  string,
  { rejectValue: string }
>("payment/createCheckoutSession", async (packageId, thunkAPI) => {
  try {
    return await paymentService.createCheckoutSession(packageId);
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const createPaymentIntent = createAsyncThunk<
  { clientSecret: string; amount: number; chips: number },
  { packageId: string; amount: number; price: number },
  { rejectValue: string }
>("payment/createPaymentIntent", async (data, thunkAPI) => {
  try {
    return await paymentService.createPaymentIntent(data);
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    reset(state) {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        createCheckoutSession.fulfilled,
        (state, action: PayloadAction<{ url: string }>) => {
          window.location.href = action.payload.url;
          state.isSuccess = true;
        }
      )
      .addCase(createCheckoutSession.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(createCheckoutSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPaymentIntent.fulfilled, (state) => {
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(createPaymentIntent.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(createPaymentIntent.pending, (state) => {
        state.isLoading = true;
      });
  },
});

export const { reset } = paymentSlice.actions;

export default paymentSlice.reducer;
