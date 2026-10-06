import React from "react";
import { CandyButton, CandyGameIcon, CandyIconButton, useCandyToast } from "candy-ui";
import "../styles/button-reference.css";

const states = [
  { label: "默认", className: "" },
  { label: "悬停", className: "is-preview-hover" },
  { label: "按下", className: "is-preview-pressed" },
  { label: "禁用", className: "", disabled: true },
];

/** Static state specimens use the same surface variables as the live buttons. */
export function ButtonReference() {
  const { showToast } = useCandyToast();
  const action = (title: string) => () => showToast({ title: `${title} · 按钮演示`, variant: "blue" });
  return (
    <section className="button-reference" aria-label="按钮样式参考" lang="zh-CN">
      <h3 className="button-reference-title">按钮 <span>Buttons</span></h3>
      <div className="button-reference-states">
        {states.map(({ label, className, disabled }) => (
          <div className="button-reference-row" key={label}>
            <span className="button-reference-label">{label}</span>
            <CandyButton variant="yellow" disabled={disabled} className={className}
              leftIcon={<CandyGameIcon name="controller" size={30} />} onClick={action("开始游戏")}>开始游戏</CandyButton>
            <CandyButton variant="cyan" disabled={disabled} className={className} onClick={action("房间")}>房间</CandyButton>
            <CandyButton variant={label === "悬停" ? "cyan" : label === "按下" ? "blue" : "yellow"}
              disabled={disabled} className={className}
              leftIcon={<CandyGameIcon name="settings" size={28} color="currentColor" />} onClick={action("创建新房间")}>创建新房间</CandyButton>
          </div>
        ))}
      </div>
      <h4>小按钮</h4>
      <div className="button-reference-small">
        <CandyButton variant="cyan" onClick={action("确定")}>确定</CandyButton>
        <CandyButton appearance="outline" variant="gray" onClick={action("取消")}>取消</CandyButton>
        <CandyButton variant="cyan" leftIcon={<CandyGameIcon name="arrow-left" size={20} color="currentColor" />} onClick={action("返回")}>返回</CandyButton>
        <CandyButton variant="blue" leftIcon={<CandyGameIcon name="edit" size={22} color="currentColor" />} onClick={action("编辑")}>编辑</CandyButton>
        <CandyButton variant="red" leftIcon={<CandyGameIcon name="trash" size={22} color="currentColor" />} onClick={action("删除")}>删除</CandyButton>
      </div>
      <div className="button-reference-icons" aria-label="图标按钮">
        <CandyIconButton aria-label="首页" size="lg" shape="square" appearance="outline" variant="gray" icon={<CandyGameIcon name="home" size={36} />} onClick={action("首页")} />
        <CandyIconButton aria-label="后退" size="lg" variant="cyan" icon={<CandyGameIcon name="arrow-left" size={32} color="currentColor" />} onClick={action("后退")} />
        <CandyIconButton aria-label="添加" size="lg" variant="cyan" icon={<CandyGameIcon name="plus" size={34} color="currentColor" />} onClick={action("添加")} />
        <CandyIconButton aria-label="搜索" size="lg" variant="blue" icon={<CandyGameIcon name="search" size={34} color="currentColor" />} onClick={action("搜索")} />
        <CandyIconButton aria-label="设置" size="lg" shape="square" appearance="outline" variant="gray" icon={<CandyGameIcon name="settings" size={42} />} onClick={action("设置")} />
        <CandyIconButton aria-label="收藏" size="lg" shape="square" appearance="outline" variant="gray" icon={<CandyGameIcon name="heart" size={36} color="var(--candy-red)" />} onClick={action("收藏")} />
      </div>
    </section>
  );
}
