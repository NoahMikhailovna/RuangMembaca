import { Head } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import BookCard from '../../Components/BookCard';

export default function History({ currentlyReading, finished }) {
    return (
        <AppLayout>
            <Head title="Riwayat Bacaan" />
            <div className="mx-auto max-w-7xl px-4 py-10">
                <h1 className="text-3xl font-extrabold">Riwayat Bacaan</h1>

                <h2 className="mt-8 text-xl font-extrabold">Sedang Dibaca</h2>
                {currentlyReading.length === 0 ? <p className="mt-2 text-muted dark:text-darkmuted">Belum ada buku yang sedang dibaca.</p> : (
                    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {currentlyReading.map((p) => <BookCard key={p.id} book={{ ...p.book, reader_count: 0 }} />)}
                    </div>
                )}
                <h2 className="mt-10 text-xl font-extrabold">Selesai Dibaca</h2>
                {finished.length === 0 ? <p className="mt-2 text-muted dark:text-darkmuted">Belum ada buku yang selesai dibaca.</p> : (
                    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {finished.map((p) => <BookCard key={p.id} book={{ ...p.book, reader_count: 0 }} />)}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
