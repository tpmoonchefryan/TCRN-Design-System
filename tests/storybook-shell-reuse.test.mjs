import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { expect } from '@playwright/test';
import { exerciseDocsTopbar, exerciseDocsTopbarEdges } from '../scripts/lib/published-docs-browser.mjs';
import { withPublishedBrowser } from '../scripts/lib/published-browser-proof.mjs';

const preferenceKey = 'tcrn-published-docs:anonymous:design-system';
const evidence = process.env.TCRN_REUSE_EVIDENCE;
const observations = [];
const locales = ['zh-CN', 'en', 'ja', 'ko', 'fr'];
const defaults = ['foundations', 'brand', 'components', 'shell'];
const story = { index: 'home', '07a-shell-upper': 'shell-upper', '05-actions': 'actions', '03-icons': 'icons', '01-tokens': 'tokens', api: 'api' };
const href = (surface, locale, page) => surface === 'static' ? `/${locale}/${page}.html`
  : surface === 'canvas' ? `/iframe.html?id=published-standards--${story[page]}&viewMode=story&globals=locale:${locale}`
  : `/index.html?path=/story/published-standards--${story[page]}&globals=locale:${locale}`;
const surfaceOf = (page, surface) => surface === 'manager' ? page.frameLocator('#storybook-preview-iframe') : page;
const box = element => element.evaluate(el => {
  const r = el.getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom };
});
const painted = element => element.evaluate(el => {
  const r = el.getBoundingClientRect(), s = getComputedStyle(el);
  return { width: r.width, height: r.height, font: s.font, padding: s.padding, background: s.backgroundColor, shadow: s.boxShadow, radius: s.borderRadius, className: el.className };
});
const adjacency = (row, popup, gap = 4) => Math.min(Math.abs(popup.x - row.right - gap), Math.abs(row.x - popup.right - gap)) < .6;
async function record(kind, data) {
  observations.push({ kind, ...data });
  if (evidence) { fs.mkdirSync(evidence, { recursive: true }); fs.writeFileSync(path.join(evidence, 'measurements.json'), JSON.stringify(observations, null, 2)); }
}
async function saved(shell) { return shell.evaluate((el, key) => JSON.parse(el.ownerDocument.defaultView.localStorage.getItem(key)), preferenceKey); }
async function ready(page, surface, locale, doc = '07a-shell-upper') {
  const root = surfaceOf(page, surface).locator(`.docs-shell[data-docs-page="${doc}"][lang="${locale}"][data-docs-ready=true]`);
  await root.waitFor();
  await root.evaluate(el => el.ownerDocument.fonts.ready);
  return root;
}
async function openDirectory(shell) {
  const brand = shell.locator(':scope > header [data-shell-brand]');
  if (await brand.getAttribute('aria-expanded') !== 'true') await brand.click();
  return shell.locator(':scope > [data-shell-menu]');
}
async function screenshot(page, name) { if (evidence) await page.screenshot({ path: path.join(evidence, `${name}.png`) }); }

