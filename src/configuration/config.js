const configuration = {
  anthropicApiKey:
    import.meta.env.VITE_ANTHROPIC_API_KEY ??
    import.meta.env.VITE_ANTHROPIC_API ??
    "",
  huggingFaceApiKey:
    import.meta.env.VITE_HUGGINGFACE_API_KEY ??
    import.meta.env.VITE_HUGGINGFACE_API ??
    "",
  preferredProvider:
    import.meta.env.VITE_RECIPE_PROVIDER?.trim().toLowerCase() ?? "local",
};

export default configuration;
