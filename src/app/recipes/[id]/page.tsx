import RecipeDetails from "@/components/recipeDetails/RecipeDetail";

export async function generateStaticParams() {
 
  const response = await fetch('https://dummyjson.com/recipes');
  const data = await response.json();
  
  return data.recipes.map((recipe: any) => ({
    id: recipe.id.toString(),
  }));
}

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
