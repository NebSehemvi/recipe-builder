import React, { useState } from 'react';
import { Search } from '../Search';
import { Button } from '../Button';
import { useRecipeStore } from '../../store/useRecipeStore';
import { type ProductRow } from '../../types';

import styles from './Table.module.css';

interface TableProps {
  rows: ProductRow[];
  setRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
}

export const Table: React.FC<TableProps> = ({ rows, setRows }) => {
  const { ingredients } = useRecipeStore();
  const [showSearch, setShowSearch] = useState(false);

  const addManualRow = () => {
    const newRow: ProductRow = {
      id: Math.random().toString(36).substr(2, 9),
      fats: '0',
      carbs: '0',
      protein: '0',
      weight: '0',
      name: '',
    };
    setRows([...rows, newRow]);
    setShowSearch(false);
  };

  const updateRow = (id: string, field: keyof ProductRow, value: string) => {
    if (field !== 'name' && value !== '' && !/^\d*[.,]?\d*$/.test(value)) {
      return;
    }
    setRows(rows.map(row => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const deleteRow = (id: string) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const onOptionClick = (option: any) => {
    if (option) {
      const { fats, carbs, protein, weight, name } = option.value;
      const newRow: ProductRow = {
        id: Math.random().toString(36).substr(2, 9),
        fats: typeof fats === 'number' ? fats.toFixed(2) : fats,
        carbs: typeof carbs === 'number' ? carbs.toFixed(2) : carbs,
        protein: typeof protein === 'number' ? protein.toFixed(2) : protein,
        weight: weight.toString(),
        name,
      };
      setRows([...rows, newRow]);
      setShowSearch(false);
    }
  };

  const parseNum = (val: string) => {
    const standardized = val.replace(',', '.');
    return parseFloat(standardized) || 0;
  };

  const totals = rows.reduce(
    (acc, row) => {
      const weight = parseNum(row.weight);
      const fats = parseNum(row.fats);
      const carbs = parseNum(row.carbs);
      const protein = parseNum(row.protein);

      acc.totalWeight += weight;
      acc.totalFats += (fats * weight) / 100;
      acc.totalCarbs += (carbs * weight) / 100;
      acc.totalProtein += (protein * weight) / 100;
      return acc;
    },
    { totalWeight: 0, totalFats: 0, totalCarbs: 0, totalProtein: 0 }
  );

  const per100g = {
    fats: totals.totalWeight > 0 ? (totals.totalFats / totals.totalWeight) * 100 : 0,
    carbs: totals.totalWeight > 0 ? (totals.totalCarbs / totals.totalWeight) * 100 : 0,
    protein: totals.totalWeight > 0 ? (totals.totalProtein / totals.totalWeight) * 100 : 0,
  };

  const calculateRowCalories = (row: ProductRow) => {
    const fats = parseNum(row.fats);
    const carbs = parseNum(row.carbs);
    const protein = parseNum(row.protein);
    const weight = parseNum(row.weight);
    
    const kcalPer100g = (fats * 9) + (carbs * 4) + (protein * 4);
    return (kcalPer100g / 100) * weight;
  };

  const totalCaloriesPer100g = (per100g.fats * 9) + (per100g.carbs * 4) + (per100g.protein * 4);

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Fats (per 100g)</th>
            <th>Carbs (per 100g)</th>
            <th>Protein (per 100g)</th>
            <th>Weight (g)</th>
            <th>Calories</th>
            <th>Product Name</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              <td><input type="text" className={styles.input} value={row.fats} onChange={e => updateRow(row.id, 'fats', e.target.value)} /></td>
              <td><input type="text" className={styles.input} value={row.carbs} onChange={e => updateRow(row.id, 'carbs', e.target.value)} /></td>
              <td><input type="text" className={styles.input} value={row.protein} onChange={e => updateRow(row.id, 'protein', e.target.value)} /></td>
              <td><input type="text" className={styles.input} value={row.weight} onChange={e => updateRow(row.id, 'weight', e.target.value)} /></td>
              <td className={styles.readonly} style={{ padding: '8px' }}>{calculateRowCalories(row).toFixed(0)}</td>
              <td>
                <input type="text" className={styles.input} value={row.name} onChange={e => updateRow(row.id, 'name', e.target.value)} />
                <button className={styles.deleteButton} onClick={() => deleteRow(row.id)} title="Delete row">&times;</button>
              </td>
            </tr>
          ))}
        </tbody>
        {rows.length > 0 && (
          <tfoot>
            <tr className={styles.totalRow}>
              <td className={styles.readonly}>{per100g.fats.toFixed(2)}</td>
              <td className={styles.readonly}>{per100g.carbs.toFixed(2)}</td>
              <td className={styles.readonly}>{per100g.protein.toFixed(2)}</td>
              <td className={styles.readonly}>{totals.totalWeight.toFixed(0)}</td>
              <td className={styles.readonly}>{totalCaloriesPer100g.toFixed(0)}</td>
              <td className={styles.readonly}><strong>Total per 100g dish</strong></td>
            </tr>
          </tfoot>
        )}
      </table>
      <div className={styles.controls}>
        {showSearch ? <Search onOptionClick={onOptionClick} ingredients={ingredients} /> : (
          <Button onClick={addManualRow}>Add manually</Button>
        )}
        <Button onClick={() => setShowSearch(!showSearch)}>
          {showSearch ? 'Hide Search' : 'Search FatSecret'}
        </Button>
      </div>
    </div>
  );
}
