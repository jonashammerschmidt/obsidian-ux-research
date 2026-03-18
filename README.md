# obsidian-ux-research

A small Obsidian template for UX research, painpoint mapping, and user story maps.
Work in progress.

## Installation

1. Copy or clone this repo into your Obsidian vaults folder.
2. Open the folder as a vault in Obsidian.
3. Install and enable the community plugins `Dataview`, `Kanban`, `Metadata Menu`, and `Folder note`.
4. Apply the settings below.
5. Restart Obsidian

## Settings

- `Settings -> Editor -> Readable line length`: off
- `Settings -> Community plugins -> Dataview -> JavaScript queries`: on
- `Settings -> Community plugins -> Dataview -> Inline JavaScript queries`: on
- `Settings -> Appearance -> CSS snippets -> ux-story-map`: on

## Overview

- `00 System`: core system docs and note templates
- `00 System/views`: shared Dataview custom views reused by notes and dashboard pages
- `01 Story Nodes/Activities/<NN - Activity - Title>/<NN - Activity - Title>.md`: one folder-note per activity
- `01 Story Nodes/Activities/<NN - Activity - Title>/<NN - Step - Title>/<NN - Step - Title>.md`: one folder-note per step inside its activity
- `01 Story Nodes/Activities/<NN - Activity - Title>/<NN - Step - Title>/<NN - Task - Title>.md`: task files directly inside their parent step folder
- `02 Problem Analysis/01 Painpoints`: central UX painpoints
- `03 Solution/<Solution Name>/`: one folder per solution idea, ready for mockups or other artifacts
- `90 Views`: ready-made views like backlog, story map, workflow, and relationships

The story-node hierarchy is physical as well as logical: activities contain step folders, and step folders contain the task files they own.

## Editing Workflow

- Use `Metadata Menu` for relation fields like `task`, `parent`, and `solves`. They are preconfigured as searchable `File` or `MultiFile` fields with filtered suggestions.
- Keep `Painpoint.task` in the numbered short-link format, for example `"[[01 - Task - Programm waehlen|TASK: Programm waehlen]]"`.
- Maintain solution links exclusively from solution notes via `solves`. Painpoint notes render the matching solutions as a read-only Dataview list.
- Keep descriptions in the note body instead of frontmatter fields.
- The dashboard notes in `90 Views` use inline control fields such as `show_painpoints:: false` or `relationship_scope:: all` so the controls stay visible without cluttering the Properties panel.
- Dataview automatic refresh stays enabled with a shorter interval for faster feedback after metadata changes.
