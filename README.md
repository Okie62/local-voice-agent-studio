# Local Voice Agent Studio

A React/Vite prototype of the local-business AI voice-agent product described in the Jason Wardrop video.

## What it includes

- White-label AI voice agent configuration wizard
- Local-business presets and agency positioning
- Simulated inbound call flow that captures:
  - service need
  - full name
  - email
  - service address
- Lead summary/progress panel
- Website voice-widget preview
- Copy-paste embed-code generator
- Unit tests for the conversation engine and embed-code generation

## Run locally

```bash
cd /Users/m4-03/Projects/local-voice-agent-studio
npm install
npm run dev
```

Then open the local URL Vite prints, usually `http://127.0.0.1:5173/`.

## Verify

```bash
npm test
npm run build
```

## Notes

This is a working front-end prototype with a deterministic simulated voice-agent engine. It does not yet connect to telephony, speech-to-text, text-to-speech, calendars, CRM, or billing. Those would be the next production integrations.
