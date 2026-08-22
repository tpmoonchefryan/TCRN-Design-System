# 派工：去产品化批次之后的三条 Incident

给 Codex。可以用 `goal` 指令完成。**没有硬门**，末尾的「验收」是验收项。

三条来自去产品化批次落地后的检查，两条在 DS 仓、一条在 AOS 仓。**每条单的 scope 就是规格**，
链上写得比本文细，动手前读它。

---

## 零、三条与缓急

| 单 | 仓 | 内容 | 缓急 |
| --- | --- | --- | --- |
| `TCRN-AOS-INC-053` | TCRN-AOS | `tcrnCoreComponentCss` 已被移除，AOS 仍 import 它 | **最急**，挡着 AOS 换包 |
| `TCRN-DS-INC-015` | TCRN-Design-System | 线上两处几何缺陷 + 没有门看得见几何 | 次之 |
| `TCRN-DS-INC-014` | TCRN-Design-System | verify 链缺一步 frozen-lockfile 安装 | 不急，但它防的是下一次 |

三条互不依赖，可并行。但 **INC-053 必须先于任何 AOS 换包动作**。

---

## 一、INC-053 —— 一次跨仓交接，不是一次修 bug

去产品化把 `@tcrn/ui-domain` 并进了 core，`tcrnCoreComponentCss` / `tcrnDomainComponentCss` /
`partitionComponentCss` / `isDomainSelector` **四个公开导出随之消失**。移除本身是对的：
domain 没了，全部即 core，切分失去意义。

问题是 AOS 正在用其中一个：

```
apps/server/src/main.ts:4   import { tcrnCoreComponentCss } from "@tcrn/ui-react";
apps/server/src/main.ts:96  .send(tcrnCoreComponentCss)   ← 喂 /assets/tcrn.css
```

AOS 今天不受影响，因为它的 `vendor/tcrn-ui-react-3.0.0.tgz` 还是旧的。**风险在换包那一刻。**

**判据 3 是要害：换包与改代码必须同一次提交。** 先换包后修，中间那个提交是坏的，而链上会留下它。

**更坏的那种情形要防住**：如果打包方式让 import 不当场挂，`/assets/tcrn.css` 会返回 undefined ——
**全站样式丢失而服务仍返回 200**。所以判据 5 要求换包后实测页面上的徽章与链接样式仍命中，
而不是只看构建绿。

DS 的 CHANGELOG 记了这次移除，但 72 行的验证报告里没有点名 AOS ——
本单顺带在 AOS 侧留一条记录，写明这不是 DS 的失误面，是跨仓变更的交接面。

---

## 二、INC-015 —— 两处几何缺陷，其中一处根因未查到

### 缺陷一：徽章圆点压在文字上（**根因未确认，不要猜**）

线上 `.tcrn-badge` 计算出 `padding: 3px 8px 3px 0px` —— 左内边距 **0px**，
而规则写的是 `padding-inline-start: calc(...)` = **18px**，那 18px 正是给绝对定位的圆点留的位。

**下面这些已经逐项排除了，不要重跑：**

| 排除项 | 实测 |
| --- | --- |
| DS 组件表 | 最小页面（只含 tokens + `tcrnComponentCss`）里 `padding: 3px 8px 3px 18px`，正常 |
| 变量失效 | `--tcrn-space-2: 8px`、`--tcrn-state-dot-size: 6px`、`--tcrn-state-chip-padding: 3px 8px 3px 6px`，全部解析 |
| calc 无效 | 同一段 calc 写成内联样式 → 18px 生效；写死 18px → 生效 |
| 选择器没命中 | CSSOM 遍历三张表（504/455/502 条，全部可读、无 adoptedStyleSheets），命中该元素共 5 条，其中两条都设 18px，**没有一条清零** |
| 上下文之外 | 克隆到 `document.body` 根部 → 18px；原地 → 0px |

**剩余方向**：规则在、值对、变量通、内联能用、脱离上下文就正常 —— 正常层叠下不该发生。
用 DevTools 的「computed → matched rules」面板落到实际胜出的那条声明上。
**查明了再改，不要因为它长得像某个已知问题就照那个改。**

特别地：**这处和刚修完的 `TCRN-DS-INC-013` 不是同一处**。那个修的是折行时圆点的
纵向锚点（`inset-block-start`），这处坏的是横向留位（`padding-inline-start`）。

### 缺陷二：品牌锁定块在收起态被挤扁（**2026-08-22 重新派工，判据已改写**）

> **首轮做了但没修对，原因是我的判据写窄了。**
> 原判据是「品牌标渲染尺寸非零」，几何门照写量了 `.tcrn-brand-mark` 的宽高与父宽 ——
> 图 38px、父 52px，都非零，判绿。**而真正坏的从来不是图，是它右边的字标。**

线上实测（2026-08-22，`components-navigation-shells.html`，展开全部折叠区后）：

