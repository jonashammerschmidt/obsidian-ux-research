const initialCurrent = dv.current();
const options = input ?? {};
const viewFilePath = initialCurrent.file.path;
const container = dv.container;

if (typeof container.__uxStoryMapCleanup === "function") {
  container.__uxStoryMapCleanup();
}

container.classList.add("ux-story-map-view");

const surface = container.createDiv({ cls: "ux-story-map-surface" });
let layoutCleanup = () => {};
let renderFrame = null;
let viewState = null;

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

function currentPage() {
  return dv.page(viewFilePath) ?? initialCurrent;
}

function persistedState(page) {
  return {
    showEmptyTasks: options.showEmptyTasks ?? page.show_empty_tasks !== false,
    showPainpoints: options.showPainpoints ?? page.show_painpoints !== false,
    hideTasksWithoutPainpoints: options.hideTasksWithoutPainpoints ?? page.hide_tasks_without_painpoints === true
  };
}

function shouldRefresh(file) {
  const path = file?.path ?? "";
  return path === viewFilePath
    || path.startsWith("01 Story Nodes/")
    || path.startsWith("02 Problem Analysis/01 Painpoints/")
    || path.startsWith("03 Solutions/");
}

function scheduleRender() {
  if (renderFrame !== null) {
    return;
  }

  renderFrame = window.requestAnimationFrame(() => {
    renderFrame = null;
    renderStoryMap();
  });
}

