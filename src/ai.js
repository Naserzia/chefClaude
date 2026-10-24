import Anthropic from "@anthropic-ai/sdk";
import { HfInference } from "@huggingface/inference";
import configuration from "./configuration/config";

const SYSTEM_PROMPT = `
You are an assistant that receives a list of 
ingredients that a user has and suggests a recipe they could make with 
some or all of those ingredients. You don't need to use every ingredient 
they mention in your recipe. The recipe can include additional ingredients 
they didn't mention, but try not to include too many extra ingredients. 
Format your response in markdown to make it easier to render to a web page
`;

function buildLocalRecipe(ingredientsArr = []) {
  const ingredients = Array.isArray(ingredientsArr) ? ingredientsArr : [];
  const ingredientList = ingredients.length
    ? ingredients.join(", ")
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

// 🚨👉 ALERT: Read message below! You've been warned! 👈🚨
// If you're following along on your local machine instead of
// here on Scrimba, make sure you don't commit your API keys
// to any repositories and don't deploy your project anywhere
// live online. Otherwise, anyone could inspect your source
// and find your API keys/tokens. If you want to deploy
// this project, you'll need to create a backend of some kind,
// either your own or using some serverless architecture where
// your API calls can be made. Doing so will keep your
// API keys private.

const anthropicApiKey = configuration.AnthropicApi?.trim();
const anthropic = anthropicApiKey
  ? new Anthropic({
      apiKey: anthropicApiKey,
      dangerouslyAllowBrowser: true,
    })
  : null;

export async function getRecipeFromChefClaude(ingredientsArr = []) {
  const safeIngredients = Array.isArray(ingredientsArr) ? ingredientsArr : [];

  if (safeIngredients.length === 0) {
    return "Please add at least one ingredient to generate a recipe.";
  }

  if (!anthropic) {
    return buildLocalRecipe(safeIngredients);
  }

  const ingredientsString = safeIngredients.join(", ");

  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
        },
      ],
    });
    return msg.content[0].text;
  } catch (error) {
    console.error("Anthropic request failed:", error);
    return buildLocalRecipe(safeIngredients);
  }
}

const huggingFaceApiKey = configuration.HuggingFaceApi?.trim();
const hf = huggingFaceApiKey ? new HfInference(huggingFaceApiKey) : null;

export async function getRecipeFromMistral(ingredientsArr = []) {
  const safeIngredients = Array.isArray(ingredientsArr) ? ingredientsArr : [];

  if (safeIngredients.length === 0) {
    return "Please add at least one ingredient to generate a recipe.";
  }

  if (!hf) {
    return buildLocalRecipe(safeIngredients);
  }

  const ingredientsString = safeIngredients.join(", ");
  try {
    const response = await hf.chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
        },
      ],
      max_tokens: 1024,
    });
    return response.choices[0].message.content;
  } catch (err) {
    console.error(err.message);
    return buildLocalRecipe(safeIngredients);
  }
}
