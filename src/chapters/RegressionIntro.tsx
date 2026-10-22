import type { ReactNode } from 'react'
import landscape from '../assets/regression-intro-191.png'
import workflow from '../assets/regression-intro-198.png'
import fitting from '../assets/regression-intro-201.png'
import './RegressionIntro.css'

function Lesson({ number, title, lead, children }: { number: string; title: string; lead: string; children: ReactNode }) {
  return <article className="regression-intro" aria-labelledby={`regression-${number}-title`}><header><p className="regression-intro__eyebrow">Chapter 12 · Lesson {number}</p><h1 id={`regression-${number}-title`}>{title}</h1><p>{lead}</p></header>{children}</article>
}
function Panel({ title, children }: { title: string; children: ReactNode }) { return <section className="regression-intro__panel"><h2>{title}</h2>{children}</section> }
function Visual({ src, alt }: { src: string; alt: string }) { return <div className="regression-intro__visual"><img src={src} alt={alt} /></div> }

export function RISupervisedUnsupervised() {
  return <Lesson number="12.1" title="Supervised and unsupervised learning" lead="Regression is the supervised learning branch used to predict numerical values.">
    <Panel title="The machine learning landscape"><Visual src={landscape} alt="Machine learning branches into supervised learning, unsupervised learning, and advanced topics. Supervised learning includes classification and regression; regression includes least squares, linear regression, forecasting, non-linear regression, and intervention analysis." /></Panel>
    <Panel title="Does the data have a label?"><div className="regression-intro__compare"><div><h3>Supervised learning</h3><strong>Has a label</strong><p>Predict a label or value.</p></div><div><h3>Unsupervised learning</h3><strong>Has no label</strong><p>Describe or organize the data.</p></div></div><p>A <strong>label</strong> is an observed variable you are trying to predict: purchase (1/0), sentiment (positive/negative), or product type (A/B/C).</p></Panel>
    <Panel title="What are we predicting?"><div className="regression-intro__compare"><div><h3>Classification → categorical</h3><ul><li>Which subscribers are likely to cancel or churn?</li><li>Which segment does this customer fall into?</li><li>Is a review positive, negative, or neutral?</li></ul></div><div className="regression-intro__emphasis"><h3>Regression → numerical</h3><ul><li>How much revenue are we forecasting for the quarter?</li><li>How many units will we sell next season?</li><li>How will seasonality affect the size of our customer base?</li></ul></div></div></Panel>
  </Lesson>
}

