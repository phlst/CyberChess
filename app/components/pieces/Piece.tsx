import { RootState } from "@/app/store/store";
import Image from "next/image";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectPiece } from "@/app/store/gameState/gameState";

type PieceProps = {
  rowIndex: number;
  colIndex: number;
  piece: string;
};

function Piece({ rowIndex, colIndex, piece }: PieceProps) {
  const turn = useSelector((state: RootState) => state.gameState.turn);
  const selectedPiece = useSelector(
    (state: RootState) => state.gameState.selectedPiece
  );
  const isSelected =
    selectedPiece &&
    selectedPiece.rowIndex === rowIndex &&
    selectedPiece.colIndex === colIndex;
  const dispatch = useDispatch();

  const draggable = turn === piece.charAt(0);
  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!draggable) {
      e.preventDefault();
      return;
    }

    // Set drag data
    const stringData = JSON.stringify({
      piece,
      rowIndex,
      colIndex,
    });

    try {
      e.dataTransfer.setData("text/plain", stringData);
    } catch (err) {
      console.error("Error setting drag data:", err);
    }

    // Set drag appearance
    e.dataTransfer.effectAllowed = "move";

    setIsDragging(true);

    // Select the piece
    dispatch(selectPiece({ rowIndex, colIndex }));
  };

  const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);

    // If the drag was cancelled (not dropped on a valid target)
    if (e.dataTransfer.dropEffect === "none") {
      // Deselect the piece
      dispatch(selectPiece({ rowIndex: null, colIndex: null }));
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (draggable) {
      dispatch(
        selectPiece({
          rowIndex: isSelected ? null : rowIndex,
          colIndex: isSelected ? null : colIndex,
        })
      );
    }
  };

  return (
    <div
      className={`piece absolute ${isDragging ? "opacity-50" : ""}`}
      style={{
        width: "var(--tile-size)",
        height: "var(--tile-size)",
        top: `calc(${rowIndex} * var(--tile-size))`,
        left: `calc(${colIndex} * var(--tile-size))`,
        cursor: draggable ? "grab" : "default",
        zIndex: isSelected ? 45 : 40,
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={handleClick}
    >
      <Image
        src={`/pieces/${piece}.svg`}
        alt={piece}
        fill
        className="pointer-events-none"
        priority={true}
        draggable={false}
      />
    </div>
  );
}

export default Piece;
