'use client';
import { useState, useRef } from 'react';
import { Upload, X, File, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface FileUploadProps {
  onUpload: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export const FileUpload = ({ onUpload, accept, maxSizeMB = 5, className }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (f: File) => {
    setError(null);
    if (maxSizeMB && f.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB`);
      return;
    }
    setFile(f);
    onUpload(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {!file ? (
        <div
          className={cn(
            'relative p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors',
            dragActive ? 'border-[var(--color-purple-primary)] bg-[var(--color-purple-primary)]/5' : 'border-[var(--color-border-primary)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-secondary)]'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-10 h-10 text-[var(--color-text-muted)] mb-4" />
          <p className="text-sm text-[var(--color-text-primary)] font-medium mb-1">
            Drag and drop file here
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] mb-4">
            or click to browse {accept ? `(${accept})` : ''} - Max {maxSizeMB}MB
          </p>
          <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
            Browse Files
          </Button>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleChange}
          />
        </div>
      ) : (
        <div className="p-4 border border-[var(--color-border-primary)] bg-[var(--color-bg-elevated)] rounded-xl flex items-center gap-4">
          <div className="p-2 bg-[var(--color-bg-secondary)] rounded-lg text-[var(--color-purple-primary)]">
            <File className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{file.name}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
          <button onClick={() => setFile(null)} className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-[var(--color-danger)]">{error}</p>}
    </div>
  );
};
