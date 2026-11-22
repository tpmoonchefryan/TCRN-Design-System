import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { ROOT, readApprovedSource, sha256 } from "../scripts/lib/approved-site-source.mjs";
import {
  ADOPTED_VOXWARD_MARK,
  AI_OUTPUT_FILES,
  LOCALES,
  VOXWARD_BRAND_DIGEST,
  checkAIOutput,
  checkBrand,
  checkManagerOutput,
  checkOutput,
  checkSourceClosure,
  compiled,
  executableOutputText,
} from "../scripts/lib/published-standard-proof.mjs";
import { markupStyleCoverage, proveStorybookSpecimensPurePackage } from "../scripts/lib/published-style-closure.mjs";
import { classifyHtml } from "../scripts/internal-vocabulary-scan.mjs";

test("actual component stories, both emitted AI trees and Manager retain the exact formal closure", () => {
  assert.deepEqual(checkSourceClosure(), []);
  assert.deepEqual(checkOutput().issues, []);
  assert.deepEqual(checkManagerOutput().issues, []);
  assert.equal(AI_OUTPUT_FILES.length, 80);
});

test("only byte-identical pinned normative quotations are inert during executable-asset scanning", () => {
  const relative = "ai/4.1.0/standard/02-typography.json";
  const source = readApprovedSource();
  const text = fs.readFileSync(path.join(ROOT, "apps/storybook/storybook-static", relative), "utf8");
  assert.match(text, /tcrn-brand-mark\.svg/);
  assert.doesNotMatch(executableOutputText(text, relative, source), /tcrn-brand-mark\.svg/);
  const changed = JSON.parse(text);
  changed.content.content += " changed";
  changed.content.sha256 = sha256(changed.content.content);
  assert.match(executableOutputText(JSON.stringify(changed), relative, source), /tcrn-brand-mark\.svg/);
  const extra = JSON.parse(text);
  extra.hiddenAsset = "tcrn-brand-mark.svg";
  assert.match(executableOutputText(JSON.stringify(extra), relative, source), /tcrn-brand-mark\.svg/);
  assert.match(executableOutputText(text, "hidden.json", source), /tcrn-brand-mark\.svg/);
});

test("a corrupt, missing or extra AI member cannot pass via its index's own claim", () => {
  const base = path.resolve(process.env.TCRN_BUILD_TRASH ?? process.env.TCRN_TEST_SCRATCH ?? path.join(ROOT, ".tarball-smoke"));
  fs.mkdirSync(base, { recursive: true });
  const fixture = fs.mkdtempSync(path.join(base, "ai-proof-"));
  const retired = path.join(base, `${path.basename(fixture)}-retired-${Date.now()}`);
  try {
    fs.cpSync(path.join(ROOT, "apps/storybook/storybook-static/ai"), path.join(fixture, "ai"), { recursive: true });
    assert.deepEqual(checkAIOutput(ROOT, fixture), []);
    const member = path.join(fixture, "ai/4.1.0/component/Button.json");
    const bytes = fs.readFileSync(member);
    fs.writeFileSync(member, Buffer.concat([bytes, Buffer.from(" ")]));
    assert.ok(checkAIOutput(ROOT, fixture).some(issue => issue.includes("byte drift component/Button")));
    const parkedMember = path.join(fixture, "Button.parked");
    fs.renameSync(member, parkedMember);
    assert.ok(checkAIOutput(ROOT, fixture).some(issue => issue.includes("Missing current output file")));
    fs.renameSync(parkedMember, member);
    fs.writeFileSync(member, bytes);
    fs.writeFileSync(path.join(fixture, "ai/4.1.0/component/StateView.json"), "{}");
    assert.ok(checkAIOutput(ROOT, fixture).some(issue => issue.includes("StateView")));
  } finally {
    fs.renameSync(fixture, retired);
  }
});

test("VoxWard Option C brandDigest and 5-locale taglines pass checkBrand and reject red-first mutations", async () => {
  const realUi = await compiled(ROOT, "packages/ui-react/dist/approved.js");
  const realNav = await compiled(ROOT, "packages/ui-react/dist/components/Navigation/Navigation.js");

  // Red-first mutation 1: altered VoxWard Option C geometry fails brandDigest & rendition check.
  const mutatedGeometryResult = await checkBrand(ROOT, {
    nav: realNav,
    ui: {
      ...realUi,
      tcrnProductMarkSvg(productId, variant) {
        const svg = realUi.tcrnProductMarkSvg(productId, variant);
        return productId === "voxward" && variant === "color" ? svg.replace("M24 9.75", "M24 11.75") : svg;
      },
    },
  });
  assert.ok(mutatedGeometryResult.issues.some((msg) => msg.includes("VoxWard SVG rendition drift") || msg.includes("brandDigest")));

  // Red-first mutation 2: altered or duplicate VoxWard locale tagline fails checkBrand.
  const mutatedTaglineResult = await checkBrand(ROOT, {
    nav: realNav,
    ui: {
      ...realUi,
      tcrnProductTagline(productId, locale) {
        if (productId === "voxward" && locale === "ja") return realUi.tcrnProductTagline("voxward", "en");
        return realUi.tcrnProductTagline(productId, locale);
      },
    },
  });
  assert.ok(mutatedTaglineResult.issues.some((msg) => msg.includes("VoxWard tagline drift") || msg.includes("5-locale taglines")));

  // Green verification against actual compiled artifacts:
  const cleanBrand = await checkBrand(ROOT);
  assert.deepEqual(cleanBrand.issues, []);
  const voxwardEntry = cleanBrand.marks.find((mark) => mark.productId === "voxward");
  assert.ok(voxwardEntry, "voxward mark is present in checkBrand report");
  assert.equal(voxwardEntry.colorGeometrySha256, VOXWARD_BRAND_DIGEST);
  assert.equal(LOCALES.every((locale) => realUi.tcrnProductTagline("voxward", locale) === ADOPTED_VOXWARD_MARK.taglines[locale]), true);
});

test("Storybook Batch 3 specimens have 0 outside-package tcrn- classes and 0 internal vocabulary hits with red-first mutations", async () => {
  const ui = await compiled(ROOT, "packages/ui-react/dist/approved.js");
  const docsCss = fs.readFileSync(path.join(ROOT, "apps/storybook/src/docs.css"), "utf8");

  // Red-first mutation 1: an outside-package custom tcrn- class fails markupStyleCoverage.
  const mutatedClassCoverage = markupStyleCoverage(
    '<section class="component-overview"><div class="tcrn-badge tcrn-custom-voxward-hack">Bad</div></section>',
    ui.tcrnComponentCss,
    docsCss
  );
  assert.deepEqual(mutatedClassCoverage.missing, ["tcrn-custom-voxward-hack"]);

  // Red-first mutation 2: leaked internal story/initiative vocabulary in specimen markup fails classifyHtml.
  const mutatedVocab = classifyHtml("voxward-batch3.stories.tsx", "<section><p>Implemented in TCRN-DS-INIT-017</p></section>");
  assert.ok(mutatedVocab.hits.length > 0);

  // Green verification across all compiled Storybook specimen stories:
  const result = await proveStorybookSpecimensPurePackage(ROOT);
  assert.ok(result.renderedStories >= 5, `expected >=5 specimen stories, rendered ${result.renderedStories}`);
  assert.deepEqual(result.unprovided, []);
  assert.deepEqual(result.vocabHits, []);
  assert.deepEqual(result.issues, []);
});
