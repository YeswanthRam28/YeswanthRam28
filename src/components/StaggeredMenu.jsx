import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import './StaggeredMenu.css';

export const StaggeredMenu = ({
    position = 'right',
    colors = ['#B19EEF', '#5227FF'],
    items = [],
    socialItems = [],
    displaySocials = true,
    displayItemNumbering = true,
    className,
    logoName = 'YESWANTH RAM',
    menuButtonColor = '#fff',
    openMenuButtonColor = '#000',
    accentColor = '#7000ff',
    changeMenuColorOnOpen = true,
    isFixed = true,
    closeOnClickAway = true,
    onMenuOpen,
    onMenuClose
}) => {
    const [open, setOpen] = useState(false);
    const openRef = useRef(false);
    const panelRef = useRef(null);
    const preLayersRef = useRef(null);
    const preLayerElsRef = useRef([]);
    const plusHRef = useRef(null);
    const plusVRef = useRef(null);
    const iconRef = useRef(null);
    const textInnerRef = useRef(null);
    const [textLines, setTextLines] = useState(['Menu', 'Close']);

    const openTlRef = useRef(null);
    const closeTweenRef = useRef(null);
    const spinTweenRef = useRef(null);
    const textCycleAnimRef = useRef(null);
    const colorTweenRef = useRef(null);
    const toggleBtnRef = useRef(null);
    const busyRef = useRef(false);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const panel = panelRef.current;
            const preContainer = preLayersRef.current;
            const plusH = plusHRef.current;
            const plusV = plusVRef.current;
            const icon = iconRef.current;
            const textInner = textInnerRef.current;
            if (!panel || !plusH || !plusV || !icon || !textInner) return;

            let preLayers = [];
            if (preContainer) {
                preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
            }
            preLayerElsRef.current = preLayers;

            const offscreen = position === 'right' ? 100 : -100;
            gsap.set([panel, ...preLayers], { xPercent: offscreen });
            gsap.set(plusH, { rotate: 0 });
            gsap.set(plusV, { rotate: 90 });
            gsap.set(icon, { rotate: 0 });
            gsap.set(textInner, { yPercent: 0 });
            if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
        });
        return () => ctx.revert();
    }, [menuButtonColor, position]);

    const buildOpenTimeline = useCallback(() => {
        const panel = panelRef.current;
        const layers = preLayerElsRef.current;
        if (!panel) return null;

        openTlRef.current?.kill();
        if (closeTweenRef.current) {
            closeTweenRef.current.kill();
            closeTweenRef.current = null;
        }

        const itemLabels = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        const numbers = Array.from(panel.querySelectorAll('.sm-panel-item'));
        const socialTitle = panel.querySelector('.sm-socials-title');
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

        gsap.set(itemLabels, { yPercent: 110, rotate: 5 });
        if (numbers.length) gsap.set(numbers, { '--sm-num-opacity': 0 });
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 20, opacity: 0 });

        const tl = gsap.timeline({
            paused: true,
            onComplete: () => { busyRef.current = false; }
        });

        layers.forEach((layer, i) => {
            tl.to(layer, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.1);
        });

        tl.to(panel, { xPercent: 0, duration: 0.6, ease: 'power4.out' }, layers.length * 0.1);

        tl.to(itemLabels, {
            yPercent: 0,
            rotate: 0,
            duration: 0.8,
            ease: 'power4.out',
            stagger: 0.1
        }, '>-0.4');

        if (numbers.length) {
            tl.to(numbers, {
                '--sm-num-opacity': 1,
                duration: 0.4,
                stagger: 0.1
            }, '<0.2');
        }

        if (socialTitle || socialLinks.length) {
            tl.to([socialTitle, ...socialLinks], {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.05
            }, '<0.3');
        }

        openTlRef.current = tl;
        return tl;
    }, []);

    const playOpen = useCallback(() => {
        if (busyRef.current) return;
        busyRef.current = true;
        const tl = buildOpenTimeline();
        tl?.play();
    }, [buildOpenTimeline]);

    const playClose = useCallback(() => {
        const panel = panelRef.current;
        const layers = preLayerElsRef.current;
        if (!panel) return;

        busyRef.current = true;
        const all = [panel, ...layers];
        const offscreen = position === 'right' ? 100 : -100;

        gsap.to(all, {
            xPercent: offscreen,
            duration: 0.4,
            ease: 'power3.inOut',
            stagger: 0.05,
            onComplete: () => { busyRef.current = false; }
        });
    }, [position]);

    const animateIcon = useCallback(opening => {
        if (!iconRef.current) return;
        gsap.to(iconRef.current, {
            rotate: opening ? 225 : 0,
            duration: 0.6,
            ease: 'power3.inOut'
        });
    }, []);

    const animateText = useCallback(opening => {
        const inner = textInnerRef.current;
        if (!inner) return;

        // Simple text toggle
        gsap.to(inner, {
            yPercent: opening ? -50 : 0,
            duration: 0.4,
            ease: 'power3.inOut'
        });
    }, []);

    const animateColor = useCallback(opening => {
        if (!toggleBtnRef.current || !changeMenuColorOnOpen) return;
        gsap.to(toggleBtnRef.current, {
            color: opening ? openMenuButtonColor : menuButtonColor,
            duration: 0.4
        });
    }, [changeMenuColorOnOpen, openMenuButtonColor, menuButtonColor]);

    const toggleMenu = useCallback(() => {
        if (busyRef.current) return;
        const target = !openRef.current;
        openRef.current = target;
        setOpen(target);

        if (target) {
            onMenuOpen?.();
            playOpen();
        } else {
            onMenuClose?.();
            playClose();
        }

        animateIcon(target);
        animateText(target);
        animateColor(target);
    }, [playOpen, playClose, animateIcon, animateText, animateColor, onMenuOpen, onMenuClose]);

    return (
        <div className={`staggered-menu-wrapper ${isFixed ? 'fixed-wrapper' : ''} ${className || ''}`}
            data-position={position} data-open={open || undefined}>

            <div ref={preLayersRef} className="sm-prelayers">
                {colors.map((c, i) => (
                    <div key={i} className="sm-prelayer" style={{ background: c }} />
                ))}
            </div>

            <header className="staggered-menu-header">
                <div className="sm-logo">
                    {logoName}
                </div>
                <button ref={toggleBtnRef} className="sm-toggle" onClick={toggleMenu}>
                    <span className="sm-toggle-textWrap">
                        <span ref={textInnerRef} className="sm-toggle-textInner">
                            <span className="sm-toggle-line">Menu</span>
                            <span className="sm-toggle-line">Close</span>
                        </span>
                    </span>
                    <span ref={iconRef} className="sm-icon">
                        <span ref={plusHRef} className="sm-icon-line" />
                        <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
                    </span>
                </button>
            </header>

            <aside ref={panelRef} className="staggered-menu-panel">
                <div className="sm-panel-inner">
                    <ul className="sm-panel-list" data-numbering={displayItemNumbering || undefined}>
                        {items.map((it, idx) => (
                            <li className="sm-panel-itemWrap" key={idx}>
                                <a className="sm-panel-item" href={it.link} onClick={toggleMenu}>
                                    <span className="sm-panel-itemLabel">{it.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>

                    {displaySocials && socialItems.length > 0 && (
                        <div className="sm-socials">
                            <h3 className="sm-socials-title">Connect</h3>
                            <ul className="sm-socials-list">
                                {socialItems.map((s, i) => (
                                    <li key={i}>
                                        <a href={s.link} target="_blank" rel="noopener noreferrer" className="sm-socials-link">
                                            {s.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
};

export default StaggeredMenu;
