---
entity_type: task
schema_version: 1
title:
order:
---

## Role In Story Map

Explain where this node sits in the journey or domain structure.

Use `entity_type: activity`, `step`, or `task` as needed.
Activities do not need a parent field.
Steps use `parentActivity: "[[NN - Activity - ...|ACTIVITY: ...]]"`.
Tasks use `parentStep: "[[NN - Step - ...|STEP: ...]]"`.
