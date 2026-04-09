import { cn } from "@/lib/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

export function Card({
  children,
  className,
  padding = "md",
  hover = false,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)]",
        "shadow-[var(--shadow-card)]",
        hover && "transition-shadow duration-200 hover:shadow-md cursor-pointer",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between pb-4 mb-4 border-b border-[var(--color-border)]",
        className
      )}
    >
      {children}
    </div>
  );
}
