import React, { useState } from 'react';
import { Button } from '../Button';
import styles from './Modal.module.css';

interface ModalProps {
  title: string;
  initialValue?: string;
  readonly?: boolean;
  onClose: () => void;
  onConfirm?: (value: string) => void;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  initialValue = '',
  readonly = false,
  onClose,
  onConfirm
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        <textarea
          className={styles.textarea}
          value={value}
          onChange={e => setValue(e.target.value)}
          readOnly={readonly}
          placeholder={readonly ? '' : 'Paste JSON here...'}
        />
        <div className={styles.actions}>
          <Button className={styles.cancelButton} onClick={onClose}>
            {readonly ? 'Close' : 'Cancel'}
          </Button>
          {!readonly && onConfirm && (
            <Button onClick={() => onConfirm(value)}>
              Import
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
