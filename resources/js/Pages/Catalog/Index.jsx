import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Grid2x2, List, Search } from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';
import BookCard from '../../Components/BookCard';
import Pagination from '../../Components/Pagination';

export default function Index({ books, categories, filters, totalBooks }) {
    const [view, setView] = useState('grid');
    const [search, setSearch] = useState(filters.search || '');

    const apply = (params) => router.get(route('catalog.index'), { ...filters, ...params }, { preserveState: true, replace: true });

    return (
        <AppLayout>
            <Head title="Katalog Buku" />
            <div className="mx-auto max-w-7xl px-4 py-10">
                <h1 className="text-3xl font-extrabold">Katalog Buku</h1>
                <p className="mt-1 text-muted dark:text-darkmuted">{totalBooks} buku tersedia</p>

                <div className="mt-6 flex flex-col gap-3 md:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); apply({ search: e.target.value }); }}
                            placeholder="Cari buku secara real-time..."
                            className="input !pl-10"
                        />
                    </div>
                    <select value={filters.category || ''} onChange={(e) => apply({ category: e.target.value })} className="input md:w-56">
                        <option value="">Semua Kategori</option>
                        {categories.map((c) => <option key={c.id} value={c.slug}>{c.name} ({c.books_count})</option>)}
                    </select>
                    <select value={filters.sort || 'latest'} onChange={(e) => apply({ sort: e.target.value })} className="input md:w-52">
                        <option value="latest">Terbaru</option>
                        <option value="popular">Terpopuler</option>
                        <option value="rating">Rating Tertinggi</option>
                    </select>
                    <div className="flex gap-1">
                        <button onClick={() => setView('grid')} className={`rounded-xl border p-2.5 ${view === 'grid' ? 'border-primary text-primary' : 'border-line dark:border-ink-border'}`} aria-label="Tampilan grid"><Grid2x2 size={18} /></button>
                        <button onClick={() => setView('list')} className={`rounded-xl border p-2.5 ${view === 'list' ? 'border-primary text-primary' : 'border-line dark:border-ink-border'}`} aria-label="Tampilan list"><List size={18} /></button>
                    </div>
                </div>

                {books.data.length === 0 ? (
                    <div className="card mt-8 p-12 text-center">
                        <p className="text-lg font-bold">Belum ada buku yang cocok</p>
                        <p className="mt-1 text-muted dark:text-darkmuted">Coba ubah kata kunci atau filter kategori.</p>
                    </div>
                ) : view === 'grid' ? (
                    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {books.data.map((book) => <BookCard key={book.id} book={book} />)}
                    </div>
                ) : (
                    <div className="mt-8 space-y-3">
                        {books.data.map((book) => (
                            <Link key={book.id} href={route('books.show', book.slug)} className="card flex items-center gap-4 p-4">
                                {book.cover_path ? (
                                    <div className="flex aspect-[2/3] h-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-soft ring-1 ring-line dark:bg-ink-bg dark:ring-ink-border">
                                        <img src={`/storage/${book.cover_path}`} alt={book.title} className="h-full w-full object-contain" loading="lazy" />
                                    </div>
                                ) : (
                                    <div className="flex h-20 w-14 shrink-0 items-center justify-center rounded-lg bg-primary px-1 text-center text-[10px] font-bold text-white">{book.title}</div>
                                )}
                                <div>
                                    <p className="font-bold">{book.title}</p>
                                    <p className="text-sm text-muted dark:text-darkmuted">{book.author?.name} - {book.reader_count} dilihat</p>
                                    <p className="line-clamp-2 text-sm text-muted dark:text-darkmuted">{book.synopsis}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                <Pagination links={books.links} />
            </div>
        </AppLayout>
    );
}
