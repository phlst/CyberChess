import { moveResolvesCheck, isInCheck } from "./checkDetection";

type checkMovesProps = {
  piece: string;
  sourceCol: number;
  sourceRow: number;
  targetCol: number;
  targetRow: number;
  position: string[][];
};

export function checkMoves({
  piece,
  sourceCol,
  sourceRow,
  targetCol,
  targetRow,
  position,
}: checkMovesProps): boolean {
  // Get the piece type and color
  const pieceType = piece.charAt(1).toLowerCase();
  const pieceColor = piece.charAt(0);

  // Check if target has a piece of the same color (can't capture your own pieces)
  const targetPiece = position[targetRow][targetCol];
  if (targetPiece && targetPiece.charAt(0) === pieceColor) {
    return false; // Can't capture your own pieces
  }

  // Check basic move validity by piece type
  let isMoveValid = false;

  switch (pieceType) {
    case "p": // Pawn
      isMoveValid = isPawnMoveValid(
        pieceColor,
        sourceCol,
        sourceRow,
        targetCol,
        targetRow,
        position
      );
      break;
    case "r": // Rook
      isMoveValid = isRookMoveValid(
        sourceCol,
        sourceRow,
        targetCol,
        targetRow,
        position
      );
      break;
    case "n": // Knight
      isMoveValid = isKnightMoveValid(
        sourceCol,
        sourceRow,
        targetCol,
        targetRow
      );
      break;
    case "b": // Bishop
      isMoveValid = isBishopMoveValid(
        sourceCol,
        sourceRow,
        targetCol,
        targetRow,
        position
      );
      break;
    case "q": // Queen
      isMoveValid = isQueenMoveValid(
        sourceCol,
        sourceRow,
        targetCol,
        targetRow,
        position
      );
      break;
    case "k": // King
      isMoveValid = isKingMoveValid(sourceCol, sourceRow, targetCol, targetRow);
      break;
    default:
      return false;
  }

  // If the move is invalid according to piece movement rules, reject it
  if (!isMoveValid) {
    return false;
  }

  // Now, check if the king is in check and if this move resolves it
  const kingInCheck = isInCheck(position, pieceColor);

  if (kingInCheck) {
    // If the king is in check, only allow moves that resolve the check
    return moveResolvesCheck(
      position,
      sourceRow,
      sourceCol,
      targetRow,
      targetCol,
      pieceColor
    );
  }

  // If not in check, we need to verify this move doesn't put the king in check
  return moveResolvesCheck(
    position,
    sourceRow,
    sourceCol,
    targetRow,
    targetCol,
    pieceColor
  );
}

// Pawn moves depend on color (white moves up, black moves down)
function isPawnMoveValid(
  color: string,
  sourceCol: number,
  sourceRow: number,
  targetCol: number,
  targetRow: number,
  position: string[][]
): boolean {
  const colDiff = targetCol - sourceCol;
  const rowDiff = targetRow - sourceRow;
  const targetPiece = position[targetRow][targetCol];
  const isCapture = !!targetPiece;

  // Check if the pawn is moving to the promotion rank

  // White pawns move up (negative row diff)
  if (color === "w") {
    // Regular forward move (1 square)
    if (colDiff === 0 && rowDiff === -1 && !isCapture) {
      return true;
    }

    // First move can be 2 squares if path is clear
    if (colDiff === 0 && rowDiff === -2 && sourceRow === 6 && !isCapture) {
      // Check if the path is clear
      return !position[sourceRow - 1][sourceCol];
    }

    // Capture diagonally
    if (Math.abs(colDiff) === 1 && rowDiff === -1 && isCapture) {
      return targetPiece.charAt(0) !== color; // Make sure it's an opponent's piece
    }
  }
  // Black pawns move down (positive row diff)
  else if (color === "b") {
    // Regular move (1 square forward)
    if (colDiff === 0 && rowDiff === 1 && !isCapture) {
      return true;
    }

    // First move can be 2 squares if path is clear
    if (colDiff === 0 && rowDiff === 2 && sourceRow === 1 && !isCapture) {
      // Check if the path is clear
      return !position[sourceRow + 1][sourceCol];
    }

    // Capture diagonally
    if (Math.abs(colDiff) === 1 && rowDiff === 1 && isCapture) {
      return targetPiece.charAt(0) !== color; // Make sure it's an opponent's piece
    }
  }

  return false;
}

