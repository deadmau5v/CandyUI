import React, { useState } from "react";
import {
  CandyAlert, CandyAlertTone, CandyAvatar, CandyAvatarCharacter, CandyBadge,
  CandyBreadcrumb, CandyButton, CandyCard, CandyCheckbox, CandyColorPicker,
  CandyDatePicker, CandyDropdown, CandyEmptyState, CandyFileUpload, CandyGameIcon,
  CandyIconButton, CandyInput, CandyModal, CandyNavigation, CandyNotification,
  CandyPagination, CandyProgress, CandyRadio, CandyRadioGroup, CandyRating,
  CandyRoomCard, CandySelect, CandySlider, CandySocialButton, CandySocialProvider,
  CandySpinner, CandyStatusBadge, CandyStepper, CandySteps, CandySwitch, CandyTab, CandyTabList,
  CandyTabs, CandyTag, CandyTagGroup, CandyTagInput, CandyTextarea, CandyTheme,
  CandyThemeCard, CandyThemeGrid, CandyThemeIcon, CandyTimePicker, CandyTooltip, useCandyToast,
} from "candy-ui";
import { demoRooms, gameNavigation, themeDefinitions, themeOptions } from "./gameKitData";
import "../styles/game-board.css";

function Section({ id, title, subtitle, span = 3, children }: {
  id: string; title: string; subtitle: string; span?: number; children: React.ReactNode;
}) {
  return <section className={`gb-tile gb-span-${span}`} data-palette-section={id} data-section={id} aria-labelledby={`gb-${id}`}>
    <h2 id={`gb-${id}`} className="gb-section-title">{title}<span>{subtitle}</span></h2>
    <div className="gb-section-body">{children}</div>
  </section>;
}

const alertMessages: { tone: CandyAlertTone; text: string }[] = [
  { tone: "success", text: "房间创建成功！" },
  { tone: "info", text: "正在加入游戏…" },
  { tone: "warning", text: "网络连接不稳定" },
  { tone: "error", text: "连接失败，请重试" },
];
const avatarCharacters: CandyAvatarCharacter[] = ["smile", "fox", "cat", "frog"];

