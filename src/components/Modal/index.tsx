import React, { useState } from 'react';
import { Button } from '../Button';
import { UploadInput } from '../UploadInput';
import styles from './Modal.module.css';
import { useRecipeStore } from '../../store/useRecipeStore';

interface ModalProps {
  mode: 'export' | 'import';
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  mode,
  onClose
}) => {
  const [fileName, setFileName] = useState(`recipes-${new Date().toISOString().slice(0, 10)}`);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const { savedRecipes, ingredients, importData } = useRecipeStore();

  const handleExport = () => {
    const dataStr = JSON.stringify({ recipes: savedRecipes, ingredients }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onClose();
  };

  const handleImport = () => {
    if (!fileContent) return;
    const result = importData(fileContent);
    if (result.success) {
      alert('Data imported successfully!');
      onClose();
    } else {
      alert(result.error);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>{mode === 'export' ? 'Export Data' : 'Import Data'}</h3>

        {mode === 'export' && (
          <div className={styles.fieldGroup}>
            <label className={styles.label}>File Name:</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.inputAffixField}
                value={fileName}
                onChange={e => setFileName(e.target.value)}
              />
              <span className={styles.affix}>.json</span>
            </div>
          </div>
        )}

        {mode === 'import' && (
          <div className={styles.fieldGroup}>
            <UploadInput accept=".json" onFileLoaded={setFileContent} />
          </div>
        )}

        <div className={styles.actions}>
          <Button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </Button>
          {mode === 'export' && (
            <Button onClick={handleExport}>
              Save
            </Button>
          )}
          {mode === 'import' && (
            <Button onClick={handleImport} disabled={!fileContent}>
              Import
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
