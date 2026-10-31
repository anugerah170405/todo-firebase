import TaskItem from "./TaskItem"
import type { Task } from "../hooks/useTasks"

interface TaskListProps {
    tasks: Task[]
    onToggle: (id: string) => Promise<void> | void
    onEdit: (task: Task) => void
    onDelete: (task: Task) => void
}

export default function TaskList({ tasks, ...handlers }: TaskListProps) {
    return (
        <ul className="border-t border-zinc-200">
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} {...handlers} />
            ))}
        </ul>
    )
}
