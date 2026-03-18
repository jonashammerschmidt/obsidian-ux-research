const current = dv.current();
const options = input ?? {};
const sortDirection = (options.sortDirection ?? current.sort_direction ?? "asc").toLowerCase();
const allPages = dv.pages();
const storyNodes = dv.pages('"01 Story Nodes"').where(page => ["activity", "step", "task"].includes((page.entity_type ?? "").toLowerCase()));
const painpoints = dv.pages('"02 Problem Analysis/01 Painpoints"').where(page => page.entity_type === "painpoint").array();
const solutions = dv.pages('"03 Solution"').where(page => page.entity_type === "solution");

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

function displayLabel(page, fallback) {
  const raw = page?.title
    ?? page?.file?.name
    ?? cleanedCandidate(fallback);

  return raw
    .replace(/^(Painpoint|Solution|Activity|Step|Task)\s*-\s*/i, "")
    .trim();
}

function displayLink(page, fallback) {
  if (page?.file?.path) {
    return dv.fileLink(page.file.path, false, displayLabel(page, fallback));
  }

  const label = displayLabel(null, fallback);
  return label || "";
}

function resolvePage(ref, pages = allPages) {
  if (!ref) {
    return null;
  }

  const candidates = [
    ref,
    cleanedCandidate(ref),
    ref?.path,
    ref?.file?.path,
    ref?.file?.name,
    ref?.display,
    ref?.title,
    ref?.value,
    ref?.markdown
  ]
    .map(cleanedCandidate)
    .filter(Boolean);

  for (const candidate of candidates) {
    const direct = dv.page(candidate);
    if (direct) {
      return direct;
    }
  }

  return pages.where(page => candidates.some(candidate =>
    page.file.path === candidate ||
    page.file.path.replace(/\.md$/, "") === candidate ||
    page.file.name === candidate.replace(/\.md$/, "") ||
    (page.title ?? "") === candidate
  )).array()[0] ?? null;
}

function referencesPage(refs, page) {
  const target = linkKey(page?.file?.path ?? page?.file?.name);
  return toArray(refs).some(ref => linkKey(ref) === target);
}

function solutionsFor(painpoint) {
  return solutions.where(solution => referencesPage(solution.solves, painpoint))
    .array()
    .sort((left, right) => displayLabel(left).localeCompare(displayLabel(right)));
}

const rows = painpoints.sort((left, right) => {
  const leftTask = displayLabel(resolvePage(left.task, storyNodes), left.task);
  const rightTask = displayLabel(resolvePage(right.task, storyNodes), right.task);
  const taskDelta = leftTask.localeCompare(rightTask);

  if (taskDelta !== 0) {
    return sortDirection === "desc" ? -taskDelta : taskDelta;
  }

  const titleDelta = displayLabel(left).localeCompare(displayLabel(right));
  return sortDirection === "desc" ? -titleDelta : titleDelta;
});

dv.table(
  ["Painpoint", "Task", "Solutions"],
  rows.map(page => {
    const task = resolvePage(page.task, storyNodes);
    const relatedSolutions = solutionsFor(page);

    return [
      displayLink(page),
      displayLink(task, page.task),
      relatedSolutions.length
    ];
  })
);
