export interface AnalysisRow {
  label: string;
  desc: string;
  value: number;
}

export interface EvidenceCardData {
  title: string;
  timestamp: string;
  body: string;
}

export interface DemoResult {
  id: string;
  filename: string;
  type: string;
  conclusion: string;
  aiProbability: number;
  timestamp: string;
  analysisRows: AnalysisRow[];
  contextualFindings: string;
  evidenceCards: EvidenceCardData[];
  advice: string;
}

export const DEMO_RESULT: DemoResult = {
  id: "7HATJTDRH",
  filename: "investment_video.mp4",
  type: "video",
  conclusion: "FAKE",
  aiProbability: 99,
  timestamp: new Date().toISOString(),
  analysisRows: [
    { label: "File Structure", desc: "Hidden data integrity scan.", value: 95 },
    { label: "Visual Reality", desc: "Shadow/light physics.", value: 92 },
    { label: "AI Artifacts", desc: "Digital fingerprint check.", value: 99 },
    { label: "Temporal Flow", desc: "Motion vector consistency.", value: 88 },
  ],
  contextualFindings: "This video is a malicious deepfake scam. It utilizes AI voice cloning and lip-sync technology to impersonate a public figure. The content promotes a fraudulent investment scheme with impossible returns. Technical analysis reveals audio-visual desynchronization and digital artifacts around the mouth region consistent with neural rendering.",
  evidenceCards: [
    { title: "Semantic Inconsistency", timestamp: "00:06", body: "Speaker mentions incorrect official titles, suggesting a script written by non-natives or AI." },
    { title: "Visual Artifacts", timestamp: "00:16", body: "Blurring and pixelation specifically around the lips while the rest of the face remains sharp, indicating a generated mask." },
    { title: "Logic Failure", timestamp: "00:21", body: "The financial claims made violate all economic reality and regulatory frameworks." },
  ],
  advice: "Manipulation suspected. Do not treat as evidence. Report this content to authorities."
};

export interface BatchItem {
  id: string;
  filename: string;
  result: "REAL" | "FAKE";
  certainty: number;
  aiChance: number;
}

export const DEMO_BATCH: BatchItem[] = [
  { id: "1", filename: "SCREENSHOT_2026-02-07_040556.PNG", result: "REAL", certainty: 98, aiChance: 2 },
  { id: "2", filename: "SCREENSHOT_2026-02-10_032938.PNG", result: "FAKE", certainty: 95, aiChance: 95 },
  { id: "3", filename: "SCREENSHOT_2026-02-07_040556.PNG", result: "REAL", certainty: 98, aiChance: 2 },
  { id: "4", filename: "SCREENSHOT_2026-02-10_032938.PNG", result: "FAKE", certainty: 95, aiChance: 95 },
];
