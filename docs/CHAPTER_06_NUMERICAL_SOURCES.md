# Chapter 6.9–6.15 source notes

## Sources reviewed

- `../Learning Files/3. Visual Guide to Machine Learning.pdf`, PDF pages 71–79: numerical–numerical distributions (p71), correlation and relationship sketches (p72), covariance/variance formula comparison (p73), correlation does not imply causation and the ice-cream example (pp74–75), color as a third dimension (p76), the Loud & Clear case assignment (p77), best practices (p78), and the Part 2 classification transition (p79). Rendered p71–77 for visual inspection; extracted p60–80 to confirm page sequence and text.
- `../06. Multivariate Profiling/9. Numerical-Numerical.vtt`: paired numerical rows, scatter plots, possible positive/negative/no and nonlinear patterns; spend/sales and floor-area/price examples.
- `../06. Multivariate Profiling/10. Correlation.vtt`: linear relationship, whether paired observations fall above or below their means, covariance, and scale normalization with standard deviations.
- `../06. Multivariate Profiling/11. Correlation vs. Causation.vtt`: ice cream sales and drowning deaths; warm/sunny weather and increased swimming are shared explanatory factors; association alone does not establish causality.
- `../06. Multivariate Profiling/12. Visualizing Third Dimension.vtt`: color or symbols can reveal different group-specific relationships hidden in the ungrouped cloud; many dimensions/classes exceed practical visual comparison.
- `../06. Multivariate Profiling/13. CASE STUDY Correlation.vtt`: Loud & Clear, weekly digital media spend against traffic, offline media spend, sales and site load time; positive, negative, curved positive, and near-zero linear patterns respectively.
- `../06. Multivariate Profiling/14. BEST PRACTICES Multivariate Profiling.vtt`: inspect variable types, select matching profiles/visuals, compare groups, and do not treat correlation as causation.
- `../06. Multivariate Profiling/16. Looking Ahead to Part 2.vtt`: transition from QA and profiling to supervised classification. Quiz 15.3 was intentionally excluded.
- `../Learning Files/3. Maven_ML_Demos_COMPLETE.xlsx`, `Correlation` sheet, columns B:G, rows 3:1003. Extracted all 1,000 records without rounding into `src/chapters/multivariateNumericalData.ts`. Workbook columns are Week_Num, Digital_Media_Spend, Site_Traffic, Offline_Media_Spend, Sales and Site_Load_Time. The workbook does not define measurement units, so the lesson uses friendly labels and reports this once rather than assigning unverified units.

## Workbook checks

Pearson correlations using all 1,000 paired rows for digital media spend against each field:

| Field | Pearson r | Reading consistent with source walkthrough |
| --- | ---: | --- |
| Site_Traffic | +0.900531 | strong positive linear association |
| Offline_Media_Spend | −0.900526 | strong negative linear association |
| Sales | +0.963741 | strong positive association; scatter bends/flattens at high spend |
| Site_Load_Time | −0.015883 | almost no linear association |

The plotted workbook case uses all 1,000 rows. Tests assert the fixture count and each full-data correlation, in addition to checking Pearson edge cases and a curved zero-correlation example.

## Teaching decisions and corrections

- Each page starts with a prominent general definition and motivates why the method is useful before controls or calculations. Scatter plots are introduced as paired rows; correlation is explicitly Pearson’s *linear* summary.
- The slide’s sample-correlation equation, Σ[(xᵢ−x̄)(yᵢ−ȳ)] / ((n−1)sₓsᵧ), is mathematically equivalent to the centered-sum form shown in the lesson because the sample standard deviations contain the same n−1 divisor. A worked three-row example keeps every deviation, product, and denominator visible.
- A value near zero is not explained as absence of every relationship: the lesson includes the symmetric U-shaped example (y=x²), whose Pearson r is zero. Constant input, fewer than two observations, mismatched arrays and non-finite values return `null` because r is undefined or cannot be computed for those inputs.
- The source’s use of language about predicting or impacting a second variable is bounded: an observed association may support exploration or prediction, but correlation alone does not prove an intervention’s effect. A simple shared-cause diagram preserves the source’s warm-weather explanation.
- The third-variable example uses named customer groups for readability; values are schematic and are not taken from the correlation workbook. It demonstrates that group-specific patterns can point in different directions.
- The case walkthrough’s qualitative findings were verified against the workbook, rather than copied from the source narrative alone. The workbook has no stated units, so none are inferred.
- The final lesson bridges to Part 2 classification at a high level and does not introduce implementation details from the following chapters.
