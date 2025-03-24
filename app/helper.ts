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
