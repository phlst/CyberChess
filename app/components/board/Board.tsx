"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import Image from "next/image";
import { useState } from "react";
import { movePiece } from "@/app/store/gameState/gameState";

function Board() {
  const position = useSelector((state: RootState) => state.gameState.position);
  const turn = useSelector((state: RootState) => state.gameState.turn);
  const dispatch = useDispatch();
  const [draggedPiece, setDraggedPiece] = useState<{
    piece: string;
    rowIndex: number;
    colIndex: number;
  } | null>(null);

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

    // Set which piece is being dragged
    setDraggedPiece({ piece, rowIndex, colIndex });

    // Let the browser handle the drag image naturally
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDraggedPiece(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetRow: number,
    targetCol: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedPiece) {
      const { rowIndex: sourceRow, colIndex: sourceCol, piece } = draggedPiece;

      // Only allow the drop if it's this piece's turn
      if (!canDragPiece(piece)) {
        return;
      }

      // Dispatch action to move the piece in the Redux store
      if (sourceCol !== targetCol || sourceRow !== targetRow) {
        dispatch(
          movePiece({
            sourceRowIndex: sourceRow,
            sourceColIndex: sourceCol,
            targetRowIndex: targetRow,
            targetColIndex: targetCol,
          })
        );
      }
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

  return (
    <div className="relative w-[calc(8*var(--tile-size))] h-[calc(8*var(--tile-size))] max-w-[90%] max-h-[90%] select-none touch-none">
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
        {boardArray.map((row, rowIndex) =>
          row.map((_, colIndex) => {
            const piece = position[rowIndex][colIndex];
            const isHidden = shouldHidePiece(rowIndex, colIndex);
            const isDraggable = piece && canDragPiece(piece);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`relative min-h-[var(--tile-size)] min-w-[var(--tile-size)] ${
                  (rowIndex + colIndex) % 2 === 0
                    ? "bg-tile-light"
                    : "bg-tile-dark"
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                data-row={rowIndex}
                data-col={colIndex}
              >
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
    </div>
  );
}

export default Board;
