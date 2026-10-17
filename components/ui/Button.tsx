"use client";

import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
}

/* Focus is handled by the app-wide :focus-visible rule in globals.css — the sheet's
   signal outline — so the variants deliberately carry no ring utilities. */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, href, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center border font-mono uppercase tracking-[0.14em] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40";

    const variants = {
      primary: "border-signal bg-signal text-signal-ink hover:opacity-85",
      secondary: "border-rule-2 bg-board text-ink hover:border-ink",
      outline: "border-rule text-mute hover:border-rule-2 hover:text-ink",
      ghost: "border-transparent text-mute hover:text-ink",
    };

    const sizes = {
      sm: "px-2.5 py-1 text-[11px]",
      md: "px-3 py-1.5 text-[11px]",
      lg: "px-4 py-2.5 text-[12px]",
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    if (href) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
