import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import BookCard from '../../Components/BookCard';

export default function History({ currentlyReading = [], finished = [], histories = [] }) {
    const reading = (Array.isArray(currentlyReading) ? currentlyReading : Object.values(currentlyReading || {})).filter((p) => p.book);
    const done = (Array.isArray(finished) ? finished : Object.values(finished || {})).filter((p) => p.book);
    const activities = (Array.isArray(histories) ? histories : Object.values(histories || {})).filter((h) => h.book);

    return (
        <AppLayout>
            <Head title="Riwayat Bacaan" />
            <div className="mx-auto max-w-7xl px-4 py-10">
                <h1 className="text-3xl font-extrabold">Riwayat Bacaan</h1>

                <h2 className="mt-8 text-xl font-extrabold">Sedang Dibaca</h2>
                {reading.length === 0 ? <p className="mt-2 text-muted dark:text-darkmuted">Belum ada buku yang sedang dibaca.</p> : (
                    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {reading.map((p) => <BookCard key={p.id} book={{ ...p.book, reader_count: 0 }} />)}
                    </div>
                )}
                <h2 className="mt-10 text-xl font-extrabold">Selesai Dibaca</h2>
                {done.length === 0 ? <p className="mt-2 text-muted dark:text-darkmuted">Belum ada buku yang selesai dibaca.</p> : (
                    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {done.map((p) => <BookCard key={p.id} book={{ ...p.book, reader_count: 0 }} />)}
                    </div>
                )}
                <h2 className="mt-10 text-xl font-extrabold">Aktivitas Membaca Terakhir</h2>
                {activities.length === 0 ? <p className="mt-2 text-muted dark:text-darkmuted">Belum ada aktivitas membaca tercatat.</p> : (
                    <div className="card mt-4 divide-y divide-line dark:divide-ink-border">
                        {activities.map((h) => (
                            <div key={h.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
                                <div>
                                    <Link href={route('books.show', h.book.slug)} className="font-semibold transition hover:text-primary">{h.book.title}</Link>
                                    <p className="text-sm text-muted dark:text-darkmuted">{h.book.author?.name} - Halaman {h.page}</p>
                                </div>
                                <p className="text-sm text-muted dark:text-darkmuted">
                                    {new Date(h.read_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
