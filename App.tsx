import React, { useState } from 'react';
import DropZone from './components/DropZone';
import TranscriptView from './components/TranscriptView';
import { AppStatus } from './types';
import { transcribeAudio } from './services/geminiService';
import { Loader2, Mic, Sparkles, X, AlertCircle } from 'lucide-react';
import { formatBytes } from './utils/fileUtils';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleFileAccepted = async (acceptedFile: File) => {
    setFile(acceptedFile);
    setStatus(AppStatus.FILE_SELECTED);
    setError(null);
  };

  const handleStartTranscription = async () => {
    if (!file) return;
    
    setStatus(AppStatus.TRANSCRIBING);
    try {
      const result = await transcribeAudio(file);
      setTranscription(result);
      setStatus(AppStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during transcription.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTranscription("");
    setStatus(AppStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Mic className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Gemini Scribe
            </h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Powered by Google Gemini 2.5
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
        
        {/* Intro Text */}
        {status === AppStatus.IDLE && (
          <div className="text-center mb-12 max-w-2xl">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Turn Audio into Text, Instantly.
            </h2>
            <p className="text-lg text-slate-600">
              Upload your MP3s, MP4s, or WAV files. Our AI-powered engine transcribes them with high accuracy in seconds.
            </p>
          </div>
        )}

        {/* State Machine UI */}
        <div className="w-full flex flex-col items-center gap-8">
          
          {/* 1. Drop Zone (Idle) */}
          {status === AppStatus.IDLE && (
            <DropZone onFileAccepted={handleFileAccepted} />
          )}

          {/* 2. File Preview & Action (Selected/Error) */}
          {(status === AppStatus.FILE_SELECTED || status === AppStatus.ERROR) && file && (
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-slate-100 p-6 animate-fade-in-up">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                     {file.type.includes('video') ? <Sparkles className="w-8 h-8"/> : <Mic className="w-8 h-8"/>}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 truncate max-w-[200px] sm:max-w-xs">{file.name}</h3>
                    <p className="text-slate-500 text-sm">{formatBytes(file.size)} • {file.type}</p>
                  </div>
                </div>
                <button onClick={handleReset} className="text-slate-400 hover:text-slate-600 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {status === AppStatus.ERROR && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="text-sm text-red-700">
                    <span className="font-semibold">Transcription failed.</span> {error}
                  </div>
                </div>
              )}

              <button
                onClick={handleStartTranscription}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                Start Transcription
              </button>
            </div>
          )}

          {/* 3. Transcribing Loader */}
          {status === AppStatus.TRANSCRIBING && (
            <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-slate-100"></div>
                <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
              </div>
              <h3 className="mt-8 text-2xl font-bold text-slate-800">Transcribing...</h3>
              <p className="mt-2 text-slate-500">This might take a moment depending on the file size.</p>
            </div>
          )}

          {/* 4. Results Viewer */}
          {status === AppStatus.COMPLETED && (
            <div className="w-full flex flex-col items-center gap-6 animate-fade-in">
              <div className="flex w-full max-w-4xl justify-between items-center">
                 <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
                >
                  ← Transcribe another file
                </button>
              </div>
              <TranscriptView text={transcription} fileName={file?.name || "transcript"} />
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
