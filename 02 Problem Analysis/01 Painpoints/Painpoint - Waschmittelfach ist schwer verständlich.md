---
entity_type: painpoint
schema_version: 1
title: Waschmittelfach ist schwer verständlich
task: "[[01 - Task - Waschmittel dosieren|TASK: Waschmittel dosieren]]"
symptoms:
  - [[Symptom - Mittel landet im falschen Fach]]
  - [[Symptom - Waschgang muss neu gestartet werden]]
root_causes:
  - [[Root Cause - Symbole sind unklar]]
  - [[Root Cause - Flüssigwaschmittel und Weichspüler sehen ähnlich aus]]
---

Die Einfächerung der Mittel ist nicht selbsterklärend, sodass leicht das falsche Fach benutzt wird.

Die Fachlogik ist nicht sofort nachvollziehbar.

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
