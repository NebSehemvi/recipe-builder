import React, { useState } from 'react';
import styles from './RecipeInfo.module.css';

interface RecipeInfoProps {
  recipeName: string;
  setRecipeName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
}

export const RecipeInfo: React.FC<RecipeInfoProps> = ({
  recipeName,
  setRecipeName,
  description,
  setDescription,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleBlur = () => {
    if (!recipeName.trim()) {
      setError('required field');
    } else {
      setError(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipeName(e.target.value);
    if (e.target.value.trim() && error) {
      setError(null);
    }
  };

  return (
    <div className={styles.recipeInfo}>
      <div className={styles.recipeInfoGroup}>
        <div className={styles.labelWrapper}>
          <label htmlFor="recipeName">Recipe Name</label>
          {error && <span className={styles.errorText}>{error}</span>}
        </div>
        <input
          id="recipeName"
          type="text"
          className={`${styles.recipeNameInput} ${error ? styles.inputError : ''}`}
          value={recipeName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. Apple Pie"
        />
      </div>
      <div className={styles.recipeInfoGroup}>
        <label htmlFor="description">Description / Cooking Instructions</label>
        <textarea
          id="description"
          className={styles.recipeDescriptionArea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your recipe or add specific notes..."
        />
      </div>
    </div>
  );
};