for (const output of ['static', 'manager']) test(`Storybook shell reuse: ${output} output`, async () => {
  await withPublishedBrowser(async ({ browser, base }) => {
    for (const surface of output === 'static' ? ['static'] : ['canvas', 'manager']) {
      for (const locale of locales) for (const theme of ['light', 'dark']) {
        const context = await browser.newContext({ viewport: { width: surface === 'manager' ? 1810 : 1462, height: 1000 }, reducedMotion: 'reduce' });
        const page = await context.newPage();
        page.setDefaultTimeout(7000);
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await context.addInitScript(({ preferenceKey, theme }) => {
          if (!localStorage.getItem(preferenceKey)) localStorage.setItem(preferenceKey, JSON.stringify({ theme, retainedPreference: 'unchanged' }));
        }, { preferenceKey, theme });
        const id = `${surface}-${locale}-${theme}`;
        try {
          await page.goto(base + href(surface, locale, '07a-shell-upper'));
          let shell = await ready(page, surface, locale);
          await expect(shell).toHaveAttribute('data-tcrn-theme', theme);
          const top = shell.locator('.docs-topics');
          assert.deepEqual(await top.locator('[data-pin]').evaluateAll(nodes => nodes.map(el => el.dataset.pin)), defaults);
          for (const button of await top.locator('button').all()) {
            await expect(button).toHaveAttribute('aria-haspopup', 'dialog');
            await expect(button).toHaveAttribute('aria-expanded', 'false');
            assert.equal(await button.locator('[data-icon-name=chevron-down]').count(), 1);
          }
          const home = shell.locator('.docs-topic-nav > .tcrn-shell-pins__pin > a');
          assert.equal(await home.getAttribute('href'), href(surface, locale, 'index'));
          const pane = shell.locator(`[data-approved-board="07a-shell-upper"] [data-doc-shell-theme="${theme}"]`);
          const toggle = pane.locator('.tcrn-doc-shell-tools > .tcrn-button').first();
          const control = await painted(toggle);
          assert.equal(control.height, 32);
          assert.match(control.className, /tcrn-button--secondary tcrn-button--md/);
          const specimenPage = await context.newPage();
          await specimenPage.goto(base + href(surface === 'manager' ? 'canvas' : surface, locale, '05-actions'));
          const specimenSurface = surfaceOf(specimenPage, surface === 'manager' ? 'canvas' : surface);
          await specimenSurface.locator('[data-approved-board="05-actions"]').waitFor();
          await specimenPage.evaluate(() => document.fonts.ready);
          const specimenButton = specimenSurface.locator(`[data-approved-board="05-actions"] [data-formal-theme="${theme}"] .tcrn-button--secondary.tcrn-button--md`).first();
          const sample = await painted(specimenButton);
          for (const prop of ['height', 'font', 'padding', 'radius', 'background', 'shadow']) assert.equal(control[prop], sample[prop], `${id}: Button ${prop}`);
          await record('button-specimen', { id, control, sample });
          if (locale === 'zh-CN') {
            if (evidence) {
              await toggle.screenshot({ path: path.join(evidence, `${id}-ordinary-button.png`) });
              await specimenButton.screenshot({ path: path.join(evidence, `${id}-button-specimen.png`) });
            }
          }
          await specimenPage.close();
          if (locale === 'zh-CN' && theme === 'light') {
            await toggle.evaluate(el => { el.style.minBlockSize = '44px'; });
            assert.notEqual((await painted(toggle)).height, sample.height, 'detect the original docs inflation');
            await toggle.evaluate(el => el.style.removeProperty('min-block-size'));
            await record('negative-button-inflation', { id, detected: true });
          }
          await toggle.click();
          const frame = pane.locator('.tcrn-doc-shell-frame').first();
          await expect(frame).toHaveAttribute('data-specimen-view', 'original');
          assert.equal((await box(frame.locator(':scope > .tcrn-product-shell'))).width, 1240);
          assert.equal(await shell.locator('.tcrn-doc-shell-frame[data-specimen-view=fit]').count() > 0, true, 'sample states remain independent');
          if (locale === 'zh-CN') await screenshot(page, `${id}-original-size`);
          await toggle.click();
          await expect(frame).toHaveAttribute('data-specimen-view', 'fit');

          let menu = await openDirectory(shell);
          const branch = menu.locator('[data-shell-row][aria-controls$="-col-api-branch"]').first();
          await branch.hover();
          await expect(branch).toHaveAttribute('aria-expanded', 'false', { timeout: 1000 });
          await branch.click();
          const popup = menu.locator(':scope > .tcrn-shell-menu__cascade');
          const rowBox = await box(branch.locator('xpath=..'));
          const popupBox = await box(popup);
          assert.ok(adjacency(rowBox, popupBox), `${id}: real row adjacency ${JSON.stringify({rowBox, popupBox})}`);
          const viewportHeight = await shell.evaluate(el => el.ownerDocument.documentElement.clientHeight);
          assert.equal(popupBox.y, Math.max(12, Math.min(rowBox.y, viewportHeight - 12 - popupBox.height)), 'row alignment or actual viewport collision');
          assert.equal(popupBox.width, 240);
          assert.equal(popupBox.height, (await box(menu.locator('[data-panel=expanded]'))).height);
          await page.mouse.move(rowBox.right + 2 + (surface === 'manager' ? (await page.locator('#storybook-preview-iframe').boundingBox()).x : 0), rowBox.y + 16 + (surface === 'manager' ? (await page.locator('#storybook-preview-iframe').boundingBox()).y : 0));
          await popup.locator('[data-shell-row]').first().hover();
          await expect(branch).toHaveAttribute('aria-expanded', 'true');
          await record('directory-row-cascade', { id, rowBox, anchorBox: await box(branch), popupBox, gap: popupBox.x - rowBox.right, verticalOffset: popupBox.y - rowBox.y, viewportHeight, pins: await menu.locator('[data-pin-button]').count() });
          if (locale === 'zh-CN') await screenshot(page, `${id}-directory-row`);
          if (locale === 'zh-CN' && theme === 'light') {
            const style = await popup.getAttribute('style');
            await popup.evaluate(el => { el.style.left = '956px'; el.style.top = '0px'; });
            assert.equal(adjacency(rowBox, await box(popup)), false, 'detect the original far-edge cascade');
            await popup.evaluate((el, style) => el.setAttribute('style', style), style);
            await record('negative-far-edge-cascade', { id, detected: true });
          }
          await branch.focus();
          await branch.press('ArrowRight');
          await expect(popup.locator('[data-shell-row]').first()).toBeFocused();
          await popup.locator('[data-shell-row]').first().press('ArrowLeft');
          await expect(branch).toBeFocused();
          await expect(branch).toHaveAttribute('aria-expanded', 'false');
          await branch.press('Escape');
          await expect(shell.locator(':scope > header [data-shell-brand]')).toBeFocused();

          const components = top.locator('[data-pin=components] > button');
          if (locale === 'zh-CN' && theme === 'light') {
            const arrow = components.locator('[data-icon-name=chevron-down]');
            const markup = await arrow.evaluate(el => { const markup = el.outerHTML; el.remove(); return markup; });
            assert.equal(await components.locator('[data-icon-name=chevron-down]').count(), 0, 'detect omitted down chevron');
            await components.evaluate((el, markup) => el.insertAdjacentHTML('beforeend', markup), markup);
            await record('negative-missing-chevron', { id, detected: true });
          }
          await components.hover();
          const layer = shell.locator('[data-docs-topic-layer=components]');
          const topicBranch = layer.locator('button.docs-topic-menu__row');
          await topicBranch.hover();
          const sub = layer.locator('.docs-topic-menu--submenu');
          await sub.waitFor();
          const topicRow = await box(topicBranch), topicPopup = await box(sub);
          assert.ok(adjacency(topicRow, topicPopup));
          assert.equal(topicRow.y, topicPopup.y);
          const destinations = await sub.locator('a').evaluateAll(links => links.map(link => link.getAttribute('href')));
          const fragments = destinations.map(destination => {
            const route = new URL(destination, base);
            return route.hash.slice(1) || (route.searchParams.get('docsAnchor') ?? '').split(':').at(-1);
          });
          assert.equal(destinations.length, 30, 'overview, 28 formal contracts and adopted support');
          assert.equal(destinations[0], href(surface, locale, 'api'));
          assert.equal(new Set(fragments.filter(fragment => fragment.startsWith('api-'))).size, 28);
          assert.equal(fragments.filter(fragment => fragment === 'adopted-support').length, 1);
          await sub.locator('a').first().hover();
          await expect(components).toHaveAttribute('aria-expanded', 'true');
          await topicBranch.focus();
          await topicBranch.press('ArrowRight');
          await expect(sub.locator('a').first()).toBeFocused();
          await sub.locator('a').first().press('Escape');
          await expect(topicBranch).toBeFocused();
          await topicBranch.press('Escape');
          await expect(components).toBeFocused();
          await expect(components).toHaveAttribute('aria-expanded', 'false');
          await record('topband-row-cascade', { id, row: topicRow, popup: topicPopup, gap: topicPopup.x - topicRow.right, chevrons: 4 });

          menu = await openDirectory(shell);
          const pin = menu.locator(`[data-shell-row][href="${href(surface, locale, '03-icons')}"]`).first().locator('xpath=..').locator('[data-pin-button]');
          const before = page.url();
          await pin.click();
          await expect(top.locator('[data-pin="03-icons"] > a')).toHaveCount(1);
          assert.equal(page.url(), before, 'pin is not a navigation action');
          await expect(pin).toHaveAttribute('aria-pressed', 'true');
          await pin.click();
          await expect(top.locator('[data-pin="03-icons"]')).toHaveCount(0);
          await pin.click();
          assert.deepEqual((await saved(shell)).pins, [...defaults, '03-icons']);
          await page.reload();
          shell = await ready(page, surface, locale);
          await expect(shell.locator('.docs-topics [data-pin="03-icons"] > a')).toBeVisible();
          assert.equal((await saved(shell)).retainedPreference, 'unchanged');
          await shell.locator('.docs-topics [data-pin="03-icons"] > a').click();
          shell = await ready(page, surface, locale, '03-icons');
          await expect(shell.locator('.docs-topics [data-pin="03-icons"] > a')).toHaveAttribute('aria-current', 'page');
          const nextLocale = locale === 'en' ? 'fr' : 'en';
          const localeTrigger = shell.locator('.docs-preferences .tcrn-shell-locale-menu__trigger');
          await localeTrigger.click();
          await shell.locator(`.tcrn-shell-locale-menu__option[lang="${nextLocale}"]`).click();
          shell = await ready(page, surface, nextLocale, '03-icons');
          await expect(shell.locator('.docs-topics [data-pin="03-icons"] > a')).toHaveAttribute('href', href(surface, nextLocale, '03-icons'));
          await expect(shell).toHaveAttribute('data-tcrn-theme', theme);
          const stable = await saved(shell);
          assert.deepEqual(stable.pins, [...defaults, '03-icons']);
          assert.equal(stable.retainedPreference, 'unchanged');
          await page.setViewportSize({ width: surface === 'manager' ? 738 : 390, height: 844 });
          if (surface === 'manager') {
            // Actual Manager viewport tool constrains its iframe, retaining native Manager UI.
            const viewport = page.getByRole('button', { name: /Change the size of the preview/ });
            if (await viewport.count()) { /* no viewport addon is installed; the owning browser width constrains Canvas */ }
          }
          const shellWidth = await shell.evaluate(el => el.getBoundingClientRect().width);
          if (shellWidth > 390 && surface === 'manager') await page.setViewportSize({ width: 390, height: 844 });
          menu = await openDirectory(shell);
          await expect(shell.locator('.docs-topic-nav')).toBeHidden();
          await expect(menu.locator('[data-shell-pinned-group]')).toBeVisible();
          const pinned = menu.locator('[data-shell-pinned-group] [data-shell-row]');
          assert.equal(await pinned.count(), 5);
          assert.deepEqual(await pinned.evaluateAll(nodes => nodes.map(el => el.textContent.trim())), await shell.locator('.docs-topics [data-pin]').evaluateAll(nodes => nodes.map(el => el.textContent.trim())));
          const narrowRows = await pinned.evaluateAll(nodes => nodes.map(el => el.getBoundingClientRect().height));
          assert.ok(narrowRows.every(height => height === 44));
          const narrowPin = pinned.last().locator('xpath=..').locator('[data-pin-button]');
          await narrowPin.click();
          await expect(pinned).toHaveCount(4);
          assert.deepEqual((await saved(shell)).pins, defaults);
          await record('pin-preferences-and-narrow', { id, nextLocale, stable, shellWidth: await shell.evaluate(el => el.getBoundingClientRect().width), narrowRows, unpinned: (await saved(shell)).pins });
          if (locale === 'zh-CN') await screenshot(page, `${id}-narrow-pins`);
          if (locale === 'en' && theme === 'light') {
            await page.setViewportSize({ width: surface === 'manager' ? 1810 : 1462, height: 1000 });
            await page.goto(base + href(surface, locale, '07a-shell-upper'));
            shell = await ready(page, surface, locale);
            menu = await openDirectory(shell);
            const targets = ['01-tokens', '05-actions', '07a-shell-upper'];
            for (const doc of targets) {
              const pin = menu.locator(`[data-shell-row][href="${href(surface, locale, doc)}"]`).first().locator('xpath=..').locator('[data-pin-button]');
              await pin.click();
            }
            const order = [...defaults, ...targets];
            assert.deepEqual((await saved(shell)).pins, order);
            const shown = shell.locator('.docs-topics [data-pin]');
            assert.equal(await shown.count(), 6, 'published six-pin maximum');
            assert.deepEqual(await shown.evaluateAll(nodes => nodes.map(el => el.dataset.pin)), order.slice(0, 6), 'overflow remains in full menu');
            const overflow = menu.locator(`[data-shell-row][href="${href(surface, locale, '07a-shell-upper')}"]`).first().locator('xpath=..').locator('[data-pin-button]');
            await expect(overflow).toHaveAttribute('aria-pressed', 'true');
            await menu.locator('input[type=search]').press('Escape');
            const moved = shell.locator('.docs-topics [data-pin="05-actions"] > a');
            await moved.focus();
            await moved.press('Alt+ArrowLeft');
            await expect(moved).toBeFocused();
            const reordered = [...defaults, '05-actions', '01-tokens', '07a-shell-upper'];
            assert.deepEqual((await saved(shell)).pins, reordered);
            const urlBeforeDrag = page.url();
            const first = await box(shell.locator('.docs-topics [data-pin="foundations"]'));
            const last = await box(shell.locator('.docs-topics [data-pin="01-tokens"]'));
            const offset = surface === 'manager' ? await page.locator('#storybook-preview-iframe').boundingBox() : { x: 0, y: 0 };
            await page.mouse.move(first.x + first.width / 2 + offset.x, first.y + first.height / 2 + offset.y);
            await page.mouse.down();
            await page.mouse.move(last.right - 1 + offset.x, last.y + last.height / 2 + offset.y, { steps: 10 });
            await page.mouse.up();
            assert.equal(page.url(), urlBeforeDrag, 'drag does not activate navigation');
            const afterDrag = (await saved(shell)).pins;
            assert.deepEqual(afterDrag, ['brand', 'components', 'shell', '05-actions', '01-tokens', 'foundations', '07a-shell-upper']);
            await page.reload();
            shell = await ready(page, surface, locale);
            assert.deepEqual((await saved(shell)).pins, afterDrag);
            await page.setViewportSize({ width: 390, height: 844 });
            menu = await openDirectory(shell);
            assert.equal(await menu.locator('[data-shell-pinned-group] [data-shell-row]').count(), 7);
            await record('maximum-overflow-reorder', { surface, order, reordered, afterDrag, narrowCount: 7 });
          }
          assert.deepEqual(errors, []);
        } catch (error) {
          await screenshot(page, `${id}-failure`);
          await record('failure-state', { id, url: page.url(), actual: await surfaceOf(page, surface).locator('.docs-shell').first().evaluate(el => ({ locale: el.lang, page: el.dataset.docsPage, pins: [...el.querySelectorAll('.docs-topics [data-pin]')].map(pin => pin.dataset.pin), stored: localStorage.getItem('tcrn-published-docs:anonymous:design-system') })).catch(error => ({ error: error.message })) });
          throw error;
        } finally { await context.close(); }
      }
    }
  }, { entry: output });
});

