import React, { useRef, useCallback } from 'react';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';
import type { Ingredient } from '../../types';

import styles from './Search.module.css';

interface FatSecretFood {
  food_id: string;
  food_name: string;
}

interface Props {
  onOptionClick: (option: any) => void;
  ingredients: Ingredient[];
}

export const Search: React.FC<Props> = ({ onOptionClick, ingredients }) => {
  const accessToken = useRef<string | null>(null);

  const getAccessToken = async () => {
    if (accessToken.current) return accessToken.current;

    const clientId = import.meta.env.VITE_FATSECRET_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_FATSECRET_CLIENT_SECRET;
    const credentials = btoa(`${clientId}:${clientSecret}`);

    try {
      const response = await axios.post(
        '/oauth/connect/token',
        'grant_type=client_credentials&scope=basic',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      accessToken.current = response.data.access_token;
      return accessToken.current;
    } catch (error) {
      console.error('Error fetching access token:', error);
      throw error;
    }
  };

  const getFoodDetails = async (foodId: string, token: string) => {
    try {
      const response = await axios.get('/fatsecret/rest/food/v5', {
        params: {
          food_id: foodId,
          format: 'json',
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const food = response.data.food;
      if (!food || !food.servings) return null;

      const servings = food.servings.serving;
      const servingArray = Array.isArray(servings) ? servings : [servings];
      const serving = servingArray.find(s => s.metric_serving_amount === "100.000") || servingArray[0];

      if (!serving) return null;

      const metricAmount = parseFloat(serving.metric_serving_amount) || 0;
      const factor = metricAmount > 0 ? 100 / metricAmount : 1;

      return {
        fats: (parseFloat(serving.fat) || 0) * factor,
        carbs: (parseFloat(serving.carbohydrate) || 0) * factor,
        protein: (parseFloat(serving.protein) || 0) * factor,
        kcal: (parseFloat(serving.calories) || 0) * factor,
        name: food.food_name,
      };
    } catch (error) {
      console.error(`Error fetching details for food ${foodId}:`, error);
      return null;
    }
  };

  const mapIngredientToOption = (
    item: { name: string; fats: number; carbs: number; protein: number; kcal?: number },
    isLocal: boolean = false
  ) => {
    const kcal = item.kcal ?? (item.fats * 9 + item.carbs * 4 + item.protein * 4);
    return {
      label: (
        <div style={isLocal ? { borderLeft: '4px solid #28a745', paddingLeft: '8px' } : undefined}>
          {isLocal && <strong>[Saved] </strong>}
          {item.name}<br/>
          Fats: {item.fats.toFixed(1)} Carbs: {item.carbs.toFixed(1)} Protein: {item.protein.toFixed(1)} kcal: {kcal.toFixed(1)}
        </div>
      ),
      value: {
        fats: item.fats,
        carbs: item.carbs,
        protein: item.protein,
        weight: 100,
        name: item.name,
      },
    };
  };

  const loadOptions = async (inputValue: string) => {
    if (!inputValue) return [];

    const query = inputValue.toLowerCase();
    
    // 1. Search in local ingredients
    const localMatches = ingredients
      .filter(i => i.name.toLowerCase().includes(query))
      .map(ing => mapIngredientToOption(ing, true));

    // 2. Search in FatSecret
    let fatSecretOptions: any[] = [];
    try {
      const token = await getAccessToken();
      const response = await axios.get('/fatsecret/rest/foods/search/v1', {
        params: {
          search_expression: inputValue,
          format: 'json',
          max_results: 3,
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const foods = response.data.foods?.food || [];
      const foodArray = Array.isArray(foods) ? foods : [foods];

      const detailedFoods = await Promise.all(
        foodArray.map((food: FatSecretFood) => getFoodDetails(food.food_id, token))
      );

      fatSecretOptions = detailedFoods
        .filter((f): f is NonNullable<typeof f> => f !== null)
        .map(detailed => mapIngredientToOption(detailed));
    } catch (error) {
      console.error('FatSecret search failed, using local only:', error);
    }

    // FatSecret first, then Local
    return [...fatSecretOptions, ...localMatches];
  };

  const debouncedLoadOptions = useCallback(
    debounce((inputValue: string, callback: (options: any[]) => void) => {
      loadOptions(inputValue).then(options => callback(options));
    }, 1000),
    [ingredients]
  );

  return (
    <div className={styles.searchContainer}>
      <AsyncSelect
        cacheOptions
        loadOptions={debouncedLoadOptions}
        defaultOptions
        onChange={onOptionClick}
        placeholder="Search ingredients..."
        noOptionsMessage={({ inputValue }) => !inputValue ? "Type to search..." : "No results found"}
      />
    </div>
  );
}
