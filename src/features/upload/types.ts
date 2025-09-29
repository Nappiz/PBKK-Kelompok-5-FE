export type UploadState =
  | { status: "idle" }
  | { status: "selecting" }
  | { status: "uploading"; progress?: number; filename: string }
  | { status: "success"; filename: string; docUrl?: string }
  | { status: "error"; message: string; filename?: string };
