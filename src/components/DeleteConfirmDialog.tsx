import { useState } from "react"
import Dialog from "./Dialog"
import Button from "./Button"
import Spinner from "./Spinner"

interface DeleteConfirmDialogProps {
    onConfirm: () => Promise<void> | void
    onClose: () => void
}

export default function DeleteConfirmDialog({ onConfirm, onClose }: DeleteConfirmDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleConfirm = async () => {
        setIsDeleting(true); setError(null)
        try { await onConfirm(); onClose() }
        catch (err) {
            setError(err instanceof Error ? err.message : "Gagal memproses permintaan")
            setIsDeleting(false)
        }
    }

    return (
        <Dialog title="Hapus tugas?" onClose={onClose}>
            <p className="text-sm text-zinc-500">Tindakan ini tidak dapat dibatalkan.</p>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <div className="mt-6 flex justify-end gap-2">
                <Button variant="ghost" onClick={onClose} disabled={isDeleting}>Batal</Button>
                <Button variant="danger" onClick={handleConfirm} disabled={isDeleting}>
                    {isDeleting ? <><Spinner size="sm" /><span>Menghapus...</span></> : "Hapus"}
                </Button>
            </div>
        </Dialog>
    )
}
