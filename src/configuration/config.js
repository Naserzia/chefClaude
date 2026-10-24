const configuration = {
  AnthropicApi: import.meta.env.VITE_ANTHROPIC_API ?? "",
  HuggingFaceApi: import.meta.env.VITE_HUGGINGFACE_API ?? "",
};

export default configuration;
