// Returns the URL for a subtitle track (.vtt) for a given job and language
export function getSubtitleTrackUrl(jobId: string, languageCode: string) {
  return `/api/downloads/download_subtitles/${jobId}/${languageCode}`;
}
// src/lib/api.ts
// Centralized API functions for subtitle generation app

export async function processVideo({ file, inputLanguage, targetLanguages }: {
  file: File,
  inputLanguage: string,
  targetLanguages: string[]
}) {
  const formData = new FormData();
  formData.append("video", file);
  formData.append("input_language", inputLanguage);
  targetLanguages.forEach(lang => formData.append("target_languages", lang));
  const response = await fetch("/api/pipeline/process", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP ${response.status}: Processing failed`);
  }
  return response.json();
}


export async function downloadProcessedVideo(jobId: string) {
  const response = await fetch(`/api/downloads/download_video/${jobId}`, { method: "GET" });
  if (!response.ok) {
    const errorData = await response.text().catch(() => '');
    throw new Error(`Download failed: ${response.status} ${errorData}`);
  }
  return response;
}


export async function fetchProcessedVideoBlob(jobId: string) {
  const response = await fetch(`/api/downloads/download_video/${jobId}`, { method: "GET" });
  if (!response.ok) {
    const errorText = await response.text().catch(() => `HTTP ${response.status}`);
    throw new Error(`Failed to load processed video: ${errorText}`);
  }
  return response.blob();
}
