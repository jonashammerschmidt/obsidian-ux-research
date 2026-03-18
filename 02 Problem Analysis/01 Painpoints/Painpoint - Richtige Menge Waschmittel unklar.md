---
entity_type: painpoint
schema_version: 1
title: Richtige Menge Waschmittel unklar
task: "[[01 - Task - Waschmittel dosieren|TASK: Waschmittel dosieren]]"
symptoms:
  - [[Symptom - Zweifel vor dem Start]]
root_causes:
  - [[Root Cause - Dosierhinweise sind schwer lesbar]]
---

Vor dem Einfüllen ist unsicher, wie viel Waschmittel für die aktuelle Ladung passend ist.

Die Dosierentscheidung kostet unnötig Zeit.

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
