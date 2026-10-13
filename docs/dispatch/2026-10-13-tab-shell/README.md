# INIT-016 派工载荷 · DS 第二批（顶带壳、导航与布局进包，Storybook 壳改为纯包）

本目录是 `TCRN-DS-INIT-016` 的执行载荷：启动文件、键号索引与收口位置。链上 scope 是任务权威，这里不是第二份 scope。

## 启动

实施对话的第一条消息：`读 docs/dispatch/2026-10-13-tab-shell/START-INIT-016.md 并按它执行`。会话根是容器 `/Users/ryanlan/Code`。

## 键号

| 单 | 键 | id | 内容 |
| --- | --- | --- | --- |
| Initiative | TCRN-DS-INIT-016 | work:1a8e81aaa0138ef58d9a8f18 | DS 第二批：顶带壳、导航与布局进包，Storybook 壳改为纯包 |
| Epic | TCRN-DS-EPIC-044 | work:4b7aee8a737fa9411ea1a1fe | 壳层 Shell：顶带壳进包 |
| Epic | TCRN-DS-EPIC-045 | work:fc9aaa71273575aa1b63440c | 导航 Navigation：图钉、家族焕新与 SideNav 退役、手机 Sheet |
| Epic | TCRN-DS-EPIC-046 | work:81a9feee48f19060e062bac5 | 品牌与布局：ProductLockup 首行变体、PageHeader 必有、纸内重排 |
| Epic | TCRN-DS-EPIC-047 | work:48756e9c2cc49d0f320ebcb7 | Storybook 壳改纯包：文档壳换顶带壳、五样板重渲染 |
| Epic | TCRN-DS-EPIC-048 | work:d51af43d4298dd916a83ac24 | 门：壳层 18 条门接入 verify 与 CI |
| Epic | TCRN-DS-EPIC-049 | work:914ff02999cf6940fa65f344 | 4.0.0 候选 |
| Story | TCRN-DS-STORY-135 | work:1ad3c63c6fe6468a9d553758 | 壳 token（EPIC-044） |
| Story | TCRN-DS-STORY-136 | work:73563c973ba4945683fbb15f | 标按钮 ShellBrandButton |
| Story | TCRN-DS-STORY-137 | work:b8e05fe98dd99b6b0da62493 | 顶带固定项 ShellPins |
| Story | TCRN-DS-STORY-138 | work:3d8ec5e9bbaaa3623c3315c8 | 完整菜单 ShellMenu |
| Story | TCRN-DS-STORY-139 | work:09e0986c769bddf72859897f | 固定二级菜单下拉与三四级级联 ShellDropdown |
| Story | TCRN-DS-STORY-140 | work:e14a7f089a9cac4c7da39d52 | ProductShell 顶带态与偏好（第一个包的末单） |
| Story | TCRN-DS-STORY-141 | work:e2def1cb6cee96bcde0ea937 | 登入动画 ShellIntro |
| Story | TCRN-DS-STORY-142 | work:27344937d9f099034b0c773e | NavItem 图钉与固定项契约；名册加 pin（EPIC-045） |
| Story | TCRN-DS-STORY-143 | work:1b03f6ae2b1a9e080fde1432 | 导航家族焕新，SideNav 等退役 |
| Story | TCRN-DS-STORY-144 | work:14b2761d4ff9e55b90cd110e | 手机 Sheet 与 INC-399 门 |
| Story | TCRN-DS-STORY-145 | work:f19ca0b68e52842e947dcafc | ProductLockup 首行变体（EPIC-046） |
| Story | TCRN-DS-STORY-146 | work:792b63bc73100197f6f41e96 | PageHeader 必有与纸内布局重排 |
| Story | TCRN-DS-STORY-147 | work:6fd15b4e5366871194d862ab | Storybook 文档壳改顶带壳（EPIC-047） |
| Story | TCRN-DS-STORY-148 | work:bad748579e7b1b7f0773bd53 | 第一批五样板换新壳重渲染，映射与门改值 |
| Story | TCRN-DS-STORY-149 | work:854cd021e8bb869b2b585fe0 | 壳层 18 条门接入 verify 与 CI（EPIC-048） |
| Story | TCRN-DS-STORY-150 | work:b140305693da159bfdc615c8 | 4.0.0 候选（EPIC-049） |
| 纪要 | TCRN-DS-MIN-20261013-SHELL | minutes:374bfe849f6f3a4d55238de9 | 壳层裁定 D1 至 D7 |
| 纪要 | TCRN-DS-MIN-20261013-INIT016 | minutes:1365e27063f8b009656965b1 | D8：INIT-015 收口方式、三张 cancel、库门、INIT-016 开单 |

INIT-015（work:e5b3880c835fd77f1c14b81b）保持 active：STORY-120 至 128、131 至 133 共 13 张待库门声明后转 done；129、130、134 已 cancelled，由 STORY-148 与 150 承接。

## 设计数据

- 成品画布「TCRN 视觉设计标准」https://claude.ai/artifact/ArthUa2urzK714fA9yPDqp ；仓内同内容 `docs/design/visual-standard/boards/`（07a `Shell.dc.html`、07b `Shell-2.dc.html`）。
- 壳层生成器与数据 `docs/design/gplus-2026-10/tools/build-shell2.mjs`、`boards/spec-geom.json`、`measure-shell.js`、`logos2/*.svg`；草案板 `boards/V2-B2-Shell-Draft*.dc.html` 只作历史，不是标准。

## 停点

推送 main、打 tag、发版、部署、Owner 目视验收、库门声明（Atelier）都不在实施对话的授权内；收口文件写到本目录 `closeout.md`，目视验收清单写到 `owner-acceptance.md`。
