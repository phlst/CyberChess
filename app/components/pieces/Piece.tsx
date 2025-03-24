import { RootState } from "@/app/store/store";
import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";

type PieceProps = {
  rowIndex: number;
  colIndex: number;
  piece: string;
};

function Piece({ rowIndex, colIndex, piece }: PieceProps) {
  const turn = useSelector((state: RootState) => state.gameState.turn);
  const draggable = turn === piece.split("")[0];
  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("Drag started:", rowIndex, colIndex, piece);

    const data = JSON.stringify({
      piece,
      rowIndex,
      colIndex,
    });

    e.dataTransfer.setData("application/json", data);
    e.dataTransfer.effectAllowed = "move";

    setIsDragging(true);
  };

  const onDragEnd = () => {
    console.log("Drag ended");
    setIsDragging(false);
  };

  return (
    <div
      className={`chess-piece ${
        isDragging ? "opacity-0" : ""
      } absolute w-[var(--tile-size)] h-[var(--tile-size)]`}
      style={{
        gridRowStart: rowIndex + 1,
        gridColumnStart: colIndex + 1,
        gridRowEnd: rowIndex + 2,
        gridColumnEnd: colIndex + 2,
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <Image
        src={`/pieces/${piece}.svg`}
        alt={piece}
        fill
        className="object-contain"
        priority={true}
      />
    </div>
  );
}

export default Piece;
