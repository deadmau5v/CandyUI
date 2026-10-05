import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import "./CandyDropdown.css";

export interface CandyDropdownItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  separator?: boolean;
}

export interface CandyDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactElement;
  items: CandyDropdownItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "end";
  disabled?: boolean;
}

type TriggerProps = React.HTMLAttributes<HTMLElement> & {
  disabled?: boolean;
  type?: string;
  ref?: React.Ref<HTMLElement>;
};

function getTriggerRef(
  trigger: React.ReactElement,
): React.Ref<HTMLElement> | undefined {
  const propsRef = Object.getOwnPropertyDescriptor(trigger.props, "ref");
  if (propsRef && !propsRef.get) return propsRef.value;
  const elementRef = Object.getOwnPropertyDescriptor(trigger, "ref");
  return elementRef && !elementRef.get ? elementRef.value : undefined;
}

export const CandyDropdown = forwardRef<HTMLDivElement, CandyDropdownProps>(
  (
    {
      trigger,
      items,
      open,
      defaultOpen = false,
      onOpenChange,
      align = "start",
      disabled = false,
      className = "",
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const triggerCleanupRef = useRef<(() => void) | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const initialFocusRef = useRef<"first" | "last">("first");
    const menuHadFocusRef = useRef(false);
    const previousOpenRef = useRef(false);
    const searchRef = useRef({ value: "", time: 0 });
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
    const [maxHeight, setMaxHeight] = useState(320);
    const generatedId = useId();
    const menuId = `candy-dropdown-${generatedId}`;
    const triggerProps = trigger.props as TriggerProps;
    const triggerId = triggerProps.id ?? `${menuId}-trigger`;
    const originalRef = getTriggerRef(trigger);
    const isControlled = open !== undefined;
    const isDisabled =
      disabled ||
      Boolean(triggerProps.disabled) ||
      triggerProps["aria-disabled"] === true ||
      triggerProps["aria-disabled"] === "true";
    const isOpen = !isDisabled && (isControlled ? open : internalOpen);

    const setTriggerRef = useCallback(
      (node: HTMLElement | null) => {
        triggerRef.current = node;
        if (triggerCleanupRef.current) {
          triggerCleanupRef.current();
          triggerCleanupRef.current = null;
          if (!node) return;
        }
        if (typeof originalRef === "function") {
          const cleanup = (
            originalRef as (node: HTMLElement | null) => void | (() => void)
          )(node);
          if (typeof cleanup === "function")
            triggerCleanupRef.current = cleanup;
        } else if (originalRef) {
          (originalRef as React.MutableRefObject<HTMLElement | null>).current =
            node;
        }
      },
      [originalRef],
    );

    const getMenuItems = useCallback(
      () =>
        Array.from(
          menuRef.current?.querySelectorAll<HTMLButtonElement>(
            'button[role="menuitem"]:not(:disabled)',
          ) ?? [],
        ),
      [],
    );

    function updateOpen(next: boolean) {
      if (next === isOpen) return;
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    }

    function closeMenu(restoreFocus: boolean) {
      if (restoreFocus) triggerRef.current?.focus();
      updateOpen(false);
    }

    function openMenu(edge: "first" | "last" = "first") {
      if (isDisabled) return;
      initialFocusRef.current = edge;
      if (isOpen) {
        const available = getMenuItems();
        const target =
          edge === "last" ? available[available.length - 1] : available[0];
        (target ?? menuRef.current)?.focus();
      } else {
        updateOpen(true);
      }
    }

    useEffect(() => {
      if (isOpen && !previousOpenRef.current) {
        searchRef.current = { value: "", time: 0 };
        const available = getMenuItems();
        const target =
          initialFocusRef.current === "last"
            ? available[available.length - 1]
            : available[0];
        (target ?? menuRef.current)?.focus();
      } else if (
        !isOpen &&
        previousOpenRef.current &&
        menuHadFocusRef.current &&
        document.activeElement === document.body
      ) {
        triggerRef.current?.focus();
      }
      previousOpenRef.current = isOpen;
      if (!isOpen) menuHadFocusRef.current = false;
    }, [isOpen, getMenuItems]);

    useEffect(() => {
      if (!isOpen) return;
      const handleOutsidePointer = (event: PointerEvent) => {
        if (
          event.target instanceof Node &&
          !rootRef.current?.contains(event.target)
        ) {
          if (!isControlled) setInternalOpen(false);
          onOpenChange?.(false);
        }
      };
      document.addEventListener("pointerdown", handleOutsidePointer);
      return () =>
        document.removeEventListener("pointerdown", handleOutsidePointer);
    }, [isOpen, isControlled, onOpenChange]);

    useEffect(() => {
      if (!isOpen) return;
      function positionMenu() {
        if (!triggerRef.current || !menuRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const below = Math.max(80, window.innerHeight - rect.bottom - 12);
        const above = Math.max(80, rect.top - 12);
        const placeAbove =
          menuRef.current.scrollHeight > below && above > below;
        setPlacement(placeAbove ? "top" : "bottom");
        setMaxHeight(Math.min(320, placeAbove ? above : below));
      }
      positionMenu();
      window.addEventListener("resize", positionMenu);
      return () => window.removeEventListener("resize", positionMenu);
    }, [isOpen, items]);

    useEffect(() => {
      if (isDisabled && !isControlled) setInternalOpen(false);
    }, [isDisabled, isControlled]);

    function handleMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
      const available = getMenuItems();
      const index = available.findIndex(
        (item) => item === document.activeElement,
      );
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeMenu(true);
      } else if (event.key === "Tab") {
        closeMenu(true);
      } else if (
        available.length &&
        ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)
      ) {
        event.preventDefault();
        let next = 0;
        if (event.key === "End") next = available.length - 1;
        else if (event.key === "ArrowDown")
          next = (index + 1) % available.length;
        else if (event.key === "ArrowUp")
          next =
            index < 0
              ? available.length - 1
              : (index - 1 + available.length) % available.length;
        available[next].focus();
      } else if (
        available.length &&
        event.key.length === 1 &&
        event.key !== " " &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
      ) {
        const now = Date.now();
        const char = event.key.toLowerCase();
        const value =
          now - searchRef.current.time < 600
            ? searchRef.current.value + char
            : char;
        searchRef.current = { value, time: now };
        const prefix = value.split("").every((letter) => letter === char)
          ? char
          : value;
        for (let offset = 1; offset <= available.length; offset++) {
          const candidate =
            available[(index + offset + available.length) % available.length];
          if (candidate.textContent?.trim().toLowerCase().startsWith(prefix)) {
            event.preventDefault();
            candidate.focus();
            break;
          }
        }
      }
    }

    const composedTrigger = React.cloneElement(
      trigger as React.ReactElement<TriggerProps>,
      {
        id: triggerId,
        ...(trigger.type === "button"
          ? { type: triggerProps.type ?? "button" }
          : {}),
        "aria-haspopup": "menu",
        "aria-expanded": isOpen,
        "aria-controls": isOpen ? menuId : undefined,
        "aria-disabled": isDisabled || undefined,
        disabled: isDisabled,
        ref: setTriggerRef,
        onClick: (event) => {
          if (isDisabled) {
            event.preventDefault();
            return;
          }
          triggerProps.onClick?.(event);
          if (event.defaultPrevented) return;
          if (isOpen) closeMenu(true);
          else openMenu();
        },
        onKeyDown: (event) => {
          triggerProps.onKeyDown?.(event);
          if (event.defaultPrevented || isDisabled) return;
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openMenu(event.key === "ArrowUp" ? "last" : "first");
          } else if (event.key === "Escape" && isOpen) {
            event.preventDefault();
            event.stopPropagation();
            closeMenu(true);
          }
        },
      },
    );

    return (
      <div
        {...rest}
        ref={(node) => {
          rootRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
        }}
        className={`candy-dropdown ${className}`.trim()}
        onBlur={(event) => {
          onBlur?.(event);
          const nextTarget = event.relatedTarget;
          if (
            isOpen &&
            nextTarget instanceof Node &&
            !event.currentTarget.contains(nextTarget)
          ) {
            menuHadFocusRef.current = false;
            closeMenu(false);
          }
        }}
      >
        {composedTrigger}
        {isOpen && (
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            tabIndex={-1}
            aria-labelledby={triggerId}
            className={`candy-dropdown-menu candy-dropdown-menu-${align} candy-dropdown-menu-${placement}`}
            style={{ maxHeight }}
            onKeyDown={handleMenuKeyDown}
            onFocus={() => {
              menuHadFocusRef.current = true;
            }}
          >
            {items.map((item) => (
              <React.Fragment key={item.id}>
                {item.separator && (
                  <div role="separator" className="candy-dropdown-separator" />
                )}
                <button
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  disabled={item.disabled}
                  className={`candy-dropdown-item${item.destructive ? " candy-dropdown-item-destructive" : ""}`}
                  onClick={() => {
                    closeMenu(true);
                    item.onSelect?.();
                  }}
                >
                  {item.icon && (
                    <span className="candy-dropdown-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </button>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    );
  },
);

CandyDropdown.displayName = "CandyDropdown";
