"use client";

import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, useSpring, motion } from "framer-motion";
import NextImage from "next/image";
import { ArrowRight } from "lucide-react";
import styles from "./KitchenSequence.module.css";

const FRAME_COUNT = 144;

export default function KitchenSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    const frameIndex = useTransform(smoothProgress, [0, 1], [0, FRAME_COUNT - 1]);

    // Opacity transforms: opacityA starts at 1 immediately on page load
    const opacityA = useTransform(smoothProgress, [0, 0.18, 0.24], [1, 1, 0]);
    const opacityB = useTransform(smoothProgress, [0.24, 0.28, 0.46, 0.50], [0, 1, 1, 0]);
    const opacityC = useTransform(smoothProgress, [0.50, 0.54, 0.72, 0.76], [0, 1, 1, 0]);
    const opacityD = useTransform(smoothProgress, [0.76, 0.80, 0.98, 1.0], [0, 1, 1, 1]);

    // Interactive transforms for pointer events to avoid invisible focusable/clickable CTA
    const pointerEventsD = useTransform(smoothProgress, (v) => (v >= 0.76 ? "auto" : "none"));

    useEffect(() => {
        const loadImages = async () => {
            setIsLoading(true);
            const isMobile = window.innerWidth < 768;
            const basePath = isMobile ? "/framesmobile/" : "/sequence/";

            const promises: Promise<HTMLImageElement | null>[] = [];

            for (let i = 0; i < FRAME_COUNT; i++) {
                promises.push(new Promise((resolve) => {
                    const img = new Image();
                    const filename = `ezgif-frame-${(i + 1).toString().padStart(3, '0')}.jpg`;
                    img.src = `${basePath}${filename}`;
                    img.onload = () => resolve(img);
                    img.onerror = () => resolve(null);
                }));
            }

            const results = await Promise.all(promises);
            const validImages = results.filter((img): img is HTMLImageElement => img !== null);
            setImages(validImages);
            setIsLoading(false);
        };

        loadImages();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        if (images.length > 0) {
            canvas.width = images[0].naturalWidth || 1920;
            canvas.height = images[0].naturalHeight || 1080;
        } else {
            const isMobile = window.innerWidth < 768;
            canvas.width = isMobile ? 1080 : 1920;
            canvas.height = isMobile ? 1920 : 1080;
        }

        const render = () => {
            if (images.length === 0) return;

            const index = Math.round(frameIndex.get());
            const safeIndex = Math.min(Math.max(index, 0), images.length - 1);
            const image = images[safeIndex];

            if (image) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            }

            requestAnimationFrame(render);
        };

        const animationId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [images, frameIndex]);

    const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.05], [1, 0]);

    const scrollToForm = (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById("candidatura");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div id="inicio" ref={containerRef} className="h-[450vh] relative bg-[#050505]">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                <div
                    className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
                >
                    <NextImage
                        src="/framesmobile/ezgif-frame-001.jpg"
                        alt="Hero Mobile"
                        fill
                        className="object-cover md:hidden"
                        priority
                    />
                    <NextImage
                        src="/sequence/ezgif-frame-001.jpg"
                        alt="Hero Desktop"
                        fill
                        className="object-cover hidden md:block"
                        priority
                    />
                </div>

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30 z-10 pointer-events-none" />

                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-cover scale-105 relative z-0"
                />

                <div aria-hidden="true" className={styles.textBackdrop} />

                {/* Scrollytelling Overlays */}
                <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-center items-center">
                    {/* Beat A (Primary H1) */}
                    <motion.div
                        style={{ opacity: opacityA }}
                        className={styles.beat}
                    >
                        <p className={styles.eyebrow}>
                            RECRUTAMENTO DE CONSTRUÇÃO CIVIL
                        </p>
                        <h1
                            className={`${styles.title} ${styles.environmentTitle}`}
                        >
                            <span className={styles.titleLine}>O teu trabalho constrói</span>{" "}
                            <span className={styles.titleLine}>mais do que edifícios.</span>{" "}
                            <span className={styles.accent}>
                                Constrói o teu futuro.
                            </span>
                        </h1>
                    </motion.div>

                    {/* Beat B (H2) */}
                    <motion.div
                        style={{ opacity: opacityB }}
                        className={styles.beat}
                    >
                        <p className={styles.eyebrow}>
                            RECONHECIMENTO PROFISSIONAL
                        </p>
                        <h2
                            className={styles.title}
                        >
                            Todos os dias, milhares de pessoas
                        </h2>
                        <p className={styles.description}>
                            entram em casas, hospitais, escolas e empresas construídas por profissionais como tu.
                        </p>
                    </motion.div>

                    {/* Beat C (H2) */}
                    <motion.div
                        style={{ opacity: opacityC }}
                        className={styles.beat}
                    >
                        <p className={styles.eyebrow}>
                            O TEU VALOR
                        </p>
                        <h2
                            className={styles.title}
                        >
                            O teu trabalho vê-se. O teu esforço conta.
                        </h2>
                        <p className={styles.description}>
                            E a tua experiência tem valor.
                        </p>
                    </motion.div>

                    {/* Beat D (H2 + CTA - interactive only when visible) */}
                    <motion.div
                        style={{ opacity: opacityD, pointerEvents: pointerEventsD }}
                        className={styles.beat}
                    >
                        <p className={styles.eyebrow}>
                            A TUA OPORTUNIDADE
                        </p>
                        <h2
                            className={styles.title}
                        >
                            Está na altura de encontrares uma empresa
                        </h2>
                        <p className={styles.description}>
                            que reconheça isso.
                        </p>

                        <div className="mt-2 flex flex-col items-center">
                            <button
                                onClick={scrollToForm}
                                className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#E0C097] to-[#b89568] hover:from-[#eed0a7] hover:to-[#cfa372] text-black font-extrabold text-sm md:text-base px-8 py-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
                            >
                                <span>QUERO ENCONTRAR TRABALHO</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <span className={styles.caption}>
                                Envia o teu currículo gratuitamente. Demora menos de 2 minutos.
                            </span>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    style={{ opacity: scrollIndicatorOpacity }}
                    animate={{ y: 8 }}
                    transition={{
                        opacity: { duration: 0.5 },
                        y: { repeat: Infinity, repeatType: "reverse", duration: 1.5, ease: "easeInOut" }
                    }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 pointer-events-none"
                >
                    <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-nowrap">
                        Deslize para continuar
                    </span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-[#E0C097] to-transparent opacity-80"></div>
                </motion.div>
            </div>
        </div>
    );
}