test('docs cascades use actual row collision and keep real coarse-pointer controls', async () => {
  await withPublishedBrowser(async ({ browser, base }) => {
    const page = await browser.newPage({ viewport: { width: 1000, height: 500 }, reducedMotion: 'reduce' });
    await page.goto(base + '/en/07a-shell-upper.html');
    const shell = await ready(page, 'static', 'en');
    let menu = await openDirectory(shell);
    await menu.locator('input[type=search]').press('Escape');
    await page.keyboard.press('Control+k');
    const search = menu.locator('input[type=search]');
    await expect(search).toBeFocused();
    await search.press('ArrowDown');
    const firstRow = menu.locator('[data-shell-row]').first();
    await expect(firstRow).toBeFocused();
    await firstRow.press('ArrowUp');
    await expect(search).toBeFocused();
    const branch = menu.locator('[data-shell-row][aria-controls$="-col-api-branch"]').first();
    await branch.focus();
    await branch.press('ArrowUp');
    await expect(menu.locator('[data-shell-row][href="/en/06-inputs.html"]').first()).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(branch).toBeFocused();
    await branch.locator('xpath=..').locator('[data-pin-button]').click();
    const rightBranch = menu.locator('[data-shell-pinned-group] [data-shell-row][aria-controls$="-col-api-branch"]');
    await rightBranch.click();
    const row = await box(rightBranch.locator('xpath=..'));
    const cascade = menu.locator(':scope > .tcrn-shell-menu__cascade');
    const popup = await box(cascade);
    assert.ok(adjacency(row, popup), JSON.stringify({row, popup}));
    assert.ok(popup.right < row.x, 'right-side branch flips to its left');
    assert.ok(popup.y >= 12 && popup.bottom <= 488, 'height and top adapt to constrained viewport');
    await record('collision-flip', { row, popup, viewport: { width: 1000, height: 500 } });
    await screenshot(page, 'static-constrained-left-flip');
    await page.setViewportSize({ width: 560, height: 400 });
    const immediatelyAfterResize = await box(cascade);
    await expect.poll(async () => {
      const popup = await box(cascade);
      return popup.x >= 12 && popup.right <= 548 && popup.y >= 12 && popup.bottom <= 388;
    }, { message: JSON.stringify({ immediatelyAfterResize }) }).toBe(true);
    const constrained = await box(cascade);
    await record('collision-no-side-fits', { popup: constrained, viewport: { width: 560, height: 400 }, limitation: 'A full-width single-column row cannot fit a 240px popup on either side; the existing viewport inset clamps it into the visible area.' });
    await rightBranch.press('Escape');
    await page.setViewportSize({ width: 1462, height: 900 });
    const pinnedBranch = shell.locator('.docs-topics [data-pin="api-branch"] > button');
    await expect(pinnedBranch).toBeVisible();
    await expect(pinnedBranch).toHaveAttribute('aria-haspopup', 'dialog');
    assert.equal(await pinnedBranch.locator('[data-icon-name=chevron-down]').count(), 1);
    await pinnedBranch.hover();
    const pinnedLayer = shell.locator('[data-docs-topic-layer="api-branch"]');
    await expect(pinnedBranch).toHaveAttribute('aria-expanded', 'true');
    assert.equal(await pinnedLayer.locator(':scope > .docs-topic-menu a').count(), 2, 'overview and adopted support keep their routes');
    const family = pinnedLayer.locator(':scope > .docs-topic-menu button.docs-topic-menu__row').first();
    await family.hover();
    const familyMenu = pinnedLayer.locator('.docs-topics__submenu-wrap');
    await expect(familyMenu).toBeVisible();
    const familyEntries = await familyMenu.locator('a').count();
    assert.equal(familyEntries, 3, 'the typography family retains Heading, Text and Highlight');
    await familyMenu.locator('a[href="/en/api.html#api-Heading"]').click();
    const apiPage = await ready(page, 'static', 'en', 'api');
    assert.equal(new URL(page.url()).hash, '#api-Heading');
    assert.ok((await saved(apiPage)).pins.includes('api-branch'));
    menu = await openDirectory(apiPage);
    const unpinBranch = menu.locator('[data-shell-row][aria-controls$="-col-api-branch"]').first().locator('xpath=..').locator('[data-pin-button]');
    await unpinBranch.click();
    await expect(apiPage.locator('.docs-topics [data-pin="api-branch"]')).toHaveCount(0);
    await record('pinned-submenu', { dropdownChevron: true, family: '02-typography', entries: familyEntries, activated: page.url(), unpinned: (await saved(apiPage)).pins });
    await page.close();
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
    const touch = await context.newPage();
    await touch.goto(base + '/fr/07a-shell-upper.html');
    const phone = await ready(touch, 'static', 'fr');
    assert.equal(await phone.evaluate(() => matchMedia('(pointer: coarse)').matches), true);
    const toggle = phone.locator('.tcrn-doc-shell-tools > .tcrn-button').first();
    assert.equal((await painted(toggle)).height, 32, 'ordinary Button follows its 05 size on touch too');
    await toggle.tap();
    await expect(phone.locator('.tcrn-doc-shell-frame').first()).toHaveAttribute('data-specimen-view', 'original');
    menu = await openDirectory(phone);
    await expect(menu.locator('[data-panel=sheet]')).toBeFocused();
    const pins = menu.locator('[data-pin-button]');
    const first = menu.locator('[data-shell-pinned-group] [data-pin-button]').first();
    const hit = () => first.evaluate(el => {
      const r = el.getBoundingClientRect();
      const before = getComputedStyle(el, '::after');
      return { hit: el.contains(el.ownerDocument.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)), width: r.width, height: r.height, touchWidth: before.width, touchHeight: before.height };
    });
    const reading = await hit();
    assert.equal(reading.hit, true);
    assert.equal(reading.touchWidth, '44px');
    assert.equal(reading.touchHeight, '44px');
    await pins.evaluateAll(nodes => nodes.forEach(el => { el.style.position = 'static'; }));
    assert.equal((await hit()).hit, false, 'detect unanchored pin hit areas intercepting another control');
    await pins.evaluateAll(nodes => nodes.forEach(el => el.style.removeProperty('position')));
    const before = await saved(phone);
    await first.tap();
    const after = await saved(phone);
    assert.equal(after.pins.length, 3);
    await record('coarse-pointer', { reading, before, after, negativeUnanchoredPins: true });
    await screenshot(touch, 'coarse-phone-pins');
    await context.close();
  }, { entry: 'static' });
});

