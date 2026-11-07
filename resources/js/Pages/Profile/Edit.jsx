import { Head, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function Edit({ user }) {
    const profile = useForm({ name: user.name, email: user.email, bio: user.bio || '', phone: user.phone || '', avatar: null });
    const password = useForm({ current_password: '', password: '', password_confirmation: '' });

    return (
        <AppLayout>
            <Head title="Profil" />
            <div className="mx-auto max-w-3xl px-4 py-10">
                <h1 className="text-3xl font-extrabold">Profil Pengguna</h1>
                <div className="card mt-8 p-6">
                    <div className="flex items-center gap-4">
                        {user.avatar ? <img src={`/storage/${user.avatar}`} alt={user.name} className="h-20 w-20 rounded-full object-cover" /> : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-extrabold text-white">{user.name.charAt(0)}</div>
                        )}
                        <div>
                            <p className="text-lg font-bold">{user.name}</p>
                            <p className="text-muted dark:text-darkmuted">{user.email} - {user.role}</p>
                        </div>
                    </div>
                    <form
                        onSubmit={(e) => { e.preventDefault(); profile.transform((d) => ({ ...d, _method: 'patch' })).post(route('profile.update')); }}
                        className="mt-6 grid gap-4 md:grid-cols-2"
                        encType="multipart/form-data"
                    >
                        <div><label className="mb-1 block text-sm font-semibold">Nama</label><input value={profile.data.name} onChange={(e) => profile.setData('name', e.target.value)} className="input" /></div>
                        <div><label className="mb-1 block text-sm font-semibold">Email</label><input type="email" value={profile.data.email} onChange={(e) => profile.setData('email', e.target.value)} className="input" /></div>
                        <div><label className="mb-1 block text-sm font-semibold">Telepon</label><input value={profile.data.phone} onChange={(e) => profile.setData('phone', e.target.value)} className="input" /></div>
                        <div><label className="mb-1 block text-sm font-semibold">Foto Profil</label><input type="file" accept="image/*" onChange={(e) => profile.setData('avatar', e.target.files[0])} className="input" /></div>
                        <div className="md:col-span-2"><label className="mb-1 block text-sm font-semibold">Bio</label><textarea value={profile.data.bio} onChange={(e) => profile.setData('bio', e.target.value)} className="input" rows={3} /></div>
                        <div className="md:col-span-2"><button className="btn-primary" disabled={profile.processing}>Simpan Profil</button></div>
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
            </div>
        </AppLayout>
    );
}
