import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const repoRoot = process.cwd();
const receiptPath = join(repoRoot, "docs", "verification", "readme-public-contract.json");
const localeSource = readFileSync(join(repoRoot, "packages", "ui-copy-state", "src", "index.ts"), "utf8");
const localeMatch = localeSource.match(/tcrnSupportedLocales = \[([^\]]+)\]/);
if (!localeMatch) {
  throw new Error("missing_tcrn_supported_locales_source");
}

const supportedLocales = localeMatch[1]
  .split(",")
  .map((item) => item.trim().replaceAll("\"", ""))
  .filter(Boolean);

const readmeFiles = {
  en: "README.md",
  "zh-CN": "README.zh-CN.md",
  ja: "README.ja.md",
  ko: "README.ko.md",
  fr: "README.fr.md"
};

const forbiddenOverclaimPatterns = [
  { id: "package-published-claim", pattern: /\bpackage published\b/i },
  { id: "storybook-docs-published-claim", pattern: /\bStorybook\/docs published\b/i },
  { id: "hosted-doc-readiness-proved", pattern: /\bhosted-doc readiness (?:proved|complete|accepted)\b/i },
  { id: "product-accepted", pattern: /\bproduct accepted\b/i },
  { id: "final-mvp-accepted", pattern: /\bfinal MVP accepted\b/i },
  { id: "release-ready", pattern: /\brelease ready\b/i },
  { id: "aos-tms-adopted", pattern: /\bAOS\/TMS adopted\b/i }
];

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function relativeLinkTargets(markdown) {
  return Array.from(markdown.matchAll(/href="([^"]+)"/g), (match) => match[1])
    .filter((href) => !href.startsWith("http://") && !href.startsWith("https://") && !href.startsWith("#"));
}

function makeReceipt() {
  const readmes = Object.fromEntries(
    Object.entries(readmeFiles).map(([locale, file]) => {
      const path = join(repoRoot, file);
      const content = readFileSync(path, "utf8");
      return [locale, { file, path, content, sha256: sha256(content) }];
    })
  );
  const main = readmes.en.content;
  const brokenAnchorHits = [];
  for (const [locale, readme] of Object.entries(readmes)) {
    for (const target of relativeLinkTargets(readme.content)) {
      if (!existsSync(join(repoRoot, target))) {
        brokenAnchorHits.push({ locale, file: readme.file, target });
      }
    }
  }
  if (!existsSync(join(repoRoot, "apps", "storybook", "assets", "tcrn-brand-mark.svg"))) {
    brokenAnchorHits.push({ locale: "all", file: "README.md", target: "apps/storybook/assets/tcrn-brand-mark.svg" });
  }

  const forbiddenOverclaimHits = [];
  for (const [locale, readme] of Object.entries(readmes)) {
    for (const rule of forbiddenOverclaimPatterns) {
      if (rule.pattern.test(readme.content)) {
        forbiddenOverclaimHits.push({ locale, file: readme.file, id: rule.id });
      }
    }
  }

  const noOverclaimFlags = {
    packagePublication: false,
    storybookDocsPublication: false,
    hostedDocReadiness: false,
    consumerProductAdoption: false,
    releaseReadiness: false,
    productAcceptance: false,
    finalMvpAcceptance: false
  };
  const requiredAiReadbackFields = [
    "contractVersion",
    "contractPayloadDigest",
    "artifact",
    "route",
    "readAt",
    "coveredRules",
    "requiredProof",
    "noOverclaimBoundaries"
  ];
  const localizedAiDiscoveryReadback = Object.fromEntries(
    Object.entries(readmes).map(([locale, readme]) => [
      locale,
      {
        llmsTxt: /llms\.txt/.test(readme.content),
        aiContractJson: /ai-consumption-contract\.json/.test(readme.content),
        requiredReadbackFields: requiredAiReadbackFields.every((field) => readme.content.includes(field))
      }
    ])
  );

  const receipt = {
    ok: true,
    readmeDigest: readmes.en.sha256,
    localizedReadmeDigests: Object.fromEntries(Object.entries(readmes).map(([locale, readme]) => [locale, readme.sha256])),
    headerPresent: /<h1 align="center">TCRN Design System<\/h1>/.test(main),
    brandHeaderImagePresent: /apps\/storybook\/assets\/tcrn-brand-mark\.svg/.test(main),
    githubRepositoryUrlPresent: /https:\/\/github\.com\/tpmoonchefryan\/TCRN-Design-System/.test(main),
    storybookUrlPresent: /https:\/\/tcrn-design-system-storybook\.vercel\.app\//.test(main),
    aiContractArtifactLinked: /ai-consumption-contract\.json/.test(main),
    aiContractLlmsTxtLinked: /llms\.txt/.test(main),
    aiContractHtmlHeadDiscoveryMentioned: /HTML head discovery/.test(main),
    aiContractRequiredReadbackFieldsPresent: requiredAiReadbackFields.every((field) => main.includes(field)),
    localizedAiDiscoveryReadback,
    darkModeReaderPathPresent: /\?theme=dark/.test(main),
    multilingualHeaderSupportReadback: {
      supportedLocales,
      readmeFiles: Object.fromEntries(Object.entries(readmeFiles).map(([locale, file]) => [locale, { file, exists: existsSync(join(repoRoot, file)) }]))
    },
    brokenAnchorHits,
    forbiddenOverclaimHits,
    noOverclaimFlags,
    dispositions: {
      packagePublicationDisposition: "not_claimed",
      storybookDocsPublicationDisposition: "not_claimed",
      hostedDocReadinessDisposition: "not_claimed",
      consumerProductAdoptionDisposition: "not_claimed",
      releaseReadinessDisposition: "not_claimed",
      productAcceptanceDisposition: "not_claimed",
      finalMvpAcceptanceDisposition: "not_claimed"
    }
  };
  receipt.ok = receipt.headerPresent
    && receipt.brandHeaderImagePresent
    && receipt.githubRepositoryUrlPresent
    && receipt.storybookUrlPresent
    && receipt.aiContractArtifactLinked
    && receipt.aiContractLlmsTxtLinked
    && receipt.aiContractHtmlHeadDiscoveryMentioned
    && receipt.aiContractRequiredReadbackFieldsPresent
    && Object.values(localizedAiDiscoveryReadback).every((readback) => readback.llmsTxt && readback.aiContractJson && readback.requiredReadbackFields)
    && receipt.darkModeReaderPathPresent
    && supportedLocales.every((locale) => receipt.multilingualHeaderSupportReadback.readmeFiles[locale]?.exists)
    && brokenAnchorHits.length === 0
    && forbiddenOverclaimHits.length === 0
    && Object.values(noOverclaimFlags).every((value) => value === false);
  return receipt;
}

test("README public contract has GitHub header, multilingual entry points, AI contract, and no-overclaim receipt", () => {
  const receipt = makeReceipt();
  mkdirSync(dirname(receiptPath), { recursive: true });
  writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
  assert.equal(receipt.ok, true);
  assert.deepEqual(receipt.multilingualHeaderSupportReadback.supportedLocales, ["zh-CN", "en", "ja", "ko", "fr"]);
  assert.equal(receipt.forbiddenOverclaimHits.length, 0);
  assert.equal(receipt.brokenAnchorHits.length, 0);
});
