import { Head, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

function ModerationList({ title, items, routeName }) {
    return (
        <section className="card mt-8 p-6">
            <h2 className="text-xl font-extrabold">{title}</h2>
            <div className="mt-4 space-y-3">
                {items.data.map((item) => (
                    <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3 dark:border-ink-border">
                        <div className="max-w-xl">
                            <p className="font-semibold">{item.user?.name} - {item.book?.title}</p>
                            <p className="text-sm text-muted dark:text-darkmuted">{item.body}</p>
                            <span className="mt-1 inline-block rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">{item.status}</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => router.patch(route(routeName, item.id), { status: 'approved' }, { preserveScroll: true })} className="btn-primary !px-3 !py-1.5 text-sm">Setujui</button>
                            <button onClick={() => router.patch(route(routeName, item.id), { status: 'rejected' }, { preserveScroll: true })} className="btn-secondary !px-3 !py-1.5 text-sm">Tolak</button>
                        </div>
                    </div>
                ))}
                {items.data.length === 0 && <p className="text-muted dark:text-darkmuted">Tidak ada data.</p>}
            </div>
        </section>
    );
}

export default function Moderation({ comments, reviews, stats }) {
    const activity = stats.readingActivity || [];
    const maxActivity = activity.reduce((max, a) => Math.max(max, a.total), 0);

    return (
        <AppLayout>
            <Head title="Moderasi" />
            <div className="mx-auto max-w-6xl px-4 py-10">
                <h1 className="text-3xl font-extrabold">Moderasi Komentar dan Ulasan</h1>
                <p className="mt-1 text-muted dark:text-darkmuted">CRUD lengkap buku, kategori, penulis, dan pengguna tersedia di dashboard Filament: <a href="/admin" className="font-semibold text-primary">/admin</a></p>
                <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[['Total Buku', stats.books], ['Total Pengguna', stats.users], ['Total Dilihat', stats.readers], ['Buku Terpopuler', stats.popularBooks?.[0]?.title || '-']].map(([label, value]) => (
                        <div key={label} className="card p-5">
                            <p className="text-sm text-muted dark:text-darkmuted">{label}</p>
                            <p className="mt-1 line-clamp-1 text-2xl font-extrabold">{value}</p>
                        </div>
                    ))}
                </div>
                <section className="card mt-8 p-6">
                    <h2 className="text-xl font-extrabold">Aktivitas Membaca (30 Hari Terakhir)</h2>
                    {activity.length === 0 ? <p className="mt-4 text-muted dark:text-darkmuted">Belum ada aktivitas membaca tercatat.</p> : (
                        <>
                            <div className="mt-6 flex h-40 items-end gap-1">
                                {activity.map((a) => (
                                    <div
                                        key={a.date}
                                        className="flex-1 rounded-t bg-primary"
                                        style={{ height: `${maxActivity > 0 ? Math.max(4, (a.total / maxActivity) * 100) : 0}%` }}
                                        title={`${a.date}: ${a.total} aktivitas`}
                                    />
                                ))}
                            </div>
                            <div className="mt-3 space-y-1 border-t border-line pt-3 dark:border-ink-border">
                                {activity.slice(-5).reverse().map((a) => (
                                    <p key={a.date} className="flex justify-between text-sm text-muted dark:text-darkmuted">
                                        <span>{new Date(`${a.date}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        <span className="font-semibold text-black dark:text-white">{a.total} aktivitas</span>
                                    </p>
                                ))}
                            </div>
                        </>
                    )}
                </section>
                <ModerationList title="Komentar" items={comments} routeName="admin.moderation.comment" />
                <ModerationList title="Ulasan" items={reviews} routeName="admin.moderation.review" />
            </div>
        </AppLayout>
    );
}
