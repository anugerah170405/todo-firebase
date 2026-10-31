import { Loader2 } from "lucide-react"

export type SpinnerSize = "xs" | "sm" | "md" | "lg"

interface SpinnerProps {
    size?: SpinnerSize
    className?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
}

export default function Spinner({
    size = "md",
    className = "",
}: SpinnerProps) {
    return (
        <Loader2
            className={`animate-spin text-current ${sizeClasses[size]} ${className}`}
            aria-hidden="true"
        />
    )
}

