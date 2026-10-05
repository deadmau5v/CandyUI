import { default as default_2 } from 'react';

export declare const CandyAlert: default_2.ForwardRefExoticComponent<CandyAlertProps & default_2.RefAttributes<HTMLDivElement>>;

export declare interface CandyAlertProps extends Omit<default_2.HTMLAttributes<HTMLDivElement>, "title"> {
    tone?: CandyAlertTone;
    title?: default_2.ReactNode;
    icon?: default_2.ReactNode;
    action?: default_2.ReactNode;
    dismissible?: boolean;
    onClose?: () => void;
    closeLabel?: string;
}

export declare type CandyAlertTone = "success" | "info" | "warning" | "error";

export declare const CandyAvatar: default_2.FC<CandyAvatarProps>;

export declare type CandyAvatarCharacter = "smile" | "bear" | "cat" | "fox" | "rabbit" | "frog" | "crown" | "user";

export declare interface CandyAvatarProps {
    src?: string;
    alt?: string;
    size?: CandySize;
    level?: number | string;
    borderColor?: CandyColor;
    character?: CandyAvatarCharacter;
    icon?: default_2.ReactNode;
    fallbackBg?: string;
    status?: "online" | "offline" | "away" | "playing";
    onEdit?: () => void;
    editLabel?: string;
    className?: string;
    style?: default_2.CSSProperties;
}

export declare const CandyBadge: default_2.FC<CandyBadgeProps>;

export declare interface CandyBadgeProps extends default_2.HTMLAttributes<HTMLSpanElement> {
    variant?: CandyColor;
    size?: "sm" | "md" | "lg";
    icon?: default_2.ReactNode;
    pulse?: boolean;
}

export declare const CandyBreadcrumb: default_2.ForwardRefExoticComponent<CandyBreadcrumbProps & default_2.RefAttributes<HTMLElement>>;

export declare interface CandyBreadcrumbItem {
    label: default_2.ReactNode;
    href?: string;
    icon?: default_2.ReactNode;
    onClick?: default_2.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

export declare interface CandyBreadcrumbProps extends default_2.HTMLAttributes<HTMLElement> {
    items: CandyBreadcrumbItem[];
    separator?: default_2.ReactNode;
}

export declare const CandyButton: default_2.ForwardRefExoticComponent<CandyButtonProps & default_2.RefAttributes<HTMLButtonElement>>;

export declare interface CandyButtonProps extends default_2.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: CandyColor;
    size?: CandySize;
    shape?: CandyShape;
    sound?: CandySoundType | false;
    leftIcon?: default_2.ReactNode;
    rightIcon?: default_2.ReactNode;
    fullWidth?: boolean;
    appearance?: "solid" | "outline" | "soft";
    loading?: boolean;
    loadingLabel?: default_2.ReactNode;
}

export declare const CandyCard: default_2.ForwardRefExoticComponent<CandyCardProps & default_2.RefAttributes<HTMLElement>>;

export declare interface CandyCardProps extends Omit<default_2.HTMLAttributes<HTMLElement>, "title"> {
    title?: default_2.ReactNode;
    description?: default_2.ReactNode;
    icon?: default_2.ReactNode;
    footer?: default_2.ReactNode;
}

/**
 * 糖果风格复选框组件。
 * 厚实圆润的糖果方块外形，选中时带有 SVG 描边动画与弹性弹出，支持半选 indeterminate 状态。
 */
export declare const CandyCheckbox: default_2.ForwardRefExoticComponent<CandyCheckboxProps & default_2.RefAttributes<HTMLInputElement>>;

export declare interface CandyCheckboxProps extends Omit<default_2.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> {
    /** 尺寸大小 (sm: 18px, md: 22px, lg: 28px) */
    size?: CandyCheckboxSize;
    /** 糖果主题颜色 */
    color?: CandyColor;
    /** 不确定状态 (横条图标) */
    indeterminate?: boolean;
    /** 声音反馈 (默认开启) */
    sound?: boolean;
    /** 标签文本或节点 (也可直接通过 children 传递) */
    label?: default_2.ReactNode;
    /** 勾选状态变化回调 */
    onChange?: (checked: boolean, event: default_2.ChangeEvent<HTMLInputElement>) => void;
}

export declare type CandyCheckboxSize = "sm" | "md" | "lg";

export declare type CandyColor = "pink" | "blue" | "cyan" | "red" | "gray" | "green" | "yellow" | "orange" | "purple" | "choco" | "cream" | "dark" | "ghost";

export declare const CandyColorPicker: default_2.ForwardRefExoticComponent<CandyColorPickerProps & default_2.RefAttributes<HTMLInputElement>>;

export declare interface CandyColorPickerProps extends Omit<default_2.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "value" | "defaultValue" | "onChange"> {
    value?: string;
    defaultValue?: string;
    onChange?: (color: string) => void;
    label?: default_2.ReactNode;
    size?: CandySize;
    hexLabel?: string;
}

export declare type CandyConnection = "good" | "fair" | "poor" | "offline";

export declare interface CandyContextValue {
    soundEnabled: boolean;
    setSoundEnabled: (enabled: boolean) => void;
    soundVolume: number;
    setSoundVolume: (volume: number) => void;
    playSound: (type?: CandySoundType) => void;
}

