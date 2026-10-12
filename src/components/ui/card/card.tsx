"use client";

import type { ComponentPropsWithoutRef } from "react";
import styles from "./card.module.css";

export type CardProps = Omit<ComponentPropsWithoutRef<"button">, "children" | "title"> & {
  title: string; number: string; modeLabel: string; deadlineLabel: string; description: string;
  participantsLabel: string; priceLabel: string; selected?: boolean; closed?: boolean;
};

export function Card({ title, number, modeLabel, deadlineLabel, description, participantsLabel, priceLabel, selected = false, closed = false, className, type = "button", ...props }: CardProps) {
  return (
    <button {...props} type={type} className={[styles.card, className].filter(Boolean).join(" ")}
      aria-pressed={selected} data-closed={closed}>
      <span className={styles.status}><span className={styles.mode}>{modeLabel}</span><span className={styles.deadline}>{closed ? "모집 마감" : deadlineLabel}</span></span>
      <span className={styles.menu}><span className={styles.number}>{number}</span><span className={styles.title}>{title}</span></span>
      <span className={styles.description}>{description}</span>
      <span className={styles.footer}><span className={styles.participants}>{participantsLabel}</span><span className={styles.price}>{priceLabel}</span></span>
    </button>
  );
}
