# Chapter 06 categories source notes

Scope: lessons 6.1–6.3 (Multivariate profiling, categorical-categorical distributions, and the heat-map case study). Source review covers PDF pages 61–65, the three matching VTT files, and the workbook fixture below.

## Course concepts and adaptation

- **PDF p61:** Multivariate profiling follows univariate profiling and studies relationships between multiple variables. The source names joint distributions and notes they can help guide the choice of ML techniques. Lesson 6.1 keeps this as the central definition and explains why looking across variables can reveal patterns hidden by a single overall summary.
- **PDF pp63–64:** A categorical-categorical distribution counts unique combinations. Frequency tables show counts; proportion tables show each cell's share of the full table; heat maps use conditional formatting to reveal patterns. The course example groups product inventory by **Design × Size**. Lesson 6.2 uses the exact 5×5 table and provides count, proportion, and heat-map views.
- **PDF p65:** The NYC DOT case assignment is accident frequency by **hour of day × day of week** for 2019–2020, with the heat map intended to show lower and higher counts. Lesson 6.3 uses the workbook's 24-hour by seven-day aggregate, totals, and an interactive count/share/heat-map display.

## Workbook source

Read-only source: `../Learning Files/3. Maven_ML_Demos_COMPLETE.xlsx`.

- **Chapter 6 product inventory:** values transcribed from the rendered PDF p64 5×5 frequency table. The 25 cells sum to **638**; the proportional view uses this as its denominator.
- **NYC accidents:** `Frequency Table!D6:AA12` contains the weekday-by-hour frequency cells; weekday totals are `AC6:AC12`, hour totals are `D14:AA14`, and the grand total is `AC14` (**579,025**). The displayed weekday/hour labels are `B6:B12` and `D4:AA4`. The table rows and columns sum to the reported totals. These are pre-aggregated workbook values; the case lesson does not imply access to event-level records.
- Workbook proportion values are available in rows 26–32, but the lesson calculates each cell's share as `count / 579,025` so that the denominator is visible and all 168 cells use one consistent total.

## Interpretation boundary

The course describes high-count windows as when accidents are “most likely.” Counts alone do not give per-driver, per-trip, or per-mile risk. The lesson therefore describes recorded frequencies in this 2019–2020 sample and explicitly says exposure denominators and additional analysis would be needed for risk comparisons or causal claims. Higher inventory counts likewise describe available products in the sample; demand data is needed before calling inventory excess.

The course uses red for high accident counts and green for low counts, because high counts represent more observed accidents. The heat-map legend states the encoded quantity and retains cell values so meaning does not rely on color alone.
