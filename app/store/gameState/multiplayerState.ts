import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialPosition } from "@/app/helper";

type SelectPiecePayload = {
  rowIndex: number | null;
  colIndex: number | null;
};

type MultiplayerStatePayload = {
  position: string[][];
  turn: string;
  playerColor: string | null;
  gameId: string;
  playerId: string;
  selectedPiece?: { rowIndex: number; colIndex: number } | null;
  whiteInCheck?: boolean;
  blackInCheck?: boolean;
  castlingRights?: {
    w: { kingSide: boolean; queenSide: boolean };
    b: { kingSide: boolean; queenSide: boolean };
  };
  gameStatus?: "active" | "checkmate" | "stalemate";
  lastMove?: {
    from: { row: number; col: number };
    to: { row: number; col: number };
    piece: string;
  } | null;
};

type MultiplayerStateType = {
  position: string[][];
  turn: string;
  playerColor: string | null;
  gameId: string;
  playerId: string;
  selectedPiece: { rowIndex: number; colIndex: number } | null;
  whiteInCheck: boolean;
  blackInCheck: boolean;
  castlingRights: {
    w: { kingSide: boolean; queenSide: boolean };
    b: { kingSide: boolean; queenSide: boolean };
  };
  gameStatus: "active" | "checkmate" | "stalemate";
  lastMove: {
    from: { row: number; col: number };
    to: { row: number; col: number };
    piece: string;
  } | null;
};

const initialState: MultiplayerStateType = {
  position: initialPosition(),
  turn: "w",
  playerColor: null,
  gameId: "",
  playerId: "",
  selectedPiece: null,
  whiteInCheck: false,
  blackInCheck: false,
  castlingRights: {
    w: { kingSide: true, queenSide: true },
    b: { kingSide: true, queenSide: true },
  },
  gameStatus: "active",
  lastMove: null,
};

const multiplayerState = createSlice({
  name: "multiplayerState",
  initialState,
  reducers: {
    setMultiplayerState: (
      state,
      action: PayloadAction<MultiplayerStatePayload>
    ) => {
      const {
        position,
        turn,
        playerColor,
        gameId,
        playerId,
        selectedPiece,
        whiteInCheck,
        blackInCheck,
        castlingRights,
        gameStatus,
        lastMove,
      } = action.payload;

      state.position = position;
      state.turn = turn;
      state.playerColor = playerColor;
      state.gameId = gameId;
      state.playerId = playerId;

      if (selectedPiece !== undefined) {
        state.selectedPiece = selectedPiece;
      }

      if (whiteInCheck !== undefined) {
        state.whiteInCheck = whiteInCheck;
      }

      if (blackInCheck !== undefined) {
        state.blackInCheck = blackInCheck;
      }

      if (castlingRights) {
        state.castlingRights = castlingRights;
      }

      if (gameStatus) {
        state.gameStatus = gameStatus;
      }

      if (lastMove !== undefined) {
        state.lastMove = lastMove;
      }
    },

    selectMultiplayerPiece: (
      state,
      action: PayloadAction<SelectPiecePayload>
    ) => {
      const { rowIndex, colIndex } = action.payload;

      if (rowIndex === null || colIndex === null) {
        state.selectedPiece = null;
      } else {
        const piece = state.position[rowIndex][colIndex];
        if (
          piece &&
          piece.charAt(0) === state.turn &&
          piece.charAt(0) === state.playerColor
        ) {
          state.selectedPiece = { rowIndex, colIndex };
        } else {
          state.selectedPiece = null;
        }
      }
    },
  },
});

export const { setMultiplayerState, selectMultiplayerPiece } =
  multiplayerState.actions;
export default multiplayerState.reducer;
