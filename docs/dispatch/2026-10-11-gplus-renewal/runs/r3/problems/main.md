# INIT-015 R3 · 主线程问题清单

每条：现象、证据、处置。批末与各包问题清单一起合并处置。

**R3M1 P5 交回（合入 989fec7）：SUB-091 判据达成（第二次返工，主力档）。** `.tcrn-multi-select-dropdown` 改为纵向（flex-direction column、align-items stretch）；实测静态展开态列表紧贴触发器正下方（偏移 0、宽差 0、左缘对齐），四个选项不换行；full-surface 两个弹层用例亮暗都绿（R2 的 dark 红消除）；inputs-matrix 亮暗各 42/42、controlHeight 零偏差；R2 SUB-061 的 30px 末端区与 Select 同语境不回退。余项：样板 rail 红属 O-1（P1、P3 处理）；doc-shell-class 基线与 R2 清零说明仍按旧注释计 1 处静态命中（现为 0），交 SUB-046；静态展开态列表紧贴触发器而运行时浮层留 8px 间隙（判据未要求，交 R3 判断）。RM7 ① 的目视行按验收 B 改为复核项（P4 的 SUB-106 回写）。
