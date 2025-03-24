import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { findKing } from "@/app/arbiter/checkDetection";

const CheckIndicator = () => {
  const position = useSelector((state: RootState) => state.gameState.position);
  const whiteInCheck = useSelector(
    (state: RootState) => state.gameState.whiteInCheck
  );
  const blackInCheck = useSelector(
    (state: RootState) => state.gameState.blackInCheck
  );

  // Get king positions
  const whiteKingPos = findKing(position, "w");
  const blackKingPos = findKing(position, "b");

  return (
    <>
      {whiteInCheck && whiteKingPos && (
        <div
          className="absolute check-indicator pulse-animation"
          style={{
            top: `calc(${whiteKingPos.row} * var(--tile-size))`,
            left: `calc(${whiteKingPos.col} * var(--tile-size))`,
            width: "var(--tile-size)",
            height: "var(--tile-size)",
            backgroundColor: "rgba(255, 0, 0, 0.4)",
            boxShadow: "inset 0 0 0 3px rgba(255, 0, 0, 0.7)",
            borderRadius: "50%",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />
      )}

      {blackInCheck && blackKingPos && (
        <div
          className="absolute check-indicator pulse-animation"
          style={{
            top: `calc(${blackKingPos.row} * var(--tile-size))`,
            left: `calc(${blackKingPos.col} * var(--tile-size))`,
            width: "var(--tile-size)",
            height: "var(--tile-size)",
            backgroundColor: "rgba(255, 0, 0, 0.4)",
            boxShadow: "inset 0 0 0 3px rgba(255, 0, 0, 0.7)",
            borderRadius: "50%",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />
      )}
    </>
  );
};

export default CheckIndicator;