export declare const CandyCounter: default_2.FC<CandyCounterProps>;

export declare interface CandyCounterProps {
    value: number | string;
    icon: default_2.ReactNode;
    iconBg?: CandyColor;
    onPlusClick?: () => void;
    className?: string;
    style?: default_2.CSSProperties;
}

export declare const CandyDatePicker: default_2.ForwardRefExoticComponent<CandyDatePickerProps & default_2.RefAttributes<HTMLInputElement>>;

export declare interface CandyDatePickerProps extends Omit<CandyInputProps, "type" | "leftIcon" | "rightIcon" | "clearable"> {
}

/**
 * CandyDivider 糖果风格水平/垂直分隔线
 * 支持纯分隔线与居中文字徽章（如“或”、“VS”），游戏风格圆润厚边。
 */
export declare const CandyDivider: default_2.ForwardRefExoticComponent<CandyDividerProps & default_2.RefAttributes<HTMLElement>>;

export declare type CandyDividerOrientation = "horizontal" | "vertical";

export declare interface CandyDividerProps extends default_2.HTMLAttributes<HTMLElement> {
    /**
     * 分割线方向，默认为水平
     */
    orientation?: CandyDividerOrientation;
    /**
     * 是否为虚线样式
     */
    dashed?: boolean;
    /**
     * 渲染的原生标签，在 ul/ol 中使用时可指定为 'li' 以保证语义合法
     */
    as?: "div" | "li";
    /**
     * 分割线中间展示的内容或文字（如“或”、“VS”）
     */
    children?: default_2.ReactNode;
}

export declare const CandyDropdown: default_2.ForwardRefExoticComponent<CandyDropdownProps & default_2.RefAttributes<HTMLDivElement>>;

export declare interface CandyDropdownItem {
    id: string;
    label: default_2.ReactNode;
    icon?: default_2.ReactNode;
    onSelect?: () => void;
    disabled?: boolean;
    destructive?: boolean;
    separator?: boolean;
}

export declare interface CandyDropdownProps extends default_2.HTMLAttributes<HTMLDivElement> {
    trigger: default_2.ReactElement;
    items: CandyDropdownItem[];
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    align?: "start" | "end";
    disabled?: boolean;
}

export declare const CandyEmptyState: default_2.ForwardRefExoticComponent<CandyEmptyStateProps & default_2.RefAttributes<HTMLDivElement>>;

export declare interface CandyEmptyStateProps extends Omit<default_2.HTMLAttributes<HTMLDivElement>, "title"> {
    title?: default_2.ReactNode;
    description?: default_2.ReactNode;
    icon?: default_2.ReactNode;
    action?: default_2.ReactNode;
}

export declare const CandyField: default_2.ForwardRefExoticComponent<CandyFieldProps & default_2.RefAttributes<HTMLDivElement>>;

export declare interface CandyFieldContextValue {
    id?: string;
    labelId?: string;
    hintId?: string;
    errorId?: string;
    invalid?: boolean;
    disabled?: boolean;
    required?: boolean;
    size?: CandyInputSize;
}

export declare interface CandyFieldProps {
    /** 表单项唯一 ID，未传时自动生成并关联 label 与 input */
    id?: string;
    /** 标签文本或节点 */
    label?: default_2.ReactNode;
    /** 提示说明文本或节点 */
    hint?: default_2.ReactNode;
    /** 错误信息，存在时会将子输入控件置为 invalid 态 */
    error?: default_2.ReactNode;
    /** 是否必填，展示糖果风格星号 */
    required?: boolean;
    /** 是否禁用 */
    disabled?: boolean;
    /** 尺寸统一注入 */
    size?: CandyInputSize;
    /** 自定义外层样式类名 */
    className?: string;
    /** 自定义外层样式 */
    style?: default_2.CSSProperties;
    /** 子组件（如 CandyInput 或 CandyTextarea） */
    children?: default_2.ReactNode;
}

export declare const CandyFileUpload: default_2.ForwardRefExoticComponent<CandyFileUploadProps & default_2.RefAttributes<HTMLInputElement>>;

export declare interface CandyFileUploadProps extends Omit<default_2.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "value" | "defaultValue" | "onChange" | "children" | "onError"> {
    label?: default_2.ReactNode;
    description?: default_2.ReactNode;
    children?: default_2.ReactNode;
    maxSize?: number;
    maxFiles?: number;
    onFilesChange?: (files: File[]) => void;
    onError?: (message: string, file?: File) => void;
}

export declare const CandyFloatingText: default_2.FC<CandyFloatingTextProps>;

export declare interface CandyFloatingTextProps {
    item: FloatingItem;
    onComplete?: (id: string) => void;
}

export declare const CandyGameIcon: default_2.FC<CandyGameIconProps>;

export declare interface CandyGameIconProps extends default_2.SVGAttributes<SVGElement> {
    name: GameIconName;
    size?: number | string;
    color?: string;
    className?: string;
    style?: default_2.CSSProperties;
}

export declare const CandyIconButton: default_2.ForwardRefExoticComponent<CandyIconButtonProps & default_2.RefAttributes<HTMLButtonElement>>;

