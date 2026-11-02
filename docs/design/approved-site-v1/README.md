# TCRN 视觉设计标准

本仓库只迁移《TCRN 视觉设计标准.html》这一份 Owner 已确认的原始文件，并且只导入该文件中现有的 8 个画板。原文件 SHA-256、源画板标识、嵌入运行时资源及字体 URL 到本地文件的 SHA-256 映射见 `provenance.json`。

未来新增标准必须由用户明确确认后再加入。草稿不会自动同步到这里，也不作为迁移内容来源。原画板中的确认标记与交互代码按原内容保留；组件的 `renderVals()` 仍返回空对象，原来没有业务处理的按钮不会增加处理逻辑。

## 本地构建

运行 `node scripts/build.mjs`，或运行 `npm run build`。构建不安装依赖，将图库输出到 `dist/`；每个画板固定使用 `dist/boards/<slug>/index.html` 路径。Sites source helper 可基于仓库内脚本重建打包目录。

源文件位于 `src/`；原始 React 18.3.1、ReactDOM 18.3.1 与 DC Runtime 字节保存在 `vendor/`。所有画板通过 `/vendor/`、`/assets/` 绝对路径读取本地资源。`dist/` 是构建产物并由 `.gitignore` 忽略。