export function RIRecapKeyConcepts() {
  const sessions = [[1,'Chrome',354,11,1],[2,'Safari',94,4,1],[3,'Safari',36,2,0],[4,'IE',17,1,0],[5,'Chrome',229,9,1]]
  return <Lesson number="12.2" title="Recap: key concepts" lead="Each row is a record or observation. Each column is a variable.">
    <Panel title="Five web sessions"><div className="regression-intro__table-wrap"><table><caption>Browser and Purchase are categorical; Time and Pageviews are numerical.</caption><thead><tr>{['Session ID','Browser','Time (Sec)','Pageviews','Purchase'].map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{sessions.map((row,i)=><tr key={i}>{row.map((v,j)=><td key={j} className={j===1||j===4?'ri-category':''}>{v}</td>)}</tr>)}</tbody></table></div><p><strong>Purchase 1/0 means Yes/No:</strong> numbers can represent categories. Session ID identifies the record.</p></Panel>
    <Panel title="QA and data profiling come first, every time"><p>Without quality data, you cannot build quality models: <strong>garbage in, garbage out.</strong> Profile the data, then filter on key variables to understand their relationships.</p></Panel>
    <Panel title="When visual analysis falls short"><p>Machine learning extends visual analysis and univariate/multivariate profiling when many variables need to be considered together.</p></Panel>
  </Lesson>
}

// Marketing example: source pages 196–200. Page 199 has its own five-row version.
const months = [
  [1,30,'High',130000,12,1300050], [2,15,'Low',600000,5,11233310],
  [3,11,'Medium',15000,10,1112050], [4,22,'Medium',705000,11,1582077],
  [5,41,'High',3000,3,1889053], [6,5,'High',3500,3,1200089],
  [7,23,'Low',280000,2,1300080], [8,12,'Low',120000,11,700150],
  [9,8,'Low',1000000,51,41011150], [10,19,'Medium',43000,10,1000210],
] as const
const money = (n: number) => '$'+n.toLocaleString('en-US')
function MarketingTable({ engineered=false, split=false }: { engineered?: boolean; split?: boolean }) {
  const rows = engineered ? months.slice(0,5) : months
  return <div className="regression-intro__table-wrap"><table className={engineered?'ri-engineered':''}><caption>{engineered?'Original fields → engineered features · Scroll right to see every calculated column':split?'Months 1–7: training data · Months 8–10: test data':'Observed months 1–10 → predict the missing revenue for month 11'}</caption><thead>{engineered&&<tr><th colSpan={6}>Original fields</th><th colSpan={5} className="ri-derived">Engineered features</th></tr>}<tr>{['Month ID','Social Posts','Competitive Activity','Marketing Spend','Promotion Count','Revenue',...(engineered?['Competitive High','Competitive Medium','Competitive Low','Promotion >10 & Social >25','Log Spend']:[])].map((h,i)=><th key={h} scope="col" className={i>=6?'ri-derived':undefined}>{h}</th>)}</tr></thead><tbody>{rows.map(row=>{
    const [id,posts,activity,spend,promotions,revenue]=row
    const social=engineered&&id===3?8:posts
    return <tr key={id} className={split?(id<=7?'ri-training':'ri-test'):undefined}><th scope="row">{id}</th><td>{social}</td><td>{activity}</td><td>{money(spend)}</td><td>{promotions}</td><td className="ri-target">{money(revenue)}</td>{engineered&&<>{['High','Medium','Low'].map(a=><td className="ri-derived" key={a}>{activity===a?1:0}</td>)}<td className="ri-derived">{promotions>10&&social>25?1:0}</td><td className="ri-derived">{Math.log(spend).toFixed(1)}</td></>}</tr>
  })}{!engineered&&!split&&<tr className="ri-test"><th scope="row">11</th><td>7</td><td>High</td><td>$320,112</td><td>8</td><td className="ri-target"><strong>???</strong></td></tr>}</tbody></table></div>
}
export function RIRegression101() {
  return <Lesson number="12.3" title="Regression 101" lead="Predict a numeric dependent variable using independent variables.">
    <div className="regression-intro__compare"><Panel title="Y · Dependent variable"><p><strong>The numerical outcome you are trying to predict.</strong></p><p>Also called the target, output, or response variable.</p></Panel><Panel title="X · Independent variables"><p><strong>The variables that help predict Y.</strong></p><p>Also called predictors, features, explanatory variables, or covariates.</p></Panel></div>
    <Panel title="Predict monthly revenue from marketing and sales data"><MarketingTable/><div className="regression-intro__compare"><div><h3>Inputs · X</h3><p>Social Posts, Competitive Activity, Marketing Spend, and Promotion Count.</p></div><div><h3>Target · Y</h3><p>Revenue is numerical, so this is regression.</p></div></div><p>Train on records with observed inputs <strong>and</strong> revenue. Apply the fitted model to month 11, whose inputs are known but revenue is unknown.</p><p>Competitive Activity is categorical; it can be encoded into numerical input fields.</p></Panel>
    <Panel title="Regression workflow"><Visual src={workflow} alt="Measurement planning, preliminary QA, and data profiling come first. Then feature engineering → data splitting → model training → selection and tuning, with loops back to earlier modeling steps."/><p>Use training data for fitting and tuning; reserve test data for the final evaluation.</p></Panel>
  </Lesson>
}
export function RIFeatureEngineering() {
  return <Lesson number="12.4" title="Feature engineering for regression" lead="Create additional independent variables from existing fields to make useful model inputs.">
    <Panel title="Original fields → engineered features"><MarketingTable engineered/><div className="regression-intro__feature-notes"><div><h3>One-hot encoding</h3><p>High → <strong>1, 0, 0</strong><br/>Low → <strong>0, 0, 1</strong><br/>Medium → <strong>0, 1, 0</strong></p></div><div><h3>Boolean logic</h3><p>Set the flag to 1 only when <strong>Promotion &gt; 10 AND Social &gt; 25</strong>. Only month 1 meets both conditions.</p></div><div><h3>Natural log</h3><p>Transform Marketing Spend:<br/><strong>ln(130,000) ≈ 11.8</strong></p></div></div></Panel>
    <Panel title="Data splitting"><p>Separate records for training and testing. The course’s rule of thumb is <strong>70–80% training</strong> and <strong>20–30% test</strong>.</p><MarketingTable split/><p><strong>Test data is not used to optimize models.</strong> It checks how well the fitted model predicts unseen records.</p></Panel>
    <Panel title="Overfitting"><p>A model overfits when it predicts training data very well but test data poorly—like memorizing answers rather than learning to generalize.</p><Visual src={fitting} alt="Three fits to the same points: an overfit wavy curve follows training observations too closely; a well-fit smooth U-shaped curve captures the pattern; an underfit horizontal line misses the pattern. Overfit has high variance and low bias, well-fit balances bias and variance, underfit has high bias and low variance."/></Panel>
  </Lesson>
}
function RevenueQuestions() {
  return <Panel title="Same revenue question, different evidence">
    <div className="regression-intro__compare">
      <div className="ri-question"><h3>What revenue should we expect?</h3>
        <svg viewBox="0 0 440 310" role="img" aria-label="Known marketing inputs pass through a fitted model to produce estimated monthly revenue.">
          <defs><marker id="ri-predict-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="#167f7d"/></marker></defs>
          <rect x="45" y="15" width="350" height="70" rx="12" className="ri-diagram-input"/><text x="220" y="44">Known marketing inputs · X</text><text x="220" y="68" className="ri-diagram-small">Posts · Competition · Spend · Promotions</text>
          <path d="M220 85 V117" className="ri-diagram-arrow" markerEnd="url(#ri-predict-arrow)"/>
          <rect x="100" y="125" width="240" height="60" rx="12" className="ri-diagram-model"/><text x="220" y="161">Fitted regression model</text>
          <path d="M220 185 V217" className="ri-diagram-arrow" markerEnd="url(#ri-predict-arrow)"/>
          <rect x="65" y="225" width="310" height="65" rx="12" className="ri-diagram-input"/><text x="220" y="264">Estimated monthly revenue · ŷ</text>
        </svg><p>Check the prediction against revenue observed later.</p>
      </div>
      <div className="ri-question"><h3>Does extra spend cause extra revenue?</h3>
        <svg viewBox="0 0 440 310" role="img" aria-label="Possible explanation: holiday demand can increase both marketing spend and revenue. The causal effect of spend on revenue remains a question.">
          <defs><marker id="ri-cause-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="#167f7d"/></marker></defs>
          <rect x="105" y="15" width="230" height="65" rx="12" className="ri-diagram-demand"/><text x="220" y="54">Holiday demand</text>
          <path d="M160 80 L100 165" className="ri-diagram-arrow" markerEnd="url(#ri-cause-arrow)"/><path d="M280 80 L340 165" className="ri-diagram-arrow" markerEnd="url(#ri-cause-arrow)"/>
          <text x="94" y="120" className="ri-diagram-small">may raise</text><text x="346" y="120" className="ri-diagram-small">may raise</text>
          <rect x="10" y="175" width="170" height="65" rx="12" className="ri-diagram-input"/><text x="95" y="214">Marketing spend</text>
          <rect x="270" y="175" width="160" height="65" rx="12" className="ri-diagram-input"/><text x="350" y="214">Revenue</text>
          <path d="M180 208 H262" className="ri-diagram-arrow ri-diagram-unknown" markerEnd="url(#ri-cause-arrow)"/><text x="222" y="193">?</text>
          <text x="220" y="283" className="ri-diagram-small">Moving together does not establish cause.</text>
        </svg><p>Holiday demand is a possible <strong>confounder</strong>: a common influence on both variables.</p>
      </div>
    </div>
  </Panel>
}

export function RIPredictionRootCause() {
  return <Lesson number="12.5" title="Prediction vs. root-cause analysis" lead="Regression has two different uses: predicting an outcome and investigating causal impact.">
    <div className="regression-intro__compare"><Panel title="Prediction"><p><strong>Predict or forecast a numerical dependent variable.</strong></p><p>The goal is accurate predictions, even when causality cannot be proven.</p></Panel><Panel title="Root-cause analysis"><p><strong>Investigate the causal impact of individual model inputs.</strong></p><p>The goal is to understand how changing an input changes the outcome. Regression alone does not establish causality; this needs an appropriate study design and assumptions.</p></Panel></div><RevenueQuestions/><p className="regression-intro__focus">This course focuses on <strong>prediction and forecasting</strong>.</p>
  </Lesson>
}
