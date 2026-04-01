import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'default' | 'save';
  className?: string | undefined;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'default', 
  className = '',
  disabled = false
}) => {
  const variantClass = variant === 'save' ? styles['variant-save'] : '';
  
  return (
    <button 
      className={`${styles.button} ${variantClass} ${className}`} 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
