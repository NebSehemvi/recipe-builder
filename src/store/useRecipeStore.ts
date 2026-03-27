import { create } from 'zustand';
import { ProductRow, Ingredient, SavedRecipe } from '../types';

interface RecipeState {
  savedRecipes: SavedRecipe[];
  ingredients: Ingredient[];
  currentRecipe: SavedRecipe | null;

  loadInitialData: () => void;
  saveRecipe: (name: string, description: string, rows: ProductRow[], id: string | null) => void;
  loadRecipe: (recipe: SavedRecipe) => void;
  deleteSavedRecipe: (id: string) => void;
  startNewRecipe: () => void;
  importData: (jsonData: string) => { success: boolean; error?: string };
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  savedRecipes: [],
  ingredients: [],
  currentRecipe: null,

  loadInitialData: () => {
    const saved = localStorage.getItem('recipes');
    const savedIngredients = localStorage.getItem('ingredients');
    set({
      savedRecipes: saved ? JSON.parse(saved) : [],
      ingredients: savedIngredients ? JSON.parse(savedIngredients) : [],
    });
  },

  saveRecipe: (name, description, rows, id) => {
    const { savedRecipes, ingredients } = get();

    let updatedRecipes: SavedRecipe[];
    let newRecipeObject: SavedRecipe;

    if (id) {
      updatedRecipes = savedRecipes.map((r) =>
        r.id === id
          ? { ...r, name, description, rows, timestamp: Date.now() }
          : r
      );
      newRecipeObject = updatedRecipes.find(r => r.id === id)!;
      alert('Recipe updated successfully!');
    } else {
      newRecipeObject = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        description,
        rows,
        timestamp: Date.now(),
      };
      updatedRecipes = [newRecipeObject, ...savedRecipes];
      alert('Recipe saved successfully!');
    }

    const newIngredients = [...ingredients];
    let ingredientsChanged = false;

    rows.forEach((row) => {
      if (!row.name.trim()) return;
      const exists = newIngredients.find((ing) => ing.name.toLowerCase() === row.name.toLowerCase());
      if (!exists) {
        newIngredients.push({
          name: row.name,
          fats: parseFloat(row.fats.replace(',', '.')) || 0,
          carbs: parseFloat(row.carbs.replace(',', '.')) || 0,
          protein: parseFloat(row.protein.replace(',', '.')) || 0,
        });
        ingredientsChanged = true;
      }
    });

    localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
    const nextState: Partial<RecipeState> = { 
      savedRecipes: updatedRecipes, 
      currentRecipe: newRecipeObject 
    };

    if (ingredientsChanged) {
      localStorage.setItem('ingredients', JSON.stringify(newIngredients));
      nextState.ingredients = newIngredients;
    }

    set(nextState);
  },

  loadRecipe: (recipe) =>
    set({
      currentRecipe: recipe
    }),

  deleteSavedRecipe: (id) => {
    set((state) => {
      const updatedRecipes = state.savedRecipes.filter((r) => r.id !== id);
      localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
      return {
        savedRecipes: updatedRecipes,
        currentRecipe: state.currentRecipe?.id === id ? null : state.currentRecipe,
      };
    });
  },

  startNewRecipe: () =>
    set({
      currentRecipe: null,
    }),

  importData: (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.recipes || !Array.isArray(data.recipes) || !data.ingredients || !Array.isArray(data.ingredients)) {
        return { success: false, error: 'Invalid JSON structure. Must contain "recipes" and "ingredients" arrays.' };
      }

      // Validate recipes
      for (const recipe of data.recipes) {
        if (!recipe.id || !recipe.name || !Array.isArray(recipe.rows)) {
          return { success: false, error: `Invalid recipe object: ${recipe.name || 'Unknown'}` };
        }
        for (const row of recipe.rows) {
          const required = ['id', 'fats', 'carbs', 'protein', 'weight', 'name'];
          if (!required.every(key => key in row)) {
            return { success: false, error: `Invalid ingredient row in recipe: ${recipe.name}` };
          }
        }
      }

      // Validate ingredients
      for (const ing of data.ingredients) {
        const required = ['name', 'fats', 'carbs', 'protein'];
        if (!required.every(key => key in ing)) {
          return { success: false, error: `Invalid ingredient object: ${ing.name || 'Unknown'}` };
        }
      }

      localStorage.setItem('recipes', JSON.stringify(data.recipes));
      localStorage.setItem('ingredients', JSON.stringify(data.ingredients));
      
      set({
        savedRecipes: data.recipes,
        ingredients: data.ingredients,
        currentRecipe: null // Reset current recipe to avoid conflicts
      });

      return { success: true };
    } catch (e) {
      return { success: false, error: 'Failed to parse JSON. Please check the format.' };
    }
  }
}));
