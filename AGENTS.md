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
- `Symptom`
- `Root Cause`
- `Solution`
- `Activity`
- `Step`
- `Task`

### Core Relationships

- A `Painpoint` belongs to one `Task`
- A `Painpoint` can relate to multiple `Symptoms`
- A `Painpoint` can relate to multiple `Root Causes`
- A `Solution` can solve multiple `Painpoints`
- A `Painpoint` derives its linked `Solutions` from those `Solution` notes
- `Activity`, `Step`, and `Task` notes form a hierarchy
- Their hierarchy derives from the current folder structure
- Their ordering derives from the numeric filename prefixes

### Current View Surface

- `90 Views/User Story Map View.md` is the current ready-made dashboard note
- Shared DataviewJS views live in `00 System/views/backlog`, `00 System/views/user-story-map`, and `00 System/views/relationship`
- Do not assume dedicated dashboard notes already exist for every shared view

## Implementation Constraints

- one markdown note per entity
- frontmatter for fields
- links for relations
- `Symptom.related_painpoint` and `Root Cause.related_painpoint` should point back to the owning painpoint
- `Painpoint.task` should resolve via the numbered task file name and usually use a readable alias like `TASK: ...`
- activity, step, and task folders/files may carry zero-padded order prefixes in the filesystem
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
