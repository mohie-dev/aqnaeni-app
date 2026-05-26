import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

const styles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-brand text-surface transition hover:bg-opacity-90 disabled:bg-white/10 disabled:text-white/50",
  secondary:
    "border border-white/10 bg-white/5 text-white transition hover:border-white/20 hover:bg-white/10",
  ghost: "text-white/80 hover:text-white",
};

export default function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={
        "inline-flex items-center justify-center rounded-3xl px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 " +
        styles[variant] +
        " " +
        className
      }
      {...props}
    />
  );
}
