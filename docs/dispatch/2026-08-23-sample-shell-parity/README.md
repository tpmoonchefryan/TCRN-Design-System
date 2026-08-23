# 2026-08-23 样例外壳一致性派工

Owner 于 2026-08-23 指出样例里的收起按钮与外壳不是一回事、外壳的左右对齐才是对的,并问 Storybook 上还有多少类似情况,裁「一起开到新单派工给 codex」。

`TCRN-DS-INC-022`,`work:679adaeda5afbf24ed7cae3d`,rev 1 携十块正本。

## 扫的结果:六个角色五个不一致

| 角色 | 结果 |
| --- | --- |
| `search` | 一致 |
| `collapse-toggle` | 本体一致;容器结构与 `aria-label` 不同 |
| `topbar` | 7 处属性差 |
| `sidebar` | 4 处 |
| `nav-item` | 6 处 |
| `group-title` | 4 处 |

共 21 处属性差,加收起按钮的容器结构与文案差。

## 根因:规律完全对上

**凡是用了注册组件的角色都一致,凡是手搓的都不一致。**

- `search` 一致,因为样例用的是 `@tcrn/ui-react` 的 `SearchInput`(`storybook-shell-demos.tsx:54,117,211`);
- `collapse-toggle` 本体一致(注册 `Button`)而摆放不一致,因为容器是手搓的 `tcrn-knowledge-shell__brand-cell`;
- 其余四个全部手搓:`<header className="tcrn-knowledge-shell__topbar">`(:199)、`<aside className="tcrn-knowledge-shell__sidebar …">`(:215)、`<nav className="tcrn-bookmark-nav …">`(:220)、`<div className="tcrn-bookmark-nav__group">`(:222)。

而这个样例逐字写着:**「知识库壳层标准与当前 TCRN 文档壳层保持一致:一个顶栏、贴合的侧边导航、一个正文列和底文章节导航。」**

## 与 INC-019 的关系

同一个根因、同一个文件。`TCRN-DS-INC-019` 修的是品牌锁定块,修法是换注册组件(`<ShellBrandLockup productId="design-system" />`),改完当场一致。当时只换了锁定块,外壳其余部分仍是手搓的 —— 本单是把同一个修法推完。

**首选修法是换注册组件,不是逐条对齐 21 个属性值。** 逐条对齐能让门当下转绿,但真身一动样例又落后。

## 复核

`DISPATCH_BRIEF_READY`,`citations.checked: true`,`unjudgedCommands: 0`。见 `dispatch-validation.json`。

---

## 第二轮:2026-08-23 Owner 退回

第一轮把 21 处差收到 1 处,收起按钮四视口右对齐内缩逐个吻合(16.4 / 20.5 / 23 / 24)。Owner 亲眼判时退回,四处原因**全部在门的比对范围之外**:

| 项 | 真身 | 样例 |
| --- | --- | --- |
| 导航项 `backgroundColor` | 透明 | `color(srgb 1 1 1 / 0.92)` |
| 分组标题 `color` | `rgb(85,87,94)` | `rgb(28,29,33)` |
| 分组容器 `gap` | 16px | 0px |

第四处是退化:样例的 `aria-label` 改成硬编码英文(`storybook-shell-demos.tsx:215`),改前是中文「收起导航」,改后五种语言全是英文。

**门为何全绿:** 样例角色的属性表不含 `backgroundColor` 与 `color`,分组容器 `gap` 无对应角色;`ariaLabel` 断言(`:366`)只在 `locale=en` 下评估,而 en 下两侧一字不差,永远不会红,五条注入变异也无一动它。

顺带收口 `TCRN-DS-INC-019` 的判据缺口:品牌块上方 12px 白带(该值 `76e471e` 时即为 12,非本次引入;是 019 让品牌块通宽后它才读成一条缝)。019 判据只要求左右下三向齐平,漏了上边。

判据追加至 12 条。**次序是要害:先把属性表补齐让门能看见,再去修观感** —— 反过来做等于再赌一次。

记录状态:`pending-owner-acceptance` → `active` rev5,链版本 1164。
