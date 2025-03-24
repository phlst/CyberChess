import { PIECE_MOVES, isSlidingPiece } from "../helper";
import { isWithinBounds } from "./checkMoves";

// Get all valid moves for a specific piece at a given position
export function getAvailableMoves(
  position: string[][],
  sourceRow: number,
  sourceCol: number
): { row: number; col: number }[] {
  const piece = position[sourceRow][sourceCol];
  if (!piece) return [];

  const pieceType = piece.charAt(1).toLowerCase();
  const pieceColor = piece.charAt(0);
  const availableMoves: { row: number; col: number }[] = [];

  // For pawns
  if (pieceType === "p") {
    const direction = pieceColor === "w" ? -1 : 1;
    const startRow = pieceColor === "w" ? 6 : 1;

    // Forward one square
    const newRow = sourceRow + direction;
    if (isWithinBounds(sourceCol, newRow) && !position[newRow][sourceCol]) {
      availableMoves.push({ row: newRow, col: sourceCol });

      // First move can go two squares
      if (sourceRow === startRow) {
        const twoAheadRow = sourceRow + 2 * direction;
        if (!position[newRow][sourceCol] && !position[twoAheadRow][sourceCol]) {
          availableMoves.push({ row: twoAheadRow, col: sourceCol });
        }
      }
    }

    // Capture diagonally
    const captureDirections =
      pieceColor === "w"
        ? PIECE_MOVES.PAWN_MOVES.WHITE.CAPTURES
        : PIECE_MOVES.PAWN_MOVES.BLACK.CAPTURES;

    for (const [dx, dy] of captureDirections) {
      const newCol = sourceCol + dx;
      const newRow = sourceRow + dy;

      if (isWithinBounds(newCol, newRow)) {
        const targetPiece = position[newRow][newCol];
        if (targetPiece && targetPiece.charAt(0) !== pieceColor) {
          availableMoves.push({ row: newRow, col: newCol });
        }
      }
    }

    return availableMoves;
  }

  // For sliding pieces (rook, bishop, queen)
  if (isSlidingPiece(piece)) {
    let directions: number[][] = [];

    if (pieceType === "r") directions = PIECE_MOVES.ROOK_DIRECTIONS;
    else if (pieceType === "b") directions = PIECE_MOVES.BISHOP_DIRECTIONS;
    else if (pieceType === "q") directions = PIECE_MOVES.QUEEN_DIRECTIONS;

    for (const [dx, dy] of directions) {
      let newCol = sourceCol + dx;
      let newRow = sourceRow + dy;

      while (isWithinBounds(newCol, newRow)) {
        const targetPiece = position[newRow][newCol];

        if (!targetPiece) {
          // Empty square - valid move
          availableMoves.push({ row: newRow, col: newCol });
        } else {
          // Hit a piece
          if (targetPiece.charAt(0) !== pieceColor) {
            // Enemy piece - can capture
            availableMoves.push({ row: newRow, col: newCol });
          }
          break; // Stop in this direction after hitting any piece
        }

        newCol += dx;
        newRow += dy;
      }
    }

    return availableMoves;
  }

  // For fixed-move pieces (knight, king)
  let moveSet: number[][] = [];

  if (pieceType === "n") moveSet = PIECE_MOVES.KNIGHT_MOVES;
  else if (pieceType === "k") moveSet = PIECE_MOVES.KING_MOVES;

  for (const [dx, dy] of moveSet) {
    const newCol = sourceCol + dx;
    const newRow = sourceRow + dy;

    if (isWithinBounds(newCol, newRow)) {
      const targetPiece = position[newRow][newCol];

      // Can move to empty square or capture opponent's piece
      if (!targetPiece || targetPiece.charAt(0) !== pieceColor) {
        availableMoves.push({ row: newRow, col: newCol });
      }
    }
  }

  return availableMoves;
}
