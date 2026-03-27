import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import { useRecipeStore } from '../../store/useRecipeStore';
import { Button } from '../Button';

export const Sidebar: React.FC<{ 
  onExport: () => void; 
  onImport: () => void; 
}> = ({ onExport, onImport }) => {
  const { 
    savedRecipes, 
    loadRecipe, 
    deleteSavedRecipe 
  } = useRecipeStore();
  
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleLoadRecipe = (recipe: any) => {
    loadRecipe(recipe);
    setIsOpen(false);
  };

  const handleDeleteSavedRecipe = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteSavedRecipe(id);
  };

  const handleExport = () => {
    setIsOpen(false);
    onExport();
  };

  const handleImport = () => {
    setIsOpen(false);
    onImport();
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <button 
        className={styles.sidebarToggle}
        onClick={handleToggle}
      >
        {isOpen ? <>&times;</> : '☰'}
      </button>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Button onClick={handleExport} className={styles.sidebarButton}>Export</Button>
        <Button onClick={handleImport} className={styles.sidebarButton}>Import</Button>
      </div>

      <h2 className={styles.sidebarTitle}>Saved Recipes</h2>
      <ul className={styles.recipeList}>
        {savedRecipes.map(recipe => (
          <li 
            key={recipe.id} 
            className={styles.recipeListItem}
            onClick={() => handleLoadRecipe(recipe)}
          >
            <span className={styles.recipeItemName}>{recipe.name}</span>
            <button 
              className={styles.deleteRecipeBtn}
              onClick={(e) => handleDeleteSavedRecipe(e, recipe.id)}
            >
              &times;
            </button>
          </li>
        ))}
        {savedRecipes.length === 0 && <p>No saved recipes yet.</p>}
      </ul>
    </div>
  );
};
