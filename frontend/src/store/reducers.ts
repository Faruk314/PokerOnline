import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import gameReducer from "./slices/game";
import shopReducer from "./slices/shop";
import paymentReducer from "./slices/payment";

const rootReducer = combineReducers({
  auth: authReducer,
  game: gameReducer,
  shop: shopReducer,
  payment: paymentReducer,
});

export default rootReducer;
