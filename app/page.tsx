export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Voodu ElevenLabs Bridge</h1>
      <p>
        API-only Next.js project. Call endpoints under <code>/api/*</code> to
        forward requests to the ElevenLabs API. Set
        <code> ELEVENLABS_API_KEY </code> in your environment.
      </p>
    </main>
  );
}
