"use client";

import type { ComponentPropsWithoutRef } from "react";
import styles from "../choice/choice.module.css";
export type RadioProps = Omit<ComponentPropsWithoutRef<"input">, "type" | "children"> & { label: string };

export function Radio({ label, className, ...props }: RadioProps) {
  return <label className={[styles.choice, className].filter(Boolean).join(" ")}>
    <input {...props} type="radio" className={styles.input} /><span>{label}</span>
  </label>;
}
