import { useEffect, useRef, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Camera } from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';

const avatarUrl = (avatar) => (avatar && avatar.startsWith('http') ? avatar : `/storage/${avatar}`);

export default function Edit({ user }) {
    const profile = useForm({ _method: 'patch', name: user.name, email: user.email, bio: user.bio || '', phone: user.phone || '', avatar: null });
    const avatarInput = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        if (!avatarPreview) return undefined;
        return () => URL.revokeObjectURL(avatarPreview);
    }, [avatarPreview]);

    const password = useForm({ current_password: '', password: '', password_confirmation: '' });
    const deleteAccount = useForm({ password: '' });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0] || null;
        profile.setData('avatar', file);
        setAvatarPreview(file ? URL.createObjectURL(file) : null);
    };

    return (
        <AppLayout>
            <Head title="Profil" />
            <div className="mx-auto max-w-3xl px-4 py-10">
                <h1 className="text-3xl font-extrabold">Profil Pengguna</h1>
                <div className="mt-6 flex flex-wrap gap-2">
                    <Link href={route('notes.index')} className="btn-secondary">Catatan Saya</Link>
                    <Link href={route('bookmarks.index')} className="btn-secondary">Bookmark</Link>
                    <Link href={route('history.index')} className="btn-secondary">Riwayat Bacaan</Link>
                    <Link href={route('favorites.index')} className="btn-secondary">Favorit</Link>
                    <Link href={route('wishlist.index')} className="btn-secondary">Wishlist</Link>
                </div>
                <div className="card mt-8 p-6">
                    <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                            {avatarPreview || user.avatar ? <img src={avatarPreview || avatarUrl(user.avatar)} alt={user.name} className="h-20 w-20 rounded-full object-cover" /> : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-extrabold text-white">{user.name.charAt(0)}</div>
                            )}
                            <button type="button" onClick={() => avatarInput.current?.click()} title="Ganti foto profil" aria-label="Ganti foto profil" className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow transition hover:opacity-90">
                                <Camera size={14} />
                            </button>
                            <input ref={avatarInput} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </div>
                        <div>
                            <p className="text-lg font-bold">{user.name}</p>
                            <p className="text-muted dark:text-darkmuted">{user.email} - {user.role}</p>
                        </div>
                    </div>
                    <form
                        onSubmit={(e) => { e.preventDefault(); profile.post(route('profile.update')); }}
                        className="mt-6 grid gap-4 md:grid-cols-2"
                        encType="multipart/form-data"
                    >
                        <div><label className="mb-1 block text-sm font-semibold">Nama</label><input value={profile.data.name} onChange={(e) => profile.setData('name', e.target.value)} className="input" />{profile.errors.name && <p className="mt-1 text-sm text-red-600">{profile.errors.name}</p>}</div>
                        <div><label className="mb-1 block text-sm font-semibold">Email</label><input type="email" value={profile.data.email} onChange={(e) => profile.setData('email', e.target.value)} className="input" />{profile.errors.email && <p className="mt-1 text-sm text-red-600">{profile.errors.email}</p>}</div>
                        <div><label className="mb-1 block text-sm font-semibold">Telepon</label><input value={profile.data.phone} onChange={(e) => profile.setData('phone', e.target.value)} className="input" />{profile.errors.phone && <p className="mt-1 text-sm text-red-600">{profile.errors.phone}</p>}</div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold">Foto Profil</label>
                            <p className="text-sm text-muted dark:text-darkmuted">Klik ikon kamera pada foto profil untuk mengganti. JPG/PNG/WebP, maks 5 MB.{profile.data.avatar ? ` File terpilih: ${profile.data.avatar.name}` : ''}</p>
                            {profile.errors.avatar && <p className="mt-1 text-sm text-red-600">{profile.errors.avatar}</p>}
                        </div>
                        <div className="md:col-span-2"><label className="mb-1 block text-sm font-semibold">Bio</label><textarea value={profile.data.bio} onChange={(e) => profile.setData('bio', e.target.value)} className="input" rows={3} />{profile.errors.bio && <p className="mt-1 text-sm text-red-600">{profile.errors.bio}</p>}</div>
                        <div className="md:col-span-2"><button className="btn-primary" disabled={profile.processing}>{profile.processing ? 'Menyimpan...' : 'Simpan Profil'}</button></div>
                    </form>
                </div>

                <div className="card mt-6 p-6">
                    <h2 className="text-xl font-extrabold">Ubah Password</h2>
                    <form
                        onSubmit={(e) => { e.preventDefault(); password.put(route('profile.password'), { onSuccess: () => password.reset() }); }}
                        className="mt-4 grid gap-4 md:grid-cols-3"
                    >
                        <div><label className="mb-1 block text-sm font-semibold">Password Saat Ini</label><input type="password" value={password.data.current_password} onChange={(e) => password.setData('current_password', e.target.value)} className="input" /></div>
                        <div><label className="mb-1 block text-sm font-semibold">Password Baru</label><input type="password" value={password.data.password} onChange={(e) => password.setData('password', e.target.value)} className="input" /></div>
                        <div><label className="mb-1 block text-sm font-semibold">Konfirmasi</label><input type="password" value={password.data.password_confirmation} onChange={(e) => password.setData('password_confirmation', e.target.value)} className="input" /></div>
                        <div className="md:col-span-3"><button className="btn-primary" disabled={password.processing}>Ubah Password</button></div>
                    </form>
                </div>

                <div className="card mt-6 border-red-300 p-6 dark:border-red-900">
                    <h2 className="text-xl font-extrabold text-red-600">Hapus Akun</h2>
                    <p className="mt-1 text-sm text-muted dark:text-darkmuted">Akunmu beserta seluruh data bacaan, catatan, bookmark, dan ulasan akan dihapus permanen dan tidak dapat dikembalikan. Masukkan password untuk konfirmasi.</p>
                    <form
                        onSubmit={(e) => { e.preventDefault(); deleteAccount.delete(route('profile.destroy')); }}
                        className="mt-4 flex flex-wrap items-end gap-3"
                    >
                        <div>
                            <label className="mb-1 block text-sm font-semibold">Password</label>
                            <input type="password" value={deleteAccount.data.password} onChange={(e) => deleteAccount.setData('password', e.target.value)} className="input" placeholder="Password saat ini" />
                            {deleteAccount.errors.password && <p className="mt-1 text-sm text-red-600">{deleteAccount.errors.password}</p>}
                        </div>
                        <button className="btn-primary !bg-red-600 hover:!bg-red-700" disabled={deleteAccount.processing || !deleteAccount.data.password}>Hapus Akun</button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
