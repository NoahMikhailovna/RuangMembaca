import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import GoogleAuthButton from '../../Components/GoogleAuthButton';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({ name: '', email: '', password: '', password_confirmation: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <AppLayout>
            <Head title="Daftar" />
            <div className="mx-auto max-w-md px-4 py-14">
                <div className="card p-8">
                    <h1 className="text-2xl font-extrabold">Buat Akun Baru</h1>
                    <div className="mt-6">
                        <GoogleAuthButton label="Daftar dengan Google" />
                    </div>
                    <form onSubmit={submit} className="mt-5 space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-semibold">Nama</label>
                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="input"  />
                            {errors.name && <p className="mt-1 text-sm text-primary">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold">Email</label>
                            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="input"  />
                            {errors.email && <p className="mt-1 text-sm text-primary">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold">Password</label>
                            <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="input"  />
                            {errors.password && <p className="mt-1 text-sm text-primary">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold">Konfirmasi Password</label>
                            <input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className="input"  />
                            {errors.password_confirmation && <p className="mt-1 text-sm text-primary">{errors.password_confirmation}</p>}
                        </div>

                        <button disabled={processing} className="btn-primary w-full">{processing ? 'Memproses...' : 'Daftar'}</button>
                    </form>
                    <p className="mt-4 text-center text-sm text-muted dark:text-darkmuted">Sudah punya akun? <Link href={route('login')} className="font-semibold text-primary">Masuk</Link></p>
                </div>
            </div>
        </AppLayout>
    );
}
