---
entity_type: painpoint_cluster
schema_version: 1
title:
order:
---

> Describe the painpoint cluster here.


## Related Painpoints

```dataview
LIST FROM "02 Problem Analysis/01 Painpoints"
WHERE painpoint_cluster = this.file.link
SORT file.name ASC
```