// Check if the path is clear for sliding pieces
function isPathClear(
  sourceCol: number,
  sourceRow: number,
  targetCol: number,
  targetRow: number,
  position: string[][]
): boolean {
  const deltaX = Math.sign(targetCol - sourceCol);
  const deltaY = Math.sign(targetRow - sourceRow);

  let currCol = sourceCol + deltaX;
  let currRow = sourceRow + deltaY;

  // Move step by step until we reach the target (but not including it)
  while (currCol !== targetCol || currRow !== targetRow) {
    if (position[currRow][currCol]) {
      return false; // Path is blocked
    }
    currCol += deltaX;
    currRow += deltaY;
  }

  return true;
}

// Rook moves horizontally or vertically any number of squares
function isRookMoveValid(
  sourceCol: number,
  sourceRow: number,
  targetCol: number,
  targetRow: number,
  position: string[][]
): boolean {
  // Either the column or row must stay the same for a valid rook move
  const isValidDirection = sourceCol === targetCol || sourceRow === targetRow;

  if (!isValidDirection) {
    return false;
  }

  // Check if path to target is clear
  return isPathClear(sourceCol, sourceRow, targetCol, targetRow, position);
}

// Knight moves in an L-shape: 2 squares in one direction and 1 square perpendicular
function isKnightMoveValid(
  sourceCol: number,
  sourceRow: number,
  targetCol: number,
  targetRow: number
): boolean {
  const colDiff = Math.abs(targetCol - sourceCol);
  const rowDiff = Math.abs(targetRow - sourceRow);

  // Knight moves 2 squares in one direction and 1 in the other
  return (colDiff === 2 && rowDiff === 1) || (colDiff === 1 && rowDiff === 2);
}

// Bishop moves diagonally any number of squares
function isBishopMoveValid(
  sourceCol: number,
  sourceRow: number,
  targetCol: number,
  targetRow: number,
  position: string[][]
): boolean {
  // For diagonal movement, the absolute difference between columns and rows must be equal
  const colDiff = Math.abs(targetCol - sourceCol);
  const rowDiff = Math.abs(targetRow - sourceRow);

  const isValidDirection = colDiff === rowDiff && colDiff > 0;

  if (!isValidDirection) {
    return false;
  }

  // Check if path to target is clear
  return isPathClear(sourceCol, sourceRow, targetCol, targetRow, position);
}

// Queen combines rook and bishop movements
function isQueenMoveValid(
  sourceCol: number,
  sourceRow: number,
  targetCol: number,
  targetRow: number,
  position: string[][]
): boolean {
  // Queen can move like a rook (horizontally/vertically) or like a bishop (diagonally)
  return (
    isRookMoveValid(sourceCol, sourceRow, targetCol, targetRow, position) ||
    isBishopMoveValid(sourceCol, sourceRow, targetCol, targetRow, position)
  );
}

// King moves one square in any direction
function isKingMoveValid(
  sourceCol: number,
  sourceRow: number,
  targetCol: number,
  targetRow: number
): boolean {
  const colDiff = Math.abs(targetCol - sourceCol);
  const rowDiff = Math.abs(targetRow - sourceRow);

  // King can move exactly one square in any direction
  return colDiff <= 1 && rowDiff <= 1 && (colDiff > 0 || rowDiff > 0);
}

// Helper function to check if a position is within the bounds of the chessboard
export function isWithinBounds(col: number, row: number): boolean {
  return col >= 0 && col < 8 && row >= 0 && row < 8;
}
