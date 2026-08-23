# 2026-08-23 用户可见字符串同源检查

Owner 于 2026-08-23 裁「全部同意」。`TCRN-DS-INC-023`,`work:b2cbd1c1e12e047e025bf660`,rev 1。

## 现象

样例顶栏四控件逐语言比对,三个全对,一个不对:

| 页面语言 | 真身语言按钮 | 样例语言按钮 |
| --- | --- | --- |
| en | English | English |
| zh-CN | 简体中文 | **English** |
| ja | 日本語 | **English** |
| fr | Français | **English** |
| ko | 한국어 | **English** |

两侧 `aria-label` 都是 `Language`,所以 `ariaLabel` 断言判绿;`element-inventory` 比存在性,也判绿。**差的是可见文本,两道检查各守一半,它正好从中间漏过去。**

## 为什么不按字段追

这是同一形态第二次:`TCRN-DS-INC-022` 第一轮里样例的 `expandedLabel` 硬编码英文,改取 `localeText(...)` 后修好;这次是同一个病换了个字段。

四轮下来规律稳定:**凡是把值交给注册组件或语言表的地方,修完不再坏;凡是样例自己供值的地方,反复坏。** 而字段是无穷的 —— 可见文本、`aria-label`、`placeholder`、`title`、`alt`。按字段逐个补,每次都慢真身一步。

判据 3 因此禁止写死字段清单:清点入口是「两侧实际渲染出了哪些用户可见字符串」,由此反推承载点。这与 `TCRN-DS-INC-022` 退回三次的教训是同一条 —— 覆盖面不能由执行者事先决定。

## 复核

`DISPATCH_BRIEF_READY`,`citations.checked: true`,`unjudgedCommands: 0`。
