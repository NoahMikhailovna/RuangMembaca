import { Head, Link, router } from '@inertiajs/react';
import { Bookmark, Trash2 } from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';

export default function Bookmarks({ bookmarks }) {
    return (
        <AppLayout>
            <Head title="Bookmark" />
            <div className="mx-auto max-w-4xl px-4 py-10">
                <h1 className="text-3xl font-extrabold">Bookmark Halaman</h1>
                {bookmarks.length === 0 ? (
                    <div className="card mt-8 p-12 text-center">
                        <p className="text-lg font-bold">Belum ada bookmark</p>
                        <p className="mt-1 text-muted dark:text-darkmuted">Tandai halaman penting saat membaca buku.</p>
                    </div>
                ) : (
                    <div className="mt-8 space-y-3">
                        {bookmarks.map((b) => (
                            <div key={b.id} className="card flex items-center justify-between p-4">
                                <Link href={route('reader.show', b.book.slug)} className="flex items-center gap-3">
                                    <Bookmark className="text-primary" />
                                    <span><span className="font-bold">{b.book.title}</span><span className="block text-sm text-muted dark:text-darkmuted">Halaman {b.page}{b.label ? ` - ${b.label}` : ''}</span></span>
                                </Link>
                                <button onClick={() => router.delete(route('bookmarks.destroy', b.id), { preserveScroll: true })} className="rounded-full p-2 text-primary transition hover:bg-soft dark:hover:bg-ink-bg" aria-label="Hapus bookmark"><Trash2 size={18} /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
