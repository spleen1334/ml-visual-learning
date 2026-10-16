# Chapter 04 QA inventory data

`src/chapters/qaInventory.json` contains the 100 inventory records in `Preliminary QA!B4:H103`, with canonical categories copied from the profiling list in `J19:J28`. Excel row numbers are retained in each record so the interactive checks can point to the source observations.

The source workbook is `../Learning Files/3. Maven_ML_Demos.xlsx` (sheet `Preliminary QA`, source range `B3:H103`). Its SHA-256 is `c43750fb296339a6534808c0dad76c1ef5491a96cf5492a77cdbe91d52adb4dc`. Extraction read stored cached worksheet XML values; it did not recalculate formulas or modify the workbook. Excel date serials use the workbook's 1900 date system and were converted to ISO calendar dates in UTC. The text dates in rows 89–103 retain their original `d-MMM-yy` strings and are flagged with `dateIsText: true`.

The data records the workbook's raw state. `issueRows` maps the five QA controls to Excel row numbers: zero-coded prices in F11, F19, F24, F25, F36, F53, F85, and F98; text dates in B89:B103; no row-specific identifier defect; the price outlier in F34; and category strings in D24, D29, D42, and D71. `categoryFixes` preserves the workbook's exact canonical spellings. All SKU values are stored as numbers in the source and can be converted to strings as an identifier cleanup.

With all cleanup controls off, the workbook profile is 100 records, price sum 591.44, mean 5.9144, minimum 0, maximum 375, and 96 recognized categories. With all controls on, eight zero-coded prices become null and are omitted from price summaries while their rows are retained, F34 becomes 3.75, text dates are parsed, and all category values are recognized: 92 prices, mean 2.393369565217391, minimum 1.13, maximum 8.99, and latest date 2020-05-30.
