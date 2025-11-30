"use client"

import { create, StateCreator } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface IRecipes {
  id: number;
  name: string;
  ingredients: string[] | null;
  instructions: string[] | null;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[] | null;
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[] | null;
  isFavorite?: boolean;
}

interface INewRecipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  image: string;
}

interface IActions {
  fetchRecipes: () => Promise<void>;
  fetchDetailsRecipe: (id: number) => Promise<void>;
  favoriteRecipes: (id: number) => void;
  deleteRecipes: (id: number) => void;
  toogleShowFavorites: () => void;
  addRecipe: (newRecipe: INewRecipe) => Promise<void>;
  setCurrentPage: (page: number) => void;
}

interface IInitialState {
  recipes: IRecipes[];
  recipeDetails: IRecipes | null;
  isLoading: boolean;
  showFavoritesOnly: boolean;
  currentPage: number;
  recipesPerPage: number;
}

interface IRecipesState extends IInitialState, IActions { }

const initialState: IInitialState = {
  recipes: [],
  recipeDetails: null,
  isLoading: false,
  showFavoritesOnly: false,
  currentPage: 1,
  recipesPerPage: 9, 
}

const recipesStore: StateCreator<
  IRecipesState,
  [['zustand/devtools', never], ["zustand/persist", unknown]]
> = (set, get) => ({
  ...initialState,
  fetchRecipes: async () => {
    set({ isLoading: true }, false, "fetchRecipes/start");

    try {
      const response = await fetch("https://dummyjson.com/recipes");
      const data = await response.json();

      const recipesWithFavorite = data.recipes.map((recipe: IRecipes) => ({
        ...recipe,
        isFavorite: false
      }));

      set({ recipes: recipesWithFavorite, currentPage: 1 }, false, "fetchRecipes/success");

    } catch (error) {
      console.log("Error fetching recipes:", error);
      set({ recipes: [] }, false, "fetchRecipes/failed");
    } finally {
      set({ isLoading: false }, false, "fetchRecipes/finally")
    }
  },

  fetchDetailsRecipe: async (id: number) => {
    set({ isLoading: true }, false, "fetchDetailsRecipe")

    try {
      const response = await fetch(`https://dummyjson.com/recipes/${id}`);
      const data = await response.json();
      set({ recipeDetails: data }, false, "fetchDetailsRecipe/success");

    } catch (error) {
      console.log("Error fetching recipes:", error);
      set({ recipeDetails: null }, false, "fetchDetailsRecipe/failed");
    } finally {
      set({ isLoading: false }, false, "fetchDetailsRecipe/finally")
    }
  },

  favoriteRecipes: (id: number) => {
    set((state) => ({
      recipes: state.recipes.map(recipe =>
        recipe.id === id
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
    }), false, "favoriteRecipes")
  },

  deleteRecipes: (id: number) => {
    set((state) => {
      const updatedRecipes = state.recipes.filter((recipe) => recipe.id !== id);
      const totalPages = Math.ceil(updatedRecipes.length / state.recipesPerPage);
      const newCurrentPage = state.currentPage > totalPages ? Math.max(1, totalPages) : state.currentPage;
      
      return {
        recipes: updatedRecipes,
        currentPage: newCurrentPage
      };
    }, false, "deleteRecipes")
  },

  toogleShowFavorites: () => {
    set((state) => ({
      showFavoritesOnly: !state.showFavoritesOnly,
      currentPage: 1 // Сбрасываем на первую страницу при переключении фильтра
    }), false, "toogleShowFavorites")
  },

  addRecipe: async (newRecipe: INewRecipe) => {
    set({ isLoading: true }, false, "addRecipe/start");

    try {
      const response = await fetch('https://dummyjson.com/recipes/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRecipe,
          userId: 1,
          rating: 0,
          reviewCount: 0,
          mealType: newRecipe.tags || []
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const addedRecipe = await response.json();

      const recipeWithLocalFields: IRecipes = {
        ...addedRecipe,
        isFavorite: false,
        ingredients: addedRecipe.ingredients || newRecipe.ingredients,
        instructions: addedRecipe.instructions || newRecipe.instructions,
        tags: addedRecipe.tags || newRecipe.tags,
        mealType: addedRecipe.mealType || newRecipe.tags || []
      };

      set((state) => ({
        recipes: [recipeWithLocalFields, ...state.recipes],
        isLoading: false,
        currentPage: 1 // Сбрасываем на первую страницу после добавления
      }), false, "addRecipe/success");

      return addedRecipe;

    } catch (error) {
      console.error("Error adding recipe to server:", error);

      const newId = get().recipes.length > 0
        ? Math.max(...get().recipes.map(r => r.id)) + 1
        : Date.now();

      const recipeToAdd: IRecipes = {
        ...newRecipe,
        id: newId,
        userId: 1,
        rating: 0,
        reviewCount: 0,
        isFavorite: false,
        mealType: newRecipe.tags || []
      };

      set((state) => ({
        recipes: [recipeToAdd, ...state.recipes],
        isLoading: false,
        currentPage: 1 // Сбрасываем на первую страницу после добавления
      }), false, "addRecipe/fallback");

      throw error;
    }
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page }, false, "setCurrentPage");
  },
})

const useRecipesStore = create<IRecipesState>()(
  devtools(
    persist(recipesStore, {
      name: "recipes-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        recipes: state.recipes,
        recipeDetails: state.recipeDetails
      })
    }
    )
  )
)

export const useRecipes = () => useRecipesStore((state) => state.recipes);
export const useRecipeDetails = () => useRecipesStore((state) => state.recipeDetails);
export const useIsLoading = () => useRecipesStore((state) => state.isLoading);
export const useShowFavotireOnly = () => useRecipesStore((state) => state.showFavoritesOnly);
export const useCurrentPage = () => useRecipesStore((state) => state.currentPage);
export const useRecipesPerPage = () => useRecipesStore((state) => state.recipesPerPage);

export const fetchRecipes = () => useRecipesStore.getState().fetchRecipes();
export const fetchDetailsRecipe = (id: number) => useRecipesStore.getState().fetchDetailsRecipe(id);
export const favoriteRecipes = (id: number) => useRecipesStore.getState().favoriteRecipes(id);
export const deleteRecipes = (id: number) => useRecipesStore.getState().deleteRecipes(id);
export const toogleShowFavorites = () => useRecipesStore.getState().toogleShowFavorites();
export const addRecipe = (newRecipe: INewRecipe) => useRecipesStore.getState().addRecipe(newRecipe);
export const setCurrentPage = (page: number) => useRecipesStore.getState().setCurrentPage(page);