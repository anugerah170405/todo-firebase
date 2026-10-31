import { useMemo, useState } from "react"
import { Search, Plus, AlertCircle, X } from "lucide-react"
import TaskList from "./components/TaskList"
import TaskFormDialog from "./components/TaskFormDialog"
import DeleteConfirmDialog from "./components/DeleteConfirmDialog"
import Button from "./components/Button"
import Spinner from "./components/Spinner"
import { useTasks, type Task } from "./hooks/useTasks"

type DialogState = { type: "none" } | { type: "add" } | { type: "edit"; task: Task } | { type: "delete"; task: Task }

export default function App() {
    const { tasks, isLoading, loadError, reload, addTask, editTask, removeTask, toggleTask } = useTasks()
    const [query, setQuery] = useState("")
    const [dialog, setDialog] = useState<DialogState>({ type: "none" })
    const [actionError, setActionError] = useState<string | null>(null)

    const closeDialog = () => setDialog({ type: "none" })

    const handleToggle = async (id: string) => {
        setActionError(null)
        try {
            await toggleTask(id)
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Gagal memperbarui status tugas (Error 500)")
        }
    }

    const visibleTasks = useMemo(() => {
        const keyword = query.trim().toLowerCase()
        return keyword ? tasks.filter((t) => t.title.toLowerCase().includes(keyword)) : tasks
    }, [tasks, query])

    const totalTasks = tasks.length
    const doneTasks = tasks.filter((t) => t.completed).length
    const undoneTasks = totalTasks - doneTasks

    return (
        <div className="min-h-screen bg-white">
            <main className="mx-auto w-full max-w-[640px] px-4 py-12 sm:py-20">
                <h1 className="text-xl font-semibold text-zinc-900">Daftar Tugas</h1>

                {actionError && (
                    <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                        <p className="flex-1">{actionError}</p>
                        <button type="button" onClick={() => setActionError(null)} className="cursor-pointer text-red-500 hover:text-red-700" aria-label="Tutup pesan error">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                <div className="mt-6 mb-2 flex items-center gap-3">
                    <div className="relative min-w-0 flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Cari tugas..."
                            aria-label="Cari tugas"
                            className="w-full rounded-md border border-zinc-200 py-2 pr-3 pl-9 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/25"
                        />
                    </div>
                    <Button variant="primary" onClick={() => setDialog({ type: "add" })}>
                        <Plus className="h-4 w-4" /> Tambah tugas
                    </Button>
                </div>

                <div className="flex gap-3 text-sm text-zinc-500 mb-2">
                    <div>Total Tugas: {totalTasks}</div>
                    <div>Belum Selesai: {undoneTasks}</div>
                    <div>Selesai: {doneTasks}</div>
                </div>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center gap-3 py-16">
                        <Spinner size="lg" className="text-blue-600" />
                        <p className="text-sm text-zinc-500">Memuat tugas...</p>
                    </div>
                )}

                {!isLoading && loadError && (
                    <div className="py-16 text-center">
                        <p className="text-sm text-red-600">Gagal memuat tugas: {loadError}</p>
                        <Button variant="link" onClick={reload} className="mt-3">Coba lagi</Button>
                    </div>
                )}

                {!isLoading && !loadError && totalTasks === 0 && (
                    <div className="py-16 text-center">
                        <p className="text-sm text-zinc-500">Belum ada tugas</p>
                        <Button variant="link" onClick={() => setDialog({ type: "add" })} className="mt-3">+ Tambah tugas</Button>
                    </div>
                )}

                {!isLoading && !loadError && totalTasks > 0 && visibleTasks.length === 0 && (
                    <p className="py-16 text-center text-sm text-zinc-500">Tugas tidak ditemukan</p>
                )}

                {!isLoading && !loadError && visibleTasks.length > 0 && (
                    <TaskList
                        tasks={visibleTasks}
                        onToggle={handleToggle}
                        onEdit={(task) => setDialog({ type: "edit", task })}
                        onDelete={(task) => setDialog({ type: "delete", task })}
                    />
                )}
            </main>

            {dialog.type === "add" && <TaskFormDialog onSubmit={addTask} onClose={closeDialog} />}
            {dialog.type === "edit" && (
                <TaskFormDialog
                    task={dialog.task}
                    onSubmit={(title, description) => editTask(dialog.task.id, title, description)}
                    onClose={closeDialog}
                />
            )}
            {dialog.type === "delete" && <DeleteConfirmDialog onConfirm={() => removeTask(dialog.task.id)} onClose={closeDialog} />}
        </div>
    )
}
