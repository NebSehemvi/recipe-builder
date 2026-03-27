# Recipe Builder

A modern, fast, and local application for calculating nutrition data and managing recipes.

## 🚀 Features

- **Hybrid Ingredient Search**: Seamlessly search for products using the **FatSecret API** or your own **local ingredient library**.
- **Automatic Calculations**: 
  - Instant nutritional totals (Fats, Carbs, Protein) based on ingredient weight.
  - Automatic **Calories calculation** using the standard formula (4 kcal for carbs/protein, 9 kcal for fats).
  - **Weighted Totals**: See the exact nutritional profile **per 100g of the final dish**.
- **Local Persistence**: 
  - Save, update, and delete recipes directly in your browser using **Local Storage**.
  - Automatically builds a local ingredient library as you save recipes.
- **Recipe Management**:
  - Sidebar for quick access to saved recipes.
  - Detailed descriptions and cooking instructions.
- **Data Portability**: Full **Export and Import** functionality via JSON, making it easy to backup or transfer your data.
- **Validation**: Built-in validation for recipe names and numeric inputs to ensure data integrity.

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **State Management**: Zustand (for collections) + Local React State (for smooth input handling)
- **Build Tool**: Vite
- **Styling**: CSS Modules (Vanilla CSS)
- **HTTP Client**: Axios
- **External API**: FatSecret Platform API (v5)

## 📦 Getting Started

1. **Install dependencies**:
   ```bash
   yarn install
   ```

2. **Configure API**:
   Create a `.env` file in the root directory and add your FatSecret credentials:
   ```env
   VITE_FATSECRET_CLIENT_ID=your_client_id
   VITE_FATSECRET_CLIENT_SECRET=your_client_secret
   ```

3. **Run the development server**:
   ```bash
   yarn dev
   ```

4. **Build for production**:
   ```bash
   yarn build
   ```

## 🔒 Privacy & Data

All recipe and ingredient data is stored **locally in your browser**. No personal information or recipe data is sent to any server, except for search queries sent to the FatSecret API.
