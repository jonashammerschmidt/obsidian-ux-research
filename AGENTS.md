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
- `00 System/Templates`
- `00 System/views/<view-name>/view.js`
- `01 Story Nodes`
- `01 Story Nodes/Activities/Activities.md`
- `01 Story Nodes/Activities/<NN - Activity - Title>/<NN - Activity - Title>.md`
- `01 Story Nodes/Activities/<NN - Activity - Title>/<NN - Step - Title>/<NN - Step - Title>.md`
- `01 Story Nodes/Activities/<NN - Activity - Title>/<NN - Step - Title>/<NN - Task - Title>.md`
- `02 Problem Analysis/01 Painpoints`
- `03 Solutions/Solution - ....md`
- `90 Views/User Story Map View.md`

### Entities

- `Painpoint`
- `Solution`
- `Story Node`

### Core Relationships

- A `Painpoint` belongs to one `Task`
- A `Solution` can solve multiple `Painpoints`
- A `Painpoint` derives its linked `Solutions` from those `Solution` notes
- `Story Nodes` form a hierarchy
- `Story Node.parentActivity` links `step -> activity`
- `Story Node.parentStep` links `task -> step`
- `Story Node.order` defines stable view ordering independently from folder names

### Current View Surface

- `90 Views/User Story Map View.md` is the current ready-made dashboard note
- Shared DataviewJS views live in `00 System/views/backlog`, `00 System/views/user-story-map`, and `00 System/views/relationship`
- Do not assume dedicated dashboard notes already exist for every shared view

## Implementation Constraints

- one markdown note per entity
- frontmatter for fields
- links for relations
- `Painpoint.task` should resolve via the numbered task file name and usually use a readable alias like `TASK: ...`
- story-node folders may carry zero-padded order prefixes in the filesystem
- story nodes should keep `order` in frontmatter so views do not depend on filename sorting alone
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
- Current dashboard controls in `90 Views` use Dataview inline fields instead of top-level Properties.
- If new dashboard notes are added later, keep the same pattern: note-local inline controls, shared rendering logic in `00 System/views`.
