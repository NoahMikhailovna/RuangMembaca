import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;
    return (
        <nav className="mt-8 flex flex-wrap justify-center gap-1">
            {links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url || '#'}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${link.active ? 'bg-primary text-white' : 'bg-white text-black hover:text-primary dark:bg-ink-surface dark:text-white'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </nav>
    );
}
