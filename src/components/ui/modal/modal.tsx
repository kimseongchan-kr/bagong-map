"use client";

import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import styles from "./modal.module.css";

export type ModalProps = {
  open: boolean; onClose: () => void; title: string; description?: string;
  children: ReactNode; footer?: ReactNode;
};

export function Modal({ open, onClose, title, description, children, footer }: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    const previous = document.activeElement;
    element.showModal();
    closeButton.current?.focus();
    return () => {
      element.close();
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  }, [open]);

  function keepFocusInside(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
      'button, input, select, textarea, a[href], [tabindex]',
    )).filter(element => element.tabIndex >= 0 && !element.matches(":disabled") && element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  }

  return (
    <dialog ref={dialog} className={styles.modal} aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-description` : undefined}
      onKeyDown={keepFocusInside}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClose={event => { if (open && !event.currentTarget.open) onClose(); }}>
      <header className={styles.header}>
        <h2 id={`${id}-title`} className={styles.title}>{title}</h2>
        <button ref={closeButton} type="button" className={styles.close} aria-label="닫기" onClick={onClose}>
          <span aria-hidden="true">×</span>
        </button>
      </header>
      {description && <p id={`${id}-description`} className={styles.description}>{description}</p>}
      <div className={styles.body}>{children}</div>
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </dialog>
  );
}
