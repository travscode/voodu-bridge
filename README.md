# Voodu ElevenLabs Bridge

API-only Next.js app that mirrors every ElevenLabs endpoint. Requests to `/api/*` are forwarded to the ElevenLabs API with your configured key.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file:
   ```bash
   ELEVENLABS_API_KEY=your_xi_api_key
   # Optional if you want to point at a different upstream (staging, mock, etc.)
   # ELEVENLABS_BASE_URL=https://api.elevenlabs.io/
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Call any ElevenLabs path through the bridge. Examples:
   ```bash
   # List voices (mirrors GET https://api.elevenlabs.io/v1/voices)
   curl -H "xi-api-key: $ELEVENLABS_API_KEY" http://localhost:3000/api/v1/voices

   # Agent API example (mirrors POST https://api.elevenlabs.io/v1/agents)
   curl -X POST http://localhost:3000/api/v1/agents \
     -H "Content-Type: application/json" \
     -H "xi-api-key: $ELEVENLABS_API_KEY" \
     -d '{"name":"My agent","voice_id":"VOICE_ID"}'
   ```

## How it works

- `app/api/[[...slug]]/route.ts` is a catch-all proxy. Any path after `/api/` is forwarded to `https://api.elevenlabs.io/` (or `ELEVENLABS_BASE_URL` if set).
- Your provided `xi-api-key` header is passed through; if you omit it, the value from `ELEVENLABS_API_KEY` is injected.
- Hop-by-hop headers are stripped to keep streaming endpoints (TTS audio, SSE, etc.) stable, and responses stream back unchanged.

## Notes

- This project is focused on API bridging; the homepage is informational only.
- For production, front a deployment with HTTPS and add auth/rate limiting as needed.
