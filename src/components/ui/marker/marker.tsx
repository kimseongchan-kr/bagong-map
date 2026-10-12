"use client";

import type { ComponentPropsWithoutRef } from "react";
import styles from "./marker.module.css";
export type MarkerProps = Omit<ComponentPropsWithoutRef<"button">, "children"> & {
  number: string; label: string; selected?: boolean; closed?: boolean;
};

export function Marker({ number, label, selected = false, closed = false, className, type = "button", ...props }: MarkerProps) {
  return <button {...props} type={type} className={[styles.marker, className].filter(Boolean).join(" ")}
    aria-pressed={selected} data-closed={closed}>
    <span className={styles.number}>{number}</span><span>{label}</span>
    {closed && <span className={styles.closed}>모집 마감</span>}
  </button>;
}
