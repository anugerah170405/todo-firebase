import type { ButtonHTMLAttributes, ReactNode } from "react"

export type IconButtonVariant = "default" | "danger"

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: IconButtonVariant
    children: ReactNode
}

const variantStyles: Record<IconButtonVariant, string> = {
    default: "text-zinc-400 hover:text-zinc-900",
    danger: "text-zinc-400 hover:text-red-600",
}

export default function IconButton({
    variant = "default",
    className = "",
    children,
    type = "button",
    ...props
}: IconButtonProps) {
    return (
        <button
            type={type}
            className={`cursor-pointer rounded-md p-1.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-600/40 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

