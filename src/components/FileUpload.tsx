'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onCancel: () => void;
  isLoading?: boolean;
  acceptedTypes?: string[];
  maxSizeMB?: number;
}

export default function FileUpload({ 
  onFileSelect, 
  onCancel, 
  isLoading = false,
  acceptedTypes = ['.pdf', '.docx', '.doc'],
  maxSizeMB = 10
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return `File type must be one of: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Upload Syllabus</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your file here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  browse
                </button>
              </p>
              <p className="text-sm text-gray-500">
                Accepted formats: {acceptedTypes.join(', ')}
              </p>
              <p className="text-sm text-gray-500">
                Maximum size: {maxSizeMB}MB
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-green-900">{selectedFile.name}</p>
                  <p className="text-sm text-green-700">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setError(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  disabled={isLoading}
                >
                  Choose Different File
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
