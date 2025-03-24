import { getAvailableMoves } from "./availableMoves";

// Find the position of a king of the specified color
export function findKing(
  position: string[][],
  color: string
): { row: number; col: number } | null {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = position[row][col];
      if (piece === `${color}k`) {
        return { row, col };
      }
    }
  }
  return null; // Should never happen in a valid chess position
}

// Check if the specified king is in check
export function isInCheck(position: string[][], kingColor: string): boolean {
  const kingPos = findKing(position, kingColor);
  if (!kingPos) return false;

  const opponentColor = kingColor === "w" ? "b" : "w";

  // Check if any opponent piece can attack the king
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = position[row][col];
      if (piece && piece.charAt(0) === opponentColor) {
        const moves = getAvailableMoves(position, row, col);
        if (
          moves.some(
            (move) => move.row === kingPos.row && move.col === kingPos.col
          )
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

// Simulate a move and check if it resolves a check situation
export function moveResolvesCheck(
  position: string[][],
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  kingColor: string
): boolean {
  // Create a deep copy of the position
  const newPosition = position.map((row) => [...row]);

  // Simulate the move
  newPosition[toRow][toCol] = newPosition[fromRow][fromCol];
  newPosition[fromRow][fromCol] = "";

  // Check if the king is safe after the move
  const kingStillInCheck = isInCheck(newPosition, kingColor);

  // Debugging
  if (kingStillInCheck) {
    console.log(
      `Move from ${fromRow},${fromCol} to ${toRow},${toCol} doesn't resolve check`
    );
  }

  return !kingStillInCheck;
}

// Get all legal moves for a piece that resolve a check (if in check)
export function getLegalMoves(
  position: string[][],
  row: number,
  col: number,
  inCheck: boolean,
  kingColor: string
): { row: number; col: number }[] {
  const piece = position[row][col];
  if (!piece || piece.charAt(0) !== kingColor) {
    return [];
  }

  const candidateMoves = getAvailableMoves(position, row, col);

  // Filter moves to only those that don't leave/put the king in check
  return candidateMoves.filter((move) =>
    moveResolvesCheck(position, row, col, move.row, move.col, kingColor)
  );
}
