import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight, BookOpen, BookmarkCheck, FileText, Heart, Library, Moon,
    MessagesSquare, NotebookPen, PenLine, Search, TrendingUp, UserPlus, Users,
} from 'lucide-react';
import DarkModeToggle from '../Components/DarkModeToggle';
import BookCard from '../Components/BookCard';
import QuotesCarousel from '../Components/QuotesCarousel';
import DotBook from '../Components/DotBook';

function Reveal({ children, className = '', delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

const FEATURES = [
    { icon: FileText, title: 'Baca PDF Online', desc: 'Buka dan baca buku langsung dari browser dengan penampil PDF bawaan — tanpa unduh, tanpa aplikasi tambahan.' },
    { icon: BookmarkCheck, title: 'Progress & Bookmark Halaman', desc: 'Progres bacaanmu tersimpan otomatis dan halaman penting bisa ditandai untuk dilanjutkan kapan saja.' },
    { icon: NotebookPen, title: 'Catatan Pribadi', desc: 'Tulis catatan di setiap buku yang kamu baca dan temukan lagi dengan mudah di rak catatanmu.' },
    { icon: Heart, title: 'Favorit & Wishlist', desc: 'Simpan buku kesukaanmu sebagai favorit dan buat daftar bacaan berikutnya di wishlist.' },
    { icon: MessagesSquare, title: 'Ulasan & Diskusi', desc: 'Beri rating dan ulasan, lalu berdiskusi dengan pembaca lain lewat komentar dan balasan.' },
    { icon: Moon, title: 'Mode Gelap', desc: 'Baca lebih nyaman di malam hari dengan mode gelap yang tersimpan mengikuti preferensimu.' },
];

const STEPS = [
    { icon: UserPlus, title: 'Buat akun gratis', desc: 'Daftar dalam hitungan detik hanya dengan nama, email, dan kata sandi.' },
    { icon: Search, title: 'Pilih buku', desc: 'Jelajahi katalog, cari judul favoritmu, atau mulai dari koleksi unggulan.' },
    { icon: TrendingUp, title: 'Baca & tandai progresmu', desc: 'Baca langsung di website — progres, bookmark, dan catatanmu tersimpan otomatis.' },
];

export default function Landing({ featuredBooks, categories, stats }) {
    const { auth } = usePage().props;
    const isLoggedIn = !!auth.user;

    return (
        <div className="min-h-screen bg-white text-black transition-colors dark:bg-ink-bg dark:text-white">
            <Head title="Ruang Membaca - Perpustakaan Digital" />

            <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur dark:border-ink-border dark:bg-ink-bg/90">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
                    <Link href={route('landing')} className="flex items-center gap-2 text-xl font-extrabold">
                        <span className="rounded-lg bg-primary p-1.5 text-white"><BookOpen size={20} /></span>
                        Ruang<span className="text-primary">Membaca</span>
                    </Link>
                    <nav className="hidden items-center gap-6 md:flex">
                        <a href="#fitur" className="font-medium transition hover:text-primary">Fitur</a>
                        <a href="#koleksi" className="font-medium transition hover:text-primary">Koleksi</a>
                        <a href="#tentang" className="font-medium transition hover:text-primary">Tentang</a>
                    </nav>
                    <div className="flex items-center gap-1">
                        <DarkModeToggle />
                        {!isLoggedIn && <Link href={route('login')} className="btn-secondary !px-3 !py-1.5 text-sm">Masuk</Link>}
                        <Link href={route('home')} className="btn-primary !px-3 !py-1.5 text-sm">
                            {isLoggedIn ? 'Ke Beranda' : 'Mulai Membaca'}
                        </Link>
                    </div>
                </div>
            </header>

            <main>
                <section id="beranda-hero" className="relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-soft to-white dark:from-ink-surface dark:to-ink-bg">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0"
                        style={{
                            backgroundImage: 'radial-gradient(rgba(128,128,128,0.16) 1.2px, transparent 1.2px)',
                            backgroundSize: '24px 24px',
                            maskImage: 'radial-gradient(ellipse 90% 85% at 50% 15%, black 25%, transparent 78%)',
                            WebkitMaskImage: 'radial-gradient(ellipse 90% 85% at 50% 15%, black 25%, transparent 78%)',
                        }}
                    />
                    <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                    <div aria-hidden="true" className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                    <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:gap-14 lg:py-20">
                        <div className="text-center lg:text-left">
                            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                                Perpustakaan Digital Indonesia
                            </motion.span>
                            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mx-auto mt-6 max-w-xl text-4xl font-extrabold leading-tight md:text-5xl lg:mx-0 lg:text-6xl">
                                Buka Buku, Buka Dunia. <span className="text-primary">Baca Langsung dari Browsermu.</span>
                            </motion.h1>
                            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mx-auto mt-5 max-w-xl text-lg text-muted dark:text-darkmuted lg:mx-0">
                                Ruang Membaca menghadirkan koleksi buku yang bisa dibaca online dengan progres tersimpan, bookmark, catatan pribadi, dan diskusi antar pembaca — semua dalam satu tempat.
                            </motion.p>
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                                <Link href={route('home')} className="btn-primary px-6 py-3 text-base">
                                    {isLoggedIn ? 'Ke Beranda' : 'Mulai Membaca'} <ArrowRight size={18} />
                                </Link>
                                <Link href={route('catalog.index')} className="btn-secondary px-6 py-3 text-base">Lihat Katalog</Link>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-x-4 gap-y-6 lg:mx-0">
                                <div className="flex flex-col items-center lg:items-start"><BookOpen className="text-primary" size={20} /><p className="mt-1 text-xl font-extrabold sm:text-2xl">{stats.books}</p><p className="text-sm text-muted dark:text-darkmuted">Buku</p></div>
                                <div className="flex flex-col items-center lg:items-start"><PenLine className="text-primary" size={20} /><p className="mt-1 text-xl font-extrabold sm:text-2xl">{stats.authors}</p><p className="text-sm text-muted dark:text-darkmuted">Penulis</p></div>
                                <div className="flex flex-col items-center lg:items-start"><Library className="text-primary" size={20} /><p className="mt-1 text-xl font-extrabold sm:text-2xl">{stats.categories}</p><p className="text-sm text-muted dark:text-darkmuted">Kategori</p></div>
                                <div className="flex flex-col items-center lg:items-start"><Users className="text-primary" size={20} /><p className="mt-1 text-xl font-extrabold sm:text-2xl">{stats.users}</p><p className="text-sm text-muted dark:text-darkmuted">Pengguna</p></div>
                                <div className="flex flex-col items-center lg:items-start"><TrendingUp className="text-primary" size={20} /><p className="mt-1 text-xl font-extrabold sm:text-2xl">{stats.readers}</p><p className="text-sm text-muted dark:text-darkmuted">Total Pembaca</p></div>
                            </motion.div>
                        </div>
                        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }} className="relative mx-auto w-full max-w-md px-3 sm:px-6 lg:max-w-none lg:px-2">
                            <DotBook />
                        </motion.div>
                    </div>
                </section>

                <QuotesCarousel variant="section" />

                <section id="fitur" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16">
                    <Reveal>
                        <h2 className="text-center text-3xl font-extrabold">Semua yang Kamu Butuhkan untuk <span className="text-primary">Membaca Lebih Baik</span></h2>
                        <p className="mx-auto mt-3 max-w-2xl text-center text-muted dark:text-darkmuted">Fitur-fitur ini benar-benar bekerja di Ruang Membaca — bukan sekadar pajangan.</p>
                    </Reveal>
                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {FEATURES.map((f, i) => (
                            <Reveal key={f.title} delay={(i % 3) * 0.08}>
                                <div className="card h-full p-6">
                                    <span className="inline-block rounded-xl bg-primary/10 p-3 text-primary"><f.icon size={24} /></span>
                                    <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted dark:text-darkmuted">{f.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {featuredBooks?.length > 0 && (
                    <section id="koleksi" className="scroll-mt-24 bg-soft py-16 dark:bg-ink-surface">
                        <div className="mx-auto max-w-7xl px-4">
                            <Reveal>
                                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                                    <div>
                                        <h2 className="text-3xl font-extrabold">Koleksi Unggulan</h2>
                                        <p className="mt-2 text-muted dark:text-darkmuted">Buku-buku dengan pembaca terbanyak di Ruang Membaca.</p>
                                    </div>
                                    <Link href={route('catalog.index')} className="font-semibold text-primary transition hover:text-primary-dark">Lihat Semua <ArrowRight size={16} className="inline" /></Link>
                                </div>
                            </Reveal>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                {featuredBooks.map((book) => <BookCard key={book.id} book={book} />)}
                            </div>
                        </div>
                    </section>
                )}

                {categories?.length > 0 && (
                    <section className="mx-auto max-w-7xl px-4 py-16">
                        <Reveal>
                            <h2 className="mb-6 text-center text-3xl font-extrabold">Jelajahi Berdasarkan Kategori</h2>
                            <div className="flex flex-wrap justify-center gap-2">
                                {categories.map((c) => (
                                    <Link key={c.id} href={route('catalog.index', { category: c.slug })} className="rounded-full border border-line bg-white px-4 py-2 font-medium transition hover:border-primary hover:text-primary dark:border-ink-border dark:bg-ink-surface">
                                        {c.name} <span className="text-muted dark:text-darkmuted">({c.books_count})</span>
                                    </Link>
                                ))}
                            </div>
                        </Reveal>
                    </section>
                )}

                <section className="mx-auto max-w-7xl px-4 py-16">
                    <Reveal>
                        <h2 className="text-center text-3xl font-extrabold">Mulai dalam 3 Langkah</h2>
                    </Reveal>
                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {STEPS.map((s, i) => (
                            <Reveal key={s.title} delay={i * 0.1}>
                                <div className="card relative h-full p-6 text-center">
                                    <span className="absolute right-5 top-4 text-5xl font-extrabold text-primary/10">{i + 1}</span>
                                    <span className="inline-block rounded-full bg-primary p-3.5 text-white"><s.icon size={24} /></span>
                                    <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted dark:text-darkmuted">{s.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                <section id="tentang" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-20">
                    <Reveal>
                        <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-muted dark:text-darkmuted">
                            <span className="font-bold text-black dark:text-white">Ruang Membaca</span> adalah perpustakaan digital modern berbahasa Indonesia. Kami percaya membaca harus semudah membuka browser: koleksi buku bisa dibaca langsung secara online, progresmu tersimpan otomatis, dan kamu bisa berbagi ulasan dengan sesama pembaca — kapan saja, di mana saja, gratis.
                        </p>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <div className="mt-12 rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-black px-6 py-14 text-center text-white shadow-xl">
                            <h2 className="text-3xl font-extrabold md:text-4xl">Siap mulai membaca?</h2>
                            <p className="mx-auto mt-3 max-w-xl text-white/80">Ribuan halaman menunggumu. Masuk ke beranda dan temukan bacaan pertamamu hari ini.</p>
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                                <Link href={route('home')} className="rounded-xl bg-white px-6 py-3 font-bold text-primary transition hover:bg-soft active:scale-95">
                                    {isLoggedIn ? 'Ke Beranda' : 'Mulai Membaca'}
                                </Link>
                                {!isLoggedIn && <Link href={route('register')} className="rounded-xl border border-white/60 px-6 py-3 font-bold text-white transition hover:bg-white/10 active:scale-95">Daftar Gratis</Link>}
                            </div>
                        </div>
                    </Reveal>
                </section>
            </main>

            <footer className="bg-black text-white">
                <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 text-center">
                    <p className="flex items-center gap-2 text-lg font-extrabold">
                        <span className="rounded-lg bg-primary p-1.5 text-white"><BookOpen size={18} /></span>
                        Ruang<span className="text-primary">Membaca</span>
                    </p>
                    <p className="max-w-md text-sm text-gray-400">Perpustakaan digital modern: baca online, simpan favorit, dan diskusi seputar buku.</p>
                    <nav className="flex flex-wrap justify-center gap-6 text-sm">
                        <Link href={route('catalog.index')} className="text-gray-300 transition hover:text-primary">Katalog</Link>
                        <Link href={route('login')} className="text-gray-300 transition hover:text-primary">Masuk</Link>
                        <Link href={route('register')} className="text-gray-300 transition hover:text-primary">Daftar</Link>
                    </nav>
                    <p className="text-xs text-gray-500">&copy; 2026 Ruang Membaca - Perpustakaan Digital</p>
                </div>
            </footer>
        </div>
    );
}