export declare interface CandyIconButtonProps extends Omit<CandyButtonProps, "leftIcon" | "rightIcon"> {
    icon: default_2.ReactNode;
    "aria-label": string;
}

export declare const CandyInput: default_2.ForwardRefExoticComponent<CandyInputProps & default_2.RefAttributes<HTMLInputElement>>;

export declare interface CandyInputProps extends Omit<default_2.InputHTMLAttributes<HTMLInputElement>, "size"> {
    /** 尺寸：小号 (sm: 36px)、中号 (md: 46px)、大号 (lg: 54px) */
    size?: CandyInputSize;
    /** 是否处于无效/错误状态 */
    invalid?: boolean;
    success?: boolean;
    /** 左侧图标或装饰节点 */
    leftIcon?: default_2.ReactNode;
    /** 右侧图标或装饰节点 */
    rightIcon?: default_2.ReactNode;
    /** 是否显示清除按钮（有值时可见，支持受控与非受控） */
    clearable?: boolean;
    /** 点击清除按钮时的回调 */
    onClear?: () => void;
    /** 是否开启音效反馈（默认 true） */
    sound?: boolean;
    label?: default_2.ReactNode;
    hint?: default_2.ReactNode;
    error?: default_2.ReactNode;
    fieldClassName?: string;
    fieldStyle?: default_2.CSSProperties;
    inputClassName?: string;
    inputStyle?: default_2.CSSProperties;
}

export declare type CandyInputSize = "sm" | "md" | "lg";

/**
 * CandyList 糖果风格列表容器组件
 * 专为排行榜、游戏任务列表、邮件列表打造，具备厚边与果冻质感。
 */
export declare const CandyList: default_2.ForwardRefExoticComponent<CandyListProps & default_2.RefAttributes<HTMLUListElement>>;

export declare interface CandyListContextValue {
    variant: CandyListVariant;
    size: CandySize;
    divided: boolean;
    sound: CandySoundType | boolean;
}

/**
 * CandyListItem 糖果风格列表项行容器
 * 支持 leading、title、description、trailing、名次徽章、交互下沉及无障碍焦点。
 */
export declare const CandyListItem: default_2.ForwardRefExoticComponent<CandyListItemProps & default_2.RefAttributes<HTMLLIElement>>;

export declare interface CandyListItemProps extends Omit<default_2.LiHTMLAttributes<HTMLLIElement>, "title"> {
    /**
     * 左侧节点（如头像、图标、自定义节点等）
     */
    leading?: default_2.ReactNode;
    /**
     * 列表项主标题
     */
    title?: default_2.ReactNode;
    /**
     * 列表项副标题或说明文字
     */
    description?: default_2.ReactNode;
    /**
     * 右侧节点（如分数、操作按钮、时间、标签等）
     */
    trailing?: default_2.ReactNode;
    /**
     * 是否选中状态
     * @default false
     */
    selected?: boolean;
    /**
     * 是否高亮显示（例如排行榜中“我自己”的行，使用主题强调色与微光底色）
     * @default false
     */
    highlight?: boolean;
    /**
     * 是否可点击交互。若传入 onClick 也会自动识别为可交互项，具备 hover/active 按压下沉与 focus-visible
     * @default false
     */
    interactive?: boolean;
    /**
     * 是否在底部显示分割线（在 plain 变体下默认由列表管理，也可显式指定）
     */
    divider?: boolean;
    /**
     * 是否禁用
     * @default false
     */
    disabled?: boolean;
    /**
     * 排行榜名次编号（1 为金牌、2 为银牌、3 为铜牌，4 及之后为常规名次徽章）。
     * 徽章由纯 CSS 绘制，不依赖外部组件。
     */
    rank?: number;
    /**
     * 单项覆盖尺寸，默认继承 CandyList 的 size
     */
    size?: CandySize;
    /**
     * 点击音效，覆盖列表统一配置
     */
    sound?: CandySoundType | boolean;
    /**
     * 自定义内容节点（作为行内主体内容）
     */
    children?: default_2.ReactNode;
}

export declare interface CandyListProps extends default_2.HTMLAttributes<HTMLUListElement> {
    /**
     * 列表形态变体：
     * - 'plain': 连续面板卡片容器，内部行由分割线隔开，适合设置或常规列表
     * - 'card': 每个条目为独立圆润泡泡卡片，悬浮投影与点击弹性反馈，适合任务/邮件/背包
     * - 'ranked': 排行榜变体，前三名自动赋予金/银/铜强调色与奖牌徽章（支持通过 rank 属性、data-rank 或子项索引自动推断）
     * @default 'plain'
     */
    variant?: CandyListVariant;
    /**
     * 列表统一尺寸规范
     * @default 'md'
     */
    size?: CandySize;
    /**
     * 是否在条目之间显示分割线
     * @default false
     */
    divided?: boolean;
    /**
     * 点击可交互行时的音效类型，设为 false 关闭音效
     * @default 'click'
     */
    sound?: CandySoundType | boolean;
    /**
     * 子节点
     */
    children?: default_2.ReactNode;
}

export declare type CandyListVariant = "plain" | "card" | "ranked";

/**
 * CandyLoadingOverlay - 糖果风加载遮罩层
 * 包裹任意子内容，在 loading 为 true 时叠加半透明遮罩与居中 Spinner，阻止底层交互。
 */
