import { initialPosition } from "@/app/helper";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  isInCheck,
  isCheckmate,
  isStalemate,
} from "@/app/arbiter/checkDetection";

type MovePayload = {
  sourceRowIndex: number;
  sourceColIndex: number;
  targetRowIndex: number;
  targetColIndex: number;
  isCastling?: boolean;
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
  castlingRights: {
    w: { kingSide: boolean; queenSide: boolean };
    b: { kingSide: boolean; queenSide: boolean };
  };
  gameStatus: "active" | "checkmate" | "stalemate";
  winner: string | null;
};

const initialState: gameStateType = {
  position: initialPosition(),
  turn: "w",
  pendingPromotion: null,
  selectedPiece: null,
  whiteInCheck: false,
  blackInCheck: false,
  castlingRights: {
    w: { kingSide: true, queenSide: true },
    b: { kingSide: true, queenSide: true },
  },
  gameStatus: "active",
  winner: null,
};

const gameState = createSlice({
  name: "gameState",
  initialState,
  reducers: {
    movePiece: (state, action: PayloadAction<MovePayload>) => {
      const {
        sourceRowIndex,
        sourceColIndex,
        targetRowIndex,
        targetColIndex,
        isCastling,
      } = action.payload;

      const movingPiece = state.position[sourceRowIndex][sourceColIndex];
      const pieceType = movingPiece.charAt(1);
      const pieceColor = movingPiece.charAt(0);

      // Handle castling moves separately
      if (isCastling) {
        // Update king position
        state.position[targetRowIndex][targetColIndex] = movingPiece;
        state.position[sourceRowIndex][sourceColIndex] = "";

        // Determine rook positions and move the rook
        if (targetColIndex > sourceColIndex) {
          // Kingside castling
          const rookSourceCol = 7;
          const rookTargetCol = targetColIndex - 1;
          const rookPiece = state.position[targetRowIndex][rookSourceCol];
          state.position[targetRowIndex][rookTargetCol] = rookPiece;
          state.position[targetRowIndex][rookSourceCol] = "";
        } else {
          // Queenside castling
          const rookSourceCol = 0;
          const rookTargetCol = targetColIndex + 1;
          const rookPiece = state.position[targetRowIndex][rookSourceCol];
          state.position[targetRowIndex][rookTargetCol] = rookPiece;
          state.position[targetRowIndex][rookSourceCol] = "";
        }
      } else {
        // Regular move
        state.position[targetRowIndex][targetColIndex] = movingPiece;
        state.position[sourceRowIndex][sourceColIndex] = "";
      }

      // Update castling rights
      if (pieceType === "k") {
        // King moved, lose all castling rights for that color
        state.castlingRights[pieceColor].kingSide = false;
        state.castlingRights[pieceColor].queenSide = false;
      } else if (pieceType === "r") {
        // Rook moved, lose castling rights for that side
        if (sourceColIndex === 0) {
          // queenside rook
          state.castlingRights[pieceColor].queenSide = false;
        } else if (sourceColIndex === 7) {
          // kingside rook
          state.castlingRights[pieceColor].kingSide = false;
        }
      }

      // Check if this is a pawn promotion
      const isPawn = pieceType.toLowerCase() === "p";
      const isPromotionRank =
        (pieceColor === "w" && targetRowIndex === 0) ||
        (pieceColor === "b" && targetRowIndex === 7);

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

        // Check for checkmate or stalemate
        const nextPlayer = state.turn;
        if (isCheckmate(state.position, nextPlayer, state.castlingRights)) {
          state.gameStatus = "checkmate";
          state.winner = nextPlayer === "w" ? "b" : "w";
        } else if (
          isStalemate(state.position, nextPlayer, state.castlingRights)
        ) {
          state.gameStatus = "stalemate";
          state.winner = null;
        }
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

      // Check for checkmate or stalemate
      const nextPlayer = state.turn;
      if (isCheckmate(state.position, nextPlayer, state.castlingRights)) {
        state.gameStatus = "checkmate";
        state.winner = nextPlayer === "w" ? "b" : "w";
      } else if (
        isStalemate(state.position, nextPlayer, state.castlingRights)
      ) {
        state.gameStatus = "stalemate";
        state.winner = null;
      }
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

    // Reset the game
    resetGame: (state) => {
      state.position = initialPosition();
      state.turn = "w";
      state.pendingPromotion = null;
      state.selectedPiece = null;
      state.whiteInCheck = false;
      state.blackInCheck = false;
      state.castlingRights = {
        w: { kingSide: true, queenSide: true },
        b: { kingSide: true, queenSide: true },
      };
      state.gameStatus = "active";
      state.winner = null;
    },
  },
});

export const {
  movePiece,
  promotePawn,
  cancelPromotion,
  selectPiece,
  initCheckStatus,
  resetGame,
} = gameState.actions;
export default gameState.reducer;
