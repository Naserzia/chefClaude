import React from "react";
import IngredientForm from "./IngredientForm";
import IngredientsList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";
import configuration from "../configuration/config";
import { getRecipeByProvider } from "../services/recipeService";
import { addIngredientToList } from "../utils/ingredients";

export default function Main() {
  const [ingredients, setIngredients] = React.useState([]);
  const [recipe, setRecipe] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [statusMessage, setStatusMessage] = React.useState("");

  function handleAddIngredient(rawIngredient) {
    setIngredients(currentIngredients =>
      addIngredientToList(currentIngredients, rawIngredient),
    );
    setError("");
    setStatusMessage("");
  }

  function clearIngredients() {
    setIngredients([]);
    setRecipe("");
    setError("");
    setStatusMessage("");
  }

  async function getRecipe() {
    if (!ingredients.length) {
      setError("Add at least one ingredient before generating a recipe.");
      return;
    }

    setIsLoading(true);
    setError("");
    setStatusMessage("");

    try {
      const provider = configuration.preferredProvider || "local";
      const nextRecipe = await getRecipeByProvider(ingredients, provider);

      if (provider === "local") {
        setStatusMessage(
          "AI services are unavailable right now, so a local recipe suggestion is being shown.",
        );
      }

      setRecipe(nextRecipe);
    } catch (caughtError) {
      console.error("Recipe generation failed:", caughtError);
      setRecipe("");
      setError("We could not generate a recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="recipe-panel">
        <IngredientForm
          onAddIngredient={handleAddIngredient}
          disabled={isLoading}
        />

        <IngredientsList
          ingredients={ingredients}
          onGenerateRecipe={getRecipe}
          onClearIngredients={clearIngredients}
          isLoading={isLoading}
        />

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {statusMessage && <p className="status-message">{statusMessage}</p>}

        {recipe && <ClaudeRecipe recipe={recipe} />}
      </section>
    </main>
  );
}
