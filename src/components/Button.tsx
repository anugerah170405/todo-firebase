import type { ButtonHTMLAttributes, ReactNode } from "react"

export type ButtonVariant = "primary" | "danger" | "ghost" | "link"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600/40 focus-visible:ring-offset-2 disabled:opacity-60",
    danger:
        "rounded-md bg-red-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-600/40 focus-visible:ring-offset-2 disabled:opacity-60",
    ghost:
        "rounded-md px-3.5 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
    link:
        "text-sm font-medium text-blue-600 hover:text-blue-700",
}

export default function Button({
    variant = "primary",
    className = "",
    children,
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={`inline-flex items-center justify-center gap-1.5 transition-colors outline-none cursor-pointer disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

