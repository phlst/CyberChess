import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { getLegalMoves } from "@/app/arbiter/checkDetection";

type CandidateMovesProps = {
  onSelectMove: (row: number, col: number) => void;
};

const CandidateMoves = ({ onSelectMove }: CandidateMovesProps) => {
  const position = useSelector((state: RootState) => state.gameState.position);
  const selectedPiece = useSelector(
    (state: RootState) => state.gameState.selectedPiece
  );
  const turn = useSelector((state: RootState) => state.gameState.turn);
  const whiteInCheck = useSelector(
    (state: RootState) => state.gameState.whiteInCheck
  );
  const blackInCheck = useSelector(
    (state: RootState) => state.gameState.blackInCheck
  );

  if (!selectedPiece) return null;

  const { rowIndex, colIndex } = selectedPiece;
  const inCheck = turn === "w" ? whiteInCheck : blackInCheck;
  const moves = getLegalMoves(position, rowIndex, colIndex, inCheck, turn);

  return (
    <>
      {moves.map((move, index) => {
        const hasPiece = !!position[move.row][move.col];

        return (
          <div
            key={`candidate-${index}-${move.row}-${move.col}`}
            className="absolute pointer-events-auto candidate-move"
            style={{
              top: `calc(${move.row} * var(--tile-size))`,
              left: `calc(${move.col} * var(--tile-size))`,
              width: "var(--tile-size)",
              height: "var(--tile-size)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 25, // Higher than the board, lower than pieces
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectMove(move.row, move.col);
            }}
          >
            <div
              className={hasPiece ? "capture-indicator" : "move-indicator"}
              style={{
                width: hasPiece
                  ? "calc(var(--tile-size) - 8px)"
                  : "calc(var(--tile-size) * 0.3)",
                height: hasPiece
                  ? "calc(var(--tile-size) - 8px)"
                  : "calc(var(--tile-size) * 0.3)",
                borderRadius: "50%",
                opacity: "0.7",
                border: hasPiece ? "3px solid #FFCC00" : "none",
                backgroundColor: hasPiece ? "transparent" : "#555555",
              }}
            />
          </div>
        );
      })}
    </>
  );
};

export default CandidateMoves;
