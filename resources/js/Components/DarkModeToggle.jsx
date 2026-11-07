import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle() {
    const [dark, setDark] = useState(() => localStorage.getItem('ruang-membaca-theme') === 'dark');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark);
        localStorage.setItem('ruang-membaca-theme', dark ? 'dark' : 'light');
    }, [dark]);

    return (
        <button onClick={() => setDark(!dark)} className="rounded-full p-2 transition hover:bg-soft hover:text-primary dark:hover:bg-ink-surface" aria-label="Ganti tema">
            {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}
