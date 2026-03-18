const current = dv.current();
const options = input ?? {};
const allPages = dv.pages();
const allPainpoints = dv.pages('"02 Problem Analysis/01 Painpoints"').where(page => page.entity_type === "painpoint");
const allSolutions = dv.pages('"03 Solution"').where(page => page.entity_type === "solution");
const scope = (options.scope ?? current.relationship_scope ?? "all").toLowerCase();
const focusPainpoint = options.focus ?? current.focus_painpoint;

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

  return displayLabel(null, fallback);
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
    ref?.markdown,
    `${ref}`
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
  return allSolutions.where(solution => referencesPage(solution.solves, painpoint))
    .array()
    .sort((left, right) => displayLabel(left).localeCompare(displayLabel(right)));
}

let selectedPainpoints = allPainpoints;
if (scope === "focus" && focusPainpoint) {
  const painpoint = resolvePage(focusPainpoint, allPainpoints);
  selectedPainpoints = painpoint ? [painpoint] : [];
}

const rows = [];

for (const painpoint of selectedPainpoints) {
  const painpointLink = displayLink(painpoint);

  for (const solution of solutionsFor(painpoint)) {
    rows.push([painpointLink, "solved by", displayLink(solution)]);
  }

  rows.push([painpointLink, "belongs to task", displayLink(resolvePage(painpoint.task), painpoint.task)]);
}

dv.table(["From", "Relationship", "To"], rows);
