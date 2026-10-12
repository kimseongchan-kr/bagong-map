"use client";

import { useId, type ComponentPropsWithoutRef } from "react";
import styles from "../field/field.module.css";

export type InputProps = Omit<ComponentPropsWithoutRef<"input">, "children" | "type"> & {
  label: string;
  helperText?: string;
  error?: string;
  type?: "text" | "email" | "password" | "search" | "tel" | "url" | "number";
};

export function Input({ label, helperText, error, id, className, type = "text", "aria-describedby": describedBy, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const message = error || helperText;
  const messageId = `${inputId}-message`;
  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      <label className={styles.label} htmlFor={inputId}>{label}</label>
      <input {...props} id={inputId} type={type} className={styles.control}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={[describedBy, message ? messageId : undefined].filter(Boolean).join(" ") || undefined} />
      {message && <p id={messageId} className={[styles.message, error && styles.error].filter(Boolean).join(" ")}>{message}</p>}
    </div>
  );
}
