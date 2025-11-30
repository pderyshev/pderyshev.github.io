"use client"

import { fetchDetailsRecipe, useIsLoading, useRecipeDetails } from "@/store/useRecipesStore";
import { useEffect } from "react";
import "./recipe.scss"
import { useNavigation } from "@/utils/hooks/useNavigation";


interface RecipeDetailsProps {
  id: number;
}

export default function RecipeDetails({ id }: RecipeDetailsProps) {
  const recipe = useRecipeDetails();
  const isLoading = useIsLoading();
  const { handleHome } = useNavigation();

  useEffect(() => {
    if (id) {
      fetchDetailsRecipe(id);
    }
  }, [id]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!recipe) {
    return <div>Рецепт не найден</div>;
  }

  return (
    <div className="recipe">
      <div className="recipe__wrapper">
        <div className="recipe__left">
          <img
            className="recipe__image"
            src={recipe.image}
            alt={recipe.name}
            width={370}
            height={288}
          />
          <div className="recipe__inner">
            <h2 className="recipe__title">{recipe.name}</h2>
            <p className="recipe__text">
              Кухня: {recipe.cuisine} | Сложность: {recipe.difficulty}
            </p>
            <p className="recipe__text">
              Время приготовления: {recipe.prepTimeMinutes + recipe.cookTimeMinutes} мин
            </p>
            <p className="recipe__text">Порции: {recipe.servings}</p>
          </div>
        </div>
        <div className="recipe__description">
          <ul className="recipe__description-list">
            <span className="recipe__description-name">Ингридиенты:</span>
            {recipe.ingredients?.map((ingredient, index) => (
              <li className="recipe__description-item" key={`ingredient-${recipe.id}-${index}`}>
                <span className="recipe__description-text">{ingredient}</span>
              </li>
            ))}
          </ul>
          <ul className="recipe__description-list">
            <span className="recipe__description-name">Способ приготовления:</span>
            {recipe.instructions?.map((steps, index) => (
              <li className="recipe__description-item" key={`instruction-${recipe.id}-${index}`}>
                <span className="recipe__description-text">{steps}</span>
              </li>
            ))}
          </ul>
        </div>
        <button className="btn recipe__button" onClick={handleHome}>На главную страницу</button>
      </div>

    </div>
  )
}