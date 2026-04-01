import React, { useState } from 'react';
import styles from './UploadInput.module.css';

interface UploadInputProps {
  onFileLoaded: (content: string | null) => void;
  accept?: string;
}

export const UploadInput: React.FC<UploadInputProps> = ({ onFileLoaded, accept }) => {
  const [fileNameDisplay, setFileNameDisplay] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file) return;
    setFileNameDisplay(file.name);
    const reader = new FileReader();
    reader.onload = (re) => {
      onFileLoaded(re.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    } else {
      onFileLoaded(null);
      setFileNameDisplay(null);
    }
  };

  return (
    <div 
      className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        accept={accept} 
        className={styles.hiddenFileInput} 
        onChange={handleFileChange}
        id="file-upload"
      />
      <label htmlFor="file-upload" className={styles.dropZoneLabel}>
        {isDragging ? (
          <span>Drop file here...</span>
        ) : fileNameDisplay ? (
          <span>Selected: <span className={styles.fileName}>{fileNameDisplay}</span>.<br />Click or drag to change.</span>
        ) : (
          <span>Click to select or drag and drop a file here</span>
        )}
      </label>
    </div>
  );
};
