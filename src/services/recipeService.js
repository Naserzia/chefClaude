import configuration from "../configuration/config";
import { sanitizeIngredients } from "../utils/ingredients";

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You do not need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they did not mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page.
`;

export function buildLocalRecipe(ingredients = []) {
  const safeIngredients = sanitizeIngredients(ingredients);
  const ingredientList = safeIngredients.length
    ? safeIngredients.join(", ")
    : "a few pantry staples";

  return `## Quick Recipe Idea

Using: ${ingredientList}

### Simple One-Pan Meal
1. Heat a little oil in a pan over medium heat.
2. Add the ingredients and cook until softened and fragrant.
3. Stir in a splash of broth or water and simmer for a few minutes.
4. Season with salt, pepper, and any herbs you already have.
5. Serve warm as a simple, satisfying meal.

This is a safe fallback recipe while the AI API is unavailable.`;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Request failed with status ${response.status}: ${errorText || response.statusText}`,
    );
  }

  return response.json();
}

export async function getRecipeFromChefClaude(ingredients = []) {
  const safeIngredients = sanitizeIngredients(ingredients);

  if (safeIngredients.length === 0) {
    return "Please add at least one ingredient to generate a recipe.";
  }

  const apiKey = configuration.anthropicApiKey?.trim();

  if (!apiKey) {
    return buildLocalRecipe(safeIngredients);
  }

  const ingredientsString = safeIngredients.join(", ");

  try {
    const payload = {
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
        },
      ],
    };

    const data = await fetchJson("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });

    return data?.content?.[0]?.text ?? buildLocalRecipe(safeIngredients);
  } catch (error) {
    console.error("Anthropic request failed:", error);
    return buildLocalRecipe(safeIngredients);
  }
}

export async function getRecipeFromMistral(ingredients = []) {
  const safeIngredients = sanitizeIngredients(ingredients);

  if (safeIngredients.length === 0) {
    return "Please add at least one ingredient to generate a recipe.";
  }

  const apiKey = configuration.huggingFaceApiKey?.trim();

  if (!apiKey) {
    return buildLocalRecipe(safeIngredients);
  }

  const ingredientsString = safeIngredients.join(", ");

  try {
    const payload = {
      inputs: `System: ${SYSTEM_PROMPT}\nUser: I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
      parameters: {
        max_new_tokens: 512,
        temperature: 0.7,
        top_p: 0.9,
      },
    };

    const response = await fetchJson(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const generatedText = Array.isArray(response)
      ? response[0]?.generated_text
      : response?.generated_text;

    if (generatedText) {
      return generatedText;
    }

    return buildLocalRecipe(safeIngredients);
  } catch (error) {
    console.error("Mistral request failed:", error);
    return buildLocalRecipe(safeIngredients);
  }
}

export async function getRecipeByProvider(
  ingredients = [],
  provider = "local",
) {
  const normalizedProvider = provider?.trim().toLowerCase() || "local";

  switch (normalizedProvider) {
    case "anthropic":
      return getRecipeFromChefClaude(ingredients);
    case "mistral":
      return getRecipeFromMistral(ingredients);
    case "local":
    default:
      return buildLocalRecipe(ingredients);
  }
}
