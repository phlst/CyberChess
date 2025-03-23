function Ranks() {
  const ranks = new Array(8);
  return (
    <div>
      {ranks.map((_, i) => (
        <span key={i}>{i}</span>
      ))}
    </div>
  );
}

export default Ranks;
