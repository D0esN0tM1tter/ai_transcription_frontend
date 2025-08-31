// Returns the URL for a subtitle track (.vtt) for a given job and language
export function getSubtitleTrackUrl(jobId: string, languageCode: string) {
  return `/api/downloads/download_subtitles/${jobId}/${languageCode}`;
}
// src/lib/api.ts
// Centralized API functions for subtitle generation app

export async function processVideo({ file, inputLanguage, targetLanguages, asrModelSize }: {
  file: File,
  inputLanguage: string,
  targetLanguages: string[],
  asrModelSize: string
}) {
  const formData = new FormData();
  formData.append("video", file);
  formData.append("input_language", inputLanguage);
  targetLanguages.forEach(lang => formData.append("target_languages", lang));
  formData.append("asr_model_size", asrModelSize);
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

// Interface for summary response
export interface SummaryResponse {
  summary_id: string;
  job_id: string;
  text_content: string;
  language: string;
}

export interface SummariesResponse {
  job_id: string;
  summaries: SummaryResponse[];
}

// Fetch summaries for a specific job
export async function fetchSummaries(jobId: string): Promise<SummariesResponse> {
  const response = await fetch(`/api/downloads/summaries/${jobId}`, { 
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to fetch summaries: HTTP ${response.status}`);
  }
  
  return response.json();
}
