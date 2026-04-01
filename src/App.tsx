import React, { useState, useEffect } from 'react';
import { Table, Button, Sidebar, RecipeInfo, Modal } from './components';
import { useRecipeStore } from './store/useRecipeStore';
import { ProductRow } from './types';
import styles from './App.module.css';

const App: React.FC = () => {
  const {
    currentRecipe,
    loadInitialData,
    saveRecipe,
    startNewRecipe
  } = useRecipeStore();

  const [rows, setRows] = useState<ProductRow[]>([]);
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');

  const [modalMode, setModalMode] = useState<'none' | 'export' | 'import'>('none');

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (currentRecipe) {
      setRows(currentRecipe.rows);
      setRecipeName(currentRecipe.name);
      setDescription(currentRecipe.description);
    } else {
      setRows([]);
      setRecipeName('');
      setDescription('');
    }
  }, [currentRecipe]);

  const handleSave = () => {
    saveRecipe(recipeName, description, rows, currentRecipe?.id || null);
  };

  const handleExport = () => {
    setModalMode('export');
  };

  const handleImport = () => {
    setModalMode('import');
  };

  return (
    <div className={styles.layout}>
      <Sidebar onExport={handleExport} onImport={handleImport} />

      <div className={styles.container}>
        <header>
          <h1 className={styles.title}>Recipe Builder</h1>
          <Button onClick={startNewRecipe}>+ New</Button>
        </header>

        <Table rows={rows} setRows={setRows} />

        <RecipeInfo
          recipeName={recipeName}
          setRecipeName={setRecipeName}
          description={description}
          setDescription={setDescription}
        />

        <Button
          variant="save"
          className={styles.saveButton}
          onClick={handleSave}
        >
          {currentRecipe ? 'Update Recipe' : 'Save Recipe'}
        </Button>
      </div>

      <div className={styles.version}>v{APP_VERSION}</div>

      {modalMode === 'export' && (
        <Modal
          mode="export"
          onClose={() => setModalMode('none')}
        />
      )}

      {modalMode === 'import' && (
        <Modal
          mode="import"
          onClose={() => setModalMode('none')}
        />
      )}
    </div>
  );
};

export default App;
