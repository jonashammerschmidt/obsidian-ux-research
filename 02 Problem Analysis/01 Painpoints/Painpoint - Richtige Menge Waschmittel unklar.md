---
entity_type: painpoint
schema_version: 1
title: Richtige Menge Waschmittel unklar
task: "[[01 - Task - Waschmittel dosieren|TASK: Waschmittel dosieren]]"
painpoint_cluster: "[[Painpoint Cluster - Wäsche-Knowhow|CLUSTER: Wäsche-Knowhow]]"
---

Vor dem Einfüllen ist unsicher, wie viel Waschmittel für die aktuelle Ladung passend ist.

Die Dosierentscheidung kostet unnötig Zeit.

## Related Solutions

```dataview
LIST FROM "03 Solutions"
WHERE contains(solves, this.file.link)
SORT file.name ASC
```
