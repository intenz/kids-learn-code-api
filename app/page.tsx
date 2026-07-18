export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Kids Learn Code API</h1>
      <p>API server is running.</p>
      <ul>
        <li>
          <a href="/api/health">GET /api/health</a>
        </li>
        <li>
          <a href="/api/cards">GET /api/cards</a>
        </li>
      </ul>
    </main>
  );
}
