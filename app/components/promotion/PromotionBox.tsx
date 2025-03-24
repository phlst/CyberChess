import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { promotePawn, cancelPromotion } from "@/app/store/gameState/gameState";
import Image from "next/image";
import { useEffect, useState } from "react";

const PROMOTION_PIECES = ["q", "r", "b", "n"]; // Queen, Rook, Bishop, Knight
const TILE_SIZE = "var(--tile-size)"; // Match your chess board tile size

const PromotionBox = () => {
  const dispatch = useDispatch();
  const pendingPromotion = useSelector(
    (state: RootState) => state.gameState.pendingPromotion
  );
  const turn = useSelector((state: RootState) => state.gameState.turn);
  const [position, setPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (pendingPromotion) {
      // Position the promotion box outside the chessboard
      const colPosition = pendingPromotion.col;

      // Calculate left position based on the column
      const leftPosition =
        colPosition *
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--tile-size"
          )
        );

      // Position outside the board (above or below based on which side is promoting)
      const isTopRow = pendingPromotion.row === 0; // White promotion at top row

      // Position vertically outside the board
      const topPosition = isTopRow
        ? -1 *
            parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue(
                "--tile-size"
              )
            ) -
          8 // Place above the board for white promotion
        : 8 *
            parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue(
                "--tile-size"
              )
            ) +
          8; // Place below the board for black promotion

      setPosition({
        left: leftPosition,
        top: topPosition,
      });
    }
  }, [pendingPromotion]);

  if (!pendingPromotion) return null;

  const handlePromote = (piece: string) => {
    dispatch(
      promotePawn({
        row: pendingPromotion.row,
        col: pendingPromotion.col,
        promoteTo: piece,
      })
    );
  };

  // Don't use a backdrop that covers the board
  const handleClickOutside = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(cancelPromotion());
  };

  return (
    <>
      {/* Promotion box positioned outside the chessboard */}
      <div
        className="absolute z-50 bg-white rounded-md shadow-lg border border-gray-300 flex"
        style={{
          left: position.left,
          top: position.top,
          width: `calc(${TILE_SIZE} * 4)`, // Make it wide enough for all pieces
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {PROMOTION_PIECES.map((piece) => (
          <div
            key={piece}
            className="p-1 flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-colors"
            style={{
              width: `calc(${TILE_SIZE})`,
              height: `calc(${TILE_SIZE})`,
            }}
            onClick={() => handlePromote(piece)}
          >
            <div className="relative w-full h-full">
              <Image
                src={`/pieces/${turn}${piece}.svg`}
                alt={`${turn}${piece}`}
                fill
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add a visible indicator on the promotion square */}
      <div
        className="absolute border-2 border-yellow-400 z-30 pointer-events-none"
        style={{
          left: `calc(${pendingPromotion.col} * ${TILE_SIZE})`,
          top: `calc(${pendingPromotion.row} * ${TILE_SIZE})`,
          width: TILE_SIZE,
          height: TILE_SIZE,
        }}
      />

      {/* Add a small click-away area without blocking the board */}
      <div
        className="fixed inset-0 z-40 pointer-events-auto cursor-pointer"
        style={{ background: "transparent" }}
        onClick={handleClickOutside}
      />
    </>
  );
};

export default PromotionBox;
