import { initialPosition } from "@/app/helper";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MovePayload = {
  sourceRowIndex: number;
  sourceColIndex: number;
  targetRowIndex: number;
  targetColIndex: number;
};

type gameStateType = {
  position: string[][];
};

const initialState: gameStateType = {
  position: initialPosition(),
};

const gameState = createSlice({
  name: "gameState",
  initialState,
  reducers: {
    movePiece: (state, action: PayloadAction<MovePayload>) => {
      const { sourceRowIndex, sourceColIndex, targetRowIndex, targetColIndex } =
        action.payload;

      // Move piece from source to target
      state.position[targetRowIndex][targetColIndex] =
        state.position[sourceRowIndex][sourceColIndex];

      // Clear the source square
      state.position[sourceRowIndex][sourceColIndex] = "";
    },
  },
});

export const { movePiece } = gameState.actions;
export default gameState.reducer;
