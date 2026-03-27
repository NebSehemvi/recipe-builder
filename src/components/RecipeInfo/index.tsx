import React from 'react';
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
  return (
    <div className={styles.recipeInfo}>
      <div className={styles.recipeInfoGroup}>
        <label htmlFor="recipeName">Recipe Name</label>
        <input
          id="recipeName"
          type="text"
          className={styles.recipeNameInput}
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          placeholder="e.g. Grandma's Apple Pie"
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
