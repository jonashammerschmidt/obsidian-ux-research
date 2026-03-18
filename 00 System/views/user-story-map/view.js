const current = dv.current();
const options = input ?? {};
const showEmptyTasks = options.showEmptyTasks ?? current.show_empty_tasks !== false;
const showPainpoints = options.showPainpoints ?? current.show_painpoints !== false;
const hideTasksWithoutPainpoints = options.hideTasksWithoutPainpoints ?? current.hide_tasks_without_painpoints === true;
const nodeTypes = new Set(["activity", "step", "task"]);
const nodes = dv.pages('"01 Story Nodes"').where(page => nodeTypes.has((page.entity_type ?? "").toLowerCase()));
const painpoints = dv.pages('"02 Problem Analysis/01 Painpoints"').where(page => page.entity_type === "painpoint");
const solutions = dv.pages('"03 Solutions"').where(page => page.entity_type === "solution");
const levelOrder = { activity: 1, step: 2, task: 3 };
const container = dv.container;

if (typeof container.__uxStoryMapCleanup === "function") {
  container.__uxStoryMapCleanup();
}

container.classList.add("ux-story-map-view");

function cleanedCandidate(value) {
  if (value == null) {
    return "";
  }

  return String(value)
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/^\[\[/, "")
    .replace(/\]\]$/, "")
    .split("|")[0]
    .trim();
}

function linkKey(link) {
  return cleanedCandidate(link)
    .split("/")
    .pop()
    .replace(/\.md$/, "");
}

function toArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value.array === "function") {
    return value.array();
  }

  return [value];
}

function nodeLevel(node) {
  return (node?.entity_type ?? "").toLowerCase();
}

function folderPath(node) {
  return node?.file?.folder ?? node?.file?.path?.replace(/\/[^/]+$/, "") ?? "";
}

function parentFolder(path) {
  return path ? path.replace(/\/[^/]+$/, "") : "";
}

function derivedParent(node) {
  const level = nodeLevel(node);
  const ownFolder = folderPath(node);

  if (level === "step") {
    const activityFolder = parentFolder(ownFolder);
    return nodes.where(candidate =>
      nodeLevel(candidate) === "activity" && folderPath(candidate) === activityFolder
    ).array()[0] ?? null;
  }

  if (level === "task") {
    return nodes.where(candidate =>
      nodeLevel(candidate) === "step" && folderPath(candidate) === ownFolder
    ).array()[0] ?? null;
  }

  return null;
}

function sortNodes(items) {
  return items.array().sort((left, right) => {
    const levelDelta = (levelOrder[nodeLevel(left) || "task"] ?? 99)
      - (levelOrder[nodeLevel(right) || "task"] ?? 99);

    if (levelDelta !== 0) {
      return levelDelta;
    }

    return left.file.name.localeCompare(right.file.name);
  });
}

function childrenOf(parent) {
  if (!parent) {
    return sortNodes(nodes.where(node => nodeLevel(node) === "activity"));
  }

  const childLevel = nodeLevel(parent) === "activity"
    ? "step"
    : nodeLevel(parent) === "step"
      ? "task"
      : null;

  if (!childLevel) {
    return [];
  }

  return sortNodes(
    nodes.where(node =>
      nodeLevel(node) === childLevel
      && derivedParent(node)?.file?.path === parent.file.path
    )
  );
}

function referencesPage(refs, page) {
  const target = linkKey(page?.file?.path ?? page?.file?.name);
  return toArray(refs).some(ref => linkKey(ref) === target);
}

function solutionsFor(painpoint) {
  return solutions.where(solution => referencesPage(solution.solves, painpoint)).array();
}

function painpointsFor(node) {
  return painpoints.where(page => linkKey(page.task) === node.file.name)
    .array()
    .sort((left, right) => (left.title ?? left.file.name).localeCompare(right.title ?? right.file.name));
}

function createInternalLink(parent, page, label) {
  const link = parent.createEl("a", {
    text: label ?? page.title ?? page.file.name,
    href: page.file.path,
    cls: "internal-link"
  });
  link.dataset.href = page.file.path;
  return link;
}

function appendMetaBadge(parent, text, cls) {
  const badge = parent.createSpan({ text });
  badge.addClass("ux-story-map__badge");
  if (cls) {
    badge.addClass(cls);
  }
  return badge;
}

const board = container.createDiv({ cls: "ux-story-map-board" });
const activityHeaders = [];

