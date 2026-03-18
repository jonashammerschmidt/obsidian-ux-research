---
entity_type: painpoint
schema_version: 1
title:
task:
---

## Summary

Describe the painpoint in user-centered language.

## Notes

- Add evidence, links, or research context here.

## Related Solutions

```dataview
LIST FROM "03 Solution"
WHERE contains(solves, this.file.link)
SORT file.name ASC
```
