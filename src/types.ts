export interface ProductRow {
  id: string;
  fats: string;
  carbs: string;
  protein: string;
  weight: string;
  name: string;
}

export interface Ingredient {
  name: string;
  fats: number;
  carbs: number;
  protein: number;
}

export interface SavedRecipe {
  id: string;
  name: string;
  description: string;
  rows: ProductRow[];
  timestamp: number;
}
