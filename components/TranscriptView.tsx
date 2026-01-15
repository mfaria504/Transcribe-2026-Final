import React, { useState } from 'react';
import { Download, Copy, FileText, Check, FileType } from 'lucide-react';
import { jsPDF } from "jspdf";
import { downloadTextFile } from '../utils/fileUtils';

interface TranscriptViewProps {
  text: string;
  fileName: string;
}

const TranscriptView: React.FC<TranscriptViewProps> = ({ text, fileName }) => {
  const [editableText, setEditableText] = useState(text);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const name = fileName.replace(/\.[^/.]+$/, "") + "_transcript.txt";
    downloadTextFile(editableText, name);
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const name = fileName.replace(/\.[^/.]+$/, "") + "_transcript.pdf";
    
    // Split text to fit page
    const splitText = doc.splitTextToSize(editableText, 180);
    
    let y = 20;
    const pageHeight = doc.internal.pageSize.height;
    
    doc.setFontSize(16);
    doc.text("Transcription: " + fileName, 10, y);
    y += 10;
    
    doc.setFontSize(12);
    splitText.forEach((line: string) => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 10, y);
      y += 7;
    });

    doc.save(name);
  };

  const handleDownloadDoc = () => {
    // Simple HTML-based Word export
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
        "xmlns:w='urn:schemas-microsoft-com:office:word' "+
        "xmlns='http://www.w3.org/TR/REC-html40'>"+
        "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header+editableText.replace(/\n/g, "<br>")+footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = fileName.replace(/\.[^/.]+$/, "") + "_transcript.doc";
    fileDownload.click();
    document.body.removeChild(fileDownload);
  }

  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
                <h3 className="font-semibold text-slate-800">Transcription Result</h3>
                <p className="text-xs text-slate-500">{editableText.length} characters</p>
            </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          
          <div className="h-6 w-px bg-slate-300 mx-1 hidden sm:block"></div>

          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          >
            <FileType className="w-4 h-4" />
            TXT
          </button>
          
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>

           <button
            onClick={handleDownloadDoc}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
          >
            <FileText className="w-4 h-4" />
            Word
          </button>
        </div>
      </div>
      
      <div className="relative">
        <textarea
          value={editableText}
          onChange={(e) => setEditableText(e.target.value)}
          className="w-full h-[60vh] p-8 text-lg leading-relaxed text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500/20"
          placeholder="Transcription will appear here..."
        />
      </div>
    </div>
  );
};

export default TranscriptView;
