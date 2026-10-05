import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { CandyPanel, CandyPanelTheme } from "../Panel/CandyPanel";
import { CandyRibbonColor } from "../Panel/CandyRibbon";
import { CandyIconButton } from "../Button/CandyIconButton";
import { CandyGameIcon } from "../GameIcon/CandyGameIcon";
import { useCandy } from "../../context/CandyProvider";
import "./CandyModal.css";

export interface CandyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  ribbonColor?: CandyRibbonColor;
  theme?: CandyPanelTheme;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  children: React.ReactNode;
  width?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

const KNOWN_CANDY_VARS = [
  "--candy-font-family",
  "--candy-pink",
  "--candy-pink-light",
  "--candy-pink-dark",
  "--candy-pink-shadow",
  "--candy-pink-text",
  "--candy-blue",
  "--candy-blue-light",
  "--candy-blue-dark",
  "--candy-blue-shadow",
  "--candy-blue-text",
  "--candy-green",
  "--candy-green-light",
  "--candy-green-dark",
  "--candy-green-shadow",
  "--candy-green-text",
  "--candy-yellow",
  "--candy-yellow-light",
  "--candy-yellow-dark",
  "--candy-yellow-shadow",
  "--candy-yellow-text",
  "--candy-orange",
  "--candy-orange-light",
  "--candy-orange-dark",
  "--candy-orange-shadow",
  "--candy-orange-text",
  "--candy-purple",
  "--candy-purple-light",
  "--candy-purple-dark",
  "--candy-purple-shadow",
  "--candy-purple-text",
  "--candy-choco",
  "--candy-choco-light",
  "--candy-choco-dark",
  "--candy-choco-shadow",
  "--candy-choco-text",
  "--candy-cream",
  "--candy-cream-light",
  "--candy-cream-dark",
  "--candy-cream-shadow",
  "--candy-cream-text",
  "--candy-dark",
  "--candy-dark-light",
  "--candy-dark-dark",
  "--candy-dark-shadow",
  "--candy-dark-text",
  "--candy-primary",
  "--candy-primary-shadow",
  "--candy-primary-text",
  "--candy-btn-depth",
  "--candy-outline",
  "--candy-text",
  "--candy-text-muted",
  "--candy-surface",
  "--candy-track",
  "--candy-panel-shadow",
  "--candy-focus",
  "--candy-radius-sm",
  "--candy-radius-md",
  "--candy-radius-lg",
  "--candy-radius-xl",
  "--candy-radius-full",
  "--candy-transition",
  "--candy-bounce",
  "--candy-pop-shadow",
  "--candy-text-stroke",
];

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export const CandyModal: React.FC<CandyModalProps> = ({
  isOpen,
  onClose,
  title,
  ribbonColor = "blue",
  theme = "cookie",
  showCloseButton = true,
  closeOnOverlayClick = true,
  children,
  width = "480px",
  className = "",
  style,
}) => {
  const { playSound } = useCandy();
  const dialogRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const titleId = useId();

  useIsomorphicLayoutEffect(() => {
    if (!isOpen || typeof window === "undefined") return;
    const anchor = anchorRef.current;
    const overlay = overlayRef.current;
    if (!anchor || !overlay) return;

    const computed = window.getComputedStyle(anchor);
    const targetStyle = overlay.style;

    for (let i = 0; i < computed.length; i++) {
      const prop = computed[i];
      if (prop.startsWith("--candy-")) {
        const val = computed.getPropertyValue(prop).trim();
        if (val) {
          targetStyle.setProperty(prop, val);
        }
      }
    }

    for (const prop of KNOWN_CANDY_VARS) {
      const val = computed.getPropertyValue(prop).trim();
      if (val) {
        targetStyle.setProperty(prop, val);
      }
    }
  });

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;
    playSound("whoosh");
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    // Hiding the page scrollbar widens the viewport and makes content jump;
    // pad the body by the scrollbar width so the layout stays put.
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      const currentPadding =
        parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";
    const dialog = dialogRef.current;
    const focusable = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]',
        ) || [],
      ).filter(
        (element) =>
          element.getClientRects().length > 0 &&
          getComputedStyle(element).visibility !== "hidden" &&
          !element.closest("[inert]"),
      );
    (focusable()[0] || dialog)?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
      }
      if (event.key === "Tab") {
        const elements = focusable();
        if (!elements.length) {
          event.preventDefault();
          dialog?.focus();
          return;
        }
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === dialog)
        ) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      document.removeEventListener("keydown", handleKey);
      previousFocus?.focus();
    };
  }, [isOpen, playSound]);

  if (typeof document === "undefined" || !document.body) {
    return null;
  }

  return (
    <>
      <span ref={anchorRef} style={{ display: "none" }} aria-hidden="true" />
      {isOpen &&
        createPortal(
          <div
            ref={overlayRef}
            className="candy-ui-root candy-modal-overlay"
            style={{ fontFamily: "var(--candy-font-family)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget && closeOnOverlayClick) {
                playSound("pop");
                onClose();
              }
            }}
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? titleId : undefined}
              aria-label={title ? undefined : "Game dialog"}
              tabIndex={-1}
              className={`candy-modal-content ${className}`}
              style={{ width, ...style }}
            >
              <CandyPanel
                theme={theme}
                ribbon={title ? <span id={titleId}>{title}</span> : undefined}
                ribbonColor={ribbonColor}
              >
                {showCloseButton && (
                  <div
                    style={{
                      position: "absolute",
                      top: -14,
                      right: -14,
                      zIndex: 30,
                    }}
                  >
                    <CandyIconButton
                      aria-label="Close"
                      size="sm"
                      variant="pink"
                      shape="circle"
                      sound="pop"
                      onClick={onClose}
                      icon={
                        <CandyGameIcon name="cross" size={12} color="#8f2652" />
                      }
                    />
                  </div>
                )}
                {children}
              </CandyPanel>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