| | 容器宽 | 图 | 文案块可见宽 | 文案块 scrollWidth |
| --- | --- | --- | --- | --- |
| 收起态 lockup ① | **52px** | 38px | **2px** | **93px** |
| 收起态 lockup ② | **52px** | 38px | **2px** | **129px** |
| 正常 lockup | 170 / 543px | 38px | 120 / 132px | 同宽 |

容器只有 52px（图 38 + 间距），留给字标 2px，而 `overflow: visible` ——
字形直接溢出到容器外，视觉上是图右侧几个碎点。

**改写后的判据 2**：量品牌锁定块内的**文案块**，其 `clientWidth` 不小于 `scrollWidth`
（不被挤压后溢出），**或**该文案块在收起态被明确隐藏。

**不许靠给文案块加 `overflow: hidden` 了事** —— 那只是把溢出换成截断，
读者看到的仍是半个字标。收起态要么明确隐藏文案，要么让容器按内容定宽。

**几何门要相应扩一组**，与现有 badge / brand 两组同形，自带红→绿。

### 缺陷一：已修复，本轮不要再动

根因是 `compactCss()` 把 `calc()` 里 `+` 两侧的空白一起压掉了，而 CSS 的 `calc` 要求
加减号两侧必须有空白 —— 无空白即无效，`padding-inline-start` 退回初始值 0。
已随 `9188c75` 修复并上线，线上实测 `padding-inline-start: 18px`、文字距左 18px、点右 14px、不重叠。

### 缺陷二（原记）：演示外壳的品牌标塌成 0×0

六个品牌标里 **五个** CSS 尺寸为 38px（`--tcrn-brand-mark-size: 38px`）而实际渲染 **0×0**，
且父元素 `.tcrn-shell-brand-lockup` / `.tcrn-top-bar__brand` 同样 0×0 ——
演示外壳的收起态没有给品牌区尺寸。这个根因是清楚的。

### 缺陷三：没有门看得见几何

前两处都不是「类缺定义」，而 `gate:ds-adoption` 那类断言查的正是类有没有定义，所以看不见；
268 张视觉截图也没红，因为本批 14 处差异被判为有意，这两处混在其中。

**判据 3、4 是本单的要害**：新的几何门必须各红过一次 ——
一道从未红过的几何门，与本单要修的「看不见」是同一种状态。

---

## 三、INC-014 —— 本地绿不构成关于 CI 的证据

Vercel 部署自 2026-08-18 12:59 起连红四天、十一个提交，无人看见。原因不是那次锁文件不同步本身，
是**为什么没人看见**：

```
ERR_PNPM_OUTDATED_LOCKFILE — pnpm-lock.yaml is not up to date with
<ROOT>/packages/ui-domain/package.json
```

`vercel.json` 的 `installCommand` 是 `pnpm install --frozen-lockfile`（CI 里本来也默认为真），
**安装阶段就挂了，一个构建步骤都没跑到**。而本地 `pnpm install` 不带该标志时会默默补上锁文件再继续，
**verify 链里没有任何一步做过 frozen-lockfile 安装**。

复现方式（用 git worktree 模拟干净检出，已实测）：

| 提交 | `pnpm install --frozen-lockfile` | `public-docs:vercel-build` |
| --- | --- | --- |
| `0e702e2` | exit=1 | exit=1，连 `@tcrn/ui-tokens` 都没建成 |
| `b29f15f` | exit=0 | exit=0 |

**判据 3 要求这道门红过一次再变绿** —— 否则分不清「检查通过」和「检查没执行」。

顺带一笔，**不在修复范围**：`public-docs:vercel-build` 与根 `build` 两条链**都从未包含
`@tcrn/ui-domain`**。那是同一次疏漏的另一半，随该包删除一并消失；但它说明新增 workspace 包时
构建链与锁文件两处都要跟，而当时两处都没跟。

---

## 四、纪律

**跨仓**：INC-053 在 AOS 仓，另两条在 DS 仓。任何一仓不许伸手进另一仓的树。

**不许自证**：三条各自的门都要红过一次再变绿（INC-015 判据 3/4、INC-014 判据 3）。

**INC-015 的缺陷一根因未确认**。查明之前不要动手改 —— 一个基于猜测的修复会让这处
从「看得见的坏」变成「看不见的坏」。

提交身份 `tpmoonchefryan <253097889+tpmoonchefryan@users.noreply.github.com>`，不加 `Co-Authored-By`。

**做完不是 `done`。** INC-015 的外观归 Owner 亲眼判；另两条属机检车道。
推送、发布、部署是各自独立的停止点。

**注意**：DS 侧改动若动了 `tcrnComponentCss`，按既有约定要重打 tarball、AOS 换包、
门户刷新 CSS 快照（`TCRN-CROSS-INC-223`）—— 而换包这件事本身就是 INC-053 的内容，两者要合流。
