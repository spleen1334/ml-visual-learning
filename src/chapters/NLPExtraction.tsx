import { useState } from 'react'
import { extractionPresets, grammar, recordFromAnnotations, type EntityType } from './nlpExtractionData'
import './NLPIntroduction.css'
import './NLPExtraction.css'

export function NLPExtraction() {
  const [presetIndex, setPresetIndex] = useState(0)
  const [selected, setSelected] = useState(0)
  const preset = extractionPresets[presetIndex]
  const current = preset.annotations[selected]
  const record = recordFromAnnotations(preset)
  let position = 0
  const text = preset.annotations.flatMap((span, index) => {
    const before = preset.text.slice(position, span.start)
    position = span.end
    return [before, <button type="button" className="extract-span" aria-pressed={selected === index} key={`${span.start}-${span.end}`} onClick={() => setSelected(index)} aria-label={`${span.text}, ${span.type}, characters ${span.start} to ${span.end} exclusive`}>{span.text}</button>]
  })
  const fields: { label: string; type: EntityType; value: string | null }[] = [
    { label: 'Person', type: 'person', value: record.person },
    { label: 'Organization', type: 'organization', value: record.organization },
    { label: 'Date expression', type: 'date expression', value: record.dateExpression },
  ]
  return <article className="nlp-lesson extract-lesson">
    <header className="nlp-header"><p className="nlp-eyebrow">97.9 · Natural Language Processing</p><h1>Turn text into a structured record</h1><p className="nlp-definition"><strong>Information extraction</strong> turns pieces of text into fields that can be used separately.</p><p>Choose a message and follow a highlighted span into its record field.</p></header>
    <section className="nlp-map" aria-labelledby="extract-title"><div className="nlp-map-heading"><div><p className="nlp-eyebrow">SOURCE → ANNOTATIONS → RECORD</p><h2 id="extract-title">Trace the text</h2></div><p>Select a highlighted span to inspect its source and field.</p></div>
      <p className="extract-definitions">A <b>span</b> is a continuous piece of text. A <b>named entity</b> can be a person or organization; here we also annotate date expressions. Real named-entity recognition models predict spans and types and can make mistakes. These preset annotations are <b>authored</b>, not live model predictions.</p>
      <div className="extract-presets" role="group" aria-label="Choose a message">{extractionPresets.map((item, index) => <button key={item.id} type="button" aria-pressed={presetIndex === index} onClick={() => { setPresetIndex(index); setSelected(0) }}>{item.label}</button>)}</div>
      <div className="extract-flow"><div className="extract-source"><p className="nlp-kicker">SOURCE · {preset.id === 'CS11' ? 'FROZEN SUPPORT MESSAGE' : 'SEPARATE AUTHORED EXAMPLE'}</p><p className="extract-sentence">{text}{preset.text.slice(position)}</p><p>Click any highlighted span. Offsets <b>[start, end)</b> count from zero and exclude the end.</p></div><div className="extract-arrow" aria-hidden="true">→</div><div className="extract-record"><p className="nlp-kicker">STRUCTURED RECORD · COMPUTED</p>{fields.map(field => <div key={field.type} className={current?.type === field.type ? 'extract-field-active' : ''}><b>{field.label}</b><span>{field.value ?? 'null · not annotated'}</span></div>)}</div></div>
      <div className="extract-selection" aria-live="polite"><b>{current.text}</b><span>Authored type: {current.type} · source characters [{current.start}, {current.end}) · copied to {current.type} field</span></div><p className="extract-rule"><b>Copy rule:</b> for each field, copy the first authored span with that type; if none exists, use null. Null means no matching annotation is supplied—not zero, and not proof that the information is absent. “Friday” remains text, not a resolved calendar date. We do not infer who sent CS11.</p>
    </section>
    <section className="extract-grammar"><p className="nlp-eyebrow">A SEPARATE AUTHORED SENTENCE</p><h2>Who did what to whom?</h2><p>A <b>part of speech</b> is a word’s grammatical category, such as noun or verb. A <b>dependency</b> is a grammatical relationship between words. In this example the subject performs the action and the object receives it; these roles differ from entity types.</p><p className="extract-grammar-source">{grammar.text}</p><div className="extract-grammar-flow" aria-label="Maya, subject, contacted, action, Acme, object">{grammar.words.map((word, index) => <div className="extract-grammar-item" key={word.text}><div><small>{word.role}</small><b>{word.text}</b><span>{word.pos}</span></div>{index < grammar.words.length - 1 && <strong aria-hidden="true">→</strong>}</div>)}</div><p>The arrows read this event from subject → action → object; they are an authored explanation, not a live parse or a rule for every English sentence. “on Friday” provides a date expression.</p></section>
    <section className="extract-ambiguity"><h2>Context changes the interpretation</h2><p><b>Apple shipped the device.</b> → Apple is annotated as an organization. <b>Maya ate an apple.</b> → apple is a fruit, not an organization. These labels are authored for the examples; capitalization alone is not a reliable extraction rule. Use the two Apple presets above to inspect their records.</p></section>
    <nav className="nlp-links" aria-label="Related lesson"><b>Related lesson</b><a href="#chapter-97/97.1-what-can-we-do-with-language">97.1 Language task map</a></nav>
  </article>
}
