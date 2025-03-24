import { initialPosition } from "@/app/helper";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isInCheck } from "@/app/arbiter/checkDetection";

type MovePayload = {
  sourceRowIndex: number;
  sourceColIndex: number;
  targetRowIndex: number;
  targetColIndex: number;
};

type PromotionPayload = {
  row: number;
  col: number;
  promoteTo: string;
};

type SelectPiecePayload = {
  rowIndex: number | null;
  colIndex: number | null;
};

type gameStateType = {
  position: string[][];
  turn: string;
  pendingPromotion: { row: number; col: number } | null;
  selectedPiece: { rowIndex: number; colIndex: number } | null;
  whiteInCheck: boolean;
  blackInCheck: boolean;
};

const initialState: gameStateType = {
  position: initialPosition(),
  turn: "w",
  pendingPromotion: null,
  selectedPiece: null,
  whiteInCheck: false,
  blackInCheck: false,
};

const gameState = createSlice({
  name: "gameState",
  initialState,
  reducers: {
    movePiece: (state, action: PayloadAction<MovePayload>) => {
      const { sourceRowIndex, sourceColIndex, targetRowIndex, targetColIndex } =
        action.payload;

      const movingPiece = state.position[sourceRowIndex][sourceColIndex];

      // Move piece from source to target
      state.position[targetRowIndex][targetColIndex] = movingPiece;

      // Clear the source square
      state.position[sourceRowIndex][sourceColIndex] = "";

      // Check if this is a pawn promotion
      const isPawn = movingPiece.charAt(1).toLowerCase() === "p";
      const isPromotionRank =
        (movingPiece.charAt(0) === "w" && targetRowIndex === 0) ||
        (movingPiece.charAt(0) === "b" && targetRowIndex === 7);

      if (isPawn && isPromotionRank) {
        // Set pending promotion instead of changing turn
        state.pendingPromotion = {
          row: targetRowIndex,
          col: targetColIndex,
        };
      } else {
        // Normal move - switch turn
        state.turn = state.turn === "w" ? "b" : "w";

        // Clear selected piece
        state.selectedPiece = null;

        // Update check status
        state.whiteInCheck = isInCheck(state.position, "w");
        state.blackInCheck = isInCheck(state.position, "b");
      }
    },

    promotePawn: (state, action: PayloadAction<PromotionPayload>) => {
      const { row, col, promoteTo } = action.payload;
      const color = state.position[row][col].charAt(0);

      // Replace the pawn with the promoted piece
      state.position[row][col] = color + promoteTo;

      // Clear pending promotion and switch turn
      state.pendingPromotion = null;
      state.turn = state.turn === "w" ? "b" : "w";

      // Update check status
      state.whiteInCheck = isInCheck(state.position, "w");
      state.blackInCheck = isInCheck(state.position, "b");
    },

    cancelPromotion: (state) => {
      state.pendingPromotion = null;
    },

    selectPiece: (state, action: PayloadAction<SelectPiecePayload>) => {
      const { rowIndex, colIndex } = action.payload;

      if (rowIndex === null || colIndex === null) {
        state.selectedPiece = null;
      } else {
        const piece = state.position[rowIndex][colIndex];
        if (piece && piece.charAt(0) === state.turn) {
          state.selectedPiece = { rowIndex, colIndex };
        } else {
          state.selectedPiece = null;
        }
      }
    },

    // Initialize check status at the start of the game
    initCheckStatus: (state) => {
      state.whiteInCheck = isInCheck(state.position, "w");
      state.blackInCheck = isInCheck(state.position, "b");
    },
  },
});

export const {
  movePiece,
  promotePawn,
  cancelPromotion,
  selectPiece,
  initCheckStatus,
} = gameState.actions;
export default gameState.reducer;
