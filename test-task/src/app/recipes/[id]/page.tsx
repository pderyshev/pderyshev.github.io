import RecipeDetails from "@/components/recipeDetails/RecipeDetail";

export default async function RecipeDetailsPage({ params }: { params: { id: number } }) {

  const { id } = await params;
  return (
    <div className="recipes">
      <h1 className="visually-hidden">Evapps - приложение для путешественников</h1>
      <div className="container">
        <RecipeDetails id={id} />
      </div>
    </div>
  );
}
