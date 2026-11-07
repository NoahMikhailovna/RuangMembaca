import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const QUOTES = [
    {
        text: 'Aku rela dipenjara asalkan bersama buku, karena dengan buku aku bebas.',
        name: 'Mohammad Hatta',
        role: 'Wakil Presiden Pertama RI',
        image: '/images/quotes/mohammad-hatta.jpg',
        initials: 'MH',
    },
    {
        text: 'Selama toko buku ada, selama itu pustaka bisa dibentuk kembali. Kalau perlu dan memang perlu, pakaian dan makanan dikurangi.',
        name: 'Tan Malaka',
        role: 'Bapak Republik Indonesia',
        image: '/images/quotes/tan-malaka.jpg',
        initials: 'TM',
    },
    {
        text: 'Dengan membaca, kau hidup seribu kehidupan. Dengan tidak membaca, kau hanya hidup sekali.',
        name: 'Pramoedya Ananta Toer',
        role: 'Sastrawan Indonesia',
        image: '/images/quotes/pramoedya-ananta-toer.jpg',
        initials: 'PT',
    },
    {
        text: 'Sesungguhnya, hidup itu ibarat sebuah buku. Siapa yang tidak pernah belajar, sama saja dengan buku yang tidak pernah dibaca.',
        name: 'Ki Hadjar Dewantara',
        role: 'Bapak Pendidikan Nasional',
        image: '/images/quotes/ki-hadjar-dewantara.jpg',
        initials: 'KHD',
    },
    {
        text: 'Saya selalu membayangkan bahwa surga akan menjadi semacam perpustakaan.',
        name: 'Jorge Luis Borges',
        role: 'Penulis Argentina',
        image: '/images/quotes/borges.jpg',
        initials: 'JB',
    },
    {
        text: 'Ruangan tanpa buku bagaikan tubuh tanpa jiwa.',
        name: 'Marcus Tullius Cicero',
        role: 'Filsuf Romawi',
        image: '/images/quotes/cicero.jpg',
        initials: 'MC',
    },
];

const AUTOPLAY_MS = 5000;

