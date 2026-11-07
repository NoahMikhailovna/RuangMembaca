import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { BookOpen, Bookmark, Download, Heart, MessageCircle, ShoppingBag } from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';
import BookCard from '../../Components/BookCard';
import StarRating from '../../Components/StarRating';

export default function Show({ book, userState, related }) {
    const { auth } = usePage().props;
    const reviewForm = useForm({ body: '' });
    const commentForm = useForm({ body: '' });

    const post = (name, params) => router.post(route(name, params), {}, { preserveScroll: true });

    return (
        <AppLayout>
            <Head title={book.title} />
            <div className="mx-auto max-w-7xl px-4 py-10">
                <div className="grid gap-8 md:grid-cols-[280px_1fr]">
                    <div className="card flex aspect-[2/3] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-primary-dark text-white">
                        {book.cover_path ? <img src={`/storage/${book.cover_path}`} alt={book.title} className="h-full w-full object-cover" /> : (
                            <div className="px-6 text-center">
                                <BookOpen className="mx-auto mb-3" size={48} />
                                <p className="text-xl font-extrabold">{book.title}</p>
                                <p className="mt-1 text-sm opacity-80">{book.author?.name}</p>
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex flex-wrap gap-1">
                            {(book.categories || []).map((c) => <span key={c.id} className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-white">{c.name}</span>)}
                        </div>
                        <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">{book.title}</h1>
                        <p className="mt-1 text-lg text-muted dark:text-darkmuted">{book.author?.name} - {book.published_year} - {book.page_count} halaman</p>
                        <div className="mt-3 flex items-center gap-4">
                            <StarRating book={book} value={userState?.myRating || Math.round(book.ratings_avg_score || 0)} />
                            <span className="font-semibold">{book.ratings_avg_score ? Number(book.ratings_avg_score).toFixed(1) : '-'}/5</span>
                            <span className="text-muted dark:text-darkmuted">{book.reader_count} pembaca - {book.ratings_count} rating</span>
                        </div>
                        <p className="mt-5 leading-relaxed text-muted dark:text-darkmuted">{book.synopsis}</p>

                        <div className="mt-6 flex flex-wrap gap-2">
                            {auth.user ? (
                                <Link href={route('reader.show', book.slug)} className="btn-primary"><BookOpen size={18} /> Baca Buku</Link>
                            ) : (
                                <Link href={route('login')} className="btn-primary"><BookOpen size={18} /> Masuk untuk Membaca</Link>
                            )}
                            {book.pdf_path && <a href={route('books.download', book.slug)} className="btn-secondary"><Download size={18} /> Download PDF</a>}
                            {auth.user && (
                                <>
                                    <button onClick={() => post('books.favorite', book.id)} className={`btn-secondary ${userState?.isFavorite ? '!border-primary !text-primary' : ''}`}><Heart size={18} /> Favorit</button>
                                    <button onClick={() => post('books.wishlist', book.id)} className={`btn-secondary ${userState?.isWishlist ? '!border-primary !text-primary' : ''}`}><ShoppingBag size={18} /> Wishlist</button>
                                </>
                            )}
                        </div>
                        {userState?.progress && (
                            <div className="mt-6 max-w-md">
                                <p className="mb-1 text-sm font-semibold">Progress membaca: {Number(userState.progress.progress_percent).toFixed(0)}% (halaman {userState.progress.current_page})</p>
                                <div className="h-2.5 overflow-hidden rounded-full bg-line dark:bg-ink-border">
                                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${userState.progress.progress_percent}%` }} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {auth.user && (
                    <section className="card mt-10 p-6">
                        <h2 className="text-xl font-extrabold">Tulis Ulasan</h2>
                        <form onSubmit={(e) => { e.preventDefault(); reviewForm.post(route('books.reviews.store', book.id), { preserveScroll: true, onSuccess: () => reviewForm.reset() }); }} className="mt-3">
                            <textarea value={reviewForm.data.body} onChange={(e) => reviewForm.setData('body', e.target.value)} className="input" rows={3} placeholder="Bagikan pendapatmu tentang buku ini..." />
                            <button className="btn-primary mt-3" disabled={reviewForm.processing}>Kirim Ulasan</button>
                        </form>
                        <div className="mt-6 space-y-4">
                            {(book.reviews || []).filter((r) => r.status === 'approved').map((r) => (
                                <div key={r.id} className="border-b border-line pb-3 dark:border-ink-border">
                                    <p className="font-semibold">{r.user?.name}</p>
                                    <p className="text-muted dark:text-darkmuted">{r.body}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section className="card mt-6 p-6">
                    <h2 className="flex items-center gap-2 text-xl font-extrabold"><MessageCircle className="text-primary" /> Diskusi</h2>
                    {auth.user && (
                        <form onSubmit={(e) => { e.preventDefault(); commentForm.post(route('books.comments.store', book.id), { preserveScroll: true, onSuccess: () => commentForm.reset() }); }} className="mt-3 flex gap-2">
                            <input value={commentForm.data.body} onChange={(e) => commentForm.setData('body', e.target.value)} className="input" placeholder="Tulis komentar..." />
                            <button className="btn-primary" disabled={commentForm.processing}>Kirim</button>
                        </form>
                    )}
                    <div className="mt-5 space-y-5">
                        {(book.comments || []).filter((c) => c.status === 'approved').map((c) => (
                            <CommentItem key={c.id} comment={c} canReply={!!auth.user} />
                        ))}
                    </div>
                </section>

                {related?.length > 0 && (
                    <section className="mt-10">
                        <h2 className="mb-4 text-2xl font-extrabold">Buku Terkait</h2>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {related.map((b) => <BookCard key={b.id} book={b} />)}
                        </div>
                    </section>
                )}
            </div>
        </AppLayout>
    );
}

function CommentItem({ comment, canReply }) {
    const replyForm = useForm({ body: '' });
    return (
        <div className="border-b border-line pb-4 dark:border-ink-border">
            <p className="font-semibold">{comment.user?.name}</p>
            <p className="text-muted dark:text-darkmuted">{comment.body}</p>
            <div className="ml-6 mt-3 space-y-2">
                {(comment.replies || []).filter((r) => r.status === 'approved').map((r) => (
                    <div key={r.id}>
                        <p className="text-sm font-semibold">{r.user?.name}</p>
                        <p className="text-sm text-muted dark:text-darkmuted">{r.body}</p>
                    </div>
                ))}
                {canReply && (
                    <form onSubmit={(e) => { e.preventDefault(); replyForm.post(route('comments.reply', comment.id), { preserveScroll: true, onSuccess: () => replyForm.reset() }); }} className="flex gap-2">
                        <input value={replyForm.data.body} onChange={(e) => replyForm.setData('body', e.target.value)} className="input !py-1.5 text-sm" placeholder="Balas komentar..." />
                        <button className="btn-secondary !px-3 !py-1.5 text-sm">Balas</button>
                    </form>
                )}
            </div>
        </div>
    );
}
