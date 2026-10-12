"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { SelectOption } from "../select-option/select-option";
import field from "../field/field.module.css";
import styles from "./select.module.css";

export type SelectItem = { value: string; label: string; disabled?: boolean };
export type SelectProps = {
  label: string; options: readonly SelectItem[]; value: string; onValueChange: (value: string) => void;
  id?: string; name?: string; placeholder?: string; helperText?: string; error?: string;
  disabled?: boolean; className?: string;
};

export function Select({ label, options, value, onValueChange, id, name, placeholder = "항목을 선택하세요", helperText, error, disabled = false, className }: SelectProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const listId = `${controlId}-list`;
  const labelId = `${controlId}-label`;
  const messageId = `${controlId}-message`;
  const root = useRef<HTMLDivElement>(null);
  const search = useRef({ text: "", time: 0 });
  const [open, setOpen] = useState(false);
  const [activeValue, setActiveValue] = useState<string | undefined>();
  const enabled = options.filter(option => !option.disabled);
  const selected = options.find(option => option.value === value);
  const active = enabled.find(option => option.value === activeValue) ?? enabled[0];
  const activeIndex = active ? options.indexOf(active) : -1;
  const optionId = (index: number) => `${controlId}-option-${index}`;
  const expanded = open && !disabled;
  const message = error || helperText;

  // 비활성으로 전환된 뒤 다시 활성화해도 이전 팝업이 되살아나지 않는다.
  if (disabled && open) setOpen(false);

  useEffect(() => {
    if (!expanded) return;
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [expanded]);

  useEffect(() => {
    if (expanded && activeIndex >= 0) {
      document.getElementById(`${controlId}-option-${activeIndex}`)?.scrollIntoView?.({ block: "nearest" });
    }
  }, [expanded, activeIndex, controlId]);

  function show(option = selected && !selected.disabled ? selected : enabled[0]) {
    setActiveValue(option?.value);
    search.current = { text: "", time: 0 };
    setOpen(true);
  }

  function choose(option: SelectItem | undefined) {
    if (!option || option.disabled || disabled) return;
    onValueChange(option.value);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    const key = event.key;
    if (key === "Escape" || key === "Tab") {
      if (key === "Escape" && expanded) { event.preventDefault(); event.stopPropagation(); }
      setOpen(false);
      return;
    }
    if (key === "Enter" || key === " ") {
      event.preventDefault();
      if (expanded) choose(active); else show();
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) {
      event.preventDefault();
      if (key === "Home") show(enabled[0]);
      else if (key === "End") show(enabled.at(-1));
      else if (!expanded) show();
      else {
        const index = active ? enabled.indexOf(active) : 0;
        const next = Math.max(0, Math.min(enabled.length - 1, index + (key === "ArrowDown" ? 1 : -1)));
        setActiveValue(enabled[next]?.value);
      }
      return;
    }
    if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = event.timeStamp;
      const previous = now - search.current.time < 700 ? search.current.text : "";
      const text = (previous + key).toLocaleLowerCase();
      const repeated = [...text].every(character => character === text[0]);
      const query = repeated ? text[0] : text;
      const start = repeated && expanded && active ? enabled.indexOf(active) + 1 : 0;
      const ordered = [...enabled.slice(start), ...enabled.slice(0, start)];
      const match = ordered.find(option => option.label.toLocaleLowerCase().startsWith(query));
      if (!expanded) show(match);
      else if (match) setActiveValue(match.value);
      search.current = { text, time: now };
    }
  }

  return (
    <div ref={root} className={[field.field, styles.root, className].filter(Boolean).join(" ")}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <label id={labelId} htmlFor={controlId} className={field.label}>{label}</label>
      <button type="button" id={controlId} className={`${field.control} ${styles.trigger}`} role="combobox"
        aria-labelledby={labelId} aria-haspopup="listbox" aria-controls={expanded ? listId : undefined}
        aria-expanded={expanded} aria-activedescendant={expanded && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        aria-invalid={error ? true : undefined} aria-describedby={message ? messageId : undefined}
        disabled={disabled} onKeyDown={handleKeyDown} onClick={() => { if (expanded) setOpen(false); else show(); }}>
        <span>{selected?.label ?? placeholder}</span><span className={styles.arrow} aria-hidden="true">{expanded ? "⌃" : "⌄"}</span>
      </button>
      {name && <input type="hidden" name={name} value={selected?.value ?? ""} disabled={disabled} />}
      {message && <p id={messageId} className={[field.message, error && field.error].filter(Boolean).join(" ")}>{message}</p>}
      {expanded && <>
        <ul id={listId} role="listbox" aria-labelledby={labelId} className={styles.list}>
          {options.map((option, index) => <SelectOption key={option.value} id={optionId(index)} label={option.label}
            disabled={option.disabled} selected={option.value === value} active={active === option}
            onPointerDown={event => event.preventDefault()}
            onPointerMove={() => { if (!option.disabled) setActiveValue(option.value); }}
            onClick={() => choose(option)} />)}
        </ul>
        {enabled.length === 0 && <p className={styles.empty} role="status">선택 가능한 항목이 없어요</p>}
      </>}
    </div>
  );
}
