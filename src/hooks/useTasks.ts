import { useEffect, useState } from "react"
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from "firebase/firestore"
import { db, isConfigured } from "../firebase"

export interface Task {
    id: string
    title: string
    description: string
    completed: boolean
    createdAt?: number
}

export function formatFirebaseError(error: unknown): string {
    if (!(error instanceof Error)) return "Terjadi kesalahan internal pada server (Error 500)."
    const msg = error.message.toLowerCase()
    if (msg.includes("permission-denied") || msg.includes("missing or insufficient permissions"))
        return "Akses ditolak (Error 403): Aturan keamanan (Security Rules) Firebase menolak permintaan."
    if (msg.includes("unavailable") || msg.includes("could not reach cloud firestore"))
        return "Server database tidak dapat dijangkau (Error 503). Periksa koneksi internet Anda."
    if (msg.includes("deadline-exceeded") || msg.includes("timeout") || msg.includes("waktu habis"))
        return "Koneksi ke database melebihi batas waktu / Timeout (Error 504)."
    if (msg.includes("not-found")) return "Data tidak ditemukan di database (Error 404)."
    if (msg.includes("internal")) return "Terjadi kesalahan internal pada server database (Error 500)."
    if (msg.includes("unauthenticated")) return "Autentikasi ditolak atau sesi berakhir (Error 401)."
    return error.message
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs = 10000, actionName = "Operasi"): Promise<T> {
    let timer: ReturnType<typeof setTimeout>
    const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${actionName} gagal: Batas waktu koneksi habis (Error 504 / Timeout). Periksa koneksi internet Anda.`)), timeoutMs)
    })
    try {
        return await Promise.race([promise, timeout])
    } finally {
        clearTimeout(timer!)
    }
}

const getDb = () => {
    if (!isConfigured || !db) throw new Error("Firebase belum dikonfigurasi (Error 500). Silakan isi file .env terlebih dahulu.")
    return db
}

const throwFormatted = (error: unknown) => { throw new Error(formatFirebaseError(error), { cause: error }) }

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [reloadKey, setReloadKey] = useState(0)

    const reload = () => setReloadKey((k) => k + 1)

    useEffect(() => {
        if (!isConfigured || !db) {
            setIsLoading(false)
            setLoadError("Firebase belum dikonfigurasi. Silakan isi file .env terlebih dahulu.")
            return
        }

        setIsLoading(true)
        setLoadError(null)

        let isDone = false
        const timer = setTimeout(() => {
            if (!isDone) {
                setLoadError("Gagal terhubung ke database dalam 10 detik (Error 504 / Timeout). Periksa koneksi internet atau aturan Firebase Anda.")
                setIsLoading(false)
            }
        }, 10000)

        const unsubscribe = onSnapshot(
            collection(db, "tasks"),
            (snapshot) => {
                isDone = true
                clearTimeout(timer)
                const items: Task[] = snapshot.docs
                    .map((docSnap) => {
                        const data = docSnap.data()
                        const createdAt = data.createdAt?.toMillis?.() ?? (typeof data.createdAt === "number" ? data.createdAt : 0)
                        return { id: docSnap.id, title: data.title || "", description: data.description || "", completed: Boolean(data.completed), createdAt }
                    })
                    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
                setTasks(items)
                setIsLoading(false)
                setLoadError(null)
            },
            (error) => {
                isDone = true
                clearTimeout(timer)
                setLoadError(formatFirebaseError(error))
                setIsLoading(false)
            },
        )

        return () => { clearTimeout(timer); unsubscribe() }
    }, [reloadKey])

    const addTask = async (title: string, description = "") => {
        try {
            await withTimeout(addDoc(collection(getDb(), "tasks"), { title, description, completed: false, createdAt: serverTimestamp() }), 10000, "Tambah tugas")
        } catch (e) { throwFormatted(e) }
    }

    const editTask = async (id: string, title: string, description = "") => {
        try {
            await withTimeout(updateDoc(doc(getDb(), "tasks", id), { title, description }), 10000, "Edit tugas")
        } catch (e) { throwFormatted(e) }
    }

    const toggleTask = async (id: string) => {
        try {
            const target = tasks.find((t) => t.id === id)
            if (!target) return
            await withTimeout(updateDoc(doc(getDb(), "tasks", id), { completed: !target.completed }), 10000, "Ubah status tugas")
        } catch (e) { throwFormatted(e) }
    }

    const removeTask = async (id: string) => {
        try {
            await withTimeout(deleteDoc(doc(getDb(), "tasks", id)), 10000, "Hapus tugas")
        } catch (e) { throwFormatted(e) }
    }

    return { tasks, isLoading, loadError, reload, addTask, editTask, toggleTask, removeTask }
}
