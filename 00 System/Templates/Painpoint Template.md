---
entity_type: painpoint
schema_version: 1
title:
task:
---

## Summary

Describe the painpoint in user-centered language.

Keep `task` as a readable short wiki link such as `[[01 - Task - Example|TASK: Example]]`.

## Notes

- Add evidence, links, or research context here.

## Related Solutions

```dataview
LIST FROM "03 Solutions"
WHERE contains(solves, this.file.link)
SORT file.name ASC
```
