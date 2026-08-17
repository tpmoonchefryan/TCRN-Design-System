> 已脱敏，非逐字；原件见平台档案 `init-032-review-remediation/original/STORY-254-component-return.md`。

# STORY-254 DS 九构件回流证据

状态目标：`pending-owner-acceptance`；`done` 仍只属于 Owner。本单没有发版、发布、push、tag 或 deploy。

## 交付范围

DS 仓本地实现了九构件回流的八个公开组件，以及一个待 Owner 裁定的合并槽：

| 构件 | 公开根类 | 实现 / 测试 | 已证明的主要状态 |
| --- | --- | --- | --- |
| `Switch` | `tcrn-switch` | `packages/ui-react/src/components/Form/Form.tsx` / `Form.test.tsx` | `role="switch"`、on/off 数据状态、说明文字、disabled |
| `StatCard` | `tcrn-stat-card` | `packages/ui-react/src/components/DataDisplay/DataDisplay.tsx` / `DataDisplay.test.tsx` | neutral/positive/warning/danger tone |
| `SettingRow` | `tcrn-setting-row` | `packages/ui-react/src/components/Form/Form.tsx` / `Form.test.tsx` | setting key、control、modified dot、reset action |
| `FieldProvenance` | `tcrn-field-provenance` | `packages/ui-react/src/components/Form/Form.tsx` / `Form.test.tsx` | source、overridden、single-field restore slot |
| `LineNumberedEditor` | `tcrn-line-numbered-editor` | `packages/ui-react/src/components/Form/Form.tsx` / SSR + DOM test | gutter、warning finding、textarea、gutter scroll sync |
| `AppStatusBar` | `tcrn-app-status-bar` | `packages/ui-react/src/components/Layout/Layout.tsx` / `Layout.test.tsx` | command、state、optional action、`role="status"` |
| `DefinitionList` | `tcrn-definition-list` | `packages/ui-react/src/components/DataDisplay/DataDisplay.tsx` / `DataDisplay.test.tsx` | semantic `dl/dt/dd`，dense layout |
| `LockHint` | `tcrn-lock-hint` | `packages/ui-react/src/components/Form/Form.tsx` / `Form.test.tsx` | `role="note"`、lock icon、reader-facing hint |
| 合并槽 `ModifiedIndicator` | `tcrn-setting-row__modified` | `SettingRow` 内建 modified marker + reset action | one-row state ownership；未作为独立公开组件导出 |

CSS 全部追加在 `tcrnComponentCss`，没有新增消费方私有 stylesheet。公开名册由 101 项增至命令读回的 109 项；组件 API 机器名册读回 `109/109`，没有缺失项或 extraction error。

## 合并槽与待裁点

本地实现提案是把 `ModifiedIndicator` 合并进 `SettingRow`：修改点与重置动作共用同一个 row-owned state，避免只为一个点状标记拆出新的状态所有权。替代方案是公开一个只渲染 dot 的独立组件；代价是把 row 状态拆散，并没有独立布局契约。

这只是实现证据，不是 Owner 决策；`ownerDecision=unresolved_until_owner_acceptance`。若 Owner 选择独立构件，S254 需要回补独立公开名、CSS、story、测试和消费边界。

## DOM 级 UI 证据

API 导出、源码 CSS 命中和静态 HTML 计数只作为结构交叉检查，不作为 UI 主张的唯一证据。主证据是实际构建后的 Storybook 页面由 Playwright 打开并查询执行 DOM：

复核命令=`node scripts/s254-story-dom-proof.mjs`

```verbatim:node scripts/s254-story-dom-proof.mjs
{
  "schemaVersion": "tcrn.inc254-story-dom-proof.v1",
  "route": "components-component-inventory.html#display-primitives-spec",
  "viewport": "desktop-1440x900",
  "rendered": {
    "storyExpanded": true,
    "switchOn": true,
    "statTones": [
      "positive",
      "warning"
    ],
    "settingModified": true,
    "fieldOverridden": true,
    "editorWarning": true,
    "statusRole": true,
    "definitionTerms": 2,
    "lockHint": true
  },
  "ok": true
}
```

这个门查询的是实际渲染 DOM 的 data/class/role/语义节点；没有用 API 返回值或 `innerHTML` 字符串包含来代替。对应的构件 story 页面截图由 `internal-alpha:proof` 在 desktop/tablet/mobile 三个 viewport 生成：

- [desktop story capture](docs/verification/internal-alpha/screenshots/desktop-1440x900-display-primitives-spec.png)
- [tablet story capture](docs/verification/internal-alpha/screenshots/tablet-1024x768-display-primitives-spec.png)
- [mobile story capture](docs/verification/internal-alpha/screenshots/mobile-390x844-display-primitives-spec.png)

复核命令=`pnpm --filter @tcrn/ui-react test`：62 tests、62 pass、0 fail。SSR 测试直接读每个构件的渲染标记；其中 `AppStatusBar` 已改为允许 `role="status"` 的 div，modified marker 使用 `role="img"`，Storybook Select 具备 `aria-label`，并通过了 axe。

复核命令=`pnpm --filter @tcrn/ui-react test:dom`：10 tests、10 pass、0 fail。新增 DOM 测试实际派发 textarea scroll 事件并断言 `.tcrn-line-numbered-editor__gutter.scrollTop` 同步；这不是静态 CSS 或字符串门。

