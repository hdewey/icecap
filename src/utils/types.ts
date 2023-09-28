export interface Property {
  _id: string;
  property_name: string;
  agent: string;
  uploaded_at: number;
  prompt: string;
  transcripts: Transcript[];
  descriptions: Description[];
}

export interface Transcript {
  _id: string;
  property_id: string;
  transcription: string;
  upload_time: number;
}

export interface Description {
  _id: string;
  property_id: string;
  upload_time: number;
  descriptions: string;
  prompt: Prompt;
}

export interface Prompt {
  _id: string;
  name: string;
  value: string;
}