interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "info" | "warning" | "error";
  size?: "sm" | "md";
  className?: string;
}

/* The palette carries one accent, so success and error are told apart by weight
   rather than hue: outline for success, filled for error. */
const variants = {
  default: "border-rule text-mute",
  info: "border-rule text-mute",
  success: "border-signal text-signal",
  error: "border-signal bg-signal text-signal-ink",
  warning: "border-rule-2 text-faint",
};

const sizes = {
  sm: "px-1.5 py-0.5",
  md: "px-2 py-0.5",
};

export default function Badge({ children, variant = "default", size = "md", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center border font-mono text-[10px] uppercase leading-none tracking-[0.14em] ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
