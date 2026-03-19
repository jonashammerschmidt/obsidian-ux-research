# obsidian-ux-research

A flexible Obsidian vault for UX painpoint analysis, linked solution ideas, and story-map based navigation.

## Installation

1. Copy or clone this repo into your Obsidian vaults folder.
2. Open the folder as a vault in Obsidian.
3. Install and enable the community plugins `Dataview`, `Kanban`, and `Metadata Menu`.
4. Apply the settings below.
5. Restart Obsidian

## Settings

- `Settings -> Editor -> Readable line length`: off
- `Settings -> Community plugins -> Dataview -> JavaScript queries`: on
- `Settings -> Community plugins -> Dataview -> Inline JavaScript queries`: on
- `Settings -> Appearance -> CSS snippets -> ux-story-map`: on

## Overview

- `00 System`: core system docs, templates, and shared DataviewJS views
- `00 System/Templates`: templates for `Painpoint`, `Solution`, `Activity`, `Step`, and `Task` notes
- `00 System/views`: shared rendering logic for backlog, relationship, and user-story-map views
- `01 Story Nodes/Activities/Activities.md`: optional root note for the activity collection
- `01 Story Nodes/Activities/<NN - Activity - Title>/<NN - Activity - Title>.md`: one folder-note per activity
- `01 Story Nodes/Activities/<NN - Activity - Title>/<NN - Step - Title>/<NN - Step - Title>.md`: one folder-note per step inside its activity
- `01 Story Nodes/Activities/<NN - Activity - Title>/<NN - Step - Title>/<NN - Task - Title>.md`: task files directly inside their parent step folder
- `02 Problem Analysis/01 Painpoints`: central UX painpoints
- `03 Solutions/Solution - ....md`: one markdown note per solution idea
- `90 Views/User Story Map View.md`: current dashboard note for browsing the activity-step-task hierarchy with optional painpoints

The activity-step-task hierarchy is physical as well as logical: activities contain step folders, and step folders contain the task files they own.

The current vault state ships one ready-made dashboard note in `90 Views`. Additional reusable DataviewJS views for backlog and relationship tables already live in `00 System/views` and can be embedded later without changing the data model.

## Data Model

- `Painpoint` is the central entity and lives in `02 Problem Analysis/01 Painpoints`.
- Every painpoint belongs to exactly one task via the `task` field.
- `Solution` notes live in `03 Solutions` and own the editable `solves` links to one or more painpoints.
- `Painpoint` notes derive their related solutions from those `Solution.solves` links.
- `Activity`, `Step`, and `Task` notes use `entity_type: activity|step|task`; hierarchy and ordering are derived from the folder structure and filename prefixes.

## Editing Workflow

- Use `Metadata Menu` for relation fields like `task` and `solves`. They are preconfigured as searchable `File` or `MultiFile` fields with filtered suggestions.
- Keep `Painpoint.task` in the numbered short-link format, for example `"[[01 - Task - Programm wählen|TASK: Programm wählen]]"`.
- Maintain solution links exclusively from solution notes via `solves`. Painpoint notes render the matching solutions as a read-only Dataview list.
- Keep descriptions in the note body instead of frontmatter fields.
- Keep activity, step, and task files in the expected folder-note layout, because hierarchy and ordering are resolved from their folders and filename prefixes.
- The current dashboard note in `90 Views` uses inline control fields such as `show_empty_tasks:: true`, `show_painpoints:: true`, and `hide_tasks_without_painpoints:: false` so controls stay visible without cluttering the Properties panel.
