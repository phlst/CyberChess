"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  movePiece,
  selectPiece,
  initCheckStatus,
} from "@/app/store/gameState/gameState";
import { checkMoves } from "@/app/arbiter/checkMoves";
import PromotionBox from "../promotion/PromotionBox";
import { getLegalMoves } from "@/app/arbiter/checkDetection";

function Board() {
  const position = useSelector((state: RootState) => state.gameState.position);
  const turn = useSelector((state: RootState) => state.gameState.turn);
  const selectedPiece = useSelector(
    (state: RootState) => state.gameState.selectedPiece
  );
  const whiteInCheck = useSelector(
    (state: RootState) => state.gameState.whiteInCheck
  );
  const blackInCheck = useSelector(
    (state: RootState) => state.gameState.blackInCheck
  );
  const dispatch = useDispatch();
  const [draggedPiece, setDraggedPiece] = useState<{
    piece: string;
    rowIndex: number;
    colIndex: number;
  } | null>(null);

  // Initialize check status when component mounts
  useEffect(() => {
    dispatch(initCheckStatus());
  }, [dispatch]);

  // Create the 8x8 board array
  const boardArray = Array.from({ length: 8 }, () => new Array(8).fill(null));

  // Check if a piece is allowed to be dragged based on turn
  const canDragPiece = (piece: string) => {
    const pieceColor = piece.charAt(0); // 'w' for white, 'b' for black
    return pieceColor === turn;
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    piece: string,
    rowIndex: number,
    colIndex: number
  ) => {
    // Check if the piece is allowed to be dragged (based on turn)
    if (!canDragPiece(piece)) {
      e.preventDefault(); // Prevent drag if not this player's turn
      return;
    }

    e.stopPropagation();

    // Set the data in a format that will work cross-browser
    try {
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          piece,
          rowIndex,
          colIndex,
        })
      );
    } catch (err) {
      console.error("Error setting drag data:", err);
    }

    // Set which piece is being dragged
    setDraggedPiece({ piece, rowIndex, colIndex });

    // Also select the piece for candidate moves
    dispatch(selectPiece({ rowIndex, colIndex }));

    // Let the browser handle the drag image naturally
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDraggedPiece(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // This is crucial for drop to work
    e.stopPropagation();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetRow: number,
    targetCol: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    let sourceRow, sourceCol, piece;

    try {
      const dataString = e.dataTransfer.getData("text/plain");
      if (!dataString) {
        console.error("No data received during drop");
        return;
      }

      const data = JSON.parse(dataString);
      piece = data.piece;
      sourceRow = data.rowIndex;
      sourceCol = data.colIndex;

      console.log("Dropped piece data:", data);

      // Validate and proceed only if we have the required data
      if (!piece || sourceRow === undefined || sourceCol === undefined) {
        console.error("Missing required data for drop");
        return;
      }

      // Only allow drop if it's the player's turn
      if (piece.charAt(0) !== turn) {
        console.log("Not this player's turn");
        return;
      }

      // Check if the move is valid
      if (
        checkMoves({
          piece,
          sourceCol,
          sourceRow,
          targetCol,
          targetRow,
          position,
        })
      ) {
        // Execute the move
        dispatch(
          movePiece({
            sourceRowIndex: sourceRow,
            sourceColIndex: sourceCol,
            targetRowIndex: targetRow,
            targetColIndex: targetCol,
          })
        );
      } else {
        console.log("Invalid move");
      }
    } catch (error) {
      console.error("Error handling drop:", error);
    }

    setDraggedPiece(null);
  };

  // Helper to determine if a piece should be hidden (if it's the one being dragged)
  const shouldHidePiece = (rowIndex: number, colIndex: number) => {
    return (
      draggedPiece !== null &&
      draggedPiece.rowIndex === rowIndex &&
      draggedPiece.colIndex === colIndex
    );
  };

  // Helper to get candidate moves for a selected piece
  const getCandidateMoves = () => {
    if (!selectedPiece) return [];

    const { rowIndex, colIndex } = selectedPiece;
    const piece = position[rowIndex][colIndex];

    if (!piece || piece.charAt(0) !== turn) return [];

    const inCheck = piece.charAt(0) === "w" ? whiteInCheck : blackInCheck;
    return getLegalMoves(position, rowIndex, colIndex, inCheck, turn);
  };

  // Handle clicking a piece to select it or move to a target
  const handleSquareClick = (rowIndex: number, colIndex: number) => {
    const targetPiece = position[rowIndex][colIndex];

    // If no piece is selected and clicking on own piece
    if (!selectedPiece && targetPiece && targetPiece.charAt(0) === turn) {
      dispatch(selectPiece({ rowIndex, colIndex }));
      return;
    }

    // If a piece is already selected
    if (selectedPiece) {
      const sourcePiece =
        position[selectedPiece.rowIndex][selectedPiece.colIndex];

      // If clicking on another own piece, select it instead
      if (targetPiece && targetPiece.charAt(0) === turn) {
        dispatch(selectPiece({ rowIndex, colIndex }));
        return;
      }

      // Otherwise try to move the selected piece to the target
      if (
        checkMoves({
          piece: sourcePiece,
          sourceCol: selectedPiece.colIndex,
          sourceRow: selectedPiece.rowIndex,
          targetCol: colIndex,
          targetRow: rowIndex,
          position,
        })
      ) {
        dispatch(
          movePiece({
            sourceRowIndex: selectedPiece.rowIndex,
            sourceColIndex: selectedPiece.colIndex,
            targetRowIndex: rowIndex,
            targetColIndex: colIndex,
          })
        );
      } else {
        // Deselect if invalid move
        dispatch(selectPiece({ rowIndex: null, colIndex: null }));
      }
    }
  };

  // Get all candidate moves for the selected piece
  const candidateMoves = getCandidateMoves();

  return (
    <div className="relative w-[calc(8*var(--tile-size))] h-[calc(8*var(--tile-size))] max-w-[90%] max-h-[90%] select-none touch-none">
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
        {boardArray.map((row, rowIndex) =>
          row.map((_, colIndex) => {
            const piece = position[rowIndex][colIndex];
            const isHidden = shouldHidePiece(rowIndex, colIndex);
            const isDraggable = piece && canDragPiece(piece);
            const isSelected =
              selectedPiece &&
              selectedPiece.rowIndex === rowIndex &&
              selectedPiece.colIndex === colIndex;

            // Is this square a candidate move?
            const isCandidateMove = candidateMoves.some(
              (move) => move.row === rowIndex && move.col === colIndex
            );

            // Check if king is in check
            const isKingInCheck =
              (whiteInCheck && piece === "wk") ||
              (blackInCheck && piece === "bk");

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`relative min-h-[var(--tile-size)] min-w-[var(--tile-size)] 
                  ${
                    (rowIndex + colIndex) % 2 === 0
                      ? "bg-tile-light"
                      : "bg-tile-dark"
                  }
                  ${isSelected ? "ring-4 ring-blue-400 ring-inset" : ""}
                  ${isKingInCheck ? "king-in-check" : ""}`}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                data-row={rowIndex}
                data-col={colIndex}
              >
                {/* Show candidate move indicator */}
                {isCandidateMove && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className={piece ? "capture-indicator" : "move-indicator"}
                      style={{
                        width: piece ? "calc(100% - 10px)" : "30%",
                        height: piece ? "calc(100% - 10px)" : "30%",
                        borderRadius: "50%",
                        backgroundColor: piece ? "transparent" : "#555",
                        border: piece ? "3px solid #FFCC00" : "none",
                        opacity: 0.6,
                      }}
                    />
                  </div>
                )}

                {/* Render piece */}
                {piece && (
                  <div
                    className={`absolute inset-0 w-full h-full z-10 
                      ${
                        isDraggable
                          ? "cursor-grab active:cursor-grabbing"
                          : "cursor-default"
                      } 
                      ${isHidden ? "opacity-30" : ""}`}
                    draggable={!!isDraggable}
                    onDragStart={(e) =>
                      handleDragStart(e, piece, rowIndex, colIndex)
                    }
                    onDragEnd={handleDragEnd}
                    data-draggable={isDraggable}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={`/pieces/${piece}.svg`}
                        alt={piece}
                        fill
                        className="object-contain pointer-events-none"
                        priority={true}
                        draggable={false}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Promotion box */}
      <PromotionBox />
    </div>
  );
}

export default Board;
