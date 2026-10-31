import { useEffect, type ReactNode } from "react"

interface DialogProps {
    title: string
    onClose: () => void
    children: ReactNode
}

export default function Dialog({ title, onClose, children }: DialogProps) {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [onClose])

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/30 p-4"
            onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-105 rounded-xl border border-zinc-200 bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-base font-semibold text-zinc-900">{title}</h2>
                {children}
            </div>
        </div>
    )
}
