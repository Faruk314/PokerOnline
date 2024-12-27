import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import gameService from "../services/gameServices";
import { GameRoom, IGame, IGameStatus } from "../../types/types";

interface GameState {
  gameRooms: GameRoom[];
  gameState: IGame | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  openRaiseBar: boolean;
  totalChips: number;
  gameStatus: IGameStatus;
}

const initialState: GameState = {
  gameRooms: [],
  gameState: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  openRaiseBar: false,
  totalChips: 0,
  gameStatus: {
    isGameOver: false,
    reason: null,
  },
};

export const fetchRooms = createAsyncThunk<
  GameRoom[],
  void,
  { rejectValue: string }
>("game/fetchRooms", async (_, thunkAPI) => {
  try {
    return await gameService.fetchRooms();
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchChips = createAsyncThunk<
  { chips: number },
  void,
  { rejectValue: string }
>("game/fetchChips", async (_, thunkAPI) => {
  try {
    return await gameService.fetchChips();
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const getGameState = createAsyncThunk<
  IGame,
  string,
  { rejectValue: string }
>("game/getGameState", async (roomId, thunkAPI) => {
  try {
    return await gameService.getGameState(roomId);
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameState(state, action: PayloadAction<IGame | null>) {
      state.gameState = action.payload;
    },

    setGameStatus(state, action: PayloadAction<IGameStatus>) {
      state.gameStatus = action.payload;
    },

    setOpenRaiseBar(state, action: PayloadAction<boolean>) {
      state.openRaiseBar = action.payload;
    },

    reset(state) {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.gameRooms = [];
      })
      .addCase(fetchRooms.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.gameRooms = action.payload;
        state.isLoading = false;
      })
      .addCase(getGameState.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.gameState = null;
      })
      .addCase(getGameState.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getGameState.fulfilled,
        (state, action: PayloadAction<IGame>) => {
          state.isSuccess = true;
          state.gameState = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(
        fetchChips.fulfilled,
        (state, action: PayloadAction<{ chips: number }>) => {
          if (action.payload) {
            state.totalChips = action.payload.chips;
          } else {
            state.totalChips = 0;
          }
        }
      );
  },
});

export const { setGameState, setOpenRaiseBar, setGameStatus } =
  gameSlice.actions;

export default gameSlice.reducer;
