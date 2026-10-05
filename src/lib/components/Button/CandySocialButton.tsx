import React, { forwardRef } from "react";
import { CandyButton, CandyButtonProps } from "./CandyButton";
import "./CandySocialButton.css";

export type CandySocialProvider = "twitter" | "google" | "vk" | "discord";
export interface CandySocialButtonProps extends Omit<CandyButtonProps, "variant" | "leftIcon"> {
  provider: CandySocialProvider;
}

function SocialIcon({ provider }: { provider: CandySocialProvider }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      {provider === "twitter" && <path d="M22 5.8a8.3 8.3 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.7 8.7 0 0 1-2.7 1A4.2 4.2 0 0 0 11.5 9 11.9 11.9 0 0 1 3 4.7a4.2 4.2 0 0 0 1.3 5.6 4.2 4.2 0 0 1-1.9-.5 4.2 4.2 0 0 0 3.4 4.1 4.2 4.2 0 0 1-1.9.1 4.2 4.2 0 0 0 3.9 2.9A8.5 8.5 0 0 1 2 18.6a12 12 0 0 0 18.5-10.1c0-.2 0-.4-.1-.6A8.6 8.6 0 0 0 22 5.8Z" />}
      {provider === "google" && <path d="M21.7 10H12v4h5.6c-.8 2.5-2.8 4-5.6 4a6 6 0 1 1 4-10.5l2.8-2.9A10 10 0 1 0 22 12c0-.7-.1-1.4-.3-2Z" />}
      {provider === "vk" && <path d="M2 5h4c.7 5 2.4 8.2 4 8.8V5h3.5v5c1.6-.2 3.2-2.5 4.4-5H22c-1 3-2.8 5.3-4.4 6.5 1.7 1.1 3.8 3.2 4.4 7H18c-.8-2.4-2.5-4.3-4.5-4.6V19H12C5.5 19 2.4 13.8 2 5Z" />}
      {provider === "discord" && <><path d="M7 4.5a18 18 0 0 0-3.5 1.2C1.5 8.9.8 12.3 1.2 15.6c1.5 1.1 3 1.9 4.6 2.4l1.1-1.8-1.8-.9.4-.3a14 14 0 0 0 13 0l.4.3-1.8.9 1.1 1.8a18 18 0 0 0 4.6-2.4c.4-3.3-.3-6.7-2.3-9.9A18 18 0 0 0 17 4.5l-.5 1.1a14 14 0 0 0-9 0L7 4.5Z" /><ellipse cx="8" cy="11.8" rx="1.5" ry="2" fill="var(--accent)" /><ellipse cx="16" cy="11.8" rx="1.5" ry="2" fill="var(--accent)" /></>}
    </svg>
  );
}

export const CandySocialButton = forwardRef<HTMLButtonElement, CandySocialButtonProps>(
  ({ provider, children, className = "", ...rest }, ref) => (
    <CandyButton {...rest} ref={ref} variant="blue" leftIcon={<SocialIcon provider={provider} />}
      className={`candy-social-btn candy-social-${provider} ${className}`}>
      {children ?? provider.toUpperCase()}
    </CandyButton>
  ),
);
CandySocialButton.displayName = "CandySocialButton";
