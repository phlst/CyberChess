function Files() {
  const files = new Array(8);

  return (
    <div>
      {files.map((_, index) => (
        <span key={index}>{index}</span>
      ))}
    </div>
  );
}

export default Files;
