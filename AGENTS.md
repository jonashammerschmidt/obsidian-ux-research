# AGENTS.md

## Scope

Build and maintain a flexible UX painpoint system in Obsidian.

The system should:

- treat `Painpoint` as the central entity
- store each entity as a markdown file
- use YAML frontmatter for structured fields
- use wiki links for relationships
- support multiple views from the same underlying data

Do not hardcode one fixed UX workflow or taxonomy.

## Basic Structure

### Current Folder Layout

- `00 System`
- `01 Story Nodes`
- `01 Story Nodes/Activities/<NN - Activity - Title>/<NN - Activity - Title>.md`
- `01 Story Nodes/Activities/<NN - Activity - Title>/<NN - Step - Title>/<NN - Step - Title>.md`
- `01 Story Nodes/Activities/<NN - Activity - Title>/<NN - Step - Title>/<NN - Task - Title>.md`
- `02 Problem Analysis/01 Painpoints`
- `03 Solution/<Solution Name>/Solution - ....md`
- `90 Views`

### Entities

- `Painpoint`
- `Solution`
- `Story Node`

### Core Relationships

- A `Painpoint` belongs to one `Task`
- A `Solution` can solve multiple `Painpoints`
- A `Painpoint` derives its linked `Solutions` from those `Solution` notes
- `Story Nodes` form a hierarchy

### Required Views

- Backlog view
- User story map view
- Relationship view

## Implementation Constraints

- one markdown note per entity
- frontmatter for fields
- links for relations
- `Painpoint.task` should resolve via the numbered task file name and usually use a readable alias like `TASK: ...`
- story-node folders may carry zero-padded order prefixes in the filesystem
- structure must stay extendable
- new fields should be easy to add later

## Preferred Obsidian Plugins

- `Dataview`
- `Kanban`
- `Metadata Menu`

## Editing Notes

- Keep Dataview views readable from the current folder structure without duplicating data.
- Prefer readable wiki-link aliases even when file names carry numeric prefixes.
- Maintain editable Solution-to-Painpoint links only on the `Solution` notes via `solves`.
- Dashboard controls in `90 Views` may use Dataview inline fields instead of top-level Properties.
