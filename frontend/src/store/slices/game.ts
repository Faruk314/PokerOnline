import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import gameService from "../services/gameServices";
import { GameRoom, IGame, IGameStatus } from "../../types/types";

interface GameState {
  gameRooms: GameRoom[];
  currentGameRoom: GameRoom | null;
  gameState: IGame | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  openRaiseBar: boolean;
  totalCoins: number;
  gameStatus: IGameStatus;
}

const initialState: GameState = {
  gameRooms: [],
  currentGameRoom: null,
  gameState: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  openRaiseBar: false,
  totalCoins: 0,
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
  { coins: number },
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
  GameRoom,
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
    updateGameState(state, action: PayloadAction<Partial<IGame>>) {
      if (!state.gameState) return;

      Object.assign(state.gameState, action.payload);
    },

    removePlayer(state, action: PayloadAction<{ playerId: string }>) {
      const playerId = action.payload.playerId;

      if (state.gameState?.players) {
        state.gameState.players = state.gameState.players.filter(
          (p) => p.playerInfo.userId !== playerId
        );
      }

      if (state.currentGameRoom?.players) {
        const updatedPlayers = state.currentGameRoom.players.filter(
          (p) => p.userId !== playerId
        );
        state.currentGameRoom.players = updatedPlayers;
      }
    },

    updatePlayer(
      state,
      action: PayloadAction<{
        playerId: string;
        data: Partial<IGame["players"][number]>;
      }>
    ) {
      if (!state.gameState) return;

      const players = state.gameState.players;
      const index = players.findIndex(
        (p) => p.playerInfo.userId === action.payload.playerId
      );

      if (index === -1) return;

      players[index] = {
        ...players[index],
        ...action.payload.data,
      };
    },

    updatePlayerCoins(
      state,
      action: PayloadAction<{ playerId: string; amount: number }>
    ) {
      if (!state.gameState) return;

      const players = state.gameState.players;

      const index = players.findIndex(
        (p) => p.playerInfo.userId === action.payload.playerId
      );

      if (index === -1) return;

      players[index].coins += action.payload.amount;
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
        (state, action: PayloadAction<GameRoom>) => {
          state.currentGameRoom = null;
          state.gameState = null;

          const data = action.payload;

          state.isSuccess = true;

          if (data.gameState) state.gameState = data.gameState;

          state.currentGameRoom = {
            ...data,
          };

          state.isLoading = false;
        }
      )
      .addCase(
        fetchChips.fulfilled,
        (state, action: PayloadAction<{ coins: number }>) => {
          if (action.payload) {
            state.totalCoins = action.payload.coins;
          } else {
            state.totalCoins = 0;
          }
        }
      );
  },
});

export const {
  setGameState,
  updateGameState,
  setOpenRaiseBar,
  setGameStatus,
  updatePlayer,
  updatePlayerCoins,
  removePlayer,
} = gameSlice.actions;

export default gameSlice.reducer;
