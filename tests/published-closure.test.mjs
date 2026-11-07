import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { ROOT, readApprovedSource, sha256 } from "../scripts/lib/approved-site-source.mjs";
import { AI_OUTPUT_FILES, checkAIOutput, checkSourceClosure, checkOutput, checkManagerOutput, executableOutputText } from "../scripts/lib/published-standard-proof.mjs";

test("actual component stories, both emitted AI trees and Manager retain the exact formal closure", () => {
  assert.deepEqual(checkSourceClosure(), []);
  assert.deepEqual(checkOutput().issues, []);
  assert.deepEqual(checkManagerOutput().issues, []);
  assert.equal(AI_OUTPUT_FILES.length, 48);
});

test("only byte-identical pinned normative quotations are inert during executable-asset scanning", () => {
  const relative = "ai/4.0.0/standard/02-typography.json";
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
  const base = path.resolve(process.env.TCRN_TEST_SCRATCH ?? path.join(ROOT, ".tarball-smoke"));
  fs.mkdirSync(base, { recursive: true });
  const fixture = fs.mkdtempSync(path.join(base, "ai-proof-"));
  try {
    fs.cpSync(path.join(ROOT, "apps/storybook/storybook-static/ai"), path.join(fixture, "ai"), { recursive: true });
    assert.deepEqual(checkAIOutput(ROOT, fixture), []);
    const member = path.join(fixture, "ai/4.0.0/component/Button.json");
    const bytes = fs.readFileSync(member);
    fs.writeFileSync(member, Buffer.concat([bytes, Buffer.from(" ")]));
    assert.ok(checkAIOutput(ROOT, fixture).some(issue => issue.includes("byte drift component/Button")));
    fs.rmSync(member);
    assert.ok(checkAIOutput(ROOT, fixture).some(issue => issue.includes("Missing current output file")));
    fs.writeFileSync(member, bytes);
    fs.writeFileSync(path.join(fixture, "ai/4.0.0/component/StateView.json"), "{}");
    assert.ok(checkAIOutput(ROOT, fixture).some(issue => issue.includes("StateView")));
  } finally { fs.rmSync(fixture, { recursive: true }); }
});
