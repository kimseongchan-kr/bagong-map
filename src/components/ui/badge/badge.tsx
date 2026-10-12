import styles from "./badge.module.css";

export type BadgeProps = { status?: "recruiting" | "pending" | "approved" | "closed"; label?: string; className?: string };
const labels = { recruiting: "모집 중", pending: "승인 대기", approved: "참여 승인", closed: "모집 마감" };

export function Badge({ status = "recruiting", label, className }: BadgeProps) {
  return <span className={[styles.badge, className].filter(Boolean).join(" ")} data-status={status}>{label ?? labels[status]}</span>;
}