export declare const CandyLoadingOverlay: default_2.ForwardRefExoticComponent<CandyLoadingOverlayProps & default_2.RefAttributes<HTMLDivElement>>;

export declare interface CandyLoadingOverlayProps extends default_2.HTMLAttributes<HTMLDivElement> {
    /** Whether the loading overlay is active and blocking interaction */
    loading: boolean;
    /** Content to be wrapped */
    children?: default_2.ReactNode;
    /** Optional message displayed below the spinner */
    text?: default_2.ReactNode;
    /** Custom spinner element (defaults to CandySpinner) */
    spinner?: default_2.ReactNode;
    /** Props forwarded to default CandySpinner */
    spinnerProps?: CandySpinnerProps;
    /** Whether to apply backdrop blur filter to wrapped content */
    blur?: boolean;
    /** Whether to wrap the spinner and text in a solid candy panel */
    panel?: boolean;
}

export declare const CandyModal: default_2.FC<CandyModalProps>;

export declare interface CandyModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: default_2.ReactNode;
    titleStyle?: "plain" | "ribbon";
    closeLabel?: string;
    ribbonColor?: CandyRibbonColor;
    theme?: CandyPanelTheme;
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    children: default_2.ReactNode;
    width?: string | number;
    className?: string;
    style?: default_2.CSSProperties;
}

export declare const CandyNavigation: default_2.ForwardRefExoticComponent<CandyNavigationProps & default_2.RefAttributes<HTMLElement>>;

export declare interface CandyNavigationItem {
    value: string;
    label: default_2.ReactNode;
    icon?: default_2.ReactNode;
    disabled?: boolean;
    href?: string;
}

export declare interface CandyNavigationProps extends Omit<default_2.HTMLAttributes<HTMLElement>, "onChange"> {
    items: CandyNavigationItem[];
    value?: string;
    onChange?: (value: string) => void;
    orientation?: "horizontal" | "vertical";
    brand?: default_2.ReactNode;
    footer?: default_2.ReactNode;
}

export declare const CandyNotification: default_2.ForwardRefExoticComponent<CandyNotificationProps & default_2.RefAttributes<HTMLElement>>;

export declare interface CandyNotificationProps extends Omit<default_2.HTMLAttributes<HTMLElement>, "title"> {
    title: default_2.ReactNode;
    description?: default_2.ReactNode;
    icon?: default_2.ReactNode;
    action?: default_2.ReactNode;
    onClose?: () => void;
    closeLabel?: string;
}

export declare const CandyPagination: default_2.ForwardRefExoticComponent<CandyPaginationProps & default_2.RefAttributes<HTMLElement>>;

export declare interface CandyPaginationProps extends default_2.HTMLAttributes<HTMLElement> {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
    disabled?: boolean;
    size?: "sm" | "md" | "lg";
}

export declare const CandyPanel: default_2.FC<CandyPanelProps>;

export declare interface CandyPanelProps extends default_2.HTMLAttributes<HTMLDivElement> {
    theme?: CandyPanelTheme;
    ribbon?: default_2.ReactNode;
    ribbonColor?: CandyRibbonColor;
    ribbonIcon?: default_2.ReactNode;
    hasRivets?: boolean;
    innerWell?: boolean;
}

export declare type CandyPanelTheme = "cookie" | "bubblegum" | "cyber" | "frosted";

export declare const CandyProgress: default_2.FC<CandyProgressProps>;

export declare interface CandyProgressProps extends default_2.HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
    variant?: CandyColor;
    striped?: boolean;
    showLabel?: boolean | ((val: number, maxVal: number) => string);
    height?: number;
    icon?: default_2.ReactNode;
    sparkle?: boolean;
}

export declare const CandyProvider: default_2.FC<CandyProviderProps>;

export declare interface CandyProviderProps {
    children: default_2.ReactNode;
    defaultSoundEnabled?: boolean;
    defaultVolume?: number;
    className?: string;
    style?: default_2.CSSProperties;
}

/**
 * 糖果风格单选框组件。
 * 圆形糖果外形，选中时中心糖果圆点弹跳出现。支持独立使用或配合 CandyRadioGroup 使用。
 */
export declare const CandyRadio: default_2.ForwardRefExoticComponent<CandyRadioProps & default_2.RefAttributes<HTMLInputElement>>;

/**
 * 糖果风格单选按钮组。
 * 统一管理子 Radio 的 name/value/onChange/disabled/size/color，支持水平与垂直方向，支持键盘方向键切换。
 */
export declare const CandyRadioGroup: default_2.ForwardRefExoticComponent<CandyRadioGroupProps & default_2.RefAttributes<HTMLDivElement>>;

export declare interface CandyRadioGroupProps extends Omit<default_2.HTMLAttributes<HTMLDivElement>, "onChange"> {
    /** 原生 name 属性 (未提供时自动生成) */
    name?: string;
    /** 受控值 */
    value?: string;
    /** 默认非受控值 */
    defaultValue?: string;
    /** 选中值变化回调 */
    onChange?: (value: string) => void;
    /** 是否整组禁用 */
    disabled?: boolean;
    /** 尺寸大小 */
    size?: CandyCheckboxSize;
    /** 糖果颜色 */
    color?: CandyColor;
    /** 排列方向：水平或垂直 */
    orientation?: "horizontal" | "vertical";
    /** 子元素 */
    children?: default_2.ReactNode;
}

