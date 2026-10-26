import { useState } from 'react'
import type { ReactNode } from 'react'
import { timeSeriesWorkbook as data } from '../data/timeSeriesWorkbook'
import { timeSeriesWorkbookSourceGrids as grids } from '../data/timeSeriesWorkbookGrid'
import './TimeSeriesCases.css'
import residualNoTrend from '../assets/time-series-residual-no-trend.png'
import residualWithTrend from '../assets/time-series-residual-trend.png'

type CaseKey = keyof typeof grids
const cyan = '#26e2f6', yellow = '#ffff89', pink = '#ff66ff', green = '#70ad47'
const fmt = (n: number, digits = 3) => n.toLocaleString('en-US', { maximumFractionDigits: digits })
function Lesson({ number, title, lead, children }: { number: number; title: string; lead: string; children: ReactNode }) {
  return <article className="ts-case"><header><p className="ts-case__eyebrow">Chapter 15 · Lesson 15.{number}</p><h1>{title}</h1><p className="ts-case__lead">{lead}</p></header>{children}</article>
}
function col(n: number): string { return n > 26 ? col(Math.floor((n - 1) / 26)) + String.fromCharCode(65 + (n - 1) % 26) : String.fromCharCode(64 + n) }
function colNumber(s: string) { return [...s].reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0) }
function Grid({ sheet, range, caption, indicatorHeaders = false, overrides = {} }: { sheet: CaseKey; range: string; caption: string; indicatorHeaders?: boolean; overrides?: Record<string, number | string | null> }) {
  const source = grids[sheet]
  const cells = source.cells as Record<string, string | number>
  const formulas = source.formulas as Record<string, string>
  const [start, end] = range.split(':').map(ref => ({ c: colNumber(ref.replace(/\d/g, '')), r: Number(ref.replace(/\D/g, '')) }))
  const cellValue = (ref: string) => {
    const v = Object.hasOwn(overrides, ref) ? overrides[ref] : cells[ref]
    if (v === undefined || v === null) return ''
    if (typeof v !== 'number') return v
    if ((sheet === 'smoothing' || sheet === 'interventionAnalysis') && ref.startsWith('B') && !ref.startsWith('BA') && v > 40000) return new Date(Date.UTC(1899, 11, 30) + v * 86400000).toISOString().slice(0, 10)
    if (sheet === 'interventionAnalysis' && /^[EM]/.test(ref) && Number(ref.replace(/\D/g,'')) >= 4) return fmt(v * 100, 2) + '%'
    if ((sheet === 'oneHotEncoding' || sheet === 'seasonalityTrend') && /^B[0-9]+$/.test(ref) && v >= 2010 && v <= 2020) return String(v)
    if (v !== 0 && Math.abs(v) < .00001) return v.toExponential(3)
    return fmt(v, 5)
  }
  return <div className="ts-case__data"><p className="ts-case__table-title">{caption}</p><div className="ts-case__table" tabIndex={0} role="region" aria-label={caption}><table className={indicatorHeaders ? 'ts-case__indicator-grid' : undefined}>{indicatorHeaders && <thead><tr className="ts-case__column-groups"><th colSpan={2} scope="colgroup">Observations</th><th colSpan={11} scope="colgroup" className="ts-case__indicator-heading">One-hot encoded columns</th>{sheet === 'seasonalityTrend' ? <><th scope="colgroup" className="ts-case__time-step">Time step</th><th colSpan={end.c - start.c - 13} scope="colgroup">Revenue &amp; forecasts</th></> : <th colSpan={end.c - start.c - 12} scope="colgroup">Temperature &amp; forecast</th>}</tr></thead>}<tbody>{Array.from({ length: end.r - start.r + 1 }, (_, ri) => {
    const r = start.r + ri
    return <tr key={r}>{Array.from({ length: end.c - start.c + 1 }, (_, ci) => { const ref = col(start.c + ci) + r; const value = cellValue(ref); const isTimeStep = sheet === 'seasonalityTrend' && indicatorHeaders && start.c + ci === 15; return ri === 0 ? <th scope="col" key={ref} className={isTimeStep ? 'ts-case__time-step' : indicatorHeaders && ci >= 2 && ci <= 12 ? 'ts-case__indicator-heading' : undefined}>{value}</th> : <td key={ref} title={formulas[ref] ? `${ref}: =${formulas[ref]}` : undefined} className={isTimeStep ? 'ts-case__time-step' : Object.hasOwn(overrides, ref) ? 'ts-case__changed' : undefined}>{value}</td> })}</tr>
  })}</tbody></table></div></div>
}
function FullSheet({ sheet }: { sheet: CaseKey }) { return <details className="ts-case__details"><summary>All worksheet calculations and regression output</summary><Grid sheet={sheet} range={grids[sheet].range} caption="Complete worksheet values · Hover a formula cell to inspect its calculation" /></details> }
type Series = { name: string; values: readonly (number | null)[]; color: string; dashed?: boolean; dots?: boolean; scatter?: boolean; area?: boolean; strokeWidth?: number }
function Chart({ title, labels, series, min, max, step, percent = false, bars = false, barLabels = false, xLabel = 'Time', yLabel, intervention, xValues }: { title: string; labels: readonly string[]; series: Series[]; min: number; max: number; step: number; percent?: boolean; bars?: boolean; barLabels?: boolean; xLabel?: string; yLabel: string; intervention?: number; xValues?: readonly number[] }) {
  const xMin = xValues ? Math.min(...xValues) : 0, xMax = xValues ? Math.max(...xValues) : labels.length - 1
  const x = (i: number) => 65 + ((xValues ? xValues[i] : i) - xMin) / Math.max(.001, xMax - xMin) * 670
  const y = (v: number) => 290 - (v - min) / (max - min) * 250
  const ticks = Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => min + i * step)
  const indices = bars && labels.length === 36 ? Array.from({length:12},(_,i)=>i*3+2) : Array.from(new Set([0, ...Array.from({ length: Math.min(5, labels.length) }, (_, i) => Math.round(i * (labels.length - 1) / Math.min(4, labels.length - 1)))]))
  return <figure className="ts-case__chart"><h2>{title}</h2><svg viewBox="0 0 770 360" role="img" aria-label={`${title}. ${yLabel} against ${xLabel}. Series: ${series.map(s=>s.name).join(', ')}. Exact values in the adjacent table.`}>
    {ticks.map(t => <g key={t}><line x1="65" x2="735" y1={y(t)} y2={y(t)} stroke="#61666b" strokeWidth=".6"/><text x="56" y={y(t)+4} textAnchor="end">{percent ? fmt(t * 100, 0) + '%' : fmt(t, 1)}</text></g>)}
    {indices.map((i,j) => <text key={i} x={xValues ? 65+j*670/(indices.length-1) : x(i)} y="310" textAnchor={j===0?'start':j===indices.length-1?'end':'middle'}>{xValues ? fmt(xMin+j*(xMax-xMin)/(indices.length-1),1) : labels[i]}</text>)}
    {series.map(s => <g key={s.name}>{bars ? s.values.map((v,i) => v === null ? null : <rect key={i} x={x(i)-5} y={Math.min(y(v),y(0))} width={Math.max(3, Math.min(12, 500 / labels.length))} height={Math.max(1,Math.abs(y(v)-y(0)))} fill={s.color}/>) : !s.scatter && <path fill={s.area ? s.color+'44' : 'none'} stroke={s.color} strokeWidth={s.strokeWidth ?? 2} strokeDasharray={s.dashed ? '7 5' : undefined} d={s.values.map((v,i) => v === null ? '' : `${i===0 || s.values[i-1] === null ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ') + (s.area ? ` L${x(labels.length-1)},${y(0)} L${x(0)},${y(0)} Z` : '')}/>} {s.dots && s.values.map((v,i)=>v===null?null:<rect key={i} x={x(i)-2} y={y(v)-2} width="4" height="4" fill={s.color} transform={`rotate(45 ${x(i)} ${y(v)})`}/>)}</g>)}
    {barLabels && bars && series.map(s => <g className="ts-case__bar-labels" key={s.name}>{s.values.map((v, i) => v === null ? null : <text key={i} x={x(i)} y={v >= 0 ? y(v) - 7 : y(v) + 13 + (i % 3) * 12} textAnchor="middle">{fmt(percent ? v * 100 : v, 1)}{percent ? '%' : ''}</text>)}</g>)}
    {intervention !== undefined && <g><line x1={x(intervention)} x2={x(intervention)} y1="30" y2="290" stroke="#fff" strokeDasharray="4 4"/><text x={x(intervention)+5} y="25">New landing page</text></g>}
    <text x="400" y="340" textAnchor="middle">{xLabel}</text><text transform="rotate(-90 15 170)" x="15" y="170" textAnchor="middle">{yLabel}</text>
  </svg><figcaption>{series.map(s=><span key={s.name}><svg className="ts-case__legend-symbol" viewBox="0 0 24 16" aria-hidden="true">{s.scatter ? <path d="M12 3 L17 8 L12 13 L7 8 Z" fill={s.color}/> : <line x1="1" y1="8" x2="23" y2="8" stroke={s.color} strokeWidth={s.strokeWidth ?? 2} strokeDasharray={s.dashed ? '6 4' : undefined}/>}</svg>{s.name}</span>)}</figcaption></figure>
}
function Coefficients({ rows, baseline }: { rows: readonly { term: string; coefficient: number }[]; baseline: string }) { return <div className="ts-case__coefficients"><p>{baseline}</p><table><thead><tr><th>Term</th><th>Coefficient</th></tr></thead><tbody>{rows.map(r=><tr key={r.term}><th scope="row">{r.term}</th><td>{fmt(r.coefficient,6)}</td></tr>)}</tbody></table></div> }

export function TSACFCase() {
 const source = data.autoCorrelation
 return <Lesson number={4} title="Case study: seasonality with ACF" lead="Accucorp Accounting wants to know whether monthly searches for tax-related keywords follow a seasonal pattern.">
   <section className="ts-case__sheet ts-case__acf-sheet">
     <Chart title="Auto correlation" labels={source.autocorrelation.map(r=>String(r.lag))} series={[{name:'Correlation',values:source.autocorrelation.map(r=>r.correlation),color:cyan}]} min={-.8} max={1.2} step={.2} percent bars barLabels xLabel="Lag (months)" yLabel="Correlation"/>
     <section className="ts-case__conclusion" aria-labelledby="ts-case-acf-conclusion">
       <h2 id="ts-case-acf-conclusion">Case study conclusion</h2>
       <p>Peaks at <strong>12, 24 and 36 months</strong> indicate an <strong>annual pattern</strong>.</p>
     </section>
     <div className="ts-case__acf-tables">
       <Grid sheet="autoCorrelation" range="B3:AM123" caption="Tax keyword searches · all 120 months and 36 lags"/>
       <Grid sheet="autoCorrelation" range="AO3:AQ39" caption="Lag correlations"/>
     </div>
     <FullSheet sheet="autoCorrelation"/>
   </section>
 </Lesson>
}
export function TSOneHotCase() {
 const s=data.oneHotEncoding, [show,setShow]=useState(true)
 return <Lesson number={6} title="Case study: seasonality with one-hot encoding" lead="Weather Trends uses monthly temperatures in Rio de Janeiro to forecast the following year.">
   <section className="ts-case__sheet">
     <label className="ts-case__toggle"><input type="checkbox" checked={show} onChange={e=>setShow(e.target.checked)}/>Show forecast</label>
     <Chart title="Brazil average temperature" labels={s.observations.map(r=>r.year+' '+r.month)} series={[{name:'Temp',values:s.observations.map(r=>r.temperatureC),color:cyan},...(show?[{name:'Forecast',values:s.observations.map(r=>r.predictionC),color:yellow,dashed:true}]:[])]} min={15} max={35} step={5} yLabel="Temperature (°C)"/>
     <section className="ts-case__conclusion" aria-labelledby="ts-case-one-hot-conclusion">
       <h2 id="ts-case-one-hot-conclusion">Case study conclusion</h2>
       <p>The seasonal regression <strong>matches the observed temperatures closely through October 2019</strong>, then extends the <strong>forecast through the rest of 2019 and into 2020</strong>.</p>
       <p className="ts-case__note">Future forecast accuracy is not yet known.</p>
     </section>
     <div className="ts-case__one-hot-tables">
       <div><Grid sheet="oneHotEncoding" range="B3:P75" indicatorHeaders caption="Brazil average temperature (°C) · monthly indicators and forecasts"/><p className="ts-case__encoding-footnote">January’s indicator is omitted on purpose: it is the reference month, represented by all zeros. January observations remain in the data.</p></div>
       <Coefficients rows={s.coefficients} baseline="January is the reference month. Forecast = intercept + the month’s coefficient."/>
     </div>
     <FullSheet sheet="oneHotEncoding"/>
   </section>
 </Lesson>
}
export function TSLinearTrendCase() {
 const s=data.seasonalityTrend, [noTrend,setNoTrend]=useState(true),[trend,setTrend]=useState(true)
 const labels=s.observations.map(r=>r.year+' '+r.month)
 return <Lesson number={8} title="Case study: seasonality with linear trend" lead="Maven Muscles wants a revenue forecast that captures both monthly seasonality and growth over time."><section className="ts-case__sheet"><div className="ts-case__controls"><label><input type="checkbox" checked={noTrend} onChange={e=>setNoTrend(e.target.checked)}/>Regression (No Trend)</label><label><input type="checkbox" checked={trend} onChange={e=>setTrend(e.target.checked)}/>Regression (Trend)</label></div><Chart title="Maven Muscles revenue" labels={labels.slice(0,130)} series={[{name:'Actual',values:s.observations.slice(0,130).map(r=>r.revenueMM),color:cyan},...(noTrend?[{name:'Regression (No Trend)',values:s.observations.slice(0,130).map(r=>r.forecastNoTrendMM),color:yellow,dashed:true}]:[]),...(trend?[{name:'Regression (Trend)',values:s.observations.slice(0,130).map(r=>r.forecastTrendMM),color:pink,dashed:true}]:[])]} min={2} max={6} step={1} yLabel="Revenue ($MM)"/><div className="ts-case__trend-tables"><Grid sheet="seasonalityTrend" range="B3:R135" indicatorHeaders overrides={{ Q3: 'Forecast (No Trend)', R3: 'Forecast (Trend)' }} caption="Maven Muscles revenue ($MM) · all month flags, time steps and forecasts"/><Coefficients rows={s.noTrendCoefficients} baseline="Seasonality only · December reference"/><Coefficients rows={s.trendCoefficients} baseline="Seasonality + time trend · December reference"/></div><p className="ts-case__note"><strong>Read the residual plots:</strong> the line shows actual revenue − predicted revenue, in observation order. The shaded area extends to zero. Without the time trend, errors rise from negative to positive; with the trend, they stay much closer to zero.</p><div className="ts-case__paired ts-case__residual-source"><figure><img src={residualNoTrend} alt="Residuals without trend: yellow line and shaded area rise from around minus 1.2 to plus 1 million dollars across the observations. Vertical scale is minus 2 to plus 1.5."/></figure><figure><img src={residualWithTrend} alt="Residuals with trend: magenta line and shaded area fluctuate closely around zero across the observations. Vertical scale is minus 2 to plus 1.5, matching the no-trend chart."/></figure></div><section className="ts-case__conclusion" aria-labelledby="ts-case-trend-conclusion"><h2 id="ts-case-trend-conclusion">Case study conclusion</h2><p><strong>Include both seasonality and the time trend.</strong> The seasonality-only model misses the growth in revenue; adding T-Step follows the observed values more closely and produces <strong>smaller residuals</strong>.</p><p className="ts-case__note">This improves the fit to observed data; future forecast accuracy still needs to be checked.</p></section><FullSheet sheet="seasonalityTrend"/></section></Lesson>
}
const windowKeys={ '1-Week':'ma1Week','2-Week':'ma2Week','3-Week':'ma3Week','4-Week':'ma4Week','6-Week':'ma6Week','12-Week':'ma12Week' } as const
export function TSSmoothingCase() {
 const s=data.smoothing, [window,setWindow]=useState<keyof typeof windowKeys>('2-Week')
 return <Lesson number={10} title="Case study: smoothing" lead="Maven Motel wants to see whether guest ratings are improving. Compare moving-average windows to reveal the underlying trend."><section className="ts-case__sheet"><div className="ts-case__layout"><Grid sheet="smoothing" range="B3:I1098" caption="Maven Motel guest ratings · all 1,095 days and six moving averages"/><div><label className="ts-case__select">Select window<select value={window} onChange={e=>setWindow(e.target.value as keyof typeof windowKeys)}>{Object.keys(windowKeys).map(w=><option key={w}>{w}</option>)}</select></label><Chart title="Maven Motel guest ratings" labels={s.observations.map(r=>r.date)} series={[{name:'Avg. Rating',values:s.observations.map(r=>r.averageRating),color:cyan,dots:true},{name:window+' moving average',values:s.observations.map(r=>r[windowKeys[window]]),color:yellow}]} min={.5} max={10.5} step={2} yLabel="Average guest rating"/><p className="ts-case__note">A wider window smooths more of the daily variation. Centered windows use observations before and after each date. They describe the historical trend; they are not forecasts available on that date.</p></div></div><section className="ts-case__conclusion" aria-labelledby="ts-case-smoothing-conclusion"><h2 id="ts-case-smoothing-conclusion">Case study conclusion</h2><p>The <strong>12-week moving average</strong> reveals the pattern: guest ratings <strong>rise, then level off</strong>.</p></section><FullSheet sheet="smoothing"/></section></Lesson>
}
export function TSNonLinearCase() {
 const s=data.nonLinearTrend,[A,setA]=useState<number>(s.parameters.A),[B,setB]=useState<number>(s.parameters.B),[C,setC]=useState<number>(s.parameters.C)
 const values=s.observations.map(r=>A*Math.exp(-B*r.week*Math.exp(-C*r.week)))
 const sse=s.observations.reduce((sum,r,i)=>sum+(r.unitsSold===null?0:(r.unitsSold-values[i])**2),0)
 const overrides:Record<string,number|null>={}
 s.observations.forEach((r,i)=>{overrides[`D${i+4}`]=values[i];overrides[`E${i+4}`]=r.unitsSold===null?null:(r.unitsSold-values[i])**2})
 return <Lesson number={12} title="Case study: non-linear trend" lead="Cat Slacks needs a weekly sales forecast for capacity planning. Use the first eight weeks of sales and adjust the supplied Gompertz curve."><section className="ts-case__sheet"><div className="ts-case__layout"><Grid sheet="nonLinearTrend" range="B3:E27" caption="Weekly sales · observed units, model and squared errors" overrides={overrides}/><div><div className="ts-case__controls">{[{name:'A · Max upper limit',value:A,set:setA,step:50},{name:'B · Low end growth rate',value:B,set:setB,step:.1},{name:'C · High end growth rate',value:C,set:setC,step:.01}].map(p=><label key={p.name}>{p.name}<input type="number" min="0" max={p.name.startsWith('A')?10000:p.name.startsWith('B')?100:5} step={p.step} value={p.value} onChange={e=>{if(e.target.value!==''&&e.target.validity.valid)p.set(Number(e.target.value))}}/></label>)}</div><p className="ts-case__equation">ŷ = A × exp(−B × t × exp(−C × t))</p><p>Sum of squared errors: <strong>{fmt(sse,2)}</strong></p><Chart title="Cat Slacks weekly sales" labels={s.observations.map(r=>String(r.week))} series={[{name:'Units Sold',values:s.observations.map(r=>r.unitsSold),color:cyan,dots:true},{name:'Gompertz Model',values,color:yellow}]} min={0} max={Math.max(1200,Math.ceil(A/200)*200)} step={Math.max(200,Math.ceil(A/1200)*200)} xLabel="Week" yLabel="Units sold"/><p className="ts-case__note">A, B and C are trial parameters. Changing them adjusts the curve; it does not fit a new regression. Weeks 9–24 are forecasts.</p></div></div><section className="ts-case__conclusion" aria-labelledby="ts-case-nonlinear-conclusion"><h2 id="ts-case-nonlinear-conclusion">Case study conclusion</h2><p>A <strong>Gompertz curve</strong> models early sales growth toward a <strong>capacity limit</strong>. Adjust the growth rates to fit the eight observed weeks.</p></section><details className="ts-case__details"><summary>Saved worksheet values and calculations</summary><Grid sheet="nonLinearTrend" range={grids.nonLinearTrend.range} caption="Saved worksheet · original A = 900, B = 7, C = 0.4"/></details></section></Lesson>
}
export function TSInterventionCase() {
 const s=data.interventionAnalysis,[show,setShow]=useState(true), rows=s.observations, change=rows.findIndex(r=>r.landingPage==='New')
 return <Lesson number={14} title="Case study: intervention analysis" lead="Alpine Supplies redesigned its product landing page. Estimate the change in conversion rate and sales using the earlier page’s seasonal pattern and trend as a baseline."><section className="ts-case__sheet"><div className="ts-case__layout"><Grid sheet="interventionAnalysis" range="B3:O94" caption="Daily conversion rate · sessions, weekday flags, forecasts and incremental sales"/><div><label className="ts-case__toggle"><input type="checkbox" checked={show} onChange={e=>setShow(e.target.checked)}/>Show baseline forecast</label><Chart title="Conversion rate before and after the redesign" labels={rows.map(r=>r.date)} series={[{name:'CVR (Pre)',values:rows.map(r=>r.landingPage==='Original'?r.conversionRate:null),color:cyan},...(show?[{name:'Forecast',values:rows.map(r=>r.forecast),color:yellow,dashed:true}]:[]),{name:'CVR (Post)',values:rows.map(r=>r.landingPage==='New'?r.conversionRate:null),color:green}]} min={0} max={.25} step={.05} percent yLabel="Conversion rate" intervention={change}/><Coefficients rows={s.coefficients} baseline="Fit to the 66 days before the change · Saturday reference"/><p className="ts-case__equation">Incremental sales = (actual CVR − baseline CVR) × sessions</p><section className="ts-case__conclusion" aria-labelledby="ts-case-intervention-conclusion"><h2 id="ts-case-intervention-conclusion">Case study conclusion</h2><p>Cumulative incremental sales: <strong>{fmt(rows.at(-1)!.cumulative!,2)}</strong></p><p className="ts-case__note">This is a model-based estimate. Other changes during the same period could also affect sales.</p></section></div></div><div className="ts-case__paired"><Chart title="Daily conversion rate" labels={rows.map(r=>r.date)} series={[{name:'CVR',values:rows.map(r=>r.conversionRate),color:cyan}]} min={0} max={.25} step={.05} percent yLabel="Conversion rate"/><Chart title="CVR · original and new landing page" labels={rows.map(r=>r.date)} series={[{name:'CVR (Pre)',values:rows.map(r=>r.landingPage==='Original'?r.conversionRate:null),color:cyan},{name:'CVR (Post)',values:rows.map(r=>r.landingPage==='New'?r.conversionRate:null),color:green}]} min={0} max={.25} step={.05} percent yLabel="Conversion rate" intervention={change}/></div><div className="ts-case__paired"><Chart title="Marginal sales" labels={rows.slice(change).map(r=>r.date)} series={[{name:'Daily incremental sales',values:rows.slice(change).map(r=>r.incremental),color:green}]} min={0} max={120} step={20} bars yLabel="Incremental sales"/><Chart title="Cumulative sales" labels={rows.slice(change).map(r=>r.date)} series={[{name:'Cumulative incremental sales',values:rows.slice(change).map(r=>r.cumulative),color:green,area:true}]} min={0} max={1400} step={200} yLabel="Cumulative sales"/></div><FullSheet sheet="interventionAnalysis"/></section></Lesson>
}
