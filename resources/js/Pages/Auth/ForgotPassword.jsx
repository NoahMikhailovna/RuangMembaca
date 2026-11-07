import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function ForgotPassword() {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AppLayout>
            <Head title="Lupa Password" />
            <div className="mx-auto max-w-md px-4 py-14">
                <div className="card p-8">
                    <h1 className="text-2xl font-extrabold">Reset Password</h1>
                    <form onSubmit={submit} className="mt-6 space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-semibold">Email</label>
                            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="input"  />
                            {errors.email && <p className="mt-1 text-sm text-primary">{errors.email}</p>}
                        </div>

                        <button disabled={processing} className="btn-primary w-full">{processing ? 'Memproses...' : 'Kirim Tautan Reset'}</button>
                    </form>

                </div>
            </div>
        </AppLayout>
    );
}
