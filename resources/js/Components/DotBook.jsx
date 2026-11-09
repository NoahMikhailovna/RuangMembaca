import { useEffect, useRef } from 'react';
import { BOOK_DOTS } from '../data/bookDots';

// Palet titik per mode: [tinta, merah, emas]
const COLORS = {
    light: ['#171717', '#DC2626', '#B07C18'],
    dark: ['#E8E8E8', '#F87171', '#D9B45B'],
};

// Ilustrasi tumpukan buku yang digambar dari ribuan titik (dot-matrix),
// terinspirasi efek DotPortrait: titik muncul berurutan dari tengah,
// bergelombang halus, dan membesar menjauhi kursor saat disentuh/hover.
export default function DotBook({ className = '' }) {
    const wrapRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return undefined;
        const ctx = canvas.getContext('2d');
        const { w, h, d } = BOOK_DOTS;
        const n = d.length;

        const bx = new Float32Array(n);
        const by = new Float32Array(n);
        const bs = new Float32Array(n);
        const boost = new Float32Array(n);
        const delay = new Float32Array(n);
        const groups = [[], [], []];
        const cx = w / 2;
        const cy = h / 2;
        const maxDist = Math.hypot(cx, cy) || 1;
        for (let i = 0; i < n; i += 1) {
            const [x, y, s, c] = d[i];
            bx[i] = x + 0.5;
            by[i] = y + 0.5;
            bs[i] = s / 10;
            delay[i] = (Math.hypot(x + 0.5 - cx, y + 0.5 - cy) / maxDist) * 500;
            groups[c].push(i);
        }

        let dark = document.documentElement.classList.contains('dark');
        let cell = 8;
        let width = 0;
        let height = 0;
        let raf = 0;
        let visible = true;
        const pointer = { x: -9999, y: -9999, active: false };
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const t0 = performance.now();

        function draw(now) {
            const t = now - t0;
            const palette = dark ? COLORS.dark : COLORS.light;
            ctx.clearRect(0, 0, width, height);
            for (let c = 0; c < 3; c += 1) {
                ctx.fillStyle = palette[c];
                ctx.beginPath();
                const list = groups[c];
                for (let k = 0; k < list.length; k += 1) {
                    const i = list[k];
                    let target = 0;
                    let dx = 0;
                    let dy = 0;
                    let dist = 1;
                    if (pointer.active) {
                        dx = bx[i] - pointer.x;
                        dy = by[i] - pointer.y;
                        dist = Math.hypot(dx, dy) || 0.0001;
                        if (dist < 7) target = 1 - dist / 7;
                    }
                    boost[i] += (target - boost[i]) * 0.12;
                    const intro = reduced ? 1 : Math.min(1, Math.max(0, (t - delay[i]) / 550));
                    if (intro <= 0) continue;
                    const ease = 1 - Math.pow(1 - intro, 3);
                    const wave = reduced ? 1 : 1 + 0.05 * Math.sin(t / 1100 + (bx[i] + by[i]) * 0.32);
                    const scale = ease * wave * (1 + boost[i] * 0.9);
                    let px = bx[i];
                    let py = by[i];
                    if (boost[i] > 0.01 && pointer.active) {
                        const push = boost[i] * 0.45;
                        px += (dx / dist) * push;
                        py += (dy / dist) * push;
                    }
                    const r = bs[i] * cell * 0.46 * scale;
                    if (r < 0.25) continue;
                    const X = px * cell;
                    const Y = py * cell;
                    ctx.moveTo(X + r, Y);
                    ctx.arc(X, Y, r, 0, 6.2832);
                }
                ctx.fill();
            }
        }

        function loop(now) {
            if (visible && !document.hidden) draw(now);
            raf = requestAnimationFrame(loop);
        }

        function resize() {
            const rect = wrap.getBoundingClientRect();
            if (rect.width === 0) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = (rect.width * h) / w;
            cell = rect.width / w;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (reduced) draw(performance.now());
        }

        function onMove(e) {
            const rect = canvas.getBoundingClientRect();
            pointer.x = (e.clientX - rect.left) / (cell || 1);
            pointer.y = (e.clientY - rect.top) / (cell || 1);
            pointer.active = true;
        }
        function onLeave() {
            pointer.active = false;
        }

        resize();
        if (!reduced) raf = requestAnimationFrame(loop);
        else draw(performance.now());

        const ro = new ResizeObserver(resize);
        ro.observe(wrap);
        const io = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }, { threshold: 0.02 });
        io.observe(wrap);
        const mo = new MutationObserver(() => {
            const nowDark = document.documentElement.classList.contains('dark');
            if (nowDark !== dark) {
                dark = nowDark;
                if (reduced) draw(performance.now());
            }
        });
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        wrap.addEventListener('pointermove', onMove);
        wrap.addEventListener('pointerleave', onLeave);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            mo.disconnect();
            wrap.removeEventListener('pointermove', onMove);
            wrap.removeEventListener('pointerleave', onLeave);
        };
    }, []);

    return (
        <div ref={wrapRef} className={className} role="img" aria-label="Ilustrasi tumpukan buku yang tersusun dari titik-titik">
            <canvas ref={canvasRef} className="block w-full" />
        </div>
    );
}