export default function QuotesCarousel({ variant = 'section' }) {
    const [[index, direction], setState] = useState([0, 0]);
    const reduceMotion = useReducedMotion();
    const touchX = useRef(null);
    const count = QUOTES.length;

    const paginate = useCallback((dir) => {
        setState(([i]) => [(i + dir + count) % count, dir]);
    }, [count]);

    const goTo = useCallback((target) => {
        setState(([i]) => (target === i ? [i, 0] : [target, target > i ? 1 : -1]));
    }, []);

    // Autoplay: SELALU jalan, tanpa state pause apa pun. Timer di-reset
    // setiap kali slide berpindah (otomatis, panah, dots, atau swipe)
    // karena `index` ada di dependency — jadi slide berikutnya selalu
    // datang tepat 5 detik setelah perpindahan terakhir.
    useEffect(() => {
        const timer = setInterval(() => paginate(1), AUTOPLAY_MS);
        return () => clearInterval(timer);
    }, [paginate, index]);

    const quote = QUOTES[index];

    const variants = {
        enter: (dir) => (reduceMotion ? { opacity: 0 } : { opacity: 0, x: dir >= 0 ? 48 : -48 }),
        center: { opacity: 1, x: 0 },
        exit: (dir) => (reduceMotion ? { opacity: 0 } : { opacity: 0, x: dir >= 0 ? -48 : 48 }),
    };

    // Sentuhan hanya untuk deteksi swipe — tidak ada jeda/pause sama
    // sekali. Swipe mengganti `index`, dan itu otomatis me-reset timer
    // autoplay, jadi slide berikutnya datang 5 detik setelah swipe.
    const onTouchStart = (e) => {
        touchX.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e) => {
        if (touchX.current !== null) {
            const delta = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(delta) > 48) paginate(delta < 0 ? 1 : -1);
            touchX.current = null;
        }
    };

    const card = (
        <div className="relative overflow-hidden rounded-3xl border border-line bg-white shadow-xl dark:border-ink-border dark:bg-ink-surface">
            {/* Aksen garis merah tipis di sisi atas kartu */}
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-transparent" />
            {/* Tanda kutip raksasa sebagai dekorasi latar, di dalam kartu */}
            <span aria-hidden="true" className="pointer-events-none absolute -right-2 -top-9 select-none font-serif text-[10rem] font-bold leading-none text-primary/[0.07]">
                &rdquo;
            </span>

            <div className="relative px-6 pt-7 sm:px-8 sm:pt-8">
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                    <motion.figure
                        key={index}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: reduceMotion ? 0.2 : 0.4, ease: 'easeInOut' }}
                    >
                        <div className="flex items-center gap-4">
                            {quote.image ? (
                                <img
                                    src={quote.image}
                                    alt={`Foto ${quote.name}`}
                                    className="h-20 w-20 shrink-0 rounded-full object-cover shadow-md ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-ink-surface"
                                    loading="lazy"
                                />
                            ) : (
                                <div
                                    aria-hidden="true"
                                    className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-dark via-primary to-black font-serif text-2xl font-bold text-white shadow-md ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-ink-surface"
                                >
                                    {quote.initials}
                                </div>
                            )}
                            <figcaption className="min-w-0">
                                <span className="block truncate text-lg font-extrabold leading-tight text-black dark:text-white">{quote.name}</span>
                                <span className="block text-sm text-muted dark:text-darkmuted">{quote.role}</span>
                            </figcaption>
                        </div>
                        <blockquote className="mt-5 min-h-[7.25rem] font-serif text-lg italic leading-relaxed text-black dark:text-white sm:min-h-[6.5rem] sm:text-xl">
                            &ldquo;{quote.text}&rdquo;
                        </blockquote>
                    </motion.figure>
                </AnimatePresence>
            </div>

            {/* Kontrol di dalam kartu */}
            <div className="relative flex items-center justify-between border-t border-line px-6 py-4 dark:border-ink-border sm:px-8">
                <div className="flex items-center gap-2">
                    {QUOTES.map((q, i) => (
                        <button
                            key={q.name}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-label={`Ke quotes ${q.name}`}
                            aria-current={i === index}
                            className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-7 bg-primary' : 'w-2 bg-line hover:bg-primary/50 dark:bg-ink-border'}`}
                        />
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => paginate(-1)}
                        aria-label="Quotes sebelumnya"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-black transition hover:border-primary hover:text-primary dark:border-ink-border dark:text-white"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => paginate(1)}
                        aria-label="Quotes selanjutnya"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-black transition hover:border-primary hover:text-primary dark:border-ink-border dark:text-white"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );

    const handlers = {
        onTouchStart,
        onTouchEnd,
    };

    if (variant === 'hero') {
        return (
            <div
                className="relative mx-auto w-full max-w-md lg:max-w-none"
                {...handlers}
                aria-roledescription="carousel"
                aria-label="Quotes tokoh tentang membaca"
            >
                {/* Cahaya lembut di belakang kartu */}
                <div aria-hidden="true" className="absolute inset-x-6 top-8 bottom-0 rounded-[2.5rem] bg-primary/15 blur-2xl" />
                {/* Chip melayang statis berisi nama web, di pojok kanan atas kartu */}
                <motion.div
                    aria-hidden="true"
                    animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-3.5 right-8 z-10 flex items-center gap-1.5 rounded-full bg-black px-3.5 py-1.5 text-xs font-bold text-white shadow-lg dark:bg-primary"
                >
                    <BookOpen size={13} /> Ruang Membaca
                </motion.div>
                <div className="relative">{card}</div>
            </div>
        );
    }

    return (
        <section className="bg-soft dark:bg-ink-bg" aria-roledescription="carousel" aria-label="Quotes tokoh tentang membaca">
            <div className="mx-auto max-w-7xl px-4 py-14">
                <div className="mb-8 text-center">
                    <p className="mb-2 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
                        <Quote size={16} fill="currentColor" /> Kata Tokoh
                    </p>
                    <h2 className="text-2xl font-extrabold md:text-3xl">Quotes Tentang Membaca</h2>
                    <p className="mx-auto mt-2 max-w-xl text-muted dark:text-darkmuted">Apa kata para tokoh besar tentang buku dan membaca?</p>
                </div>
                <div className="relative mx-auto max-w-3xl" {...handlers}>
                    {card}
                </div>
            </div>
        </section>
    );
}
