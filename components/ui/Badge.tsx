import { cn } from "@/lib/cn";

export type BadgeVariant = "primary" | "secondary" | "success" | "warning" | "error" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary:  "bg-[var(--color-primary-100)] text-[var(--color-primary-dark)]",
  secondary:"bg-[var(--color-secondary-100)] text-[var(--color-secondary-dark)]",
  success:  "bg-green-100 text-green-800",
  warning:  "bg-amber-100 text-amber-800",
  error:    "bg-red-100 text-red-800",
  neutral:  "bg-[var(--color-surface-muted)] text-[var(--color-muted)]",
};

export function Badge({ variant = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
