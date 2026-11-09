import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ArrowUp, Bell, BookOpen, Menu, X } from 'lucide-react';
import DarkModeToggle from '../Components/DarkModeToggle';

export default function AppLayout({ children }) {
    const { auth, unreadNotifications, flash } = usePage().props;
    const [open, setOpen] = useState(false);
    const [showTop, setShowTop] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 400);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (flash?.success) {
            setToast(flash.success);
            const t = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(t);
        }
    }, [flash]);

    const nav = [
        ['Beranda', 'home'],
        ['Katalog', 'catalog.index'],
    ];

    return (
        <div className="min-h-screen bg-white text-black transition-colors dark:bg-ink-bg dark:text-white">
            <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur dark:border-ink-border dark:bg-ink-bg/90">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
                    <Link href={auth.user ? route('home') : route('landing')} className="flex items-center gap-2 text-xl font-extrabold">
                        <span className="rounded-lg bg-primary p-1.5 text-white"><BookOpen size={20} /></span>
                        Ruang<span className="text-primary">Membaca</span>
                    </Link>
                    <nav className="hidden items-center gap-6 md:flex">
                        {nav.map(([label, name]) => (
                            <Link key={name} href={route(name)} className="font-medium transition hover:text-primary">{label}</Link>
                        ))}
                        {auth.user && (
                            <>
                                <Link href={route('favorites.index')} className="font-medium transition hover:text-primary">Favorit</Link>
                                <Link href={route('wishlist.index')} className="font-medium transition hover:text-primary">Wishlist</Link>
                                <Link href={route('bookmarks.index')} className="font-medium transition hover:text-primary">Bookmark</Link>
                                <Link href={route('history.index')} className="font-medium transition hover:text-primary">Riwayat</Link>
                                {auth.user.role === 'admin' && <Link href={route('admin.moderation')} className="font-medium transition hover:text-primary">Moderasi</Link>}
                                {auth.user.role === 'admin' && <a href="/admin" className="font-medium text-primary">Admin</a>}
                            </>
                        )}
                    </nav>
                    <div className="flex items-center gap-1">
                        <DarkModeToggle />
                        {auth.user ? (
                            <>
                                <Link href={route('notifications.index')} className="relative rounded-full p-2 transition hover:text-primary" aria-label="Notifikasi">
                                    <Bell size={20} />
                                    {unreadNotifications > 0 && <span className="absolute -right-0.5 -top-0.5 rounded-full bg-primary px-1 text-[10px] font-bold text-white">{unreadNotifications}</span>}
                                </Link>
                                <Link href={route('profile.edit')} className="shrink-0" aria-label="Profil saya">
                                    {auth.user.avatar ? <img src={auth.user.avatar.startsWith('http') ? auth.user.avatar : `/storage/${auth.user.avatar}`} alt={auth.user.name} className="h-9 w-9 rounded-full object-cover" /> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-extrabold uppercase text-white">{auth.user.name.charAt(0)}</span>}
                                </Link>
                                <Link href={route('profile.edit')} className="hidden font-semibold transition hover:text-primary sm:block">{auth.user.name}</Link>
                                <Link href={route('logout')} method="post" as="button" className="btn-secondary !px-3 !py-1.5 text-sm">Keluar</Link>
                            </>
                        ) : (
                            <>
                                <Link href={route('login')} className="btn-secondary !px-3 !py-1.5 text-sm">Masuk</Link>
                                <Link href={route('register')} className="btn-primary !px-3 !py-1.5 text-sm">Daftar</Link>
                            </>
                        )}
                        <button className="p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X size={22} /> : <Menu size={22} />}</button>
                    </div>
                </div>
                {open && (
                    <nav className="border-t border-line px-4 py-3 md:hidden dark:border-ink-border">
                        {nav.map(([label, name]) => (
                            <Link key={name} href={route(name)} className="block py-2 font-medium" onClick={() => setOpen(false)}>{label}</Link>
                        ))}
                        {auth.user && <Link href={route('bookmarks.index')} className="block py-2 font-medium">Bookmark</Link>}
                        {auth.user && <Link href={route('notes.index')} className="block py-2 font-medium">Catatan</Link>}
                    </nav>
                )}
            </header>

            <main>{children}</main>

            <footer className="mt-16 bg-black text-white">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
                    <div>
                        <p className="text-lg font-extrabold">Ruang<span className="text-primary">Membaca</span></p>
                        <p className="mt-2 text-sm text-gray-400">Perpustakaan digital modern: baca online, simpan favorit, dan diskusi seputar buku.</p>
                    </div>
                    <div>
                        <p className="font-bold">Jelajahi</p>
                        <Link href={route('catalog.index')} className="mt-2 block text-sm text-gray-400 transition hover:text-primary">Katalog Buku</Link>
                        <Link href={route('favorites.index')} className="mt-1 block text-sm text-gray-400 transition hover:text-primary">Favorit</Link>
                        <Link href={route('wishlist.index')} className="mt-1 block text-sm text-gray-400 transition hover:text-primary">Wishlist</Link>
                    </div>
                    <div>
                        <p className="font-bold">Akun</p>
                        <Link href={route('profile.edit')} className="mt-2 block text-sm text-gray-400 transition hover:text-primary">Profil</Link>
                        <Link href={route('notifications.index')} className="mt-1 block text-sm text-gray-400 transition hover:text-primary">Notifikasi</Link>
                        <Link href={route('history.index')} className="mt-1 block text-sm text-gray-400 transition hover:text-primary">Riwayat Bacaan</Link>
                        <Link href={route('notes.index')} className="mt-1 block text-sm text-gray-400 transition hover:text-primary">Catatan Saya</Link>
                    </div>
                </div>
                <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">Ruang Membaca - Perpustakaan Digital</div>
            </footer>

            {showTop && (
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 rounded-full bg-primary p-3 text-white shadow-lg transition hover:bg-primary-dark active:scale-90" aria-label="Kembali ke atas">
                    <ArrowUp size={20} />
                </button>
            )}
            {toast && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-black px-5 py-3 font-medium text-white shadow-xl dark:bg-white dark:text-black">{toast}</div>}
        </div>
    );
}
