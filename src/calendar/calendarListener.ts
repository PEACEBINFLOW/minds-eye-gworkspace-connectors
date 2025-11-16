import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { MindEyeEvent } from "../types/events";

export interface CalendarEventLike {
  id?: string;
  summary?: string;
  description?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
}

/**
 * Get a Calendar client using an authenticated OAuth2Client.
 */
export function getCalendarClient(auth: OAuth2Client) {
  return google.calendar({ version: "v3", auth });
}

/**
 * Fetch upcoming Calendar events and convert them into MindEyeEvent objects.
 */
export async function listUpcomingCalendarEventsAsEvents(
  auth: OAuth2Client,
  calendarId = "primary",
  maxResults = 20
): Promise<MindEyeEvent[]> {
  const calendar = getCalendarClient(auth);

  const now = new Date().toISOString();
  const res = await calendar.events.list({
    calendarId,
    timeMin: now,
    maxResults,
    singleEvents: true,
    orderBy: "startTime",
  });

  const events = res.data.items ?? [];
  const out: MindEyeEvent[] = [];

  for (const ev of events) {
    const id = ev.id ?? "";
    const start = ev.start?.dateTime ?? ev.start?.date ?? now;
    const createdAt = new Date(start).toISOString();

    const payload: CalendarEventLike = {
      id: ev.id,
      summary: ev.summary,
      description: ev.description,
      start: ev.start,
      end: ev.end,
    };

    out.push({
      id: `calendar_${calendarId}_${id}`,
      source: "calendar",
      kind: "calendar.event",
      createdAt,
      payload,
    });
  }

  return out;
}
