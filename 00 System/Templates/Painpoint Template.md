---
entity_type: painpoint
schema_version: 1
title:
task:
symptoms:
root_causes:
---

> Describe the painpoint here.


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
