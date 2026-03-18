---
entity_type: painpoint
schema_version: 1
title: Unklar, was zusammen gewaschen werden darf
task: "[[02 - Task - Wäsche sortieren|TASK: Wäsche sortieren]]"
---

Beim Sortieren ist nicht sofort klar, welche Kleidungsstücke zusammen in einen Waschgang gehören.

Die Sortierentscheidung fühlt sich unsicher an.

## Related Solutions

```dataview
LIST FROM "03 Solutions"
WHERE contains(solves, this.file.link)
SORT file.name ASC
```

## Problem Analysis

```dataviewjs
await dv.view("00 System/views/problem-analysis", {
  solutionsHeadingLevel: 3
});
```
