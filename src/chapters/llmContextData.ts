export type ContextMessage = { source: string; text: string }
export type ContextOptions = { includeNote: boolean; findPassage: boolean; window: number; reserve: number }

export const USER_MESSAGE = 'What time does the North library close on Thursday?'
export const STORED_NOTE = 'Preferred branch: North'
export const PASSAGE = 'North branch guide: Thursday hours 9 AM–8 PM.'
export const TOOL_REQUEST = 'lookup_hours(branch: North, day: Thursday)'
export const TOOL_RESULT = 'North branch, Thursday: closes at 8 PM.'

// One teaching unit per complete message, including its role and content.
// It is deliberately not an approximation of a production tokenizer.
export function assembleContext(options: ContextOptions, step: number) {
  if (typeof options.includeNote !== 'boolean' || typeof options.findPassage !== 'boolean' || !Number.isInteger(options.window) || options.window < 1 || !Number.isInteger(options.reserve) || options.reserve < 0 || !Number.isInteger(step) || step < 0 || step > 3) throw new Error('Invalid context options')
  const messages: ContextMessage[] = [{ source: 'User', text: USER_MESSAGE }]
  if (options.includeNote) messages.push({ source: 'Inserted note', text: STORED_NOTE })
  if (options.findPassage) messages.push({ source: 'Retrieved passage', text: PASSAGE })
  const initialOverflow = messages.length + options.reserve > options.window
  const requested = step >= 1 && !initialOverflow
  if (requested) messages.push({ source: 'Authored tool request', text: TOOL_REQUEST })
  const executed = step >= 2 && requested
  if (executed) messages.push({ source: 'Application tool result', text: TOOL_RESULT })
  const overflow = initialOverflow || (executed && messages.length + options.reserve > options.window)
  const complete = step >= 3 && executed && !overflow
  return { messages, requested, executed, overflow, complete, inputUnits: messages.length, totalUnits: messages.length + options.reserve }
}
