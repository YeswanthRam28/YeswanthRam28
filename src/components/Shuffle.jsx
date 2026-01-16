import React, { useRef, useEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './Shuffle.css';

// Fallback for SplitText which is a premium GSAP plugin
// If the user doesn't have it, we use this simple version
class SimpleSplit {
    constructor(el, options) {
        this.el = el;
        this.chars = [];
        this.init();
    }
    init() {
        const text = this.el.textContent;
        this.el.textContent = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'shuffle-char';
            this.el.appendChild(span);
            this.chars.push(span);
        });
    }
    revert() {
        this.el.textContent = this.chars.map(c => c.textContent).join('');
    }
}

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Shuffle = ({
    text,
    className = '',
    style = {},
    shuffleDirection = 'right',
    duration = 0.35,
    maxDelay = 0,
    ease = 'power3.out',
    threshold = 0.1,
    rootMargin = '-100px',
    tag = 'p',
    textAlign = 'center',
    onShuffleComplete,
    shuffleTimes = 1,
    animationMode = 'evenodd',
    loop = false,
    loopDelay = 0,
    stagger = 0.03,
    scrambleCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    colorFrom,
    colorTo,
    triggerOnce = true,
    respectReducedMotion = true,
    triggerOnHover = true
}) => {
    const ref = useRef(null);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [ready, setReady] = useState(false);

    const splitRef = useRef(null);
    const wrappersRef = useRef([]);
    const tlRef = useRef(null);
    const playingRef = useRef(false);
    const hoverHandlerRef = useRef(null);

    useEffect(() => {
        if ('fonts' in document) {
            if (document.fonts.status === 'loaded') setFontsLoaded(true);
            else document.fonts.ready.then(() => setFontsLoaded(true));
        } else setFontsLoaded(true);
    }, []);

    const scrollTriggerStart = useMemo(() => {
        const startPct = (1 - threshold) * 100;
        const mm = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin || '');
        const mv = mm ? parseFloat(mm[1]) : 0;
        const mu = mm ? mm[2] || 'px' : 'px';
        const sign = mv === 0 ? '' : mv < 0 ? `-=${Math.abs(mv)}${mu}` : `+=${mv}${mu}`;
        return `top ${startPct}%${sign}`;
    }, [threshold, rootMargin]);

    useGSAP(
        () => {
            if (!ref.current || !text || !fontsLoaded) return;
            if (respectReducedMotion && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                setReady(true);
                onShuffleComplete?.();
                return;
            }

            const el = ref.current;
            const start = scrollTriggerStart;

            const removeHover = () => {
                if (hoverHandlerRef.current && ref.current) {
                    ref.current.removeEventListener('mouseenter', hoverHandlerRef.current);
                    hoverHandlerRef.current = null;
                }
            };

            const teardown = () => {
                if (tlRef.current) {
                    tlRef.current.kill();
                    tlRef.current = null;
                }
                if (wrappersRef.current.length) {
                    wrappersRef.current.forEach(wrap => {
                        const inner = wrap.firstElementChild;
                        const orig = inner?.querySelector('[data-orig="1"]');
                        if (orig && wrap.parentNode) {
                            wrap.parentNode.replaceChild(orig, wrap);
                        }
                    });
                    wrappersRef.current = [];
                }
                try {
                    splitRef.current?.revert();
                } catch { /* noop */ }
                splitRef.current = null;
                playingRef.current = false;
            };

            const build = () => {
                teardown();

                // Using SimpleSplit instead of premium SplitText
                splitRef.current = new SimpleSplit(el);

                const chars = splitRef.current.chars || [];
                wrappersRef.current = [];

                const rolls = Math.max(1, Math.floor(shuffleTimes));
                const rand = set => set.charAt(Math.floor(Math.random() * set.length)) || '';

                chars.forEach(ch => {
                    const parent = ch.parentElement;
                    if (!parent) return;

                    const w = ch.getBoundingClientRect().width;
                    const h = ch.getBoundingClientRect().height;
                    if (!w) return;

                    const wrap = document.createElement('span');
                    Object.assign(wrap.style, {
                        display: 'inline-block',
                        overflow: 'hidden',
                        width: w + 'px',
                        height: shuffleDirection === 'up' || shuffleDirection === 'down' ? h + 'px' : 'auto',
                        verticalAlign: 'bottom'
                    });

                    const inner = document.createElement('span');
                    Object.assign(inner.style, {
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                        willChange: 'transform'
                    });

                    parent.insertBefore(wrap, ch);
                    wrap.appendChild(inner);

                    const firstOrig = ch.cloneNode(true);
                    Object.assign(firstOrig.style, {
                        display: 'inline-block',
                        width: w + 'px',
                        textAlign: 'center'
                    });

                    ch.setAttribute('data-orig', '1');
                    Object.assign(ch.style, {
                        display: 'inline-block',
                        width: w + 'px',
                        textAlign: 'center'
                    });

                    inner.appendChild(firstOrig);
                    for (let k = 0; k < rolls; k++) {
                        const c = ch.cloneNode(true);
                        if (scrambleCharset) c.textContent = rand(scrambleCharset);
                        Object.assign(c.style, {
                            display: 'inline-block',
                            width: w + 'px',
                            textAlign: 'center'
                        });
                        inner.appendChild(c);
                    }
                    inner.appendChild(ch);

                    const steps = rolls + 1;

                    let startX = 0, finalX = 0, startY = 0, finalY = 0;

                    if (shuffleDirection === 'right') {
                        startX = -steps * w;
                        finalX = 0;
                    } else if (shuffleDirection === 'left') {
                        startX = 0;
                        finalX = -steps * w;
                    } else if (shuffleDirection === 'down') {
                        startY = -steps * h;
                        finalY = 0;
                    } else if (shuffleDirection === 'up') {
                        startY = 0;
                        finalY = -steps * h;
                    }

                    if (shuffleDirection === 'left' || shuffleDirection === 'right') {
                        gsap.set(inner, { x: startX, y: 0, force3D: true });
                        inner.setAttribute('data-start-x', String(startX));
                        inner.setAttribute('data-final-x', String(finalX));
                    } else {
                        gsap.set(inner, { x: 0, y: startY, force3D: true });
                        inner.setAttribute('data-start-y', String(startY));
                        inner.setAttribute('data-final-y', String(finalY));
                    }

                    wrappersRef.current.push(wrap);
                });
            };

            const play = () => {
                const strips = wrappersRef.current.map(w => w.firstElementChild);
                if (!strips.length) return;

                playingRef.current = true;
                const isVertical = shuffleDirection === 'up' || shuffleDirection === 'down';

                const tl = gsap.timeline({
                    onComplete: () => {
                        playingRef.current = false;
                        if (!loop) {
                            onShuffleComplete?.();
                            armHover();
                        }
                    }
                });

                const addTween = (targets, at) => {
                    const vars = {
                        duration,
                        ease,
                        force3D: true,
                        stagger: animationMode === 'evenodd' ? stagger : 0
                    };
                    if (isVertical) {
                        vars.y = (i, t) => parseFloat(t.getAttribute('data-final-y') || '0');
                    } else {
                        vars.x = (i, t) => parseFloat(t.getAttribute('data-final-x') || '0');
                    }
                    tl.to(targets, vars, at);
                };

                if (animationMode === 'evenodd') {
                    const odd = strips.filter((_, i) => i % 2 === 1);
                    const even = strips.filter((_, i) => i % 2 === 0);
                    if (odd.length) addTween(odd, 0);
                    if (even.length) addTween(even, 0.1);
                } else {
                    strips.forEach(strip => {
                        const d = Math.random() * maxDelay;
                        const vars = { duration, ease, force3D: true };
                        if (isVertical) vars.y = parseFloat(strip.getAttribute('data-final-y'));
                        else vars.x = parseFloat(strip.getAttribute('data-final-x'));
                        tl.to(strip, vars, d);
                    });
                }
                tlRef.current = tl;
            };

            const armHover = () => {
                if (!triggerOnHover || !ref.current) return;
                removeHover();
                const handler = () => {
                    if (playingRef.current) return;
                    build();
                    play();
                };
                hoverHandlerRef.current = handler;
                ref.current.addEventListener('mouseenter', handler);
            };

            const st = ScrollTrigger.create({
                trigger: el,
                start,
                once: triggerOnce,
                onEnter: () => {
                    build();
                    play();
                    armHover();
                    setReady(true);
                }
            });

            return () => {
                st.kill();
                removeHover();
                teardown();
                setReady(false);
            };
        },
        { dependencies: [text, fontsLoaded], scope: ref }
    );

    const Tag = tag || 'p';
    return <Tag ref={ref} className={`shuffle-parent ${ready ? 'is-ready' : ''} ${className}`} style={{ textAlign, ...style }}>{text}</Tag>;
};

export default Shuffle;
