export function initialPosition() {
  const position: string[][] = Array.from({ length: 8 }, () =>
    Array(8).fill("")
  );

  // White pawns (row 6)
  position[6][0] = "wp";
  position[6][1] = "wp";
  position[6][2] = "wp";
  position[6][3] = "wp";
  position[6][4] = "wp";
  position[6][5] = "wp";
  position[6][6] = "wp";
  position[6][7] = "wp";

  // Black pawns (row 1)
  position[1][0] = "bp";
  position[1][1] = "bp";
  position[1][2] = "bp";
  position[1][3] = "bp";
  position[1][4] = "bp";
  position[1][5] = "bp";
  position[1][6] = "bp";
  position[1][7] = "bp";

  // White pieces (row 7)
  position[7][0] = "wr";
  position[7][1] = "wn";
  position[7][2] = "wb";
  position[7][3] = "wq";
  position[7][4] = "wk";
  position[7][5] = "wb";
  position[7][6] = "wn";
  position[7][7] = "wr";

  // Black pieces (row 0)
  position[0][0] = "br";
  position[0][1] = "bn";
  position[0][2] = "bb";
  position[0][3] = "bq";
  position[0][4] = "bk";
  position[0][5] = "bb";
  position[0][6] = "bn";
  position[0][7] = "br";

  return position;
}

// Movement directions for chess pieces
export const PIECE_MOVES = {
  // Rook moves horizontally and vertically
  ROOK_DIRECTIONS: [
    [0, 1], // up
    [0, -1], // down
    [1, 0], // right
    [-1, 0], // left
  ],

  // Bishop moves diagonally
  BISHOP_DIRECTIONS: [
    [1, 1], // up-right
    [1, -1], // down-right
    [-1, 1], // up-left
    [-1, -1], // down-left
  ],

  // Queen combines rook and bishop moves
  QUEEN_DIRECTIONS: [
    // Horizontal and vertical (rook-like)
    [0, 1], // up
    [0, -1], // down
    [1, 0], // right
    [-1, 0], // left
    // Diagonal (bishop-like)
    [1, 1], // up-right
    [1, -1], // down-right
    [-1, 1], // up-left
    [-1, -1], // down-left
  ],

  // Knight moves in L-shape
  KNIGHT_MOVES: [
    [2, 1], // right 2, up 1
    [2, -1], // right 2, down 1
    [-2, 1], // left 2, up 1
    [-2, -1], // left 2, down 1
    [1, 2], // right 1, up 2
    [1, -2], // right 1, down 2
    [-1, 2], // left 1, up 2
    [-1, -2], // left 1, down 2
  ],

  // King moves one square in any direction
  KING_MOVES: [
    [0, 1], // up
    [0, -1], // down
    [1, 0], // right
    [-1, 0], // left
    [1, 1], // up-right
    [1, -1], // down-right
    [-1, 1], // up-left
    [-1, -1], // down-left
  ],

  // Pawn moves by color
  PAWN_MOVES: {
    WHITE: {
      NORMAL: [0, -1], // up one square
      FIRST_MOVE: [0, -2], // up two squares
      CAPTURES: [
        [1, -1], // capture diagonally right
        [-1, -1], // capture diagonally left
      ],
    },
    BLACK: {
      NORMAL: [0, 1], // down one square
      FIRST_MOVE: [0, 2], // down two squares
      CAPTURES: [
        [1, 1], // capture diagonally right
        [-1, 1], // capture diagonally left
      ],
    },
  },
};

// Helper function to get all candidate moves for a piece
export function getMovementDirections(piece: string): number[][] {
  const pieceType = piece.charAt(1).toLowerCase();
  const color = piece.charAt(0);

  switch (pieceType) {
    case "r":
      return PIECE_MOVES.ROOK_DIRECTIONS;
    case "b":
      return PIECE_MOVES.BISHOP_DIRECTIONS;
    case "q":
      return PIECE_MOVES.QUEEN_DIRECTIONS;
    case "n":
      return PIECE_MOVES.KNIGHT_MOVES;
    case "k":
      return PIECE_MOVES.KING_MOVES;
    case "p":
      return color === "w"
        ? [...PIECE_MOVES.PAWN_MOVES.WHITE.CAPTURES]
        : [...PIECE_MOVES.PAWN_MOVES.BLACK.CAPTURES];
    default:
      return [];
  }
}

// Helper to determine if a piece can move in sliding directions (rook, bishop, queen)
export function isSlidingPiece(piece: string): boolean {
  const pieceType = piece.charAt(1).toLowerCase();
  return pieceType === "r" || pieceType === "b" || pieceType === "q";
}
