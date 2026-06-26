export const tableShellRuleRows = [
  {
    surface: "TableShell",
    desktop: "Use readable dense rows with visible headers and package-backed status cells.",
    mobile: "Stack each row into labeled fields without dropping labels or state text.",
    boundary: "Do not render unlabeled text blocks or claim remote counts from local examples."
  },
  {
    surface: "WorkIndex",
    desktop: "Use for finite review queues where status and owner scanning matter.",
    mobile: "Preserve source order and show the same labels before each value.",
    boundary: "Do not treat WorkIndex as DataGrid, virtualized search, or bulk editing."
  },
  {
    surface: "Empty state",
    desktop: "Keep the empty state inside the table frame and name what is absent.",
    mobile: "Keep the same empty message visible without inventing rows.",
    boundary: "Do not use empty state when loading or source errors are unresolved."
  },
  {
    surface: "Accessibility receipt",
    desktop: "Every table needs an accessible name and legal row/cell structure, including empty states.",
    mobile: "Stacked mobile rows keep data-label text before each value.",
    boundary: "Never place headings or arbitrary blocks directly under role=table."
  },
  {
    surface: "Sorting and filtering",
    desktop: "Show sort or filter controls only after aria-sort, active filter readback, and empty/error states are implemented.",
    mobile: "Keep the current sort/filter summary visible before stacked rows.",
    boundary: "TableShell does not imply remote filtering, column configuration, or persisted sort state."
  },
  {
    surface: "Row actions",
    desktop: "Keep row actions visible, focusable, and separated from status text.",
    mobile: "Actions wrap under the row label with the same disabled reason text.",
    boundary: "Do not hide blocked actions or append disabled reasons to visible labels."
  },
  {
    surface: "Bulk selection",
    desktop: "Batch selection requires selected counts, all/none boundaries, and keyboard behavior.",
    mobile: "Show selected state per row; do not rely on color alone.",
    boundary: "WorkIndex does not include bulk selection by default."
  }
];

export const dataGridEscalationRows = [
  {
    capability: "Editable cells",
    tableShell: "Do not keep TableShell",
    escalation: "Use DataGrid or a detail form with persistent field labels.",
    proof: "Keyboard editing, validation, save/cancel, and error recovery."
  },
  {
    capability: "Remote pagination or filtering",
    tableShell: "Do not keep TableShell",
    escalation: "Use DataGrid or a route-owned workbench.",
    proof: "Loading, empty, error, current query, and total-count ownership."
  },
  {
    capability: "Virtual scrolling",
    tableShell: "Do not keep TableShell",
    escalation: "Use DataGrid with explicit viewport and row-count proof.",
    proof: "Keyboard position, screen-reader row context, and scroll restoration."
  },
  {
    capability: "Column resize or frozen columns",
    tableShell: "Do not keep TableShell",
    escalation: "Use DataGrid with column-state controls.",
    proof: "Resize handles, focus order, persistence, and responsive fallback."
  },
  {
    capability: "Bulk operations",
    tableShell: "Do not keep WorkIndex",
    escalation: "Use a selection list or DataGrid with batch-action proof.",
    proof: "Selected count, all/none behavior, disabled reasons, and undo or confirmation."
  }
];
