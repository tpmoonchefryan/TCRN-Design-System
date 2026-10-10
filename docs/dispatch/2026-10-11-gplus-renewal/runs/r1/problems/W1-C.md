# INIT-015 R1 · W1-C 问题清单（SUB-004 → SUB-005）

每条：现象、证据、建议。见红只记不修；标「待 Owner」的只有 Owner 能定，其余按建议先做并在此回显。日志都在主会话 scratch 的 `logs/r1-W1-C-*.log`。

## 待 Owner

**W1C-1 三份上游 LICENSE 的版权行只写「Google Inc.」（待 Owner 知悉，不阻塞）。**
现象：`@fontsource-variable/source-serif-4`、`noto-sans-sc`、`noto-serif-sc` 三个包的 LICENSE 字节相同，首行只有「Google Inc.」，不是项目自身的版权声明（画布字体板 G 段记 Source Serif 4 为 Adobe、Noto 为 Google Noto 项目）。Hanken Grotesk 与 IBM Plex Mono 的 LICENSE 带各自的版权行。
证据：`packages/ui-tokens/licenses/*.txt` 与上游 LICENSE 的 sha256 一致（`fonts-vendor.mjs --check` 通过）；三份上游 LICENSE 的 sha256 前缀同为 18aabf190848725e。
处置：licenses/ 原样复制上游文本，可按 sha256 核对；字体文件逐字节未改，内嵌元数据随包。FONT-LICENSES.md 没有替上游补写版权行。
建议：如要在 licenses/ 里给出项目自身的版权行，需要另取上游项目仓库的 OFL.txt，属于新的下载来源，由 Owner 决定；不影响本批。

**W1C-2 P9 补充测量（原 P9 仍待 Owner）。**
现象：两款中文字体各选 22 片，覆盖 4,074 个码点；产品 921 个 CJK 码点全部覆盖。产品用字集中在 [101]–[119] 号片，另有 [27]（阈）、[28]（锚）、[43]（耦）三片各因一个技术用字被选入。
证据：`packages/ui-tokens/fonts/manifest.json` 的 `families[].subsets` 与 `coveredCodepoints`；`r1-W1-C-final-vendor-check.log`。
建议：维持原 P9 建议，不加 3500 字表；Owner 给定字表来源后，由 fonts-vendor 按字表加选分片。

## 已按建议处置（回显）

**W1C-3 pnpm 10.12.1 的 add 会删掉锁文件里的 libc 行。**
现象：`corepack pnpm@10.12.1 add -D -w --save-exact …` 重写 pnpm-lock.yaml 时删掉 26 行 `libc: [glibc]` / `libc: [musl]`。原锁文件由更新版本的 pnpm 写出，10.12.1 不写这个字段。
证据：`r1-W1-C-add.log`；首次 diff 为 16 行 glibc、10 行 musl 删除。
处置：保留这 26 行，锁文件只多五个字体包条目（+40 行）。`corepack pnpm@10.12.1 install` 回读时报 Lockfile is up to date，没有再改锁文件。
建议：SUB-015 移除 lucide-react 时会遇到同样的删除，可以照此保留，或者在集成时统一处理。

**W1C-4 fonts-proof 的变异测试接入 verify。**
现象：拆分的 SUB-005 文件清单只列两份脚本；测试如果不进任何脚本，就只在实施时跑过一次。
处置：根 package.json（本包独占集）的 `fonts:proof` 与 `tokens:proof` 在 `node scripts/fonts-proof.mjs` 前加跑 `node --test tests/fonts-proof.test.mjs`，与 `ds:consumption:proof` 等同型；另加 `fonts:vendor` 脚本。
建议：主线程如果不想让测试进 verify 链，撤回 package.json 里这两处即可，两份脚本不受影响。

**W1C-5 build-output 检查比判据多查一项。**
现象：Story 实施说明要求不用 data: URI 内嵌字体；判据只要求 fonts.css 不用 data: URI。
处置：fonts-proof 的 build-output 检查（扫 packages/*/dist 与 apps/storybook/storybook-static）除 googleapis、gstatic 外，也拦截 `data:font/…` 与 `data:application/font…`，防止后续打包步骤把随包字体内联进产物。当前产物里都没有这两类引用。

**W1C-6 pnpm add 规整了根 package.json 两行缩进。**
`public-output:scan` 与 `public:naming:proof` 两行由 2 空格改成 4 空格，内容不变。

## 待批末与集成处理

**W1C-7 产品用字码点会随其他包新增的文案漂移。**
现象：中文分片取自包源码、storybook 源码、存在时的 contract JSON（`docs/design/gplus-2026-10/contract/**/*.json`）和「季度复盘」中 zh-CN 键下的字符串与未标注的字符串。W1 其它包新增的矩阵、样板 story 文案或 contract 标语，可能带来落在未选分片里的字。
证据：`scripts/fonts-vendor.mjs` 的 `listProductSources` 与 `collectProductCodepoints`；当前树为 921 个码点、22 片。
建议：集成分支合并后跑 `node scripts/fonts-vendor.mjs --check`。如果 fonts-proof 的 coverage 检查判红，或 check 报 selection would add，就跑一次 `pnpm fonts:vendor`，提交 packages/ui-tokens/fonts（生成物批末再生）。

**W1C-8 本包没有构建 storybook-static，build-output 检查只扫了 ui-tokens 的 dist。**
现象：局部门不含 storybook 构建，只为 fonts-proof 构建了 @tcrn/ui-tokens。googleapis、gstatic、data: 字体的扫描，以及构建产物里只允许逐字节相同的字体副本这条规则，在本包只覆盖了 packages/ui-tokens/dist。
证据：`r1-W1-C-final-fonts-proof.log` 的 note 行。
建议：批末 verify 里 tokens:proof 在 pnpm build 之后运行，会扫全部 packages/*/dist 与 apps/storybook/storybook-static。若判红，说明是真实缺陷，按清单处置。

**W1C-9 体积报数（P8 无预算机制，只报数）。**
随包字体 52 个文件，共 3,290,644 字节：Hanken Grotesk 2 个 54,292 字节，Source Serif 4 2 个 223,232 字节，IBM Plex Mono 4 个 56,376 字节，Noto Sans SC 22 个 1,282,484 字节，Noto Serif SC 22 个 1,674,260 字节。manifest.json 91,654 字节，fonts.css 67,629 字节；CJK 分片的 unicode-range 很长，manifest 与 css 里各出现一次。@tcrn/ui-tokens 打包产物 3,365,238 字节（含 dist）。
