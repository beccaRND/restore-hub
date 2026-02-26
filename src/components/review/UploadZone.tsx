import { useState, useRef } from 'react';
import { Upload, FileText, FileSpreadsheet, File, X, Sparkles } from 'lucide-react';
import type { UploadedDocument } from '../../data/mock-applications';

const FILE_ICONS: Record<string, typeof FileText> = {
  pdf: FileText,
  docx: FileText,
  csv: FileSpreadsheet,
  xlsx: FileSpreadsheet,
};

interface UploadZoneProps {
  documents: UploadedDocument[];
  onReview: () => void;
  hasReview: boolean;
}

export default function UploadZone({ documents, onReview, hasReview }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedDocument[]>(documents);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Demo: simulate adding files
    const newFiles: UploadedDocument[] = Array.from(e.dataTransfer.files).map((f) => ({
      name: f.name,
      type: (f.name.split('.').pop() || 'pdf') as UploadedDocument['type'],
      size: `${(f.size / 1024).toFixed(0)} KB`,
      uploadedAt: new Date().toISOString().slice(0, 10),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }

  function handleClick() {
    inputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const newFiles: UploadedDocument[] = Array.from(e.target.files).map((f) => ({
      name: f.name,
      type: (f.name.split('.').pop() || 'pdf') as UploadedDocument['type'],
      size: `${(f.size / 1024).toFixed(0)} KB`,
      uploadedAt: new Date().toISOString().slice(0, 10),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--zfp-white)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--zfp-border)' }}>
        <h3 className="text-base font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--zfp-text)' }}>
          Application Documents
        </h3>
        <p className="text-xs" style={{ color: 'var(--zfp-text-light)' }}>
          Upload application files for AI-assisted review
        </p>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Drop zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
          style={{
            borderColor: dragActive ? 'var(--zfp-green)' : 'var(--zfp-border)',
            backgroundColor: dragActive ? 'var(--zfp-green-pale)' : 'var(--zfp-cream)',
          }}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.csv,.xlsx"
            className="hidden"
            onChange={handleFileChange}
          />
          <Upload
            size={28}
            strokeWidth={1.5}
            className="mx-auto mb-3"
            style={{ color: dragActive ? 'var(--zfp-green)' : 'var(--zfp-text-muted)' }}
          />
          <p className="text-sm font-medium" style={{ color: 'var(--zfp-text)' }}>
            Drop files here or click to browse
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--zfp-text-light)' }}>
            PDF, DOCX, CSV, XLSX — up to 25MB per file
          </p>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((doc, i) => {
              const Icon = FILE_ICONS[doc.type] || File;
              return (
                <div
                  key={`${doc.name}-${i}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg border"
                  style={{ borderColor: 'var(--zfp-border)', backgroundColor: 'var(--zfp-cream)' }}
                >
                  <Icon size={18} strokeWidth={1.75} style={{ color: 'var(--zfp-green)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--zfp-text)' }}>
                      {doc.name}
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--zfp-text-light)' }}>
                      {doc.size}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                    className="p-1 rounded hover:bg-[var(--zfp-cream-dark)] transition-colors"
                    style={{ color: 'var(--zfp-text-muted)' }}
                  >
                    <X size={14} strokeWidth={1.75} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Review button */}
        {files.length > 0 && (
          <button
            onClick={onReview}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all hover:-translate-y-px"
            style={{
              backgroundColor: hasReview ? 'var(--zfp-cream-dark)' : 'var(--zfp-green)',
              color: hasReview ? 'var(--zfp-text)' : '#FFFFFF',
              border: hasReview ? '1px solid var(--zfp-border)' : 'none',
              fontFamily: 'var(--font-body)',
              borderRadius: 'var(--radius-button)',
            }}
          >
            <Sparkles size={16} strokeWidth={1.75} />
            {hasReview ? 'Re-run AI Review' : 'Review Application'}
          </button>
        )}
      </div>
    </div>
  );
}