export declare interface CandyRadioProps extends Omit<default_2.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> {
    /** 尺寸大小 (sm: 18px, md: 22px, lg: 28px) */
    size?: CandyCheckboxSize;
    /** 糖果主题颜色 */
    color?: CandyColor;
    /** 声音反馈 (默认开启) */
    sound?: boolean;
    /** 标签文本或节点 (也可直接通过 children 传递) */
    label?: default_2.ReactNode;
    /** 选中状态变化回调 */
    onChange?: (checked: boolean, event: default_2.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * CandyRating - Interactive star rating component with candy game aesthetics.
 */
export declare const CandyRating: default_2.ForwardRefExoticComponent<CandyRatingProps & default_2.RefAttributes<HTMLDivElement>>;

export declare interface CandyRatingIconProps {
    /** 0-based star index */
    index: number;
    /** Current actual rating value */
    value: number;
    /** Current hovered rating value if hovering */
    hoverValue?: number;
    /** Whether this star has active highlight (filled or hovered) */
    active: boolean;
    /** Whether this star is filled (or partially filled) */
    filled: boolean;
    /** Whether this star is half-filled */
    half?: boolean;
    /** Whether the rating is currently in hover state */
    hover: boolean;
    /** Whether the rating component is disabled */
    disabled?: boolean;
    /** Whether the rating component is read-only */
    readOnly?: boolean;
    /** Rating size */
    size?: CandyRatingSize;
}

export declare interface CandyRatingProps extends Omit<default_2.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
    /** Controlled rating value */
    value?: number;
    /** Initial rating value when uncontrolled */
    defaultValue?: number;
    /** Change callback */
    onChange?: (value: number) => void;
    /** Hover preview change callback */
    onHoverChange?: (hoverValue: number) => void;
    /** Total number of stars (default: 5) */
    max?: number;
    /** Read-only mode */
    readOnly?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Component size: xs, sm, md, lg, xl (default: md) */
    size?: CandyRatingSize;
    /** Allow half star rating (default: false) */
    allowHalf?: boolean;
    /** Allow clearing to 0 by clicking current value (default: true) */
    allowClear?: boolean;
    /** Custom icon node or render function */
    icon?: default_2.ReactNode | ((props: CandyRatingIconProps) => default_2.ReactNode);
    /** Sound effect on interaction (default: 'star') */
    sound?: CandySoundType | boolean;
    /** Form field name for native form submission */
    name?: string;
}

export declare type CandyRatingSize = "xs" | "sm" | "md" | "lg" | "xl" | CandySize;

/**
 * Game-style title banner: an arched band with folded tails behind it.
 * The shape is an SVG stretched horizontally (non-scaling strokes keep the
 * outline crisp at every width); text sits on top as real, selectable HTML.
 * The styles in CandyPanel.css (.candy-ribbon-shape ...) depend on this markup.
 */
export declare const CandyRibbon: default_2.FC<CandyRibbonProps>;

export declare type CandyRibbonColor = "gold" | "pink" | "blue" | "green";

export declare interface CandyRibbonProps extends default_2.HTMLAttributes<HTMLDivElement> {
    color?: CandyRibbonColor;
    icon?: default_2.ReactNode;
}

export declare const CandyRoomCard: default_2.ForwardRefExoticComponent<CandyRoomCardProps & default_2.RefAttributes<HTMLElement>>;

export declare interface CandyRoomCardProps extends Omit<default_2.HTMLAttributes<HTMLElement>, "title"> {
    title: default_2.ReactNode;
    icon?: default_2.ReactNode;
    theme?: default_2.ReactNode;
    players: number;
    capacity: number;
    connection?: CandyConnection;
    connectionLabel?: string;
    status?: CandyRoomStatus;
    compact?: boolean;
    joinLabel?: default_2.ReactNode;
    onJoin?: () => void;
    disabled?: boolean;
}

export declare type CandyRoomStatus = "waiting" | "playing" | "full" | "closed";

/**
 * CandySelect 糖果风格自绘下拉选择器组件
 */
export declare const CandySelect: default_2.ForwardRefExoticComponent<CandySelectProps & default_2.RefAttributes<HTMLDivElement>>;

export declare interface CandySelectOption {
    value: string | number;
    label: default_2.ReactNode;
    disabled?: boolean;
    icon?: default_2.ReactNode;
}

export declare interface CandySelectProps extends Omit<default_2.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
    /** 选项列表 */
    options: CandySelectOption[];
    /** 当前选中值（受控） */
    value?: string | number;
    /** 默认选中值（非受控） */
    defaultValue?: string | number;
    /** 选中值变化回调 */
    onChange?: (value: string | number, option: CandySelectOption) => void;
    /** 未选择时的占位文本 */
    placeholder?: string;
    /** 尺寸大小 */
    size?: CandySize;
    /** 主题颜色 */
    color?: CandyColor;
    /** 是否禁用 */
    disabled?: boolean;
    /** 是否处于无效/错误状态 */
    invalid?: boolean;
    /** 表单提交时的字段名（渲染隐藏 input） */
    name?: string;
    /** 音效反馈，支持具体音效类型或布尔值关闭 */
    sound?: CandySoundType | boolean;
    /** 是否占满容器宽度 */
    fullWidth?: boolean;
    /** 无障碍标签 */
    "aria-label"?: string;
}