for (const activity of childrenOf(null)) {
  const activityColumn = board.createDiv({ cls: "ux-story-map__activity" });

  const activityHeaderTrack = activityColumn.createDiv({ cls: "ux-story-map__activity-header-track" });
  const activityHeader = activityHeaderTrack.createDiv({ cls: "ux-story-map__activity-header" });
  createInternalLink(activityHeader, activity, activity.title ?? activity.file.name);
  appendMetaBadge(activityHeader, "activity", "is-activity");
  activityHeaders.push({ column: activityColumn, track: activityHeaderTrack, header: activityHeader });

  const steps = childrenOf(activity);
  if (!steps.length) {
    const empty = activityColumn.createDiv({ cls: "ux-story-map__empty" });
    empty.setText("No steps linked to this activity.");
    continue;
  }

  const stepsRail = activityColumn.createDiv({ cls: "ux-story-map__steps" });

  for (const step of steps) {
    const stepLane = stepsRail.createDiv({ cls: "ux-story-map__step" });

    const stepHeader = stepLane.createDiv({ cls: "ux-story-map__step-header" });
    createInternalLink(stepHeader, step, step.title ?? step.file.name);
    appendMetaBadge(stepHeader, "step", "is-step");

    const taskGrid = stepLane.createDiv({ cls: "ux-story-map__tasks" });
    const tasks = childrenOf(step);

    for (const task of tasks) {
      const relatedPainpoints = painpointsFor(task);
      const shouldHideEmptyTask = relatedPainpoints.length === 0
        && (hideTasksWithoutPainpoints || (showPainpoints && !showEmptyTasks));

      if (shouldHideEmptyTask) {
        continue;
      }

      const taskCard = taskGrid.createDiv({ cls: "ux-story-map__task" });
      if (!relatedPainpoints.length) {
        taskCard.addClass("has-no-painpoints");
      }

      const taskHeader = taskCard.createDiv({ cls: "ux-story-map__task-header" });
      createInternalLink(taskHeader, task, task.title ?? task.file.name);

      if (showPainpoints) {
        appendMetaBadge(taskHeader, `${relatedPainpoints.length} painpoint${relatedPainpoints.length === 1 ? "" : "s"}`);
      }

      if (showPainpoints && relatedPainpoints.length) {
        const painpointList = taskCard.createDiv({ cls: "ux-story-map__painpoints" });

        for (const painpoint of relatedPainpoints) {
          const painpointCard = painpointList.createDiv({ cls: "ux-story-map__painpoint" });

          const painpointTitle = painpointCard.createDiv({ cls: "ux-story-map__painpoint-title" });
          createInternalLink(painpointTitle, painpoint, painpoint.title ?? painpoint.file.name);

          const meta = painpointCard.createDiv({ cls: "ux-story-map__painpoint-meta" });
          const solutionCount = solutionsFor(painpoint).length;
          if (solutionCount > 0) {
            appendMetaBadge(meta, `${solutionCount} solution${solutionCount === 1 ? "" : "s"}`, "is-solutions");
          }
        }
      }
    }
  }
}

if (activityHeaders.length) {
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const controller = new AbortController();
  const resizeObserver = new ResizeObserver(scheduleHeaderPositionUpdate);
  let frameId = null;

  function scheduleHeaderPositionUpdate() {
    if (frameId !== null) {
      return;
    }

    frameId = window.requestAnimationFrame(() => {
      frameId = null;
      positionActivityHeaders();
    });
  }

  function positionActivityHeaders() {
    const boardRect = board.getBoundingClientRect();
    const boardWidth = board.clientWidth || boardRect.width;
    const boardCenter = boardRect.left + (boardWidth / 2);
    const gutter = 12;

    for (const { column, track, header } of activityHeaders) {
      const trackWidth = track.clientWidth;
      if (!trackWidth) {
        continue;
      }

      const maxHeaderWidth = Math.max(120, Math.min(trackWidth - (gutter * 2), boardWidth - (gutter * 2)));
      header.style.maxWidth = `${maxHeaderWidth}px`;

      const columnRect = column.getBoundingClientRect();
      const headerWidth = Math.min(header.getBoundingClientRect().width || maxHeaderWidth, maxHeaderWidth);
      const headerHalfWidth = headerWidth / 2;
      const minCenter = gutter + headerHalfWidth;
      const maxCenter = Math.max(minCenter, trackWidth - gutter - headerHalfWidth);
      const desiredCenter = boardCenter - columnRect.left;
      const centeredLeft = clamp(desiredCenter, minCenter, maxCenter) - headerHalfWidth;

      header.style.left = `${centeredLeft}px`;
    }
  }

  board.addEventListener("scroll", scheduleHeaderPositionUpdate, { passive: true, signal: controller.signal });
  window.addEventListener("resize", scheduleHeaderPositionUpdate, { passive: true, signal: controller.signal });

  resizeObserver.observe(board);
  for (const { column, track, header } of activityHeaders) {
    resizeObserver.observe(column);
    resizeObserver.observe(track);
    resizeObserver.observe(header);
  }

  container.__uxStoryMapCleanup = () => {
    controller.abort();
    resizeObserver.disconnect();
    if (frameId !== null) {
      window.cancelAnimationFrame(frameId);
    }
    delete container.__uxStoryMapCleanup;
  };

  scheduleHeaderPositionUpdate();
}
