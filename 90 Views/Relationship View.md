# Relationship View

relationship_scope:: all
focus_painpoint:: [[Painpoint - Passendes Programm schwer zu finden]]

Set `relationship_scope` to `all` to inspect the whole network, or `focus` to show only one painpoint and its direct links. The view currently shows task and solution links for each painpoint. Solution links are derived from the `solves` field on solution notes. When using `focus`, set `focus_painpoint` to the desired painpoint.

```dataviewjs
await dv.view("00 System/views/relationship");
```

## Visual Exploration

For a graph-based visualization, open the local graph from this note or from a specific painpoint. Because all relationships are wiki links, Obsidian Graph can render the same data without any duplicate modeling.
