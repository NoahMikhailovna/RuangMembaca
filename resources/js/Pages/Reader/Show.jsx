import { Head, router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Bookmark, ChevronLeft, ChevronRight, Maximize, Moon, NotebookPen, Trash2, ZoomIn, ZoomOut } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import AppLayout from '../../Layouts/AppLayout';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export default function Show({ book, progress, startPage, bookmarks, notes, pdfUrl }) {
    const canvasRef = useRef(null);
    const wrapRef = useRef(null);
    const [pdf, setPdf] = useState(null);
    const [page, setPage] = useState(startPage || progress?.current_page || 1);
    const [total, setTotal] = useState(progress?.total_pages || book.page_count || 0);
    const [scale, setScale] = useState(1.2);
    const [night, setNight] = useState(false);
    const [note, setNote] = useState('');
    const [loadError, setLoadError] = useState('');
    const [loading, setLoading] = useState(!!pdfUrl);
    const [mode, setMode] = useState(() => {
        try {
            return localStorage.getItem('reader-mode') === 'scroll' ? 'scroll' : 'single';
        } catch {
            return 'single';
        }
    });
    const [jump, setJump] = useState('');
    const [pageSize, setPageSize] = useState(null);

    const pdfRef = useRef(null);
    const scaleRef = useRef(scale);
    const pageRef = useRef(page);
    const wrapRefs = useRef(new Map());
    const canvasRefs = useRef(new Map());
    const renderedRef = useRef({});
    const nearRef = useRef(new Set());
    const programmaticRef = useRef(false);
    const programmaticTimer = useRef(null);
    const saveTimer = useRef(null);

    scaleRef.current = scale;
    pageRef.current = page;
    pdfRef.current = pdf;

    const saveProgress = useCallback((currentPage, totalPages) => {
        router.post(route('books.progress', book.id), { current_page: currentPage, total_pages: totalPages }, { preserveScroll: true, preserveState: true });
    }, [book.id]);

    const queueSave = useCallback((currentPage, totalPages) => {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => saveProgress(currentPage, totalPages), 600);
    }, [saveProgress]);

    useEffect(() => () => {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        if (programmaticTimer.current) clearTimeout(programmaticTimer.current);
    }, []);

    useEffect(() => {
        const existing = (notes || []).find((n) => n.page === page);
        setNote(existing ? existing.body : '');
    }, [page, notes]);

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
            doc.getPage(1).then((p) => {
                if (cancelled) return;
                const viewport = p.getViewport({ scale: 1 });
                setPageSize({ width: viewport.width, height: viewport.height });
            }).catch(() => {});
        }).catch((err) => {
            if (cancelled) return;
            setLoading(false);
            setLoadError(err?.message || 'Gagal memuat file PDF.');
        });
        return () => { cancelled = true; };
    }, [pdfUrl]);

    useEffect(() => {
        if (!pdf || mode !== 'single') return;
        pdf.getPage(page).then((p) => {
            const viewport = p.getViewport({ scale });
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            p.render({ canvasContext: ctx, viewport });
        });
    }, [pdf, page, scale, mode]);

    const renderScrollPage = useCallback((pageNum, canvas) => {
        const doc = pdfRef.current;
        if (!doc || !canvas) return;
        const key = `${pageNum}@${scaleRef.current}`;
        if (renderedRef.current[pageNum] === key) return;
        renderedRef.current[pageNum] = key;
        doc.getPage(pageNum).then((p) => {
            if (renderedRef.current[pageNum] !== key) return;
            const viewport = p.getViewport({ scale: scaleRef.current });
            const ctx = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            p.render({ canvasContext: ctx, viewport });
        }).catch(() => {});
    }, []);

    // Reset catatan render setiap ganti dokumen PDF.
    useEffect(() => {
        renderedRef.current = {};
    }, [pdf]);

    // Render malas (IntersectionObserver) + pelacakan halaman aktif di mode scroll.
    useEffect(() => {
        if (mode !== 'scroll' || !pdf || total === 0) return;

        const renderObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const n = Number(entry.target.dataset.page);
                if (entry.isIntersecting) {
                    nearRef.current.add(n);
                    renderScrollPage(n, canvasRefs.current.get(n));
                } else {
                    nearRef.current.delete(n);
                }
            });
        }, { rootMargin: '150% 0px 150% 0px', threshold: 0 });

        const activeObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || programmaticRef.current) return;
                const n = Number(entry.target.dataset.page);
                if (n && n !== pageRef.current) {
                    setPage(n);
                    queueSave(n, total);
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

        wrapRefs.current.forEach((el) => {
            renderObserver.observe(el);
            activeObserver.observe(el);
        });

        return () => {
            renderObserver.disconnect();
            activeObserver.disconnect();
        };
    }, [mode, pdf, total, renderScrollPage, queueSave]);

    // Zoom berubah: halaman di sekitar viewport dirender ulang pada skala baru.
    useEffect(() => {
        if (mode !== 'scroll' || !pdf) return;
        renderedRef.current = {};
        nearRef.current.forEach((n) => renderScrollPage(n, canvasRefs.current.get(n)));
    }, [scale, mode, pdf, renderScrollPage]);

    const scrollToPage = useCallback((target) => {
        const el = wrapRefs.current.get(target);
        if (!el) return;
        programmaticRef.current = true;
        if (programmaticTimer.current) clearTimeout(programmaticTimer.current);
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
        programmaticTimer.current = setTimeout(() => { programmaticRef.current = false; }, 400);
    }, []);

    // Masuk mode scroll: langsung posisikan ke halaman yang sedang aktif.
    useEffect(() => {
        if (mode !== 'scroll' || !pdf) return;
        const t = setTimeout(() => scrollToPage(pageRef.current), 60);
        return () => clearTimeout(t);
        // Hanya saat berpindah mode / dokumen selesai dimuat, bukan setiap halaman berubah.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, pdf]);

    const switchMode = (next) => {
        setMode(next);
        try {
            localStorage.setItem('reader-mode', next);
        } catch {
            // abaikan bila localStorage tidak tersedia
        }
    };

    const goTo = (next) => {
        const target = Math.min(Math.max(1, next), total || next);
        if (mode === 'scroll') {
            setPage(target);
            saveProgress(target, total);
            scrollToPage(target);
            return;
        }
        setPage(target);
        saveProgress(target, total);
    };

    const submitJump = (e) => {
        e.preventDefault();
        const target = parseInt(jump, 10);
        if (Number.isNaN(target)) return;
        goTo(target);
        setJump('');
    };

    const setWrapRef = (n) => (el) => {
        if (el) wrapRefs.current.set(n, el);
        else wrapRefs.current.delete(n);
    };

    const setCanvasRef = (n) => (el) => {
        if (el) canvasRefs.current.set(n, el);
        else canvasRefs.current.delete(n);
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

                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="flex overflow-hidden rounded-xl border border-line dark:border-ink-border" role="group" aria-label="Mode baca">
                        <button onClick={() => switchMode('single')} className={`px-4 py-2 text-sm font-semibold transition ${mode === 'single' ? 'bg-primary text-white' : 'bg-white text-black hover:text-primary dark:bg-ink-surface dark:text-white'}`}>1 Halaman</button>
                        <button onClick={() => switchMode('scroll')} className={`px-4 py-2 text-sm font-semibold transition ${mode === 'scroll' ? 'bg-primary text-white' : 'bg-white text-black hover:text-primary dark:bg-ink-surface dark:text-white'}`}>Scroll Semua</button>
                    </div>
                    <form onSubmit={submitJump} className="flex items-center gap-2">
                        <input type="number" min={1} max={total || undefined} value={jump} onChange={(e) => setJump(e.target.value)} placeholder="Ke halaman..." className="input !w-36" aria-label="Nomor halaman tujuan" />
                        <button type="submit" className="btn-secondary" disabled={!jump}>Lompat</button>
                    </form>
                </div>

                <div className="mt-4">
                    <div className="mb-1 flex justify-between text-sm font-semibold"><span>Halaman {page} dari {total || '-'}</span><span>{percent}%</span></div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-line dark:bg-ink-border">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
                    </div>
                </div>

                <div ref={wrapRef} className={`mt-4 flex justify-center overflow-auto rounded-2xl p-2 sm:p-4 [&_canvas]:h-auto [&_canvas]:max-w-full ${night ? 'bg-black' : 'bg-soft dark:bg-ink-surface'}`}>
                    {pdfUrl && loadError ? (
                        <div className="max-w-md py-16 text-center">
                            <p className="font-bold">PDF gagal dimuat di penampil</p>
                            <p className="mt-1 text-sm text-muted dark:text-darkmuted">{loadError}</p>
                            <a href={pdfUrl} target="_blank" rel="noreferrer" className="btn-primary mt-4 inline-flex">Buka PDF langsung</a>
                        </div>
                    ) : pdfUrl ? (
                        mode === 'single' ? (
                            <div className="flex flex-col items-center">
                                {loading && <p className="py-10 text-sm font-semibold text-muted dark:text-darkmuted">Memuat PDF...</p>}
                                <canvas ref={canvasRef} className={night ? 'invert' : ''} />
                            </div>
                        ) : (
                            <div className="flex w-full flex-col items-center">
                                {loading && <p className="py-10 text-sm font-semibold text-muted dark:text-darkmuted">Memuat PDF...</p>}
                                {pdf && Array.from({ length: total }, (_, i) => i + 1).map((n) => (
                                    <div
                                        key={n}
                                        ref={setWrapRef(n)}
                                        data-page={n}
                                        className="relative mb-4 scroll-mt-24 bg-white shadow last:mb-0"
                                        style={pageSize ? { width: pageSize.width * scale, maxWidth: '100%', aspectRatio: `${pageSize.width} / ${pageSize.height}` } : { width: '100%', aspectRatio: '1 / 1.414' }}
                                    >
                                        <canvas ref={setCanvasRef(n)} className={night ? 'invert' : ''} style={{ display: 'block', width: '100%', height: '100%' }} />
                                        <span className="absolute bottom-2 right-3 rounded bg-black/50 px-2 py-0.5 text-xs font-semibold text-white">{n}</span>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="max-w-md py-16 text-center">
                            <p className="font-bold">File PDF belum tersedia</p>
                            <p className="mt-1 text-sm text-muted dark:text-darkmuted">Admin dapat mengunggah PDF buku ini melalui dashboard Filament. Progress, bookmark, dan catatan tetap bisa dipakai setelah PDF tersedia.</p>
                        </div>
                    )}
                </div>

                {mode === 'single' && (
                    <div className="mt-4 flex items-center justify-center gap-3">
                        <button onClick={() => goTo(page - 1)} disabled={page <= 1} className="btn-secondary disabled:opacity-40"><ChevronLeft size={18} /> Sebelumnya</button>
                        <button onClick={() => goTo(page + 1)} disabled={total > 0 && page >= total} className="btn-primary disabled:opacity-40">Selanjutnya <ChevronRight size={18} /></button>
                    </div>
                )}

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
                    onSubmit={(e) => { e.preventDefault(); router.post(route('books.notes.store', book.id), { page, body: note, title: `Catatan halaman ${page}` }, { preserveScroll: true }); }}
                    className="card mt-6 p-5"
                >
                    <label className="flex items-center gap-2 font-bold"><NotebookPen className="text-primary" size={18} /> Catatan pribadi - halaman {page}</label>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} className="input mt-3" rows={3} placeholder="Tulis catatanmu untuk halaman ini..." />
                    <button className="btn-primary mt-3" disabled={!note.trim()}>Simpan Catatan</button>
                </form>

                {notes?.length > 0 && (
                    <div className="card mt-6 p-5">
                        <p className="flex items-center gap-2 font-bold"><NotebookPen className="text-primary" size={18} /> Catatan tersimpan di buku ini</p>
                        <div className="mt-3 space-y-3">
                            {notes.map((n) => (
                                <div key={n.id} className="flex items-start justify-between gap-3 border-b border-line pb-3 last:border-0 last:pb-0 dark:border-ink-border">
                                    <div>
                                        <button onClick={() => goTo(n.page)} className="text-sm font-semibold text-primary transition hover:underline">Halaman {n.page}</button>
                                        <p className="mt-1 text-sm text-muted dark:text-darkmuted">{n.body}</p>
                                    </div>
                                    <button onClick={() => router.delete(route('notes.destroy', n.id), { preserveScroll: true })} className="rounded-full p-2 text-primary transition hover:bg-soft dark:hover:bg-ink-bg" aria-label="Hapus catatan"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
