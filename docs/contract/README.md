# 当前契约输入与验证边界

唯一设计来源是[已发布 Sites 第 1 版](https://tcrn-ds-visual-standards.honestfawn3.chatgpt.site)，源提交 `a643d4cfcd239f6f81b1715ded6a63caead9d619`。`docs/design/approved-site-v1/source-manifest.json` 记录八板身份、原字节 hash、字体字节与真实发布身份；独立固定的 `scripts/lib/approved-site-pins.mjs` 防止同名替换或候选自报 hash 变成来源证明。

原本本目录中的 V2 家族、条款、角色与豁免表已经退出当前输入。它们的旧状态保存在 Git 历史，原工单、分钟与历史验证证据保持原字节；当前脚本不读那些表。特别是旧字标豁免、统一 Tabs 洗底/禁下划线、后续家族白名单和旧 37/119 基线都不构成本候选的准入。

当前生成器从正式 HTML/CSS 提取，不执行旧 data/lib 或 Site 的 React/DC 运行时。来源到工程名称的必要映射在 `package-bindings.json`，每一项绑定实际选择器/属性或数值文字锚点。七套源生成物与 token/component CSS 的批末一次再生次序见 `docs/design/README.md`。

验证继续使用项目当前配置的三门及其命令/顺序/阈值。现有脚本位置分别承担来源固定、精确资源/输出枚举、八板与显式 API 投影、独立正式字体/几何/状态读取。V1–V7 回归源码检测同名错字节、错 sourceId、registry 与本地 checker 同时加入无来源内容、旧资产改名/内联、未链接源码/增量陈旧输出，以及错误的选择承载面。

文字门槛保持 4.5，图形与边线保持 3；半透明颜色按实际承载面合成。K1 的 TMS 夜间和 DS 浅色后缀原色冲突真实保留，不设旧 V2 豁免或暗换色。K5 的 strong 散文与 ink/600 样例/CSS 矛盾也没有被假称统一。K4 按 Owner 的纯图标决定实施 SVG 和含项名的 aria-label，无可见文字/tooltip；正式站散文未被编辑。K2/K3 分别区分槽/图形和全局/局部坐标。

机器运行结果、生成清单、截图和验收只在实际执行后记录；本文件不声明本候选通过。包根工程 API 的存在与正式设计支持是两件事；新版文档通过 `@tcrn/ui-react/approved` 和显式来源义务消费，工程 manifest 不自动生成 131 个设计 API 页面。旧 `docs/verification` 与派工/裁定原始记录不是清理目标，新一轮事实写入独立当前输出。

K1/K5 方向已由 TCRN-DS-MIN-20261102-STANDARD-AMENDMENTS D1–D4 决定，当前状态为待正式标准修订、发布与消费版本对齐。原值与 ink/600 保留，未提前接入新色。S03-C01 为独立未决澄清：06 的快捷键 ink-3 与07 的 ink-2 不一致；06 夜间 idle 的名义 wash/panel 比约3.8769，不是浏览器或纹理实测。当前 ink-2 不能证明忠实复现未修订06，门槛仍为4.5。
