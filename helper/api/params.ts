function chatGptParams() {
  return {
    max_tokens: 1000,
    temperature: 0.7,
    top_p: 1,
    n: 1,
  };
}

export const params = {
  chatGptParams,
};

