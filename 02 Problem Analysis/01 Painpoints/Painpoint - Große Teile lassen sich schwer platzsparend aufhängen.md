---
entity_type: painpoint
schema_version: 1
title: Große Teile lassen sich schwer platzsparend aufhängen
task: "[[02 - Task - Wäsche aufhängen|TASK: Wäsche aufhängen]]"
symptoms:
  - [[Symptom - Umhängen nötig]]
  - [[Symptom - Wäsche trocknet langsamer]]
root_causes:
  - [[Root Cause - Wenig Platz auf dem Wäscheständer]]
  - [[Root Cause - Reihenfolge beim Aufhängen ist ungeschickt]]
---

Beim Aufhängen großer Teile reicht der Platz oft nicht direkt sinnvoll aus.

Das Aufhängen braucht mehr Umorganisation als nötig.

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
