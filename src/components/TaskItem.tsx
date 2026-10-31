import { useState } from "react"
import { Check, Pencil, Trash2 } from "lucide-react"
import IconButton from "./IconButton"
import Spinner from "./Spinner"
import type { Task } from "../hooks/useTasks"

interface TaskItemProps {
    task: Task
    onToggle: (id: string) => Promise<void> | void
    onEdit: (task: Task) => void
    onDelete: (task: Task) => void
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isToggling, setIsToggling] = useState(false)

    const handleToggle = async () => {
        if (isToggling) return
        setIsToggling(true)
        try { await onToggle(task.id) } finally { setIsToggling(false) }
    }

    return (
        <li className="flex flex-col gap-3 border-b border-zinc-200 py-3.5">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    role="checkbox"
                    disabled={isToggling}
                    aria-checked={task.completed}
                    aria-label={`Tandai "${task.title}" sebagai ${task.completed ? "belum selesai" : "selesai"}`}
                    onClick={handleToggle}
                    className={`flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-600/40 disabled:cursor-not-allowed ${task.completed ? "border-blue-600 bg-blue-600" : "border-zinc-300 hover:border-blue-600"}`}
                >
                    {isToggling
                        ? <Spinner size="xs" className={task.completed ? "text-white" : "text-blue-600"} />
                        : task.completed ? <Check className="h-3 w-3 stroke-[3] text-white" /> : null}
                </button>

                <span
                    onClick={() => setIsExpanded((p) => !p)}
                    className={`min-w-0 flex-1 cursor-pointer truncate text-sm hover:text-blue-500 hover:underline ${task.completed ? "text-zinc-400 line-through" : "text-zinc-900"}`}
                    title={task.title}
                >
                    {task.title}
                </span>

                <IconButton aria-label="Edit tugas" onClick={() => onEdit(task)}>
                    <Pencil className="h-4 w-4" />
                </IconButton>
                <IconButton variant="danger" aria-label="Hapus tugas" onClick={() => onDelete(task)}>
                    <Trash2 className="h-4 w-4" />
                </IconButton>
            </div>

            {isExpanded && task.description && (
                <div className="pl-8 text-sm text-zinc-500">{task.description}</div>
            )}
        </li>
    )
}
