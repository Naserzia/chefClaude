export default function IngredientForm({ onAddIngredient, disabled = false }) {
  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const rawIngredient = formData.get("ingredient")?.toString() ?? "";

    if (!rawIngredient.trim()) {
      return;
    }

    onAddIngredient(rawIngredient);
    event.currentTarget.reset();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="add-ingredient-form"
      aria-label="Add ingredient form"
    >
      <input
        type="text"
        placeholder="e.g. oregano"
        aria-label="Add ingredient"
        name="ingredient"
        disabled={disabled}
      />
      <button type="submit" disabled={disabled}>
        Add ingredient
      </button>
    </form>
  );
}
