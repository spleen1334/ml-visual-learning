const KEY = 'ml-visual-interactive:progress:v1'

export function readCompletion(): boolean {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(KEY) ?? 'null')
    return typeof saved === 'object' && saved !== null &&
      'version' in saved && saved.version === 1 &&
      'chapter01' in saved && saved.chapter01 === true
  } catch { return false }
}

export function saveCompletion(): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: 1, chapter01: true }))
    return true
  } catch { return false }
}
