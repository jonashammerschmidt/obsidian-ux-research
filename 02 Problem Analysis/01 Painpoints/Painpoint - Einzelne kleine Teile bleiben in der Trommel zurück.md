---
entity_type: painpoint
schema_version: 1
title: Einzelne kleine Teile bleiben in der Trommel zurück
task: "[[02 - Task - Nasse Wäsche herausnehmen|TASK: Nasse Wäsche herausnehmen]]"
symptoms:
  - [[Symptom - Einzelne Teile werden übersehen]]
root_causes:
  - [[Root Cause - Socken und kleine Teile kleben an der Trommel]]
---

Beim Entladen werden kleine Teile leicht übersehen und bleiben in der Maschine liegen.

Kleine Wäschestücke verschwinden leicht aus dem Blick.

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
