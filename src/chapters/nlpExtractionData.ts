import { input, spans } from './nlpData'

export type EntityType = 'person' | 'organization' | 'date expression'
export type EntitySpan = { text: string; type: EntityType; start: number; end: number }
export type ExtractionPreset = { id: string; label: string; text: string; annotations: readonly EntitySpan[] }

export const extractionPresets: readonly ExtractionPreset[] = [
  { id: 'CS11', label: 'Support message · CS11', text: input.text, annotations: spans.map(span => ({ ...span, type: span.type as EntityType })) },
  { id: 'maya', label: 'Person and organization', text: 'Maya contacted Acme on Friday.', annotations: [
    { text: 'Maya', type: 'person', start: 0, end: 4 },
    { text: 'Acme', type: 'organization', start: 15, end: 19 },
    { text: 'Friday', type: 'date expression', start: 23, end: 29 },
  ] },
  { id: 'apple-company', label: 'Apple · company', text: 'Apple shipped the device.', annotations: [
    { text: 'Apple', type: 'organization', start: 0, end: 5 },
  ] },
  { id: 'apple-fruit', label: 'apple · fruit', text: 'Maya ate an apple.', annotations: [
    { text: 'Maya', type: 'person', start: 0, end: 4 },
  ] },
]

export const grammar = {
  text: extractionPresets[1].text,
  words: [
    { text: 'Maya', start: 0, end: 4, pos: 'proper noun', role: 'subject' },
    { text: 'contacted', start: 5, end: 14, pos: 'verb', role: 'action' },
    { text: 'Acme', start: 15, end: 19, pos: 'proper noun', role: 'object' },
  ],
  // These arrows read the event subject → action → object, not parser output.
  arrows: [{ from: 0, to: 1 }, { from: 1, to: 2 }],
} as const

export function validateAnnotations(preset: ExtractionPreset) {
  let previousEnd = 0
  for (const span of preset.annotations) {
    if (!['person', 'organization', 'date expression'].includes(span.type) || !Number.isInteger(span.start) || !Number.isInteger(span.end) || span.start < previousEnd || span.end <= span.start || span.end > preset.text.length || preset.text.slice(span.start, span.end) !== span.text) throw new Error('Invalid authored span')
    previousEnd = span.end
  }
}

// Copy the first supplied span of each type; absent annotations map to null.
export function recordFromAnnotations(preset: ExtractionPreset) {
  validateAnnotations(preset)
  const find = (type: EntityType) => preset.annotations.find(span => span.type === type)?.text ?? null
  return { person: find('person'), organization: find('organization'), dateExpression: find('date expression') }
}
