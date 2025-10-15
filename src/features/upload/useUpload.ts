"use client";

import { useCallback, useState } from "react";
import { uploadPdf } from "../../lib/api";
import type { UploadState } from "./types";
import { getUserId } from "../../lib/session";

export function useUpload() {
  const [state, setState] = useState<UploadState>({ status: "idle" });

  const onFile = useCallback(async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setState({ status: "error", message: "Only PDF is allowed.", filename: file.name });
      return;
    }

    setState({ status: "uploading", filename: file.name, progress: 10 });

    const progressTimer = setInterval(() => {
      setState((s) =>
        s.status === "uploading"
          ? { ...s, progress: Math.min((s.progress ?? 0) + 8, 85) }
          : s
      );
    }, 200);

    try {
      const userId = getUserId();
      const res = await uploadPdf(file, userId); 

      clearInterval(progressTimer);

      setState({
        status: "success",
        filename: file.name,
        docUrl: res?.document?.url,
      });
    } catch (e: any) {
      clearInterval(progressTimer);
      setState({
        status: "error",
        message: e?.message || "Upload failed",
        filename: file.name,
      });
    }
  }, []);

  return { state, onFile, setState };
}