export declare type CandyShape = "rounded" | "pill" | "square" | "circle";

export declare type CandySize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * CandySkeleton - 圆角糖果风骨架屏占位块
 * 支持单块、圆形、多行文本段落骨架与流畅的糖霜流光 shimmer 动画。
 */
export declare const CandySkeleton: default_2.ForwardRefExoticComponent<CandySkeletonProps & default_2.RefAttributes<HTMLDivElement>>;

export declare interface CandySkeletonProps extends Omit<default_2.HTMLAttributes<HTMLDivElement>, "color"> {
    /** Width of the skeleton block or multiline container */
    width?: string | number;
    /** Height of the skeleton block or each line in multiline mode */
    height?: string | number;
    /** Whether to render as a circle placeholder */
    circle?: boolean;
    /** Number of text placeholder lines; if > 1, renders paragraph layout with shorter last line */
    lines?: number;
    /** Whether shimmer wave animation is active */
    animated?: boolean;
    /** Color theme for the skeleton */
    variant?: CandyColor;
}

export declare const CandySlider: default_2.FC<CandySliderProps>;

export declare interface CandySliderProps {
    id?: string;
    "aria-label"?: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    color?: CandyColor;
    onChange: (val: number) => void;
    disabled?: boolean;
    className?: string;
    style?: default_2.CSSProperties;
}

export declare const CandySocialButton: default_2.ForwardRefExoticComponent<CandySocialButtonProps & default_2.RefAttributes<HTMLButtonElement>>;

export declare interface CandySocialButtonProps extends Omit<CandyButtonProps, "variant" | "leftIcon"> {
    provider: CandySocialProvider;
}

export declare type CandySocialProvider = "twitter" | "google" | "vk" | "discord";

export declare const candySound: SoundController;

/**
 * Zero-dependency Web Audio synthesizer for juicy WebGame UI sound effects.
 */
export declare type CandySoundType = "click" | "pop" | "bubble" | "coin" | "star" | "toggle" | "whoosh" | "fanfare" | "error";

/**
 * CandySpinner - 糖果风加载转圈组件
 * 支持三色弹跳点 (dots) 与厚实糖果圆环 (ring)，具有糖果内阴影与多尺寸支持。
 */
export declare const CandySpinner: default_2.ForwardRefExoticComponent<CandySpinnerProps & default_2.RefAttributes<HTMLDivElement>>;

export declare interface CandySpinnerProps extends Omit<default_2.HTMLAttributes<HTMLDivElement>, "color"> {
    /** Spinner display style: bouncy 3-color candy dots or chunky ring swirl */
    variant?: CandySpinnerVariant;
    /** Size tier of the spinner: 'xs' | 'sm' | 'md' | 'lg' | 'xl' */
    size?: CandySize;
    /** Candy color theme */
    color?: CandyColor;
    /** Accessible label announced by screen readers */
    label?: string;
}

export declare type CandySpinnerVariant = "dots" | "ring";

/**
 * CandyStars - Read-only 0-3 star display for game level victory/settlement banners.
 */
export declare const CandyStars: default_2.ForwardRefExoticComponent<CandyStarsProps & default_2.RefAttributes<HTMLDivElement>>;

export declare interface CandyStarsProps extends default_2.HTMLAttributes<HTMLDivElement> {
    /** Number of achieved stars (alias: value) */
    count?: number;
    /** Alias for count */
    value?: number;
    /** Total number of stars (default: 3) */
    max?: number;
    /** Component size (default: sm) */
    size?: CandyRatingSize;
    /** Whether to play celebratory pop-in animation (default: true) */
    animated?: boolean;
    /** Whether to display center star elevated in an arch (default: false) */
    arched?: boolean;
}

export declare type CandyStatus = "online" | "playing" | "offline" | "away" | "host" | "admin" | "full";

export declare const CandyStatusBadge: default_2.ForwardRefExoticComponent<CandyStatusBadgeProps & default_2.RefAttributes<HTMLSpanElement>>;

export declare interface CandyStatusBadgeProps extends default_2.HTMLAttributes<HTMLSpanElement> {
    status?: CandyStatus;
    label?: default_2.ReactNode;
    icon?: default_2.ReactNode;
    size?: "sm" | "md";
}

export declare interface CandyStepItem {
    label: default_2.ReactNode;
    description?: default_2.ReactNode;
    icon?: default_2.ReactNode;
    disabled?: boolean;
}

export declare const CandyStepper: default_2.ForwardRefExoticComponent<CandyStepperProps & default_2.RefAttributes<HTMLInputElement>>;

export declare interface CandyStepperProps extends Omit<default_2.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step"> {
    value?: number;
    defaultValue?: number;
    onChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    size?: CandySize;
    label?: default_2.ReactNode;
    decrementLabel?: string;
    incrementLabel?: string;
}

export declare const CandySteps: default_2.ForwardRefExoticComponent<CandyStepsProps & default_2.RefAttributes<HTMLOListElement>>;

