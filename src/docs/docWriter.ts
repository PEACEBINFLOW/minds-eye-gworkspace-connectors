import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

/**
 * Get a Docs client.
 */
export function getDocsClient(auth: OAuth2Client) {
  return google.docs({ version: "v1", auth });
}

export interface CreateDocOptions {
  title: string;
  bodyText: string;
}

/**
 * Simple helper to create a Google Doc containing a text summary.
 * Useful for writing Mind's Eye weekly or daily summaries into Docs.
 */
export async function createSummaryDoc(
  auth: OAuth2Client,
  options: CreateDocOptions
): Promise<{ documentId: string }> {
  const docs = getDocsClient(auth);

  // 1. Create the document
  const createRes = await docs.documents.create({
    requestBody: {
      title: options.title,
    },
  });

  const documentId = createRes.data.documentId!;
  // 2. Insert body text
  await docs.documents.batchUpdate({
    documentId,
    requestBody: {
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: options.bodyText,
          },
        },
      ],
    },
  });

  return { documentId };
}
