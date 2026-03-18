---
entity_type: painpoint
schema_version: 1
title: Richtige Menge Waschmittel unklar
task: "[[01 - Task - Waschmittel dosieren|TASK: Waschmittel dosieren]]"
---

Vor dem Einfuellen ist unsicher, wie viel Waschmittel fuer die aktuelle Ladung passend ist.

Die Dosierentscheidung kostet unnoetig Zeit.

## Related Solutions

```dataview
LIST FROM "03 Solutions"
WHERE contains(solves, this.file.link)
SORT file.name ASC
```
