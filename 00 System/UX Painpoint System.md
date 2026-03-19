# UX Painpoint System

This vault models UX painpoints as linked markdown entities. The schema stays flexible by using YAML frontmatter for structured fields, note bodies for descriptive text, and wiki links for relationships.

## Design Principles

- Every entity is a note.
- Every relationship is a first-class wiki link.
- Descriptions live in the note body, not in dedicated metadata fields.
- Views read from the same source notes instead of duplicating data.
- The filesystem may be more hierarchical than the logical model as long as Dataview queries still resolve the same entities.
- `Painpoint` stays the central analysis entity; `Solution`, `Activity`, `Step`, and `Task` notes connect around it.

## Folder Structure

- `00 System/Templates`: reusable note templates
- `00 System/views`: shared DataviewJS views that can be embedded into notes
- `01 Story Nodes/Activities/Activities.md`: optional root note for the activity collection
- `01 Story Nodes/Activities/<NN - Activity - Title>/<NN - Activity - Title>.md`: top-level story map activities stored as folder notes
- `01 Story Nodes/Activities/<NN - Activity - Title>/<NN - Step - Title>/<NN - Step - Title>.md`: steps stored as folder notes below their activity
- `01 Story Nodes/Activities/<NN - Activity - Title>/<NN - Step - Title>/<NN - Task - Title>.md`: executable task nodes stored directly inside their step folder
- `02 Problem Analysis/01 Painpoints`: central painpoint records
- `03 Solutions/Solution - ....md`: one markdown note per solution
- `90 Views/User Story Map View.md`: current ready-made dashboard note

At the moment, backlog and relationship rendering logic exists as shared DataviewJS views in `00 System/views`, but only the user story map is materialized as a note in `90 Views`.

## Common Fields

All entity notes can safely carry extra properties. These fields are the recommended baseline:

| Field | Purpose |
| --- | --- |
| `entity_type` | Stable type discriminator for Dataview queries |
| `schema_version` | Allows future migration of conventions |
| `title` | Title field for display and disambiguation |

## Entity Model

### Painpoint

Required properties:

```yaml
entity_type: painpoint
schema_version: 1
title: Passendes Programm schwer zu finden
task: "[[01 - Task - Programm wählen|TASK: Programm wählen]]"
```

Painpoint notes render linked solutions as a read-only Dataview list:

```dataview
LIST FROM "03 Solutions"
WHERE contains(solves, this.file.link)
SORT file.name ASC
```

### Solution

Solutions own the editable relationship to painpoints.

```yaml
entity_type: solution
schema_version: 1
title: Solution - Standardprogramme in Klartext hervorheben
solves:
  - "[[Painpoint - Passendes Programm schwer zu finden]]"
  - "[[Painpoint - Waschmittelfach ist schwer verständlich]]"
```

### Activity / Step / Task

```yaml
entity_type: task
schema_version: 1
title: Programm wählen
```

For activity, step, and task notes, `entity_type` is the node level: `activity`, `step`, or `task`. Parent-child relationships are derived from the folder structure, and ordering comes from the numeric filename prefixes.

## Naming Conventions

- Story node files and folder notes: `NN - Activity - ...`, `NN - Step - ...`, `NN - Task - ...`
- Painpoints: `Painpoint - ...`
- Solutions: `Solution - ...`

This keeps links readable and makes folder scanning predictable. Activity folders, step folders, and task files carry the numeric prefixes that define their order in views.

## Metadata Menu Guidance

Metadata Menu can edit all frontmatter relation fields directly. Recommended field types:

| Field | Suggested type |
| --- | --- |
| `task` | File |
| `solves` | MultiFile |

Configured relation queries currently support:

- `task`: only suggests task notes
- `solves`: only suggests painpoints

These Metadata Menu definitions are stored in [data.json](/Users/jonas/dev/obsidian-ux-research/.obsidian/plugins/metadata-menu/data.json), so relation fields open a searchable file picker instead of relying on raw wiki-link typing.

For `Painpoint.task`, keep the saved link short and aligned with the numbered task filename:

```yaml
task: "[[01 - Task - Programm wählen|TASK: Programm wählen]]"
```

Activity, step, and task notes do not need saved parent links as long as the current folder hierarchy is preserved.

## Extension Strategy

You can add fields like `owner`, `effort`, `evidence`, `segment`, `journey_stage`, `impact_score`, or `linked_research` directly in frontmatter. Existing views will continue to work unless they explicitly depend on the new field.

## Entry Points

- Explore hierarchy in [User Story Map View](../90%20Views/User%20Story%20Map%20View.md)
- Reuse `00 System/views/backlog/view.js` when you want a sortable painpoint backlog table inside another note
- Reuse `00 System/views/relationship/view.js` when you want a relationship table for all painpoints or a focused subset

The current dashboard note in `90 Views` keeps its controls as inline fields in the note body instead of top-level Properties. Dataview reads them the same way, but the dashboard stays visually cleaner.
