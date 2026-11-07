import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, Star } from 'lucide-react';

export default function BookCard({ book }) {
    return (
        <motion.div whileHover={{ y: -6 }} className="card overflow-hidden">
            <Link href={route('books.show', book.slug)}>
                <div className="relative flex aspect-[2/3] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-primary-dark text-white">
                    {book.cover_path ? (
                        <img src={`/storage/${book.cover_path}`} alt={book.title} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                        <div className="px-4 text-center">
                            <BookOpen className="mx-auto mb-2" size={36} />
                            <p className="font-bold leading-snug">{book.title}</p>
                            <p className="mt-1 text-xs opacity-80">{book.author?.name}</p>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <div className="mb-2 flex flex-wrap gap-1">
                        {(book.categories || []).map((c) => (
                            <span key={c.id} className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-white">{c.name}</span>
                        ))}
                    </div>
                    <h3 className="line-clamp-1 font-bold">{book.title}</h3>
                    <p className="text-sm text-muted dark:text-darkmuted">{book.author?.name}</p>
                    <div className="mt-2 flex items-center gap-1 text-sm">
                        <Star size={16} className="fill-primary text-primary" />
                        <span className="font-semibold">{book.ratings_avg_score ? Number(book.ratings_avg_score).toFixed(1) : '-'}</span>
                        <span className="text-muted dark:text-darkmuted">- {book.reader_count} pembaca</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
