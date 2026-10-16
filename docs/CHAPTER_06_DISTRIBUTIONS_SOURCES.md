# Chapter 6: categorical-numerical distributions source notes

## PDF reference

Source: `../Learning Files/3. Visual Guide to Machine Learning.pdf`, printed PDF pages 66-70 (zero-based pages 65-69).
Visual check: rendered PDF pages 66-70 to PNG with Poppler at 100 dpi and inspected each page; the lesson diagrams and text match the page notes below.

- p. 66 defines categorical-numerical distributions as comparing a numerical distribution across category classes. It names histograms and kernel densities, violin plots, and box plots. Use cases include business metrics by customer class and sales by day or hour.
- p. 67 repeats a separate KDE for each class on a shared numeric axis. The example distributions are teal (mean about 15, low variance), yellow (about 20, moderate variance), and purple (about 25, higher variance, overlapping yellow). This is grouped one-dimensional profiling, not a joint two-dimensional density surface.
- p. 68 describes a violin as a KDE turned vertically and mirrored around its centerline, with the numeric variable on the vertical axis and categories on the horizontal axis. It reuses the KDE data and makes category shapes easier to compare without overlaying curves.
- p. 69 lists median, minimum/maximum excluding outliers, 25th/75th percentiles, and outliers as box plot attributes. The visual contains three category groups with differing spread and several points outside whiskers.
- p. 70 says categorical profiling becomes hard to visualize with many variables or classes and cannot answer predictive/prescriptive questions or establish causation. Machine learning can extend the analysis, but its predictions still require evaluation and do not prove causation.

## Subtitle cross-check

Checked `4. Categorical-Numerical.vtt` through `8. Limitations of Categorical Distributions.vtt`. They reinforce the PDF wording and examples. The KDE lesson interprets relative center, variance, modality, skew and overlap by class; the violin lesson explains turn, mirror and repeat per class; the box plot lesson prioritizes the compact statistical summary. The limitation lesson uses randomized sales-page elements as an example of a causal question that counts alone cannot resolve.

## Teaching and accuracy notes for implementation

- Lead with the general definition, then give a concrete metric-by-group reason to use the view before showing formulas or controls.
- Keep one quantitative axis and units consistent across class comparisons. Label grouped KDEs as repeated univariate estimates rather than a joint 2D KDE.
- State violin width as estimated local density; bandwidth controls smoothing and can reveal or hide bumps.
- For box plots, expose the quantile convention and calculate quartiles exactly. Define 1.5×IQR fences; whisker endpoints are the most extreme observed values still inside the fences. Outlier marks are rule-based flags, not errors.
- For high-cardinality/high-dimensional cases, show the growth in combinations as a visualization limit. Profiling helps describe and choose next analyses; predictive models need evaluation, and neither profiling nor machine learning alone proves causation.
