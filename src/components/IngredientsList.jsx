import { hasMinimumIngredients } from "../utils/ingredients";

export default function IngredientsList({
  ingredients = [],
  onGenerateRecipe,
  onClearIngredients,
  isLoading = false,
}) {
  if (!ingredients.length) {
    return null;
  }

  const hasEnoughIngredients = hasMinimumIngredients(ingredients, 3);

  return (
    <section className="ingredients-panel">
      <div className="ingredients-header">
        <h2>Ingredients on hand:</h2>
        <button
          type="button"
          className="clear-button"
          onClick={onClearIngredients}
        >
          Clear all
        </button>
      </div>

      <ul className="ingredients-list" aria-live="polite">
        {ingredients.map((ingredient, index) => (
          <li key={`${ingredient}-${index}`}>{ingredient}</li>
        ))}
      </ul>

      {hasEnoughIngredients ? (
        <div className="get-recipe-container">
          <div>
            <h3>Ready for a recipe?</h3>
            <p>Generate a recipe from your list of ingredients.</p>
          </div>
          <button type="button" onClick={onGenerateRecipe} disabled={isLoading}>
            {isLoading ? "Generating..." : "Get a recipe"}
          </button>
        </div>
      ) : (
        <p className="helper-text">
          Add at least three ingredients to unlock recipe generation.
        </p>
      )}
    </section>
  );
}
