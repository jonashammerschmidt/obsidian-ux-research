# User Story Map View

show_empty_tasks:: true
show_painpoints:: true
hide_tasks_without_painpoints:: false

This note renders the story-node hierarchy as a user story map. Activities become grouped goal sections, steps render as the blue headers beneath them, and tasks can optionally show linked painpoint cards with linked solution counts.

Use the inline controls above instead of the Properties panel.
`show_painpoints` switches between the full UX painpoint map and a plain user story map.
`hide_tasks_without_painpoints` hides tasks without linked painpoints.

```dataviewjs
await dv.view("00 System/views/user-story-map");
```
