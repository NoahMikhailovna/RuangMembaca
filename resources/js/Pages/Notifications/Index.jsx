import { Head, router } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';

export default function Index({ notifications }) {
    return (
        <AppLayout>
            <Head title="Notifikasi" />
            <div className="mx-auto max-w-4xl px-4 py-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-extrabold">Notifikasi</h1>
                    <button onClick={() => router.post(route('notifications.readAll'))} className="btn-secondary text-sm">Tandai Semua Dibaca</button>
                </div>
                {notifications.data.length === 0 ? (
                    <div className="card mt-8 p-12 text-center">
                        <p className="text-lg font-bold">Tidak ada notifikasi</p>
                        <p className="mt-1 text-muted dark:text-darkmuted">Balasan komentar akan muncul di sini.</p>
                    </div>
                ) : (
                    <div className="mt-8 space-y-3">
                        {notifications.data.map((n) => (
                            <button key={n.id} onClick={() => router.post(route('notifications.read', n.id), {}, { preserveScroll: true })} className={`card flex w-full items-start gap-3 p-4 text-left ${n.read_at ? 'opacity-70' : ''}`}>
                                <Bell className="mt-0.5 shrink-0 text-primary" size={20} />
                                <span>
                                    <span className="block font-semibold">{n.data?.message || 'Notifikasi baru'}</span>
                                    <span className="text-sm text-muted dark:text-darkmuted">{new Date(n.created_at).toLocaleString('id-ID')}</span>
                                </span>
                                {!n.read_at && <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">Baru</span>}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
