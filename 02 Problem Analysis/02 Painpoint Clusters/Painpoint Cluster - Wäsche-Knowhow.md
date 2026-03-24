---
entity_type: painpoint_cluster
schema_version: 1
title: Wäsche-Knowhow
order: 1
---

Beschreibt Painpoints, bei denen fehlendes oder schwer zugängliches Wäschewissen die Entscheidung erschwert.

## Related Painpoints

```dataview
LIST FROM "02 Problem Analysis/01 Painpoints"
WHERE painpoint_cluster = this.file.link
SORT file.name ASC
```
