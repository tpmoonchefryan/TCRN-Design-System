# W3-C 交回说明（INIT-015 R1，SUB-027）

SUB-027 的标记侧已经完成，代码提交为 3e2c46f，没有接续点。问题与判断见 `runs/r1/problems/W3-C.md`。

## 已交付

- 86 个 rename 类在标记、门和测试里全部改为 `tcrn-doc-*`。改名按 doc-class-map.json 的 `target` 逐 token 替换，类名边界判定，前缀相同的类互不影响。
- 85 个删除类（delete-package-provided 38、delete-demo 32、delete-dead 15）已从标记中删除，处置方式见问题清单第 4 条。删除后，包组件按自身属性渲染。
- W2-C 交回的第 1、2 条：Icon library contract 块的来源改为 `data-icon-library-source="tcrn-icon-contract"`，删除了 `data-icon-library-license`，保留 wrapper 和 brand-boundary 两个属性；License readback 一行整行删除。smoke.test.ts 随之改为断言新的来源值，并新增两条反向断言：Style Guide 页不得出现 `lucide`（不区分大小写），也不得出现 `data-icon-library-license=`。
- 差集证据（本包树）：`--details` 显示剩余的 164 个类全部只有 CSS 定义，源码使用与渲染使用都是 0。清零的那次提交须在 W3-B 合入后由集成方跑门，并附差集证据。

## 给 W3-B（SUB-025/026）

- CSS 里 86 个旧名按 map 改名，85 个删除类的规则一并删除。`page-template.tsx` 现在写出 14 个 `tcrn-doc-*` 类，需要在 CSS 里有定义，`templateClassCheck` 才会转绿。
- `.tcrn-doc-icon-sample-grid` 必须保留 `margin: var(--tcrn-space-4) 0 0`，并且不得出现 `--tcrn-space-3`；smoke.test.ts 读的是页面内联 CSS。
- 密集壳的顶栏现在是包 `TopBar`，`.tcrn-shell-demo__topbar …` 系列规则，包括 `.tcrn-search-input--compact { min-width: 0 }`，已经没有目标元素。

## 给 W4-A（五语与机器词）

- 新增的可见文案共两条（英文原文），需要在 `apps/storybook/src/build/locales/storybook-content-text.ts` 里写齐五语：
  - `37 icons drawn for @tcrn/ui-react from the design contract, exposed through Icon.`
  - `Downstream UI imports TCRN icon primitives instead of drawing its own SVGs.`
- 该文件里应删除第 506、507、509 行三条旧条目。因为 License readback 一行已整行删除，第 508 行「License readback」和第 510 行「This is a license receipt, not legal advice or package publication.」也已没有使用处（apps/storybook/src 内 grep 为 0），一并删除。
- `scripts/lib/locale-invariant-ledger.mjs` 第 160 行的 `"Lucide React"` 删除。

## 给 W6-B（期望值重定基线）

以下几处结构变了，外观期望值可能随之变化，本包没有改动这些期望值：

- 密集壳的两条顶栏改用 `TopBar`，影响几何与视觉签名。
- changelog 的紧凑节点现在是 `.tcrn-machine-token__value`，storybook-smoke 约第 2902 行检查它的宽度、overflow 与 text-overflow。
- 加载示例改用 Card、Skeleton、Progress、Badge 与转圈图标。
- 字号样本改用 Heading 与 Text。
- 短字段宽度改由容器设定。
- shell-parity 现在通过包根类 `tcrn-top-bar`、`tcrn-side-nav` 测量 knowledge 壳的顶栏和侧栏。

## 给集成

- 集外的两个门须在同一次合并时一起改：`scripts/s254-story-dom-proof.mjs:43` 与 `scripts/shell-fidelity-proof.mjs` 的几处条目，见问题清单第 3 条。
- storybook test 另有 7 条失败断言不是本包造成的，见问题清单第 2 条 (b)。
