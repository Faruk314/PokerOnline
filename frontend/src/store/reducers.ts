import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import gameReducer from "./slices/game";

const rootReducer = combineReducers({
  auth: authReducer,
  game: gameReducer,
});

export default rootReducer;
