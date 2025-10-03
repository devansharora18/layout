interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "info" | "warning" | "error";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({ children, variant = "default", size = "md", className = "" }: BadgeProps) {
  const variants = {
    default: "bg-white/15 text-white border border-white/25",
    success: "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30",
    info: "bg-blue-500/20 text-blue-300 border border-blue-400/30",
    warning: "bg-amber-500/20 text-amber-300 border border-amber-400/30",
    error: "bg-red-500/20 text-red-300 border border-red-400/30"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm"
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}