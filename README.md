# Mind's Eye Google Workspace Connectors

**Mind's Eye GWorkspace Connectors** are the "senses" of the Google-native
Mind's Eye OS constellation.

This repo is responsible for:

- Ingesting data from **Gmail, Calendar, Drive, Docs, and Meet**.
- Normalizing each item into a `MindEyeEvent` shape (aligned with minds-eye-core).
- Forwarding events into the Mind's Eye event stream / storage / LAW-T pipeline.

Typical flow:

1. Google Workspace (Gmail, Calendar, Drive, Docs, Meet)
2. **minds-eye-gworkspace-connectors** – watchers + parsers → `MindEyeEvent`
3. **minds-eye-core** – LAW-T labeling, block/segment logic
4. Storage (DB / event store / BigQuery)
5. Search, dashboards, automations, agents

---

##  Connectors in this repo

- `gmail/`
  - `watcher.ts` – set up watchers / polling for Gmail messages.
  - `parser.ts` – convert a Gmail message into a `MindEyeEvent`.
- `calendar/`
  - `calendarListener.ts` – read Calendar events → `MindEyeEvent`.
- `drive/`
  - `driveReader.ts` – map Drive files into long-term memory events.
- `docs/`
  - `docWriter.ts` – helper to write Docs as a response to events.
- `meet/`
  - `transcriptParser.ts` – convert Meet transcripts into `MindEyeEvent`s.

All connectors use a common event schema type inside `src/types/events.ts`.
In a full deployment, this would be imported from **minds-eye-core** as a package.

---

## 🚀 Quick Start (dev skeleton)

Install dependencies:

```bash
npm install
npm run build
