'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUp, File, Trash2, Check } from 'lucide-react';
import { useState, useRef } from 'react';

interface ResumeUploadProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxSize?: number; // in MB
  onSuccess?: () => void;
}

export function ResumeUpload({
  onUpload,
  accept = '.pdf,.doc,.docx',
  maxSize = 5,
  onSuccess,
}: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);

    // Validate file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = accept.split(',').map((ext) => ext.trim().substring(1));
    if (!allowedExtensions.includes(fileExtension)) {
      setError(`Only ${accept} files are allowed`);
      return;
    }

    setFile(selectedFile);
    setUploaded(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      await onUpload(file);
      setUploaded(true);
      setFile(null);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setUploaded(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-50', 'border-blue-300');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const inputEvent = {
        target: {
          files: [droppedFile],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(inputEvent);
    }
  };

  return (
    <div className="space-y-4">
      {uploaded ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">
                    Resume uploaded successfully
                  </p>
                  <p className="text-sm text-green-700">
                    Your resume is now attached to this application
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUploaded(false)}
              >
                Change
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="border-dashed cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-1">
                {file ? 'File Selected' : 'Upload Your Resume'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {file
                  ? `Ready to upload: ${file.name}`
                  : `Drag and drop your ${accept} file here, or click to select`}
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex gap-2 justify-center flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select File
                </Button>

                {file && (
                  <>
                    <Button onClick={handleUpload} disabled={uploading}>
                      {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleRemove}
                      disabled={uploading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Maximum file size: {maxSize}MB
              </p>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