async function persistState(nextState) {
  const file = app.vault.getAbstractFileByPath(viewFilePath);
  if (!file) {
    return;
  }

  const values = {
    show_empty_tasks: nextState.showEmptyTasks,
    show_painpoints: nextState.showPainpoints,
    hide_tasks_without_painpoints: nextState.hideTasksWithoutPainpoints
  };

  await app.vault.process(file, content => {
    let updated = content;

    for (const [field, value] of Object.entries(values)) {
      const replacement = `${field}:: ${value ? "true" : "false"}`;
      const pattern = new RegExp(`^(>\\s*)?${field}::\\s*.*$`, "m");

      if (pattern.test(updated)) {
        updated = updated.replace(pattern, match => {
          const prefix = match.startsWith(">") ? "> " : "";
          return `${prefix}${replacement}`;
        });
        continue;
      }

      updated = updated.replace(/^# .*$|^[^\n]+$/m, match => `${match}\n\n${replacement}`);
    }

    return updated;
  });
}

function renderStoryMap() {
  layoutCleanup();
  layoutCleanup = () => {};
  surface.replaceChildren();

  const current = currentPage();
  const state = viewState ?? persistedState(current);
  const showEmptyTasks = state.showEmptyTasks;
  const showPainpoints = state.showPainpoints;
  const hideTasksWithoutPainpoints = state.hideTasksWithoutPainpoints;
  const nodeTypes = new Set(["activity", "step", "task"]);
  const nodes = dv.pages('"01 Story Nodes"').where(page => nodeTypes.has((page.entity_type ?? "").toLowerCase()));
  const painpoints = dv.pages('"02 Problem Analysis/01 Painpoints"').where(page => page.entity_type === "painpoint");
  const solutions = dv.pages('"03 Solutions"').where(page => page.entity_type === "solution");
  const levelOrder = { activity: 1, step: 2, task: 3 };

  const controls = surface.createDiv({ cls: "ux-story-map__controls" });

  function appendToggle({ key, label, checked }) {
    const field = controls.createEl("label", { cls: "ux-story-map__control" });
    const input = field.createEl("input", { type: "checkbox", cls: "ux-story-map__control-input" });
    input.checked = checked;
    input.addEventListener("change", async () => {
      viewState = { ...state, [key]: input.checked };
      renderStoryMap();

      try {
        await persistState(viewState);
      } catch (error) {
        console.error("Failed to persist user story map controls", error);
      }
    });

    field.createSpan({ text: label, cls: "ux-story-map__control-label" });
  }

  appendToggle({ key: "showEmptyTasks", label: "Show Empty Tasks", checked: showEmptyTasks });
  appendToggle({ key: "showPainpoints", label: "Show Painpoints", checked: showPainpoints });
  appendToggle({
    key: "hideTasksWithoutPainpoints",
    label: "Hide Tasks Without Painpoints",
    checked: hideTasksWithoutPainpoints
  });

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

  const board = surface.createDiv({ cls: "ux-story-map-board" });
  const activityHeaders = [];

  for (const activity of childrenOf(null)) {
    const activityColumn = board.createDiv({ cls: "ux-story-map__activity" });

    const activityHeaderTrack = activityColumn.createDiv({ cls: "ux-story-map__activity-header-track" });
    const activityHeader = activityHeaderTrack.createDiv({ cls: "ux-story-map__activity-header" });
    createInternalLink(activityHeader, activity, activity.title ?? activity.file.name);
    appendMetaBadge(activityHeader, "activity", "is-activity");
    activityHeaders.push({ track: activityHeaderTrack, header: activityHeader });

    const steps = childrenOf(activity);
    if (!steps.length) {
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

  if (!activityHeaders.length) {
    return;
  }

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
    const gutter = 12;

    for (const { track, header } of activityHeaders) {
      const trackWidth = track.clientWidth;
      if (!trackWidth) {
        continue;
      }

      const maxHeaderWidth = Math.max(120, trackWidth - (gutter * 2));
      header.style.maxWidth = `${maxHeaderWidth}px`;

      const headerWidth = Math.min(header.getBoundingClientRect().width || maxHeaderWidth, maxHeaderWidth);
      const trackRect = track.getBoundingClientRect();
      const trackMinLeft = gutter;
      const trackMaxLeft = Math.max(trackMinLeft, trackWidth - gutter - headerWidth);
      const naturalLeft = clamp((trackWidth - headerWidth) / 2, trackMinLeft, trackMaxLeft);
      const visibleLeftEdge = boardRect.left + gutter;
      const visibleRightEdge = boardRect.right - gutter;
      const naturalViewportLeft = trackRect.left + naturalLeft;
      const naturalViewportRight = naturalViewportLeft + headerWidth;

      let nextLeft = naturalLeft;

      if (naturalViewportLeft < visibleLeftEdge) {
        nextLeft += visibleLeftEdge - naturalViewportLeft;
      }

      if (naturalViewportRight > visibleRightEdge) {
        nextLeft -= naturalViewportRight - visibleRightEdge;
      }

      header.style.left = `${clamp(nextLeft, trackMinLeft, trackMaxLeft)}px`;
    }
  }

  board.addEventListener("scroll", scheduleHeaderPositionUpdate, { passive: true, signal: controller.signal });
  window.addEventListener("resize", scheduleHeaderPositionUpdate, { passive: true, signal: controller.signal });

  resizeObserver.observe(board);
  for (const { track, header } of activityHeaders) {
    resizeObserver.observe(track);
    resizeObserver.observe(header);
  }

  layoutCleanup = () => {
    controller.abort();
    resizeObserver.disconnect();
    if (frameId !== null) {
      window.cancelAnimationFrame(frameId);
    }
  };

  scheduleHeaderPositionUpdate();
}

const metadataChangeRef = app.metadataCache.on("changed", file => {
  if (shouldRefresh(file)) {
    viewState = null;
    scheduleRender();
  }
});

const vaultModifyRef = app.vault.on("modify", file => {
  if (shouldRefresh(file)) {
    viewState = null;
    scheduleRender();
  }
});

container.__uxStoryMapCleanup = () => {
  layoutCleanup();
  layoutCleanup = () => {};

  if (renderFrame !== null) {
    window.cancelAnimationFrame(renderFrame);
    renderFrame = null;
  }

  app.metadataCache.offref(metadataChangeRef);
  app.vault.offref(vaultModifyRef);
  delete container.__uxStoryMapCleanup;
};

renderStoryMap();
