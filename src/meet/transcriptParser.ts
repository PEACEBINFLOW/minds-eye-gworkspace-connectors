import { MindEyeEvent } from "../types/events";

export interface MeetTranscriptEntry {
  speaker?: string;
  text: string;
  timestamp?: string; // ISO or raw
}

/**
 * Convert a single transcript entry into a MindEyeEvent.
 */
export function parseMeetTranscriptEntryToEvent(
  entry: MeetTranscriptEntry,
  meetingId: string
): MindEyeEvent {
  const createdAt = entry.timestamp
    ? new Date(entry.timestamp).toISOString()
    : new Date().toISOString();

  return {
    id: `meet_${meetingId}_${createdAt}`,
    source: "meet",
    kind: "meet.transcript",
    createdAt,
    payload: {
      meetingId,
      speaker: entry.speaker,
      text: entry.text,
      rawTimestamp: entry.timestamp,
    },
  };
}

/**
 * Convert an array of transcript entries into events.
 */
export function parseMeetTranscriptToEvents(
  entries: MeetTranscriptEntry[],
  meetingId: string
): MindEyeEvent[] {
  return entries.map((entry) =>
    parseMeetTranscriptEntryToEvent(entry, meetingId)
  );
}
