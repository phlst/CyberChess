function Board() {
  const boardArray = Array.from({ length: 8 }, () => new Array(8).fill(null));
  return (
    <div className="grid grid-cols-8 grid-rows-8 w-[calc(8*var(--tile-size))] h-[calc(8*var(--tile-size))] max-w-[90%] max-h-[90%]">
      {boardArray.map((row, rowIndex) =>
        row.map((tile, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`${
              (rowIndex + colIndex) % 2 == 0 ? "bg-tile-light" : "bg-tile-dark"
            }`}
          >
            {rowIndex}
            {colIndex}
          </div>
        ))
      )}
    </div>
  );
}

export default Board;
