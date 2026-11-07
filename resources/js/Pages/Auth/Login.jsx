import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import GoogleAuthButton from '../../Components/GoogleAuthButton';

export default function Login() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({ email: '', password: '', remember: false });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <AppLayout>
            <Head title="Masuk" />
            <div className="mx-auto max-w-md px-4 py-14">
                <div className="card p-8">
                    <h1 className="text-2xl font-extrabold">Masuk ke Ruang Membaca</h1>
                    {flash?.error && (
                        <p className="mt-4 rounded-xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">{flash.error}</p>
                    )}
                    <div className="mt-6">
                        <GoogleAuthButton label="Masuk dengan Google" />
                    </div>
                    <form onSubmit={submit} className="mt-5 space-y-4">
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
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2"><input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} /> Ingat saya</label>
                            <Link href={route('password.request')} className="font-semibold text-primary">Lupa password?</Link>
                        </div>

                        <button disabled={processing} className="btn-primary w-full">{processing ? 'Memproses...' : 'Masuk'}</button>
                    </form>
                    <p className="mt-4 text-center text-sm text-muted dark:text-darkmuted">Belum punya akun? <Link href={route('register')} className="font-semibold text-primary">Daftar</Link></p>
                </div>
            </div>
        </AppLayout>
    );
}
