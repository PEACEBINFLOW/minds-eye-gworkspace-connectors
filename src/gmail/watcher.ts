import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { parseGmailMessageToEvent, GmailMessageLike } from "./parser";
import { MindEyeEvent } from "../types/events";

/**
 * Get a Gmail client using an authenticated OAuth2Client or service account.
 * For now, we just accept an auth client from the caller.
 */
export function getGmailClient(auth: OAuth2Client) {
  return google.gmail({ version: "v1", auth });
}

/**
 * List recent messages for a given userId (usually "me").
 * This is a simple polling-based ingestion example.
 */
export async function listRecentMessagesAsEvents(
  auth: OAuth2Client,
  userEmail: string,
  maxResults = 20
): Promise<MindEyeEvent[]> {
  const gmail = getGmailClient(auth);

  const listRes = await gmail.users.messages.list({
    userId: "me",
    maxResults,
  });

  const messages = listRes.data.messages ?? [];
  const events: MindEyeEvent[] = [];

  for (const msg of messages) {
    if (!msg.id) continue;

    const fullMsgRes = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
      format: "metadata",
      metadataHeaders: ["Subject", "From", "To", "Date"],
    });

    const fullMsg = fullMsgRes.data as GmailMessageLike;
    const event = parseGmailMessageToEvent(fullMsg, userEmail);
    events.push(event);
  }

  return events;
}
