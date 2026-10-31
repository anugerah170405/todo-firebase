import { useState, type FormEvent } from "react"
import Dialog from "./Dialog"
import Button from "./Button"
import Spinner from "./Spinner"
import type { Task } from "../hooks/useTasks"

interface TaskFormDialogProps {
    task?: Task
    onSubmit: (title: string, description: string) => Promise<void> | void
    onClose: () => void
}

const inputClass = "w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/25"

export default function TaskFormDialog({ task, onSubmit, onClose }: TaskFormDialogProps) {
    const isEditing = Boolean(task)
    const [title, setTitle] = useState(task?.title ?? "")
    const [description, setDescription] = useState(task?.description ?? "")
    const [validationError, setValidationError] = useState<string | null>(null)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const trimmedTitle = title.trim()
        if (!trimmedTitle) { setValidationError("Judul tugas wajib diisi"); return }
        setValidationError(null); setSubmitError(null); setIsSubmitting(true)
        try {
            await onSubmit(trimmedTitle, description.trim())
            onClose()
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Terjadi kesalahan")
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog title={isEditing ? "Edit tugas" : "Tambah tugas"} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="task-title" className="mb-1.5 block text-sm text-zinc-500">Judul tugas</label>
                    <input
                        id="task-title"
                        autoFocus
                        value={title}
                        onChange={(e) => { setTitle(e.target.value); if (validationError) setValidationError(null) }}
                        placeholder="Apa yang perlu dikerjakan?"
                        className={inputClass}
                    />
                    {validationError && <p className="mt-1.5 text-xs text-red-600">{validationError}</p>}
                </div>

                <div>
                    <label htmlFor="task-description" className="mb-1.5 block text-sm text-zinc-500">
                        Deskripsi <span className="text-zinc-400">(opsional)</span>
                    </label>
                    <textarea
                        id="task-description"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`${inputClass} resize-none`}
                        placeholder="Deskripsi tugasnya apa?, kalo gak ada kosongkan."
                    />
                </div>

                {submitError && <p className="text-sm text-red-600">{submitError}</p>}

                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Batal</Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? <><Spinner size="sm" /><span>Menyimpan...</span></> : isEditing ? "Simpan Perubahan" : "Tambah tugas"}
                    </Button>
                </div>
            </form>
        </Dialog>
    )
}
