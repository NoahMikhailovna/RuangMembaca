import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, TrendingUp, Users } from 'lucide-react';
import AppLayout from '../Layouts/AppLayout';
import BookCard from '../Components/BookCard';

function Section({ title, books }) {
    if (!books?.length) return null;
    return (
        <section className="mx-auto max-w-7xl px-4 py-8">
            <h2 className="mb-4 text-2xl font-extrabold">{title}</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {books.map((book) => <BookCard key={book.id} book={book} />)}
            </div>
        </section>
    );
}

export default function Home({ latestBooks, popularBooks, featuredBooks, recommendations, categories, stats }) {
    const [search, setSearch] = useState('');
    const submit = (e) => {
        e.preventDefault();
        router.get(route('catalog.index'), { search }, { preserveState: false });
    };

    return (
        <AppLayout>
            <Head title="Beranda" />
            <section className="bg-gradient-to-b from-soft to-white dark:from-ink-surface dark:to-ink-bg">
                <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                    <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-extrabold md:text-6xl">
                        Baca Buku Favoritmu, <span className="text-primary">Kapan Saja.</span>
                    </motion.h1>
                    <p className="mx-auto mt-4 max-w-2xl text-muted dark:text-darkmuted">Ruang Membaca adalah perpustakaan digital modern dengan reader online, bookmark, catatan pribadi, dan diskusi pembaca.</p>
                    <form onSubmit={submit} className="mx-auto mt-8 flex max-w-xl gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari judul atau penulis..." className="input !pl-10" />
                        </div>
                        <button className="btn-primary">Cari</button>
                    </form>
                    <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-4 text-center">
                        <div><BookOpen className="mx-auto text-primary" /><p className="mt-1 text-2xl font-extrabold">{stats.books}</p><p className="text-sm text-muted dark:text-darkmuted">Buku</p></div>
                        <div><Users className="mx-auto text-primary" /><p className="mt-1 text-2xl font-extrabold">{stats.users}</p><p className="text-sm text-muted dark:text-darkmuted">Pengguna</p></div>
                        <div><TrendingUp className="mx-auto text-primary" /><p className="mt-1 text-2xl font-extrabold">{stats.readers}</p><p className="text-sm text-muted dark:text-darkmuted">Total Dilihat</p></div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-6">
                <h2 className="mb-4 text-2xl font-extrabold">Kategori Buku</h2>
                <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                        <Link key={c.id} href={route('catalog.index', { category: c.slug })} className="rounded-full border border-line bg-white px-4 py-2 font-medium transition hover:border-primary hover:text-primary dark:border-ink-border dark:bg-ink-surface">
                            {c.name} <span className="text-muted dark:text-darkmuted">({c.books_count})</span>
                        </Link>
                    ))}
                </div>
            </section>

            <Section title="Buku Pilihan" books={featuredBooks} />
            <Section title="Buku Terbaru" books={latestBooks} />
            <Section title="Buku Terpopuler" books={popularBooks} />
            <Section title="Rekomendasi Untukmu" books={recommendations} />
        </AppLayout>
    );
}
