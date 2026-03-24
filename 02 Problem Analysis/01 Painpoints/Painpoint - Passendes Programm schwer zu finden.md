---
entity_type: painpoint
schema_version: 1
title: Passendes Programm schwer zu finden
task: "[[01 - Task - Programm wählen|TASK: Programm wählen]]"
painpoint_cluster: "[[Painpoint Cluster - Wäsche-Knowhow|CLUSTER: Wäsche-Knowhow]]"
---

Beim Starten ist nicht klar, welches Programm für die aktuelle Wäsche am besten geeignet ist.

Die Programmauswahl ist kognitiv unnötig aufwendig.

## Related Solutions

```dataview
LIST FROM "03 Solutions"
WHERE contains(solves, this.file.link)
SORT file.name ASC
```
