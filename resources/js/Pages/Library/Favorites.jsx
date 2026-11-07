import { Head } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import BookCard from '../../Components/BookCard';

export default function Favorites({ books }) {
    return (
        <AppLayout>
            <Head title="Favorit" />
            <div className="mx-auto max-w-7xl px-4 py-10">
                <h1 className="text-3xl font-extrabold">Buku Favorit</h1>
                {books.length === 0 ? (
                    <div className="card mt-8 p-12 text-center">
                        <p className="text-lg font-bold">Belum ada buku favorit</p>
                        <p className="mt-1 text-muted dark:text-darkmuted">Tekan tombol Favorit di halaman detail buku.</p>
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {books.map((book) => <BookCard key={book.id} book={book} />)}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