test('existing docs navigation, hover gaps, focus, motion and last-row regressions', async () => {
  for (const output of ['static', 'manager']) await withPublishedBrowser(async ({ browser, base }) => {
    const page = await browser.newPage({ viewport: { width: 1810, height: 1000 }, reducedMotion: 'reduce' });
    page.setDefaultTimeout(7000);
    try {
      for (const surface of output === 'static' ? ['static'] : ['canvas', 'manager']) {
        for (const locale of locales) {
          const result = await exerciseDocsTopbar(page, { base, entry: surface, locale, managerUi: surface === 'manager' });
          await record('existing-topbar-regression', { surface, locale, ...result });
          assert.deepEqual(result.issues, []);
        }
        const result = await exerciseDocsTopbarEdges(page, { base, entry: surface, managerUi: surface === 'manager' });
        await record('existing-topbar-edges', { surface, ...result });
        assert.deepEqual(result.issues, []);
      }
    } finally { await page.close(); }
  }, { entry: output });
});

test('top-band left cascade follows its long-label row at 1024px', async () => {
  await withPublishedBrowser(async ({ browser, base }) => {
    const page = await browser.newPage({ viewport: { width: 1024, height: 650 }, reducedMotion: 'reduce' });
    await page.goto(base + '/fr/07a-shell-upper.html');
    const shell = await ready(page, 'static', 'fr');
    const components = shell.locator('.docs-topics [data-pin=components] > button');
    await components.focus();
    await components.press('Alt+ArrowRight');
    const order = (await saved(shell)).pins;
    assert.deepEqual(order, ['foundations', 'brand', 'shell', 'components']);
    await components.hover();
    const layer = shell.locator('[data-docs-topic-layer=components]');
    const row = layer.locator('button.docs-topic-menu__row');
    await row.hover();
    const submenu = layer.locator('.docs-topic-menu--submenu');
    const rowBox = await box(row), popup = await box(submenu);
    assert.ok(adjacency(rowBox, popup));
    assert.ok(popup.right < rowBox.x, 'the actual initiating row flips left');
    assert.ok(popup.x >= 12 && popup.bottom <= 650);
    await page.mouse.move(rowBox.x - 2, rowBox.y + 16);
    await expect(row).toHaveAttribute('aria-expanded', 'true');
    await submenu.locator('a').first().hover();
    await expect(components).toHaveAttribute('aria-expanded', 'true');
    const labels = await shell.locator('.docs-topics .tcrn-shell-pins__label').evaluateAll(nodes => nodes.map(el => ({ text: el.textContent, title: el.title, whiteSpace: getComputedStyle(el).whiteSpace, width: el.getBoundingClientRect().width, ellipsis: getComputedStyle(el).textOverflow })));
    assert.ok(labels.every(label => label.text === label.title && label.whiteSpace === 'nowrap' && label.ellipsis === 'ellipsis' && label.width > 0));
    await record('topband-left-collision-long-labels', { order, row: rowBox, popup, labels, viewport: { width: 1024, height: 650 } });
    await screenshot(page, 'topband-french-1024-left-cascade');
    await page.close();
  }, { entry: 'static' });
});
