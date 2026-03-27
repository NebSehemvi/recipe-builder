import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'default' | 'save';
  className?: string | undefined;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'default', 
  className = '' 
}) => {
  const variantClass = variant === 'save' ? styles['variant-save'] : '';
  
  return (
    <button 
      className={`${styles.button} ${variantClass} ${className}`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};
