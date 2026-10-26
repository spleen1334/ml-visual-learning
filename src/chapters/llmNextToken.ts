// Authored teaching probabilities, not the output of a trained model.
export const LLM_PROMPT = 'The cat'
export const LLM_STOP_TOKEN = '<end>'

export type TokenChoice = { token: string; probability: number; next: string }
export type TokenNode = { choices: readonly TokenChoice[] }

export const NEXT_TOKEN_TREE: Readonly<Record<string, TokenNode>> = {
  prompt: { choices: [
    { token: ' sat', probability: 0.5, next: 'sat' },
    { token: ' slept', probability: 0.3, next: 'slept' },
    { token: ' ran', probability: 0.2, next: 'ran' },
  ] },
  sat: { choices: [
    { token: ' down', probability: 0.6, next: 'punctuation' },
    { token: ' quietly', probability: 0.4, next: 'punctuation' },
  ] },
  slept: { choices: [
    { token: ' peacefully', probability: 0.7, next: 'punctuation' },
    { token: '.', probability: 0.3, next: 'stop' },
  ] },
  ran: { choices: [
    { token: ' home', probability: 0.6, next: 'punctuation' },
    { token: ' away', probability: 0.4, next: 'punctuation' },
  ] },
  punctuation: { choices: [{ token: '.', probability: 1, next: 'stop' }] },
  stop: { choices: [{ token: LLM_STOP_TOKEN, probability: 1, next: 'complete' }] },
  complete: { choices: [] },
}

export function nextTokenState(tokens: readonly string[]) {
  let nodeId = 'prompt'
  for (const token of tokens) {
    const choice = NEXT_TOKEN_TREE[nodeId].choices.find(item => item.token === token)
    if (!choice) throw new Error(`Token ${JSON.stringify(token)} is not available at ${nodeId}.`)
    nodeId = choice.next
  }
  return { nodeId, choices: NEXT_TOKEN_TREE[nodeId].choices, complete: nodeId === 'complete' }
}

export function appendToken(tokens: readonly string[], token: string): string[] {
  if (!nextTokenState(tokens).choices.some(choice => choice.token === token)) {
    throw new Error('Choose a token from the current distribution.')
  }
  return [...tokens, token]
}

export function mostLikelyToken(tokens: readonly string[]): string | undefined {
  return [...nextTokenState(tokens).choices].sort((a, b) => b.probability - a.probability)[0]?.token
}

export function completeMostLikelyPath(): string[] {
  let tokens: string[] = []
  while (!nextTokenState(tokens).complete) {
    const token = mostLikelyToken(tokens)
    if (token === undefined) throw new Error('The example must reach its stop token.')
    tokens = appendToken(tokens, token)
  }
  return tokens
}

export function generatedText(tokens: readonly string[]): string {
  nextTokenState(tokens)
  return LLM_PROMPT + tokens.filter(token => token !== LLM_STOP_TOKEN).join('')
}