export function GameShowcaseBoard() {
  const { showToast } = useCandyToast();
  const [nav, setNav] = useState("home");
  const [tab, setTab] = useState("basic");
  const [theme, setTheme] = useState<CandyTheme>("fox");
  const [sound, setSound] = useState(true);
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("public");
  const [volume, setVolume] = useState(68);
  const [duration, setDuration] = useState(180);
  const [rating, setRating] = useState(4);
  const [name, setName] = useState("User6541");
  const [language, setLanguage] = useState<string | number>("zh");
  const [bio, setBio] = useState("");
  const [tags, setTags] = useState(["游戏", "动漫", "食物"]);
  const [color, setColor] = useState("#0068f0");
  const [page, setPage] = useState(1);
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [alerts, setAlerts] = useState(alertMessages);
  const [notification, setNotification] = useState(true);
  const [dialog, setDialog] = useState<"create" | "error" | "profile" | "theme" | null>(null);
  const [created, setCreated] = useState(false);
  const filteredRooms = demoRooms.filter((room) => room.title.includes(search));
  const pages = Math.max(1, Math.ceil(filteredRooms.length / 3));
  const currentPage = Math.min(page, pages);
  const visibleRooms = filteredRooms.slice((currentPage - 1) * 3, currentPage * 3);
  const activeTheme = themeDefinitions.find((item) => item.value === theme)!;
  const toast = (title: string) => showToast({ title, variant: "blue" });
  const createRoom = () => {
    setCreated(true);
    setDialog(null);
    showToast({ title: `${name || "玩家"}的${activeTheme.label}房间已创建`, description: "本地演示房间，邀请朋友一起开始吧。", variant: "green" });
  };
  const menuItems = [
    { id: "profile", label: "编辑资料", icon: <CandyGameIcon name="edit" size={18} />, onSelect: () => setDialog("profile") },
    { id: "settings", label: "游戏设置", icon: <CandyGameIcon name="settings" size={18} />, onSelect: () => { setNav("settings"); toast("已切换至游戏设置"); } },
    { id: "themes", label: "选择主题", icon: <CandyGameIcon name="diamond" size={18} />, onSelect: () => setDialog("theme") },
    { id: "logout", label: "退出演示", icon: <CandyGameIcon name="arrow-left" size={18} />, separator: true, destructive: true, onSelect: () => toast("已退出当前演示，没有真实账号被登出") },
  ];

  return (
    <div className="game-board-container" id="game-board-stage" lang="zh-CN">
      <div className="gb-intro">
        <div><span className="gb-eyebrow">THE WEB GAME TOOLBOX</span><h1>小组件，大乐趣。<span>Let’s play.</span></h1><p>从第一声「开始游戏」，到最后一颗星星。为你的下一款游戏准备好了。</p></div>
        <div className="gb-intro-badges"><CandyBadge variant="blue">React + TypeScript</CandyBadge><CandyTag color="green" variant="soft">真实交互 · 自由组合</CandyTag></div>
      </div>

      <div className="gb-gamebar">
        <CandyNavigation aria-label="展示游戏导航" value={nav} onChange={setNav} items={gameNavigation}
          brand={<span className="gb-game-brand"><CandyGameIcon name="controller" size={28} />Candy<span>Play</span></span>} />
        <CandyDropdown align="end" trigger={<CandyButton size="sm" variant="gray" appearance="soft" leftIcon={<CandyAvatar size="xs" character={avatarCharacters[avatarIndex]} borderColor="dark" />} rightIcon={<CandyGameIcon name="arrow-down" size={12} />}>{name || "玩家"}</CandyButton>} items={menuItems} />
      </div>

      <div className="gb-grid">
        <Section id="buttons" title="按钮" subtitle="Buttons" span={4}>
          <div className="gb-button-grid">
            <CandyButton size="sm" variant="yellow" leftIcon={<CandyGameIcon name="controller" size={22} />} onClick={() => setDialog("create")}>开始游戏</CandyButton>
            <CandyButton size="sm" variant="cyan" onClick={() => { setNav("rooms"); toast("欢迎来到房间大厅"); }}>房间</CandyButton>
            <CandyButton size="sm" variant="yellow" leftIcon={<CandyGameIcon name="settings" size={20} />} onClick={() => setDialog("profile")}>设置</CandyButton>
            <CandyButton size="sm" onClick={() => toast("操作已确认")}>确定</CandyButton>
            <CandyButton size="sm" variant="cyan" leftIcon={<CandyGameIcon name="arrow-left" size={15} />} onClick={() => setNav("home")}>返回</CandyButton>
            <CandyButton size="sm" variant="red" leftIcon={<CandyGameIcon name="trash" size={18} />} onClick={() => setDialog("error")}>删除</CandyButton>
          </div>
          <div className="gb-social-grid">{(["twitter", "google", "vk", "discord"] as CandySocialProvider[]).map((provider) => <CandySocialButton key={provider} provider={provider} size="xs" onClick={() => toast(`${provider.toUpperCase()} 登录按钮演示；未连接第三方账号`)} />)}</div>
          <div className="gb-row gb-action-icons">{["home", "play", "plus", "settings", "edit", "heart"].map((icon) => <CandyIconButton key={icon} size="xs" shape="square" variant={icon === "play" ? "yellow" : "gray"} appearance={icon === "play" ? "solid" : "outline"} aria-label={`操作 ${icon}`} icon={<CandyGameIcon name={icon} size={18} />} onClick={() => toast(`已触发 ${icon} 操作`)} />)}</div>
          <div className="gb-row gb-button-states"><CandyButton size="xs" appearance="outline" onClick={() => toast("次要操作")}>次要按钮</CandyButton><CandyButton size="xs" variant="gray" appearance="soft" onClick={() => toast("操作已取消")}>取消</CandyButton><CandyButton size="xs" disabled>禁用按钮</CandyButton><CandyButton size="xs" loading loadingLabel="加载中">提交</CandyButton></div>
        </Section>

        <Section id="inputs" title="输入控件" subtitle="Inputs" span={3}>
          <CandyInput aria-label="玩家昵称" size="sm" value={name} onChange={(event) => setName(event.target.value)} leftIcon={<CandyGameIcon name="user" size={22} />} maxLength={16} />
          <CandySelect aria-label="选择语言" size="sm" value={language} onChange={setLanguage} fullWidth options={[{ value: "zh", label: "中文（简体）", icon: <CandyGameIcon name="world" size={20} /> }, { value: "en", label: "English", icon: <CandyGameIcon name="world" size={20} /> }]} />
          <CandyInput aria-label="搜索房间" type="search" size="sm" placeholder="搜索主题、房间或玩家…" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} clearable leftIcon={<CandyGameIcon name="search" size={19} />} />
          <CandyTextarea aria-label="个人介绍" size="sm" placeholder="写点什么…" value={bio} onChange={(event) => setBio(event.target.value)} maxLength={200} showCount rows={2} />
          <div className="gb-input-states"><CandyInput aria-label="默认输入示例" size="sm" defaultValue="默认" /><CandyInput aria-label="错误输入示例" size="sm" defaultValue="错误" invalid /><CandyInput aria-label="成功输入示例" size="sm" defaultValue="成功" success /></div>
        </Section>

        <Section id="selects" title="开关与选择" subtitle="Controls" span={3}>
          <div className="gb-two-columns">
            <div className="gb-stack"><span className="gb-label">人数上限</span><CandySelect aria-label="人数上限" size="sm" defaultValue={15} options={[10, 15, 20, 30, 50].map((value) => ({ value, label: value }))} fullWidth /><CandySwitch checked={sound} onChange={setSound} label={sound ? "开启音效" : "关闭音效"} /><CandySwitch checked={false} onChange={() => {}} disabled label="禁用状态" /></div>
            <div className="gb-stack"><span className="gb-label">房间偏好</span><CandyCheckbox size="sm" label="允许观战" checked={checked} onChange={setChecked} /><CandyCheckbox size="sm" label="已禁用" disabled /><CandyRadioGroup value={radio} onChange={setRadio} aria-label="房间可见性"><CandyRadio value="public" label="公开房间" size="sm" /><CandyRadio value="private" label="私人房间" size="sm" /></CandyRadioGroup></div>
          </div>
          <div className="gb-divider" />
          <CandyStepper label="回合时间（秒）" aria-label="回合时间" value={duration} onChange={setDuration} min={30} max={300} step={10} size="sm" incrementLabel="增加回合时间" decrementLabel="减少回合时间" />
          <div className="gb-meter-label"><span>音量</span><b>{volume}%</b></div><CandySlider aria-label="展示音量" value={volume} onChange={setVolume} />
        </Section>

        <Section id="pickers" title="选择器" subtitle="Pickers" span={2}>
          <CandyDatePicker aria-label="游戏日期" label="日期" size="sm" defaultValue="2026-10-05" />
          <CandyTimePicker aria-label="开始时间" label="时间" size="sm" defaultValue="12:30" />
          <CandyColorPicker aria-label="主题颜色" label="主题色" hexLabel="主题色 HEX" size="sm" value={color} onChange={setColor} />
          <CandyFileUpload aria-label="上传主题图片" label="点击或拖放图片" description="PNG / JPG / GIF · 最大 10 MB" accept="image/png,image/jpeg,image/gif" maxSize={10 * 1024 * 1024} />
        </Section>

        <Section id="navigation" title="导航与标签页" subtitle="Navigation" span={4}>
          <CandyBreadcrumb aria-label="展示面包屑" items={[{ label: "首页", icon: <CandyGameIcon name="home" size={17} />, onClick: () => setNav("home") }, { label: "设置", onClick: () => setNav("settings") }, { label: "主题" }]} />
          <CandyTabs value={tab} onChange={setTab} size="sm" fullWidth><CandyTabList aria-label="游戏设置分类"><CandyTab value="basic">游戏设置</CandyTab><CandyTab value="room">房间设置</CandyTab><CandyTab value="profile">个人资料</CandyTab></CandyTabList></CandyTabs>
          <div className="gb-settings-summary" role="status">{tab === "basic" ? `回合 ${duration} 秒 · 音量 ${volume}%` : tab === "room" ? `${radio === "public" ? "公开" : "私人"}房间 · ${checked ? "允许" : "禁止"}观战` : `玩家 ${name || "未命名"} · ${activeTheme.label}主题`}</div>
          <CandySteps aria-label="房间配置步骤" items={[{ label: "配置" }, { label: "主题" }, { label: "完成" }]} current={step} onStepChange={setStep} />
          <div className="gb-muted" role="status">当前页面：{gameNavigation.find((item) => item.value === nav)?.label} · 第 {step + 1} 步</div>
        </Section>

        <Section id="themes" title="主题选择" subtitle="Theme grid" span={5}>
          <CandyThemeGrid aria-label="展示主题选择" value={theme} onChange={(value) => setTheme(value as CandyTheme)} options={themeOptions(50)} columns={4} />
          <div className="gb-theme-caption"><span><b>{activeTheme.label}</b> · {activeTheme.description}</span><CandyTag size="sm" color="blue" variant="soft">官方主题</CandyTag></div>
        </Section>

        <Section id="alerts" title="状态与提示" subtitle="Status & alerts" span={3}>
          <div className="gb-row gb-wrap"><CandyStatusBadge status="online" label="在线" /><CandyStatusBadge status="playing" label="游戏中" /><CandyStatusBadge status="offline" label="离线" /><CandyStatusBadge status="host" label="房主" /></div>
          <div className="gb-alert-stack">{alerts.map(({ tone, text }) => <CandyAlert key={tone} tone={tone} title={text} closeLabel={`关闭${tone}提示`} onClose={() => setAlerts((items) => items.filter((item) => item.tone !== tone))} />)}</div>
          {alerts.length < 4 && <CandyButton variant="ghost" size="xs" onClick={() => setAlerts(alertMessages)}>重置提示</CandyButton>}
        </Section>

        <Section id="cards" title="卡片" subtitle="Cards" span={4}>
          <div className="gb-card-examples"><CandyThemeCard title="动物" description="官方主题 · 可爱动物" icon={<CandyThemeIcon theme="fox" size={66} />} selected={theme === "fox"} onSelect={() => setTheme("fox")} /><CandyThemeCard title="食物" description="官方主题 · 美味灵感" icon={<CandyThemeIcon theme="burger" size={66} />} selected={theme === "burger"} onSelect={() => setTheme("burger")} /></div>
          <CandyCard title="涂鸦大师" description="累计赢得 10 场比赛" icon={<CandyGameIcon name="trophy" size={36} color="#d69c00" />}><div className="gb-meter-label"><span>成就进度</span><b>6 / 10</b></div><CandyProgress aria-label="成就进度" value={6} max={10} height={12} showLabel={false} striped /></CandyCard>
        </Section>

        <Section id="rooms" title="房间列表" subtitle="Room list" span={4}>
          <div className="gb-room-list">{visibleRooms.length ? visibleRooms.map((room) => <CandyRoomCard key={room.id} title={room.title} icon={<CandyThemeIcon theme={room.theme} size={44} />} players={room.players} capacity={room.capacity} compact connection={room.id % 4 === 0 ? "fair" : "good"} connectionLabel={room.id % 4 === 0 ? "连接一般" : "连接良好"} joinLabel={room.players >= room.capacity ? "已满" : "加入"} onJoin={() => showToast({ title: `正在加入「${room.title}」`, description: "这是本地交互演示，不会连接真实游戏服务器。", variant: "blue" })} />) : <CandyEmptyState title="没有找到房间" description="换个关键词试试。" action={<CandyButton size="xs" onClick={() => { setSearch(""); setPage(1); }}>清除搜索</CandyButton>} />}</div>
          <CandyPagination aria-label="展示房间分页" page={currentPage} totalPages={pages} onPageChange={setPage} size="sm" siblingCount={0} />
          <span className="gb-muted">{filteredRooms.length} 个演示房间 · 第 {currentPage} / {pages} 页</span>
        </Section>

        <Section id="avatars" title="玩家资料" subtitle="Avatar & rating" span={4}>
          <div className="gb-profile"><CandyAvatar character={avatarCharacters[avatarIndex]} size="xl" borderColor="dark" alt="当前玩家头像" onEdit={() => setAvatarIndex((value) => (value + 1) % avatarCharacters.length)} editLabel="切换展示头像" /><div className="gb-stack"><strong>{name || "玩家"}</strong><CandyStatusBadge status="online" label="在线" /><CandyTag color="blue" variant="soft" size="sm">Lv. 15</CandyTag></div><div className="gb-avatar-presets">{avatarCharacters.map((character, index) => <button key={character} type="button" aria-label={`选择${character}头像`} aria-pressed={avatarIndex === index} onClick={() => setAvatarIndex(index)}><CandyAvatar character={character} size="xs" borderColor="blue" alt={character} /></button>)}</div></div>
          <div className="gb-meter-label"><span>下一级</span><b>680 / 1,000</b></div><CandyProgress aria-label="玩家等级进度" value={68} showLabel={false} striped height={14} />
          <div className="gb-divider" /><div className="gb-row gb-between"><CandyRating aria-label="展示星级评分" value={rating} onChange={setRating} size="sm" /><b className="gb-rating-value">{rating.toFixed(1)}</b></div>
        </Section>

        <Section id="icons" title="图标库" subtitle="Game icons" span={4}>
          <div className="gb-icon-grid">{["home", "user", "trophy", "crown", "settings", "search", "plus", "cross", "heart", "bell", "mail", "world", "controller", "camera", "edit", "trash", "star", "diamond", "briefcase", "potion", "coin", "cards", "shield", "sparkle"].map((icon) => <CandyGameIcon key={icon} name={icon} size={25} color="var(--candy-primary)" />)}</div>
          <div className="gb-medallions">{themeDefinitions.map((item) => <CandyThemeIcon key={item.value} theme={item.value} size={37} label={item.label} />)}</div>
        </Section>

        <Section id="tags" title="标签与输入" subtitle="Tags" span={4}>
          <CandyTagGroup gap="sm"><CandyBadge variant="red">NEW</CandyBadge><CandyBadge variant="yellow">HOT</CandyBadge><CandyTag color="blue" variant="soft">官方</CandyTag><CandyTag color="pink" variant="soft">活动</CandyTag><CandyTag color="purple" variant="soft">限时</CandyTag></CandyTagGroup>
          <CandyTagInput aria-label="展示标签输入" label="喜欢的主题" value={tags} onChange={setTags} placeholder="输入标签后按 Enter…" maxTags={6} maxTagLength={12} addLabel="添加主题标签" removeLabel={(tag) => `移除 ${tag}`} size="sm" />
          <div className="gb-meter-label"><span>加载进度</span><b>{volume}%</b></div><CandyProgress aria-label="展示加载进度" value={volume} variant="blue" showLabel={false} striped height={17} />
          <div className="gb-row gb-wrap"><CandyStatusBadge status="admin" label="管理员" /><CandyStatusBadge status="away" label="离开" /><CandyStatusBadge status="full" label="已满" /></div>
        </Section>

        <Section id="modals" title="弹窗与菜单" subtitle="Dialog & dropdown" span={4}>
          <CandyCard title="创建新房间" description="选择你的游戏主题开始吧！" icon={<CandyGameIcon name="trophy" size={38} color="#d69c00" />} footer={<><CandyButton appearance="outline" variant="gray" size="xs" onClick={() => toast("已取消创建")}>取消</CandyButton><CandyButton variant="yellow" size="xs" onClick={() => setDialog("create")}>创建房间</CandyButton></>} />
          <div className="gb-row gb-between"><CandyDropdown trigger={<CandyButton size="sm" appearance="outline" variant="gray" leftIcon={<CandyGameIcon name="user" size={18} />} rightIcon={<CandyGameIcon name="arrow-down" size={12} />}>玩家菜单</CandyButton>} items={menuItems} /><CandyTooltip content="选择一个主题，开始你的第一场游戏。"><CandyIconButton aria-label="展示主题帮助" size="sm" variant="ghost" icon={<CandyGameIcon name="question" size={25} />} /></CandyTooltip><CandyButton size="xs" variant="red" appearance="soft" onClick={() => setDialog("error")}>错误弹窗</CandyButton></div>
        </Section>

        <Section id="empty" title="加载与空状态" subtitle="Loading & empty" span={4}>
          <div className="gb-loading-row"><CandySpinner variant="ring" size="sm" color="blue" /><span>加载中…</span><CandySpinner variant="dots" size="sm" color="blue" /></div>
          <CandyEmptyState title={created ? "房间准备好了！" : "暂时还没有房间"} description={created ? `${activeTheme.label}主题 · 等待朋友加入` : "灵感已经就位，就等你来创建。"} icon={<CandyThemeIcon theme={created ? theme : "robot"} size={56} />} action={<CandyButton size="sm" variant="cyan" onClick={() => setDialog("create")}>{created ? "再创建一个" : "创建我的房间"}</CandyButton>} />
        </Section>

        <Section id="notifications" title="通知" subtitle="Notifications" span={4}>
          {notification ? <CandyNotification title="你有 3 条新消息" description="朋友们正在等待你的邀请。" icon={<CandyGameIcon name="bell" size={29} color="#e0aa00" />} closeLabel="关闭展示通知" onClose={() => setNotification(false)} action={<CandyButton size="xs" variant="ghost" onClick={() => toast("所有演示消息已读")}>查看消息</CandyButton>} /> : <CandyButton size="sm" appearance="outline" onClick={() => setNotification(true)}>重新显示通知</CandyButton>}
          <div className="gb-tooltip-example"><span>小提示</span><p>菜单可以用方向键选择，按 Escape 关闭。每一个组件，都可以用键盘来玩。</p></div>
          <span className="gb-muted">所有互动均为本地演示，无账号登录、网络上传或真实多人游戏。</span>
        </Section>

        <Section id="sidebar" title="侧边导航" subtitle="Sidebar" span={4}>
          <CandyNavigation aria-label="展示侧边导航" orientation="vertical" value={nav} onChange={setNav} items={gameNavigation.slice(0, 4)} />
        </Section>
      </div>

      <CandyModal isOpen={dialog !== null} onClose={() => setDialog(null)} closeLabel="关闭展示弹窗" title={dialog === "create" ? "创建新房间" : dialog === "error" ? "发生错误" : dialog === "profile" ? "玩家资料" : "选择游戏主题"} width={480}>
        {dialog === "error" ? <div className="gb-stack"><CandyAlert tone="error" title="这个演示房间已经满员" >试试其他房间，或者创建你自己的主题房间。</CandyAlert><CandyButton variant="blue" onClick={() => setDialog(null)}>知道了</CandyButton></div> : <div className="gb-stack">
          {dialog === "profile" ? <><div className="gb-row"><CandyAvatar character={avatarCharacters[avatarIndex]} size="lg" borderColor="dark" onEdit={() => setAvatarIndex((value) => (value + 1) % avatarCharacters.length)} editLabel="切换资料头像" /><CandyInput label="昵称" value={name} maxLength={16} onChange={(event) => setName(event.target.value)} /></div><CandyTextarea label="个人介绍" value={bio} onChange={(event) => setBio(event.target.value)} maxLength={200} showCount /></> : <><p className="gb-muted">选一个喜欢的主题，和朋友一起创造乐趣。</p><CandyThemeGrid aria-label="弹窗主题选择" value={theme} onChange={(value) => setTheme(value as CandyTheme)} options={themeOptions(54)} columns={4} /></>}
          <div className="gb-dialog-actions"><CandyButton size="sm" variant="gray" appearance="outline" onClick={() => setDialog(null)}>取消</CandyButton><CandyButton size="sm" variant={dialog === "create" ? "yellow" : "blue"} onClick={dialog === "create" ? createRoom : () => { setDialog(null); toast("设置已保存"); }}>{dialog === "create" ? "创建" : "保存"}</CandyButton></div>
        </div>}
      </CandyModal>
    </div>
  );
}
export default GameShowcaseBoard;
