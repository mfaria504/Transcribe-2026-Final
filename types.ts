export interface TranscriptionResult {
  text: string;
  timestamp: Date;
}

export enum AppStatus {
  IDLE = 'IDLE',
  FILE_SELECTED = 'FILE_SELECTED',
  TRANSCRIBING = 'TRANSCRIBING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface FileData {
  file: File;
  previewUrl?: string;
  duration?: number;
}
