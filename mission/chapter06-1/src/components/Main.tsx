export default function Main() {
  return (
    <main className="main">
      <div className="album-grid">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className={`album-card ${i % 7 === 3 ? "highlight" : ""}`}
          >
            <img
              src={`https://picsum.photos/400?random=${i}`}
              alt={`album-${i}`}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
