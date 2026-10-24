export function normalizeIngredient(value = "") {
  return String(value).trim().replace(/\s+/g, " ");
}

export function sanitizeIngredients(ingredients = []) {
  if (!Array.isArray(ingredients)) {
    return [];
  }

  return ingredients
    .map(ingredient => normalizeIngredient(ingredient))
    .filter(Boolean)
    .filter(
      (ingredient, index, allIngredients) =>
        allIngredients.indexOf(ingredient) === index,
    );
}

export function addIngredientToList(currentIngredients = [], rawValue = "") {
  const nextIngredient = normalizeIngredient(rawValue);

  if (!nextIngredient) {
    return sanitizeIngredients(currentIngredients);
  }

  return sanitizeIngredients([...currentIngredients, nextIngredient]);
}

export function hasMinimumIngredients(ingredients = [], minimumCount = 3) {
  return sanitizeIngredients(ingredients).length >= minimumCount;
}
