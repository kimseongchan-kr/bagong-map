"use client";

import type { ComponentPropsWithoutRef } from "react";
import styles from "./button.module.css";

export type ButtonProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "role" | "aria-label" | "aria-labelledby" | "aria-busy" | "dangerouslySetInnerHTML"
> & {
  children: string;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
};

export function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  type = "button",
  className,
  ...buttonProps
}: ButtonProps) {
  const loadingMessage = loading ? `${children} 처리 중…` : "";

  return (
    <>
      <button
        {...buttonProps}
        className={[styles.button, className].filter(Boolean).join(" ")}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        aria-label={loading ? loadingMessage : undefined}
        data-variant={variant}
      >
        {loading ? "처리 중…" : children}
      </button>
      {/* busy 버튼 밖에서, 이미 존재하는 알림 영역의 내용만 갱신한다. */}
      <span className={styles.visuallyHidden} aria-live="polite" aria-atomic="true">
        {loadingMessage}
      </span>
    </>
  );
}
