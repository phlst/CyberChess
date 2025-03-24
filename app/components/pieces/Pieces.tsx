"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import Piece from "./Piece";

function Pieces() {
  const position = useSelector((state: RootState) => state.gameState.position);

  return (
    <div className="absolute inset-0 w-full h-full">
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
