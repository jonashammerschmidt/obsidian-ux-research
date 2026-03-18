const allPages = dv.pages();
const allPainpoints = allPages.where(page => page.entity_type === "painpoint");
const allSolutions = allPages.where(page => page.entity_type === "solution");
const current = dv.current();
const options = input ?? {};
const container = dv.container;

container.classList.add("ux-problem-analysis-view");

function ensureSolutionStyles() {
  if (container.querySelector("style[data-ux-problem-analysis-solutions]")) {
    return;
  }

  const style = container.createEl("style");
  style.dataset.uxProblemAnalysisSolutions = "true";
  style.textContent = `
    .ux-problem-analysis-view .ux-problem-analysis__solutions {
      margin-top: 1rem;
    }

    .ux-problem-analysis-view .ux-problem-analysis__solutions-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .ux-problem-analysis-view .ux-problem-analysis__solutions-item {
      margin: 0;
    }

    .ux-problem-analysis-view .ux-problem-analysis__solution-link,
    .ux-problem-analysis-view .ux-problem-analysis__solution-label {
      align-items: center;
      background: var(--interactive-accent);
      border: 1px solid transparent;
      border-radius: 999px;
      color: var(--text-on-accent);
      display: inline-flex;
      font-weight: 600;
      min-height: 2.25rem;
      padding: 0.45rem 0.85rem;
      text-decoration: none;
      transition: opacity 120ms ease, transform 120ms ease;
    }

    .ux-problem-analysis-view .ux-problem-analysis__solution-link:hover,
    .ux-problem-analysis-view .ux-problem-analysis__solution-link:focus-visible {
      color: var(--text-on-accent);
      opacity: 0.92;
      text-decoration: none;
      transform: translateY(-1px);
    }
  `;
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

function resolvePage(ref, pages = allPages) {
  if (!ref) {
    return null;
  }

  const rawCandidates = [];

  if (typeof ref === "string") {
    rawCandidates.push(ref);
  } else {
    rawCandidates.push(
      ref.path,
      ref.file?.path,
      ref.file?.name,
      ref.value?.path,
      ref.link?.path,
      ref.display,
      ref.title,
      ref.value,
      ref.link,
      ref.markdown,
      `${ref}`
    );
  }

  const candidates = rawCandidates
    .flatMap(candidate => [candidate, cleanedCandidate(candidate)])
    .filter(Boolean);

  for (const candidate of candidates) {
    const direct = dv.page(candidate);
    if (direct) {
      return direct;
    }
  }

  const normalized = candidates
    .map(candidate => cleanedCandidate(candidate).replace(/\.md$/, ""))
    .filter(Boolean);

  return pages.where(page => normalized.some(candidate =>
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

function displayLabel(page, fallback) {
  const raw = page?.title
    ?? page?.file?.name
    ?? cleanedCandidate(fallback);

  return raw
    .replace(/^(Painpoint|Symptom|Root Cause|Solution|Activity|Step|Task)\s*-\s*/i, "")
    .trim();
}

function solutionsFor(painpoint) {
  return allSolutions.where(solution => referencesPage(solution.solves, painpoint))
    .array()
    .sort((left, right) => displayLabel(left).localeCompare(displayLabel(right)));
}

function createInternalLink(parent, page, label, cls) {
  const link = parent.createEl("a", {
    text: label ?? displayLabel(page),
    href: page.file.path,
    cls: "internal-link"
  });

  if (cls) {
    link.addClass(cls);
  }

  link.dataset.href = page.file.path;
  return link;
}

function createCardLink(parent, page, cls) {
  const link = parent.createEl("a", {
    href: page.file.path,
    cls: `internal-link ${cls}`.trim()
  });
  link.dataset.href = page.file.path;
  return link;
}

function appendSketchCard(parent, ref, kind, pages = allPages) {
  const page = resolvePage(ref, pages);
  const card = page?.file?.path
    ? createCardLink(parent, page, `ux-problem-analysis__node is-${kind}`)
    : parent.createDiv({ cls: `ux-problem-analysis__node is-${kind}` });

  card.createSpan({
    text: displayLabel(page, ref),
    cls: "ux-problem-analysis__node-link"
  });

  return card;
}

function appendSide(parent, title, items, kind, pages = allPages) {
  const side = parent.createDiv({ cls: `ux-problem-analysis__side is-${kind}` });
  side.createDiv({ cls: "ux-problem-analysis__side-title", text: title });

  if (!items.length) {
    const empty = side.createDiv({ cls: `ux-problem-analysis__node is-${kind} is-empty` });
    empty.setText(`No ${title.toLowerCase()} linked`);
    return side;
  }

  for (const item of items) {
    appendSketchCard(side, item, kind, pages);
  }

  return side;
}

function renderSolutions(painpoint) {
  const items = solutionsFor(painpoint);
  const level = Number(options.solutionsHeadingLevel ?? 2);
  const headingTag = `h${Math.min(6, Math.max(1, level))}`;

  if (options.showSolutionsHeading !== false) {
    container.createEl(headingTag, { text: options.solutionsHeading ?? "Related Solutions" });
  }

  const section = container.createDiv({ cls: "ux-problem-analysis__solutions" });
  ensureSolutionStyles();

  if (!items.length) {
    section.createDiv({ text: "No related solutions linked." });
    return;
  }

  const list = section.createEl("ul", { cls: "ux-problem-analysis__solutions-list" });
  for (const item of items) {
    const entry = list.createEl("li", { cls: "ux-problem-analysis__solutions-item" });

    if (item?.file?.path) {
      createInternalLink(entry, item, displayLabel(item), "ux-problem-analysis__solution-link");
    } else {
      entry.createSpan({
        text: cleanedCandidate(item),
        cls: "ux-problem-analysis__solution-label"
      });
    }
  }
}

function resolvePainpointReference() {
  return options.focus
    ?? current.focus_painpoint
    ?? (current.entity_type === "painpoint" ? current.file.link : null);
}

const focus = resolvePainpointReference();

if (!focus) {
  dv.paragraph(options.emptySelectionMessage ?? "Set `focus_painpoint` in the note or open the view inside a painpoint note.");
  return;
}

const painpoint = resolvePage(focus, allPainpoints);

if (!painpoint) {
  dv.paragraph(options.missingPainpointMessage ?? "The selected painpoint could not be resolved.");
  return;
}

const board = container.createDiv({ cls: "ux-problem-analysis__board" });
appendSide(board, "Root Causes", toArray(painpoint.root_causes), "root");

const center = board.createDiv({ cls: "ux-problem-analysis__center" });
center.createDiv({ cls: "ux-problem-analysis__painpoint-kicker", text: "Painpoint" });
const card = createCardLink(center, painpoint, "ux-problem-analysis__painpoint");
const taskText = displayLabel(resolvePage(painpoint.task), painpoint.task);

if (taskText) {
  card.createDiv({
    text: taskText,
    cls: "ux-problem-analysis__painpoint-parent"
  });
}

card.createSpan({
  text: displayLabel(painpoint),
  cls: "ux-problem-analysis__painpoint-link"
});

appendSide(board, "Symptoms", toArray(painpoint.symptoms), "symptom");

if (options.showSolutions !== false) {
  renderSolutions(painpoint);
}
