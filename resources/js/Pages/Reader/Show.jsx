import { Head, router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Bookmark, ChevronLeft, ChevronRight, Maximize, Moon, NotebookPen, ZoomIn, ZoomOut } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import AppLayout from '../../Layouts/AppLayout';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export default function Show({ book, progress, bookmarks, pdfUrl }) {
    const canvasRef = useRef(null);
    const wrapRef = useRef(null);
    const [pdf, setPdf] = useState(null);
    const [page, setPage] = useState(progress?.current_page || 1);
    const [total, setTotal] = useState(progress?.total_pages || book.page_count || 0);
    const [scale, setScale] = useState(1.2);
    const [night, setNight] = useState(false);
    const [note, setNote] = useState('');
    const [loadError, setLoadError] = useState('');
    const [loading, setLoading] = useState(!!pdfUrl);

    const saveProgress = useCallback((currentPage, totalPages) => {
        router.post(route('books.progress', book.id), { current_page: currentPage, total_pages: totalPages }, { preserveScroll: true, preserveState: true });
    }, [book.id]);

    useEffect(() => {
        if (!pdfUrl) return;
        let cancelled = false;
        setLoading(true);
        setLoadError('');
        pdfjsLib.getDocument(pdfUrl).promise.then((doc) => {
            if (cancelled) return;
            setPdf(doc);
            setTotal(doc.numPages);
            setLoading(false);
        }).catch((err) => {
            if (cancelled) return;
            setLoading(false);
            setLoadError(err?.message || 'Gagal memuat file PDF.');
        });
        return () => { cancelled = true; };
    }, [pdfUrl]);

    useEffect(() => {
        if (!pdf) return;
        pdf.getPage(page).then((p) => {
            const viewport = p.getViewport({ scale });
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            p.render({ canvasContext: ctx, viewport });
        });
    }, [pdf, page, scale]);

    const goTo = (next) => {
        const target = Math.min(Math.max(1, next), total || next);
        setPage(target);
        saveProgress(target, total);
    };

    const percent = total > 0 ? Math.round((page / total) * 100) : 0;

    return (
        <AppLayout>
            <Head title={`Membaca: ${book.title}`} />
            <div className={`mx-auto max-w-5xl px-4 py-6 ${night ? 'rounded-2xl bg-ink-bg text-white' : ''}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-extrabold">{book.title}</h1>
                        <p className="text-sm text-muted dark:text-darkmuted">{book.author?.name}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setScale(Math.max(0.6, scale - 0.2))} className="btn-secondary !px-3 !py-2" aria-label="Zoom out"><ZoomOut size={18} /></button>
                        <button onClick={() => setScale(Math.min(3, scale + 0.2))} className="btn-secondary !px-3 !py-2" aria-label="Zoom in"><ZoomIn size={18} /></button>
                        <button onClick={() => setNight(!night)} className="btn-secondary !px-3 !py-2" aria-label="Mode malam"><Moon size={18} /></button>
                        <button onClick={() => wrapRef.current?.requestFullscreen()} className="btn-secondary !px-3 !py-2" aria-label="Fullscreen"><Maximize size={18} /></button>
                        <button onClick={() => router.post(route('books.bookmark', book.id), { page, label: `Halaman ${page}` }, { preserveScroll: true })} className="btn-secondary !px-3 !py-2" aria-label="Bookmark halaman ini"><Bookmark size={18} /></button>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="mb-1 flex justify-between text-sm font-semibold"><span>Halaman {page} dari {total || '-'}</span><span>{percent}%</span></div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-line dark:bg-ink-border">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
                    </div>
                </div>

                <div ref={wrapRef} className={`mt-4 flex justify-center overflow-auto rounded-2xl p-4 ${night ? 'bg-black' : 'bg-soft dark:bg-ink-surface'}`}>
                    {pdfUrl && loadError ? (
                        <div className="max-w-md py-16 text-center">
                            <p className="font-bold">PDF gagal dimuat di penampil</p>
                            <p className="mt-1 text-sm text-muted dark:text-darkmuted">{loadError}</p>
                            <a href={pdfUrl} target="_blank" rel="noreferrer" className="btn-primary mt-4 inline-flex">Buka PDF langsung</a>
                        </div>
                    ) : pdfUrl ? (
                        <div className="flex flex-col items-center">
                            {loading && <p className="py-10 text-sm font-semibold text-muted dark:text-darkmuted">Memuat PDF...</p>}
                            <canvas ref={canvasRef} className={night ? 'invert' : ''} />
                        </div>
                    ) : (
                        <div className="max-w-md py-16 text-center">
                            <p className="font-bold">File PDF belum tersedia</p>
                            <p className="mt-1 text-sm text-muted dark:text-darkmuted">Admin dapat mengunggah PDF buku ini melalui dashboard Filament. Progress, bookmark, dan catatan tetap bisa dipakai setelah PDF tersedia.</p>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-center gap-3">
                    <button onClick={() => goTo(page - 1)} disabled={page <= 1} className="btn-secondary disabled:opacity-40"><ChevronLeft size={18} /> Sebelumnya</button>
                    <button onClick={() => goTo(page + 1)} disabled={total > 0 && page >= total} className="btn-primary disabled:opacity-40">Selanjutnya <ChevronRight size={18} /></button>
                </div>

                {bookmarks?.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                        {bookmarks.map((b) => (
                            <button key={b.id} onClick={() => goTo(b.page)} className="rounded-full border border-line px-3 py-1.5 text-sm font-medium transition hover:border-primary hover:text-primary dark:border-ink-border">
                                <Bookmark size={14} className="mr-1 inline" /> Hal. {b.page}{b.label ? ` - ${b.label}` : ''}
                            </button>
                        ))}
                    </div>
                )}

                <form
                    onSubmit={(e) => { e.preventDefault(); router.post(route('books.notes.store', book.id), { page, body: note, title: `Catatan halaman ${page}` }, { preserveScroll: true, onSuccess: () => setNote('') }); }}
                    className="card mt-6 p-5"
                >
                    <label className="flex items-center gap-2 font-bold"><NotebookPen className="text-primary" size={18} /> Catatan pribadi - halaman {page}</label>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} className="input mt-3" rows={3} placeholder="Tulis catatanmu untuk halaman ini..." />
                    <button className="btn-primary mt-3" disabled={!note.trim()}>Simpan Catatan</button>
                </form>
            </div>
        </AppLayout>
    );
}
