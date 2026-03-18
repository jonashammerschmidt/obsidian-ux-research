---
entity_type: painpoint
schema_version: 1
title: Passendes Programm schwer zu finden
task: "[[01 - Task - Programm wählen|TASK: Programm wählen]]"
symptoms:
  - [[Symptom - Längeres Vergleichen]]
  - [[Symptom - Falsches Programm gewählt]]
  - [[Symptom - Wäsche muss nochmal gewaschen werden]]
root_causes:
  - [[Root Cause - Programmnamen sind ähnlich]]
  - [[Root Cause - Bedienfeld ist überladen]]
  - [[Root Cause - Temperaturanzeige ist klein]]
---

Beim Starten ist nicht klar, welches Programm für die aktuelle Wäsche am besten geeignet ist.

Die Programmauswahl ist kognitiv unnötig aufwendig.

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
