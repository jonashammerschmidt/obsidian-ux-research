---
entity_type: painpoint
schema_version: 1
title: Einzelne kleine Teile bleiben in der Trommel zurück
task: "[[02 - Task - Nasse Wäsche herausnehmen|TASK: Nasse Wäsche herausnehmen]]"
painpoint_cluster: "[[Painpoint Cluster - Handhabung der Teile|CLUSTER: Praktische Handhabung]]"
---

Beim Entladen werden kleine Teile leicht übersehen und bleiben in der Maschine liegen.

Kleine Wäschestücke verschwinden leicht aus dem Blick.

## Related Solutions

```dataview
LIST FROM "03 Solutions"
WHERE contains(solves, this.file.link)
SORT file.name ASC
```
