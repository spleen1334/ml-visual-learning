// Graph coordinates traced from the course illustration (p.156), not raw data.
const regularMail = [227, 255, 267, 288, 304, 343, 359, 376, 418, 510]
const spam = [439, 532, 574, 597, 620, 648, 678, 696, 708, 724]

export function LogisticMultipleInputs() {
  return <figure className="logistic-multiple-inputs">
    <h2>But what if <em>multiple X variables</em> could help predict Y?</h2>
    <svg viewBox="75 90 740 365" role="img" aria-labelledby="multiple-inputs-graph-title multiple-inputs-graph-description">
      <title id="multiple-inputs-graph-title">Recipient count and spam probability</title>
      <desc id="multiple-inputs-graph-description">The original example’s S-shaped probability curve rises with recipient count. Observed emails appear at the not-spam and spam levels, including examples that do not match the curve’s likely class.</desc>
      <defs>
        <marker id="recipient-probability-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8 Z" fill="#12d8d0" /></marker>
      </defs>
      <g stroke="#d5d5d5" strokeWidth="1" strokeDasharray="4 4">
        <line x1="217" y1="121" x2="734" y2="121" />
        <line x1="217" y1="376" x2="734" y2="376" />
      </g>
      <path d="M216 113 V386 H744" fill="none" stroke="#414141" strokeWidth="2" />
      <path d="M219 376 C290 376 365 372 411 345 C445 326 454 306 469 263 C482 221 489 191 510 170 C553 129 622 122 730 121" fill="none" stroke="#12d8d0" strokeWidth="2.5" />
      <g fill="#414141">
        {regularMail.map(x => <circle key={x} cx={x} cy="376" r="4.3" />)}
        {spam.map(x => <circle key={x} cx={x} cy="121" r="4.3" />)}
      </g>
      <g fontFamily="Arial, sans-serif" fill="#111" fontSize="16">
        <text x="150" y="125" textAnchor="middle">SPAM</text>
        <text x="150" y="382" textAnchor="middle">NOT SPAM</text>
        {[5, 10, 15, 20, 25].map((value, index) => <g key={value}>
          <path d={`M${305 + index * 91} 386 v8`} stroke="#414141" />
          <text x={305 + index * 91} y="409" textAnchor="middle" fontSize="12">{value}</text>
        </g>)}
        <text x="478" y="438" textAnchor="middle"># RECIPIENTS</text>
        <text transform="translate(158 243) rotate(-90)" textAnchor="middle" fill="#12d8d0" fontWeight="700">PROBABILITY</text>
      </g>
      <g stroke="#12d8d0" strokeWidth="1" markerEnd="url(#recipient-probability-arrow)">
        <line x1="150" y1="177" x2="150" y2="142" />
        <line x1="150" y1="310" x2="150" y2="349" />
      </g>
    </svg>
    <p><strong># of Recipients</strong> can help us detect spam, but so can other variables like the <strong>number of typos</strong>, <strong>count of words like “free” or “bonus”</strong>, <strong>sender reputation score</strong>, etc.</p>
  </figure>
}
