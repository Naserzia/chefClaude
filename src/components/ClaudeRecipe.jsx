import ReactMarkdown from "react-markdown";

export default function ClaudeRecipe({
  recipe,
  title = "Chef Claude Recommends:",
}) {
  if (!recipe) {
    return null;
  }

  return (
    <section className="suggested-recipe-container">
      <h2>{title}</h2>
      <ReactMarkdown>{recipe}</ReactMarkdown>
    </section>
  );
}
