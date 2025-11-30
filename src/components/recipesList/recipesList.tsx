"use client"

import Link from "next/link";
import "./recipeCard.scss";
import "./recipesList.scss";
import "./pagination.scss";
import { 
  deleteRecipes, 
  favoriteRecipes, 
  fetchRecipes, 
  toogleShowFavorites, 
  useIsLoading, 
  useRecipes, 
  useShowFavotireOnly,
  useCurrentPage,
  useRecipesPerPage,
  setCurrentPage,
} from "@/store/useRecipesStore";
import { Button } from "../buttons/button";
import InFavorites from "../../../public/icon/RemoveFromFavoritesorites";
import DeleteIcon from "../../../public/icon/DeleteIcon";
import RemoveFromFavoritesorites from "../../../public/icon/InFavorites";
import { useEffect } from "react";

export default function RecipesList() {
  const recipes = useRecipes();
  const isLoading = useIsLoading();
  const showFavoritesOnly = useShowFavotireOnly();
  const currentPage = useCurrentPage();
  const recipesPerPage = useRecipesPerPage();

  const displayedRecipes = showFavoritesOnly
    ? recipes.filter(recipe => recipe.isFavorite)
    : recipes;

  // Расчет данных для пагинации
  const totalRecipes = displayedRecipes.length;
  const totalPages = Math.ceil(totalRecipes / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  const currentRecipes = displayedRecipes.slice(startIndex, endIndex);

  // Сброс на первую страницу при изменении фильтра
  useEffect(() => {
    setCurrentPage(1);
  }, [showFavoritesOnly]);

  // Функция для обрезки текста инструкций
  const truncateInstructions = (instructions: string[] | null, maxLength: number = 100): string => {
    if (!instructions || instructions.length === 0) {
      return "Нет инструкций";
    }

    const text = instructions.slice(0, 2).join(' ');
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }

    return text;
  };

  // Функции для пагинации
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Генерация номеров страниц для отображения
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <>
      {!isLoading ? (
        <>
          <div className="recipes__buttons">
            <div className="recipes__buttons-wrapper">
              <Button className="btn recipes__btn" onClick={fetchRecipes}>
                Обновить список
              </Button>
              <Button
                className={showFavoritesOnly ? "btn recipes__btn recipes__btn--active" : "btn recipes__btn"}
                onClick={toogleShowFavorites}
              >
                {showFavoritesOnly ? "Все рецепты" : "Избранные рецепты"}
              </Button>             
            </div>
            <Button className="btn recipes__btn">
              <Link className="recipes__add-link" href={"/create-recipe"}>Добавить рецепт</Link>
            </Button>
          </div>

          {/* Информация о пагинации */}
          <div className="pagination-info">
            Показано {startIndex + 1}-{Math.min(endIndex, totalRecipes)} из {totalRecipes} рецептов
            {showFavoritesOnly && " (в избранном)"}
          </div>

          <ul className="recipes__list">
            {currentRecipes.map((recipe) => (
              <li className="recipes__item" key={recipe.id}>
                <Link href={`recipes/${recipe.id}`}>
                  <div className="recipe-card">
                    <img
                      className="recipe-card__image"
                      src={recipe.image}
                      alt={recipe.name}
                      width={370}
                      height={288}
                      loading="lazy"
                    />
                    <div className="recipe-card__inner">
                      <div className="recipe-card__description">
                        <h2 className="recipe-card__title">{recipe.name}</h2>
                        <p className="recipe-card__text">{truncateInstructions(recipe.instructions)}...</p>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="recipe-card__buttons">
                  <Button
                    className="recipe-card__button recipe-card__button--delete"
                    onClick={() => deleteRecipes(recipe.id)}
                  >
                    <DeleteIcon className="recipe-card__icon-delete" />
                  </Button>
                  <Button
                    className="recipe-card__button recipe-card__button--favorite"
                    onClick={() => favoriteRecipes(recipe.id)}
                  >
                    {recipe.isFavorite ? (
                      <InFavorites className="recipe-card__icon-favorite" />
                    ) : (
                      <RemoveFromFavoritesorites className="recipe-card__icon-favorite" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="pagination">
              <Button
                className="btn pagination__btn pagination__btn--prev"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
              >
                Назад
              </Button>
              
              <div className="pagination__pages">
                {getPageNumbers().map(page => (
                  <Button
                    key={page}
                    className={`btn pagination__btn pagination__page ${currentPage === page ? 'pagination__page--active btn--active' : ''}`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                className="btn pagination__btn pagination__btn--next"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Вперед
              </Button>
            </div>
          )}
        </>
      ) : (
        "Загрузка"
      )}
    </>
  )
}