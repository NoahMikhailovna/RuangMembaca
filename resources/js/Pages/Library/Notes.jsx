import { Head, Link, router } from '@inertiajs/react';
import { NotebookPen, Trash2 } from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';

export default function Notes({ notes }) {
    return (
        <AppLayout>
            <Head title="Catatan Pribadi" />
            <div className="mx-auto max-w-4xl px-4 py-10">
                <h1 className="text-3xl font-extrabold">Catatan Pribadi</h1>
                {notes.length === 0 ? (
                    <div className="card mt-8 p-12 text-center">
                        <p className="text-lg font-bold">Belum ada catatan</p>
                        <p className="mt-1 text-muted dark:text-darkmuted">Catatan yang kamu tulis di reader akan muncul di sini.</p>
                    </div>
                ) : (
                    <div className="mt-8 space-y-3">
                        {notes.map((n) => (
                            <div key={n.id} className="card p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="flex items-center gap-2 font-bold"><NotebookPen size={16} className="text-primary" /> {n.title || 'Catatan'}</p>
                                        <Link href={route('books.show', n.book.slug)} className="text-sm font-semibold text-primary">{n.book.title}</Link>
                                        {n.page && <span className="text-sm text-muted dark:text-darkmuted"> - halaman {n.page}</span>}
                                        <p className="mt-2 text-muted dark:text-darkmuted">{n.body}</p>
                                    </div>
                                    <button onClick={() => router.delete(route('notes.destroy', n.id), { preserveScroll: true })} className="rounded-full p-2 text-primary transition hover:bg-soft dark:hover:bg-ink-bg" aria-label="Hapus catatan"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
