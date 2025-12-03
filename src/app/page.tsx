import RecipesList from "@/components/recipesList/recipesList";

export default async function Home() {
  return (
      <div className="recipes">
        <h1 className="visually-hidden">Тестовое задание</h1>
        <div className="container">
          <RecipesList />
        </div>
      </div>
  );
}
