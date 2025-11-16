/**
 * Local copy of the MindEyeEvent schema, aligned with minds-eye-core.
 * In a full setup, this should be imported from the minds-eye-core package.
 */

export type MindEyeSource =
  | "gmail"
  | "calendar"
  | "drive"
  | "docs"
  | "meet"
  | "android"
  | "system"
  | "other";

export interface LawTMetadata {
  blockId?: string;
  segmentId?: string;
  blockGranularity?: "daily" | "weekly" | "custom";
}

export interface MindEyeEvent<TPayload = any> {
  id: string;
  source: MindEyeSource;
  kind: string; // e.g. "gmail.message", "calendar.event"
  createdAt: string; // ISO timestamp
  lawT?: LawTMetadata;
  payload: TPayload;
}
