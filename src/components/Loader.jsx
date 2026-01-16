import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Shuffle from './Shuffle';

const Loader = ({ onFinished }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Increased duration slightly to allow the shuffle to complete beautifully
        const timer = setTimeout(() => {
            setLoading(false);
            if (onFinished) onFinished();
        }, 3500);
        return () => clearTimeout(timer);
    }, [onFinished]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    className="loader-overlay"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                >
                    <div className="loader-content">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="loader-name-container"
                        >
                            <Shuffle
                                text="YESWANTH RAM"
                                shuffleDirection="up"
                                duration={0.8}
                                shuffleTimes={3}
                                animationMode="evenodd"
                                stagger={0.05}
                                className="loader-name"
                            />

                            <motion.div
                                className="loader-bar-bg"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 3, ease: "easeInOut" }}
                            >
                                <div className="loader-bar-fill"></div>
                            </motion.div>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            transition={{ delay: 2 }}
                            className="loader-tagline"
                        >
                            INITIALIZING SYSTEMS...
                        </motion.p>
                    </div>

                    <style>{`
            .loader-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100vw;
              height: 100vh;
              background: #030014;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 9999;
              overflow: hidden;
            }
            .loader-content {
              text-align: center;
              position: relative;
            }
            .loader-name {
              font-size: 5rem;
              font-weight: 900;
              letter-spacing: 0.1em;
              color: white;
              margin-bottom: 30px;
              font-family: 'Outfit', sans-serif;
              display: block;
            }
            .loader-bar-bg {
              height: 2px;
              background: rgba(255, 255, 255, 0.1);
              width: 400px;
              margin: 0 auto;
              position: relative;
              overflow: hidden;
            }
            .loader-bar-fill {
              position: absolute;
              top: 0;
              left: 0;
              height: 100%;
              width: 100%;
              background: linear-gradient(90deg, transparent, #7000ff, #00d2ff, transparent);
              animation: shimmer 2s infinite;
            }
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            .loader-tagline {
              margin-top: 30px;
              font-size: 0.8rem;
              letter-spacing: 0.5em;
              color: #b4b4b4;
              font-family: 'JetBrains Mono', monospace;
              text-transform: uppercase;
            }
            @media (max-width: 768px) {
              .loader-name { font-size: 2.5rem; }
              .loader-bar-bg { width: 250px; }
            }
          `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Loader;
