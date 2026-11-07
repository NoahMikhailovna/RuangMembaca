import { router } from '@inertiajs/react';
import { Star } from 'lucide-react';

export default function StarRating({ book, value = 0 }) {
    const rate = (score) => router.post(route('books.rating', book.id), { score }, { preserveScroll: true });
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((score) => (
                <button key={score} onClick={() => rate(score)} aria-label={`Beri ${score} bintang`} className="transition hover:scale-110 active:scale-90">
                    <Star size={26} className={score <= value ? 'fill-primary text-primary' : 'text-muted'} />
                </button>
            ))}
        </div>
    );
}
