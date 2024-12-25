import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import shopService from "../services/shopServices";
import { ShopPackage } from "../../types/types";

interface ShopState {
  shopPackages: ShopPackage[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
}

const initialState: ShopState = {
  shopPackages: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
};

export const fetchShopPackages = createAsyncThunk<
  ShopPackage[],
  void,
  { rejectValue: string }
>("shop/fetchShopPackages", async (_, thunkAPI) => {
  try {
    return await shopService.fetchShopPackages();
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const shopSlice = createSlice({
  name: "shop",
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
        fetchShopPackages.fulfilled,
        (state, action: PayloadAction<ShopPackage[]>) => {
          state.shopPackages = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(fetchShopPackages.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(fetchShopPackages.pending, (state) => {
        state.isLoading = true;
      });
  },
});

export const { reset } = shopSlice.actions;

export default shopSlice.reducer;