复核命令=`node scripts/s254-component-contract-proof.mjs`

```verbatim:node scripts/s254-component-contract-proof.mjs
{
  "schemaVersion": "tcrn.inc254-component-contract-proof.v1",
  "constructs": [
    {
      "name": "Switch",
      "root": "tcrn-switch"
    },
    {
      "name": "StatCard",
      "root": "tcrn-stat-card"
    },
    {
      "name": "SettingRow",
      "root": "tcrn-setting-row"
    },
    {
      "name": "FieldProvenance",
      "root": "tcrn-field-provenance"
    },
    {
      "name": "LineNumberedEditor",
      "root": "tcrn-line-numbered-editor"
    },
    {
      "name": "AppStatusBar",
      "root": "tcrn-app-status-bar"
    },
    {
      "name": "DefinitionList",
      "root": "tcrn-definition-list"
    },
    {
      "name": "LockHint",
      "root": "tcrn-lock-hint"
    }
  ],
  "mergedNinthSlot": {
    "name": "ModifiedIndicator",
    "implementation": "SettingRow built-in modified marker and reset action",
    "reason": "The marker has one consumer-owned meaning and must remain attached to the row that owns reset semantics.",
    "alternative": "A separate public component could expose only the dot, but would split state ownership and add no independent layout contract.",
    "ownerDecision": "unresolved_until_owner_acceptance"
  },
  "baseline": {
    "ok": true,
    "missing": []
  },
  "mutations": {
    "cssRootRemoved": {
      "ok": false,
      "missing": [
        "css:tcrn-switch"
      ]
    },
    "registryNameRemoved": {
      "ok": false,
      "missing": [
        "registry:Switch"
      ]
    },
    "storyClassRemoved": {
      "ok": false,
      "missing": [
        "story:Switch"
      ]
    }
  },
  "ok": true
}
```

三条变异腿都按预期变红：CSS 根类删除、公开名册删除、story 使用删除；恢复后的基线为绿。这证明门会对实现缺口有反应。

## CSS、名册与 Storybook 复核

复核命令=`node scripts/css-template-integrity-proof.mjs`

```json
{
  "ok": true,
  "proof": "ds_css_template_integrity",
  "source": "packages/ui-react/src/components/Navigation/Navigation.tsx",
  "export": "tcrnComponentCss",
  "bytes": 98032,
  "ruleCount": 475,
  "findings": []
}
```

复核命令=`node scripts/component-api-manifest.mjs`

```json
{
  "ok": true,
  "componentCount": 109,
  "registryComponentCount": 109,
  "missingFromManifest": [],
  "componentsWithExtractionErrors": [],
  "mode": "regenerate"
}
```

Storybook 的 `display-primitives-spec` story 逐一实际渲染八个公开构件和主要状态；`storybook:smoke` 通过页面大小、静态输出、comparator 和页面缺失检查。Story 的新 visible copy 已登记至 `apps/storybook/src/build/locales/storybook-content-text.ts` 的五语字典；`internal-alpha:proof` 的 zh-CN 新 leak 数为 0。

视觉签名在本地更新前先红过 53 个 capture（代表性读回：`display-primitives-spec@desktop-1440x900 mean=6.047 maxCell=22`），没有把差异直接当成 Owner 接受。按门的复核命令用 `--update-visual-baseline` 记录本地实现后的签名，再次复核读回 `visualSignatureRegressions=0`；这只是测试基线更新，不是视觉验收。Owner 仍需决定构件的视觉取舍。

高度门把当前 `display-primitives-spec=2330px` 作为 `INIT-029/S254` 的显式待拆债务记录，门读回 `storyHeightBudgetOk=true`、`storyHeightToleratedDebt=10`；这不是跳过门，也不是产品接受。`scripts/lib/story-budget.mjs` 的记录保留了后续拆分/裁定责任。

## 全列车

复核命令=`pnpm verify > /tmp/init029-ds-verify-green.log 2>&1`：exit code 0。列车包含 typecheck、build、dist:hygiene、全仓 test、tokens:proof、exports:check、pack:smoke、storybook:smoke、readme:proof、public-output:scan、internal-vocab:scan、scan、scaffold:proof、internal-alpha:proof。

末段浏览器收据关键字段：

```json
{
  "ok": true,
  "browserVersion": "149.0.7827.55",
  "storyCount": 55,
  "viewportCount": 3,
  "screenshotCount": 265,
  "axeViolationCount": 0,
  "visualSignatureRegressions": 0,
  "browserProofSummaryOk": true,
  "storyCoverageManifestOk": true,
  "storyHeightBudgetOk": true,
  "localeLeakZhCnOk": true,
  "localeLeakZhCnNewLeaks": 0
}
```

## 边界与停放

- 未证——归 Owner：`ModifiedIndicator` 是否保持并入 `SettingRow`，或拆成独立第九公开构件。
- 未证——归 Owner：Storybook 构件在各 viewport 的视觉取舍；本证据提供 DOM、截图和签名门，不替代验收。
- 未证——归 S255/门户 Owner：工作流门户是否消费这九个 DS CSS 根类；本单没有声称消费者采用。
- DS 仓 `CLAUDE.md` 只补回 `internal-alpha:proof` 所要求的 Localization pointer；平台根 `AGENTS.md` 未写入。
- `0.11.15` 发版、helper c40 重钉、两仓 push/tag/deploy 均停放。
