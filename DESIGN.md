---
version: alpha
name: CandyUI
description: Juicy, playful React WebGame UI component library styled with Fredoka.
colors:
  primary: "#1761D1"
  secondary: "#0AAFF2"
  tertiary: "#FFCB05"
  neutral: "#FFFFFF"
  ink: "#12427A"
  text: "#173D5D"
  muted: "#536E82"
  heroTitle: "#F6A407"
  surfaceTint: "#EFF7FD"
  line: "#CBDDE9"
  green: "#70D997"
  pink: "#F780AE"
  purple: "#7955C7"
  highlight: "#FFF4B8"
typography:
  display:
    fontFamily: Fredoka
    fontSize: 4rem
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  h1:
    fontFamily: Fredoka
    fontSize: 2.5rem
    fontWeight: 600
    lineHeight: 1.12
  h2:
    fontFamily: Fredoka
    fontSize: 2rem
    fontWeight: 600
    lineHeight: 1.2
  body-md:
    fontFamily: Fredoka
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.55
  button:
    fontFamily: Fredoka
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.2
  caption:
    fontFamily: Fredoka
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: 10px
  md: 18px
  lg: 24px
  xl: 30px
  pill: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  section: 72px
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 16px
    height: 56px
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 16px
    height: 56px
  panel:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: 24px
  panel-tinted:
    backgroundColor: "{colors.surfaceTint}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: 24px
---

# CandyUI Design Guidelines

## 1. 核心设计原则

- **游戏玩具触感**：控件圆润、厚实质感，避免生硬方角与扁平灰暗。
- **海军蓝外描边**：核心交互元素统一采用深海军蓝（`--candy-outline`: `#12427A`）均匀轮廓，拒绝死板纯黑。
- **双层立体光影**：顶部半透明白色内高光（`inset 0 [Y]px 0 rgba(255,255,255,...)`）+ 底部深色微暗描边，点击/激活态通过亮度（`brightness`）反馈，描边保持稳定。
- **清爽留白与可读性**：面板以大圆角干净白底为主，文字与背景对比度严格符合无障碍标准（WCAG AA）。

## 2. 核心色彩 (Design Tokens)

- `primary`（主蓝 `#1761D1`）：默认品牌色与主色调，对应 `--candy-primary`。
- `secondary`（天蓝 `#0AAFF2`）：次要游戏行动与强调标签。
- `tertiary`（明黄 `#FFCB05`）：核心高亮行动（主确认、领奖），搭配深蓝字。
- `ink`（海军蓝 `#12427A`）：控件外轮廓与强调线条，对应 `--candy-outline`。
- `surface`（白底 `#FFFFFF`）与 `surfaceTint`（浅蓝底 `#EFF7FD`）：容器背景与内嵌槽位。
- `text`（深蓝字 `#173D5D`）与 `muted`（弱化字 `#536E82`）：高对比度文本排版。

## 3. 字体与排版

- **英文/数字**：以 `Fredoka` 为主，字重为 Regular(400)、SemiBold(600)、Bold(700)。
- **中文回退**：`HarmonyOS Sans SC` -> `PingFang SC` -> `Noto Sans SC` -> `Microsoft YaHei`。
- **字距优化**：中文大标题与横幅设置 `0.04em~0.08em` 字距并禁用伪粗体（`font-synthesis-weight: none`）。

## 4. 关键组件规范

- **Button / IconButton**：默认 `pill` 胶囊形，深海军蓝外框，顶部高光 + 底部沉底内影；支持 `blue`, `yellow`, `green`, `pink`, `purple`, `cream`, `ghost` 等变体。
- **Panel & Ribbon**：卡片面板为 24px~32px 圆角白面配细灰蓝边框；飘带（`CandyRibbon`）为自适应拉伸 SVG 拱形横幅，搭配深海军蓝描边与立体字效。
- **Tabs**：支持 `pill`（内嵌果冻滑块）与 `underline` 变体，消除多层边框嵌套与尺寸抖动。
- **Form Controls (Input, Select, Switch, Slider)**：内凹槽位视觉（沉底内阴影），聚焦时柔和光晕，严禁裸原生表单样式。
- **Game Elements (Rating, Avatar)**：星级评分采用纯矢量 SVG 糖果金星。
