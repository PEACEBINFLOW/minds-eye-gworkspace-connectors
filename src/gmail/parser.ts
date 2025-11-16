import { MindEyeEvent } from "../types/events";

/**
 * Minimal shape of a Gmail message we care about.
 * This roughly matches the googleapis Gmail v1 Message type, but trimmed.
 */
export interface GmailMessageLike {
  id: string;
  threadId?: string;
  internalDate?: string; // epoch millis as string
  snippet?: string;
  payload?: {
    headers?: { name: string; value: string }[];
  };
}

/**
 * Extract a header value from a Gmail payload.
 */
function getHeader(
  message: GmailMessageLike,
  name: string
): string | undefined {
  const headers = message.payload?.headers ?? [];
  const match = headers.find(
    (h) => h.name.toLowerCase() === name.toLowerCase()
  );
  return match?.value;
}

/**
 * Convert a Gmail message into a MindEyeEvent.
 * `userEmail` is the account the message belongs to.
 */
export function parseGmailMessageToEvent(
  message: GmailMessageLike,
  userEmail: string
): MindEyeEvent {
  const subject = getHeader(message, "Subject") ?? "(no subject)";
  const from = getHeader(message, "From");
  const to = getHeader(message, "To");
  const dateHeader = getHeader(message, "Date");

  let createdAt: string;
  if (message.internalDate) {
    const ms = Number(message.internalDate);
    createdAt = new Date(ms).toISOString();
  } else if (dateHeader) {
    createdAt = new Date(dateHeader).toISOString();
  } else {
    createdAt = new Date().toISOString();
  }

  return {
    id: `gmail_${userEmail}_${message.id}`,
    source: "gmail",
    kind: "gmail.message",
    createdAt,
    payload: {
      gmailId: message.id,
      threadId: message.threadId,
      account: userEmail,
      subject,
      from,
      to,
      snippet: message.snippet,
    },
  };
}
