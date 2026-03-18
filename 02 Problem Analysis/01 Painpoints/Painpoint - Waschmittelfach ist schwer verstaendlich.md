---
entity_type: painpoint
schema_version: 1
title: Waschmittelfach ist schwer verstaendlich
task: "[[01 - Task - Waschmittel dosieren|TASK: Waschmittel dosieren]]"
---

Die Einfaecherung der Mittel ist nicht selbsterklaerend, sodass leicht das falsche Fach benutzt wird.

Die Fachlogik ist nicht sofort nachvollziehbar.

## Related Solutions

```dataview
LIST FROM "03 Solution"
WHERE contains(solves, this.file.link)
SORT file.name ASC
```
