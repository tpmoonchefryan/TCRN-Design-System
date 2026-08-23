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
