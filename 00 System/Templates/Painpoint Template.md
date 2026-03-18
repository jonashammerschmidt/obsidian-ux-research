---
entity_type: painpoint
schema_version: 1
title:
task:
---

> Describe the painpoint here.


## Related Solutions

```dataview
LIST FROM "03 Solutions"
WHERE contains(solves, this.file.link)
SORT file.name ASC
```
