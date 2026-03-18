# UX Painpoint System

This vault models UX painpoints as linked markdown entities. The schema stays flexible by using YAML frontmatter for structured fields, note bodies for descriptive text, and wiki links for relationships.

## Design Principles

- Every entity is a note.
- Every relationship is a first-class wiki link.
- Descriptions live in the note body, not in dedicated metadata fields.
- Views read from the same source notes instead of duplicating data.
- The filesystem may be more hierarchical than the logical model as long as Dataview queries still resolve the same entities.

## Folder Structure

- `00 System/Templates`: reusable note templates
- `00 System/views`: shared Dataview custom views
- `01 Story Nodes/Activities/<NN - Activity - Title>/<NN - Activity - Title>.md`: top-level story map activities stored as folder notes
- `01 Story Nodes/Activities/<NN - Activity - Title>/<NN - Step - Title>/<NN - Step - Title>.md`: steps stored as folder notes below their activity
- `01 Story Nodes/Activities/<NN - Activity - Title>/<NN - Step - Title>/<NN - Task - Title>.md`: executable task nodes stored directly inside their step folder
- `02 Problem Analysis/01 Painpoints`: central painpoint records
- `03 Solutions/<Solution Name>.md`: one markdown note per solution
- `90 Views`: Dataview and Kanban views

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
task: "[[01 - Task - Programm waehlen|TASK: Programm waehlen]]"
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
  - "[[Painpoint - Waschmittelfach ist schwer verstaendlich]]"
```

### Story Node

```yaml
entity_type: task
schema_version: 1
title: Programm waehlen
parent: [[03 - Step - Waschgang starten]]
```

For story nodes, `entity_type` is the node level: `activity`, `step`, or `task`.

## Naming Conventions

- Story node files and folder notes: `NN - Activity - ...`, `NN - Step - ...`, `NN - Task - ...`
- Painpoints: `Painpoint - ...`
- Solutions: `Solution - ...`

This keeps links readable and makes folder scanning predictable.

In this vault layout, activity folders, step folders, and task files can additionally carry a zero-padded numeric prefix derived from their `order` field.

## Metadata Menu Guidance

Metadata Menu can edit all frontmatter relation fields directly. Recommended field types:

| Field | Suggested type |
| --- | --- |
| `task` | File |
| `parent` | File |
| `solves` | MultiFile |

Configured relation queries:

- `task`: only suggests task notes
- `parent`: only suggests valid story-node parents for the current story node
- `focus_painpoint`, `solves`: only suggest painpoints

These Metadata Menu definitions are stored in [data.json](/Users/jonas/dev/obsidian-ux-research/.obsidian/plugins/metadata-menu/data.json), so relation fields open a searchable file picker instead of relying on raw wiki-link typing.

For `Painpoint.task`, keep the saved link short and aligned with the numbered task filename:

```yaml
task: "[[01 - Task - Programm waehlen|TASK: Programm waehlen]]"
```

## Extension Strategy

You can add fields like `owner`, `effort`, `evidence`, `segment`, `journey_stage`, `impact_score`, or `linked_research` directly in frontmatter. Existing views will continue to work unless they explicitly depend on the new field.

## Entry Points

- Start from [Backlog View](../90%20Views/Backlog%20View.md)
- Explore hierarchy in [User Story Map View](../90%20Views/User%20Story%20Map%20View.md)
- Review network links in [Relationship View](../90%20Views/Relationship%20View.md)
- Use [Painpoint Workflow Board](../90%20Views/Painpoint%20Workflow%20Board.md) as a lightweight navigation board

The dashboard notes in `90 Views` keep their controls as inline fields in the note body instead of top-level Properties. Dataview reads them the same way, but the dashboards stay visually cleaner.
