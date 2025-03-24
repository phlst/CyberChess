"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import Image from "next/image";
import { useState } from "react";
import { movePiece } from "@/app/store/gameState/gameState";

function Board() {
  const position = useSelector((state: RootState) => state.gameState.position);
  const dispatch = useDispatch();
  const [draggedPiece, setDraggedPiece] = useState<{
    piece: string;
    rowIndex: number;
    colIndex: number;
  } | null>(null);

  // Create the 8x8 board array
  const boardArray = Array.from({ length: 8 }, () => new Array(8).fill(null));

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    piece: string,
    rowIndex: number,
    colIndex: number
  ) => {
    e.stopPropagation();
    console.log("Drag start:", piece, rowIndex, colIndex);

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
      const { rowIndex: sourceRow, colIndex: sourceCol } = draggedPiece;

      console.log(
        `Moving piece from [${sourceRow},${sourceCol}] to [${targetRow},${targetCol}]`
      );

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
        setDraggedPiece(null);
      }
    } else {
      console.log("No drag data available");
    }
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
                    className={`absolute inset-0 w-full h-full z-10 cursor-grab active:cursor-grabbing ${
                      isHidden ? "opacity-30" : ""
                    }`}
                    draggable={true}
                    onDragStart={(e) =>
                      handleDragStart(e, piece, rowIndex, colIndex)
                    }
                    onDragEnd={handleDragEnd}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={`/pieces/${piece}.svg`}
                        alt={piece}
                        fill
                        className="object-contain"
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