export declare interface CandyStepsProps extends default_2.HTMLAttributes<HTMLOListElement> {
    items: CandyStepItem[];
    current: number;
    onStepChange?: (step: number) => void;
    orientation?: "horizontal" | "vertical";
}

export declare const CandySwitch: default_2.ForwardRefExoticComponent<CandySwitchProps & default_2.RefAttributes<HTMLButtonElement>>;

export declare interface CandySwitchProps extends Omit<default_2.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "color"> {
    checked: boolean;
    onChange: (checked: boolean) => void;
    color?: CandyColor;
    label?: default_2.ReactNode;
    sound?: boolean;
    iconOn?: default_2.ReactNode;
    iconOff?: default_2.ReactNode;
}

/**
 * CandyTab - 选项卡单个 Tab 按钮
 */
export declare const CandyTab: default_2.ForwardRefExoticComponent<CandyTabProps & default_2.RefAttributes<HTMLButtonElement>>;

export declare interface CandyTabItem {
    value: string;
    label: default_2.ReactNode;
    icon?: default_2.ReactNode;
    badge?: default_2.ReactNode | boolean;
    disabled?: boolean;
    children?: default_2.ReactNode;
    keepMounted?: boolean;
}

/**
 * CandyTabList - 选项卡头部列表，包含键盘 roving tabindex 导航
 */
export declare const CandyTabList: default_2.ForwardRefExoticComponent<CandyTabListProps & default_2.RefAttributes<HTMLDivElement>>;

export declare interface CandyTabListProps extends default_2.HTMLAttributes<HTMLDivElement> {
    "aria-label"?: string;
}

/**
 * CandyTabPanel - 选项卡内容面板
 */
export declare const CandyTabPanel: default_2.ForwardRefExoticComponent<CandyTabPanelProps & default_2.RefAttributes<HTMLDivElement>>;

export declare interface CandyTabPanelProps extends default_2.HTMLAttributes<HTMLDivElement> {
    value: string;
    keepMounted?: boolean;
}

export declare interface CandyTabProps extends Omit<default_2.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
    value: string;
    icon?: default_2.ReactNode;
    badge?: default_2.ReactNode | boolean;
    disabled?: boolean;
}

/**
 * CandyTabs - 糖果/休闲游戏风格选项卡容器组件
 */
export declare const CandyTabs: default_2.ForwardRefExoticComponent<CandyTabsProps & default_2.RefAttributes<HTMLDivElement>>;

export declare interface CandyTabsProps extends Omit<default_2.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    variant?: CandyTabsVariant;
    size?: CandyTabsSize;
    color?: CandyColor;
    sound?: CandySoundType | boolean;
    keepMounted?: boolean;
    items?: CandyTabItem[];
    fullWidth?: boolean;
}

export declare type CandyTabsSize = "sm" | "md" | "lg";

export declare type CandyTabsVariant = "pill" | "underline";

export declare const CandyTag: default_2.ForwardRefExoticComponent<CandyTagProps & default_2.RefAttributes<HTMLSpanElement>>;

export declare type CandyTagColor = CandyColor | "gray";

export declare const CandyTagGroup: default_2.ForwardRefExoticComponent<CandyTagGroupProps & default_2.RefAttributes<HTMLDivElement>>;

export declare interface CandyTagGroupProps extends default_2.HTMLAttributes<HTMLDivElement> {
    /** 标签间距 */
    gap?: "xs" | "sm" | "md" | "lg" | number | string;
    /** 对齐方式 */
    align?: "start" | "center" | "end" | "baseline";
    /** 是否自动换行，默认 true */
    wrap?: boolean;
}

export declare const CandyTagInput: default_2.ForwardRefExoticComponent<CandyTagInputProps & default_2.RefAttributes<HTMLInputElement>>;

export declare interface CandyTagInputProps extends Omit<default_2.InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "defaultValue" | "onChange" | "type" | "maxLength"> {
    value?: string[];
    defaultValue?: string[];
    onChange?: (tags: string[]) => void;
    label?: default_2.ReactNode;
    size?: CandySize;
    color?: CandyColor;
    maxTags?: number;
    maxTagLength?: number;
    allowDuplicates?: boolean;
    addLabel?: string;
    removeLabel?: (tag: string) => string;
}

export declare interface CandyTagProps extends Omit<default_2.HTMLAttributes<HTMLSpanElement>, "color"> {
    /** 标签颜色，支持项目预设糖果色及 gray */
    color?: CandyTagColor;
    /** 标签变体：实心、柔和底色、描边 */
    variant?: CandyTagVariant;
    /** 尺寸大小 */
    size?: CandyTagSize;
    /** 左侧图标 */
    icon?: default_2.ReactNode;
    /** 是否支持关闭 */
    closable?: boolean;
    /** 点击或按键关闭回调 */
    onClose?: (e: default_2.MouseEvent<HTMLElement> | default_2.KeyboardEvent<HTMLElement>) => void;
    /** 关闭按钮的无障碍标签 */
    closeAriaLabel?: string;
    /** 是否为可切换筛选 Chip */
    checkable?: boolean;
    /** 筛选 Chip 选中状态 */
    checked?: boolean;
    /** 筛选 Chip 状态变更回调 */
    onCheckedChange?: (checked: boolean) => void;
    /** 是否禁用 */
    disabled?: boolean;
    /** 是否启用糖果音效反馈 */
    sound?: boolean;
}

