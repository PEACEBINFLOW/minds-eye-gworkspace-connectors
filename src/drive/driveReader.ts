import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { MindEyeEvent } from "../types/events";

export interface DriveFileLike {
  id?: string;
  name?: string;
  mimeType?: string;
  modifiedTime?: string;
  owners?: { emailAddress?: string }[];
}

/**
 * Get a Drive client.
 */
export function getDriveClient(auth: OAuth2Client) {
  return google.drive({ version: "v3", auth });
}

/**
 * List files in Drive and map them to long-term memory events.
 */
export async function listDriveFilesAsEvents(
  auth: OAuth2Client,
  pageSize = 20
): Promise<MindEyeEvent[]> {
  const drive = getDriveClient(auth);

  const res = await drive.files.list({
    pageSize,
    fields:
      "files(id, name, mimeType, modifiedTime, owners(emailAddress))",
  });

  const files = (res.data.files ?? []) as DriveFileLike[];
  const events: MindEyeEvent[] = [];

  for (const file of files) {
    const id = file.id ?? "";
    const createdAt = file.modifiedTime
      ? new Date(file.modifiedTime).toISOString()
      : new Date().toISOString();

    events.push({
      id: `drive_${id}`,
      source: "drive",
      kind: "drive.file",
      createdAt,
      payload: {
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        modifiedTime: file.modifiedTime,
        owners: file.owners,
      },
    });
  }

  return events;
}
