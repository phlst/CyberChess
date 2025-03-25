import { configureStore } from "@reduxjs/toolkit";
import gameStateReducer from "./gameState/gameState";
import multiplayerReducer from "./gameState/multiplayerState";

export const store = configureStore({
  reducer: {
    gameState: gameStateReducer,
    multiplayerState: multiplayerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
