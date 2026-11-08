/** Browser-only geometry. Static source checks cannot resolve the layout cascade. */
export async function measureConsumerLayout(page) {
  await page.evaluate(() => document.fonts.ready);
  return page.evaluate(() => {
    const tolerance = 1;
    const findings = [];
    const actions = [];
    const groups = [];
    const close = (a, b) => Math.abs(a - b) <= tolerance;
    const number = value => Number.parseFloat(value) || 0;
    const availableWidth = element => {
      const parent = element.parentElement;
      const style = getComputedStyle(parent);
      return parent.clientWidth - number(style.paddingLeft) - number(style.paddingRight);
    };
    const visibleChildren = element => [...element.children].filter(child => {
      const style = getComputedStyle(child);
      return style.display !== "none" && style.visibility !== "hidden" && style.position !== "absolute";
    });
    const naturalWidth = element => {
      if (element.matches(".tcrn-button__label, .tcrn-icon-button__label")) {
        const range = document.createRange();
        range.selectNodeContents(element);
        return range.getBoundingClientRect().width;
      }
      return element.getBoundingClientRect().width;
    };
    for (const element of document.querySelectorAll(".tcrn-button, .tcrn-link-button")) {
      const box = element.getBoundingClientRect();
      if (!box.width || !box.height || getComputedStyle(element).visibility === "hidden") continue;
      const style = getComputedStyle(element);
      const size = element.classList.contains("tcrn-button--sm") || element.classList.contains("tcrn-link-button--sm") ? "sm"
        : element.classList.contains("tcrn-button--lg") || element.classList.contains("tcrn-link-button--lg") ? "lg" : "md";
      const square = element.classList.contains("tcrn-icon-button") && !element.classList.contains("tcrn-icon-button--labelled");
      const tokenHeight = number(style.getPropertyValue(`--tcrn-control-height-${size}`));
      const tokenPadding = square ? 0 : number(style.getPropertyValue(`--tcrn-control-padding-${size}`));
      const children = visibleChildren(element);
      const gap = number(style.columnGap) * Math.max(0, children.length - 1);
      const padding = number(style.paddingLeft) + number(style.paddingRight);
      const border = number(style.borderLeftWidth) + number(style.borderRightWidth);
      const natural = children.reduce((sum, child) => sum + naturalWidth(child), 0) + gap + padding + border;
      const occupied = children.reduce((sum, child) => sum + child.getBoundingClientRect().width, 0) + gap + padding + border;
      const inGroup = element.parentElement.classList.contains("tcrn-button-group");
      const expected = square ? tokenHeight : Math.min(natural, availableWidth(element));
      const record = { label: element.textContent.trim(), size, square, inGroup, width: box.width, height: box.height,
        tokenHeight, tokenPadding, padding, naturalWidth: natural, occupiedWidth: occupied, expectedWidth: expected, parentWidth: availableWidth(element) };
      actions.push(record);
      const fail = reason => findings.push({ reason, action: actions.length - 1 });
      if (!tokenHeight || !close(box.height, tokenHeight)) fail("ACTION_TOKEN_HEIGHT");
      if (!close(number(style.paddingLeft), tokenPadding) || !close(number(style.paddingRight), tokenPadding)) fail("ACTION_TOKEN_PADDING");
      if (square ? !close(box.width, tokenHeight) : !close(box.width, occupied)) fail("ACTION_CONTENT_WIDTH");
      if (!inGroup && !close(box.width, expected)) fail("ACTION_NATURAL_OR_PARENT_WIDTH");
      if (box.width > availableWidth(element) + tolerance) fail("ACTION_PARENT_OVERFLOW");
    }
    for (const element of document.querySelectorAll(".tcrn-button-group")) {
      const box = element.getBoundingClientRect();
      if (!box.width || !box.height) continue;
      const children = [...element.children];
      const occupied = children.reduce((sum, child) => {
        const style = getComputedStyle(child);
        return sum + child.getBoundingClientRect().width + number(style.marginLeft) + number(style.marginRight);
      }, 0);
      const natural = children.reduce((sum, child) => {
        const style = getComputedStyle(child);
        const members = visibleChildren(child);
        const gaps = number(style.columnGap) * Math.max(0, members.length - 1);
        return sum + (child.matches("button") ? members.reduce((total, part) => total + naturalWidth(part), 0) + gaps
          + number(style.paddingLeft) + number(style.paddingRight) : child.getBoundingClientRect().width)
          + number(style.marginLeft) + number(style.marginRight);
      }, 0);
      const expected = Math.min(natural, availableWidth(element));
      const first = children[0]?.getBoundingClientRect();
      const last = children.at(-1)?.getBoundingClientRect();
      groups.push({ width: box.width, occupiedWidth: occupied, naturalWidth: natural, expectedWidth: expected,
        parentWidth: availableWidth(element), variant: element.classList.contains("tcrn-button-group--quiet") ? "quiet" : "secondary",
        members: children.map(child => child.getBoundingClientRect().width) });
      if (!close(box.width, occupied) || !close(box.width, expected) || !close(box.left, first.left) || !close(box.right, last.right)) {
        findings.push({ reason: "GROUP_MEMBER_ENCLOSURE", group: groups.length - 1 });
      }
    }
    if (!actions.length) findings.push({ reason: "ACTION_LAYOUT_INPUT_EMPTY" });
    return { ok: !findings.length, findings, actions, groups, viewport: { width: innerWidth, height: innerHeight },
      scope: "Rendered action geometry after fonts; no keyboard, publication, or model compliance claim" };
  });
}

export async function checkConsumerPage(url) {
  const target = new URL(url);
  if (!["http:", "https:"].includes(target.protocol)) throw new Error("LAYOUT_URL_MUST_BE_HTTP");
  const { chromium } = await import("@playwright/test");
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await page.goto(target.href, { waitUntil: "networkidle" });
    const result = await measureConsumerLayout(page);
    return { url: target.href, ...result };
  } finally {
    await browser.close();
  }
}