export declare type CandyTagSize = "sm" | "md" | "lg";

export declare type CandyTagVariant = "solid" | "soft" | "outline";

export declare const CandyTextarea: default_2.ForwardRefExoticComponent<CandyTextareaProps & default_2.RefAttributes<HTMLTextAreaElement>>;

export declare interface CandyTextareaProps extends default_2.TextareaHTMLAttributes<HTMLTextAreaElement> {
    showCount?: boolean;
    /** 尺寸：小号 (sm)、中号 (md)、大号 (lg) */
    size?: CandyInputSize;
    /** 是否处于无效/错误状态 */
    invalid?: boolean;
    /** 是否显示清除按钮（有值时可见，支持受控与非受控） */
    clearable?: boolean;
    /** 点击清除按钮时的回调 */
    onClear?: () => void;
    /** 是否开启音效反馈（默认 true） */
    sound?: boolean;
    label?: default_2.ReactNode;
    hint?: default_2.ReactNode;
    error?: default_2.ReactNode;
    fieldClassName?: string;
    fieldStyle?: default_2.CSSProperties;
    textareaClassName?: string;
    textareaStyle?: default_2.CSSProperties;
}

export declare type CandyTheme = "robot" | "fox" | "anime" | "burger" | "briefcase" | "crystal" | "cube" | "camera";

export declare const CandyThemeCard: default_2.ForwardRefExoticComponent<CandyThemeCardProps & default_2.RefAttributes<HTMLButtonElement>>;

export declare interface CandyThemeCardProps extends Omit<default_2.ButtonHTMLAttributes<HTMLButtonElement>, "title" | "onSelect" | "children"> {
    title: default_2.ReactNode;
    description?: default_2.ReactNode;
    icon?: default_2.ReactNode;
    selected?: boolean;
    onSelect?: () => void;
}

export declare const CandyThemeGrid: default_2.ForwardRefExoticComponent<CandyThemeGridProps & default_2.RefAttributes<HTMLDivElement>>;

export declare interface CandyThemeGridProps extends Omit<default_2.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
    options: CandyThemeOption[];
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    columns?: number;
}

export declare const CandyThemeIcon: default_2.ForwardRefExoticComponent<CandyThemeIconProps & default_2.RefAttributes<SVGSVGElement>>;

export declare interface CandyThemeIconProps extends Omit<default_2.SVGAttributes<SVGSVGElement>, "children"> {
    theme?: CandyTheme;
    size?: number;
    label?: string;
}

export declare interface CandyThemeOption {
    value: string;
    label: default_2.ReactNode;
    description?: default_2.ReactNode;
    icon?: default_2.ReactNode;
    disabled?: boolean;
}

export declare const CandyTimePicker: default_2.ForwardRefExoticComponent<CandyTimePickerProps & default_2.RefAttributes<HTMLInputElement>>;

export declare interface CandyTimePickerProps extends Omit<CandyInputProps, "type" | "leftIcon" | "rightIcon" | "clearable"> {
}

export declare const CandyToast: default_2.FC<CandyToastProps>;

export declare interface CandyToastProps {
    toast: ToastItem;
    onDismiss: (id: string) => void;
}

export declare const CandyToastProvider: default_2.FC<{
    children: default_2.ReactNode;
}>;

export declare const CandyTooltip: default_2.FC<CandyTooltipProps>;

export declare interface CandyTooltipProps {
    content: default_2.ReactNode;
    children: default_2.ReactElement;
    position?: "top" | "bottom";
    className?: string;
}

export declare interface ConfettiOptions {
    particleCount?: number;
    spread?: number;
    origin?: {
        x: number;
        y: number;
    };
    playSound?: boolean;
}

export declare interface FloatingItem {
    id: string;
    text: string;
    x: number;
    y: number;
    color?: CandyColor;
}

export declare interface FloatingTextContainerProps {
    className?: string;
    style?: default_2.CSSProperties;
}

export declare type GameIconName = string;

declare class SoundController {
    private ctx;
    private enabled;
    private volume;
    private getContext;
    setEnabled(enabled: boolean): void;
    isEnabled(): boolean;
    setVolume(volume: number): void;
    getVolume(): number;
    play(type?: CandySoundType): void;
}

export declare interface SpawnTextOptions {
    text: string;
    x: number;
    y: number;
    color?: CandyColor;
}

declare interface ToastContextValue {
    showToast: (options: {
        title: string;
        description?: string;
        icon?: default_2.ReactNode;
        variant?: CandyColor;
        duration?: number;
    }) => void;
}

export declare interface ToastItem {
    id: string;
    title: string;
    description?: string;
    icon?: default_2.ReactNode;
    variant?: CandyColor;
}

export declare const triggerCandyConfetti: (options?: ConfettiOptions) => void;

export declare const useCandy: () => CandyContextValue;

export declare const useCandyToast: () => ToastContextValue;

export declare const useFloatingText: () => {
    spawnText: ({ text, x, y, color }: SpawnTextOptions) => void;
    FloatingTextContainer: default_2.FC<FloatingTextContainerProps>;
};

export { }
