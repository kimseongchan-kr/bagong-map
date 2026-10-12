"use client";

import type { ComponentPropsWithoutRef } from "react";
import styles from "../choice/choice.module.css";
export type CheckboxProps = Omit<ComponentPropsWithoutRef<"input">, "type" | "children"> & { label: string };

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return <label className={[styles.choice, className].filter(Boolean).join(" ")}>
    <input {...props} type="checkbox" className={styles.input} /><span>{label}</span>
  </label>;
}
