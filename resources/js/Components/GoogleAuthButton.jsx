export default function GoogleAuthButton({ label = 'Masuk dengan Google' }) {
    return (
        <div>
            {/* Link <a> biasa (bukan Inertia Link) karena menuju redirect OAuth eksternal */}
            <a
                href={route('auth.google')}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-white px-5 py-2.5 font-semibold text-black shadow-sm transition hover:border-primary hover:text-primary active:scale-95 dark:border-ink-border dark:bg-ink-surface dark:text-white"
            >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z" />
                    <path fill="#FBBC05" d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.98 11.98 0 0 0 12 0 11.99 11.99 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
                </svg>
                {label}
            </a>
            <div className="mt-5 flex items-center gap-3" aria-hidden="true">
                <span className="h-px flex-1 bg-line dark:bg-ink-border" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted dark:text-darkmuted">atau</span>
                <span className="h-px flex-1 bg-line dark:bg-ink-border" />
            </div>
        </div>
    );
}
