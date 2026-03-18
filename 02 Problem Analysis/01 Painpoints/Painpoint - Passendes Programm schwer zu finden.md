---
entity_type: painpoint
schema_version: 1
title: Passendes Programm schwer zu finden
task: "[[01 - Task - Programm waehlen|TASK: Programm waehlen]]"
---

Beim Starten ist nicht klar, welches Programm fuer die aktuelle Waesche am besten geeignet ist.

Die Programmauswahl ist kognitiv unnoetig aufwendig.

## Related Solutions

```dataview
LIST FROM "03 Solution"
WHERE contains(solves, this.file.link)
SORT file.name ASC
```
