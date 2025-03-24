"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import Piece from "./Piece";

function Pieces() {
  const position = useSelector((state: RootState) => state.gameState.position);

  return (
    <div
      className="absolute top-0 left-0 w-full h-full grid grid-cols-8 grid-rows-8"
      style={{ zIndex: 5 }}
    >
      {position.map((row, rowIndex) =>
        row.map(
          (piece, colIndex) =>
            piece && (
              <Piece
                colIndex={colIndex}
                rowIndex={rowIndex}
                piece={piece}
                key={`${rowIndex}-${colIndex}-${piece}`}
              />
            )
        )
      )}
    </div>
  );
}

export default Pieces;
