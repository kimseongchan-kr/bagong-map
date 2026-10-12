"use client";

import type { ComponentPropsWithoutRef } from "react";
import styles from "./select-option.module.css";
export type SelectOptionProps = Omit<ComponentPropsWithoutRef<"li">, "children"> & {
  label: string; selected?: boolean; active?: boolean; disabled?: boolean;
};

export function SelectOption({ label, selected = false, active = false, disabled = false, className, onClick, ...props }: SelectOptionProps) {
  return <li {...props} role="option" aria-selected={selected} aria-disabled={disabled || undefined}
    data-active={active} className={[styles.option, className].filter(Boolean).join(" ")}
    onClick={disabled ? undefined : onClick}>{label}</li>;
}
