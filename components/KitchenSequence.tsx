"use client";

import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, useSpring, useReducedMotion, motion } from "framer-motion";
import NextImage from "next/image";
import { ArrowRight } from "lucide-react";
import styles from "./KitchenSequence.module.css";

const FRAME_COUNT = 144;

export default function KitchenSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const foregroundRef = useRef<HTMLCanvasElement>(null);
    const reduceMotion = useReducedMotion();
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

    const frameIndex = useTransform(smoothProgress, [0, 0.24, 1], [0, 0, FRAME_COUNT - 1]);

    // Opacity transforms: opacityA starts at 1 immediately on page load
    // Hold the opening frame while the heading moves behind its real island outline.
    const opacityA = useTransform(smoothProgress, [0, 0.14, 0.23], [1, 1, 0]);
    const titleY = useTransform(smoothProgress, [0, 0.23], ["-11vh", "32vh"]);
    const sceneScale = useTransform(smoothProgress, [0, 0.24], [1.04, 1.10]);
    const foregroundOpacity = useTransform(smoothProgress, (v) => v < 0.24 ? 1 : 0);
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
        const foreground = foregroundRef.current;
        const firstImage = images[0];
        if (!canvas || !foreground || !firstImage) return;
        const ctx = canvas.getContext("2d");
        const foregroundCtx = foreground.getContext("2d");
        if (!ctx || !foregroundCtx) return;

        const width = firstImage.naturalWidth;
        const height = firstImage.naturalHeight;
        canvas.width = foreground.width = width;
        canvas.height = foreground.height = height;

        // Coordinates follow the island in each opening photograph. Both canvases
        // share object-fit and scale, so the cutout stays registered on any viewport.
        const mobile = height > width;
        const island = new Path2D(mobile
            ? "M259 805 L637 780 L720 800 L720 1280 L470 1280 L467 1215 L319 1201 L270 1092 L267 840 Z"
            : "M769 664 L833 617 L1100 617 L1166 663 L1166 680 L1128 685 L1128 727 C1192 723 1180 754 1133 754 L1133 759 C1224 752 1231 793 1160 797 L1128 797 L1128 1045 L1033 1045 L1033 1080 L865 1080 L873 1047 L820 1047 L819 1007 L789 1007 L787 685 L769 680 Z");
        foregroundCtx.save();
        foregroundCtx.scale(width / (mobile ? 720 : 1920), height / (mobile ? 1280 : 1080));
        foregroundCtx.clip(island);
        foregroundCtx.drawImage(firstImage, 0, 0, mobile ? 720 : 1920, mobile ? 1280 : 1080);
        foregroundCtx.restore();

        let lastIndex = -1;
        const render = () => {
            const index = Math.min(Math.max(Math.round(frameIndex.get()), 0), images.length - 1);
            if (index === lastIndex) return;
            ctx.drawImage(images[index], 0, 0, width, height);
            lastIndex = index;
        };
        render();
        return frameIndex.on("change", render);
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
                    className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
                >
                    <NextImage
                        src="/framesmobile/ezgif-frame-001.jpg"
                        alt="Hero Mobile"
                        fill
                        className="object-cover scale-[1.04] md:hidden"
                        priority
                    />
                    <NextImage
                        src="/sequence/ezgif-frame-001.jpg"
                        alt="Hero Desktop"
                        fill
                        className="object-cover scale-[1.04] hidden md:block"
                        priority
                    />
                </div>

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30 z-40 pointer-events-none" />

                <motion.canvas
                    ref={canvasRef}
                    aria-hidden="true"
                    style={{ scale: reduceMotion ? 1.04 : sceneScale }}
                    className="w-full h-full object-cover relative z-0"
                />
                <motion.canvas
                    ref={foregroundRef}
                    aria-hidden="true"
                    style={{ scale: reduceMotion ? 1.04 : sceneScale, opacity: foregroundOpacity }}
                    className="absolute inset-0 w-full h-full object-cover z-30 pointer-events-none"
                />

                {/* Scrollytelling Overlays */}
                <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-center items-center">
                    {/* Beat A (Primary H1) */}
                    <motion.div
                        style={{ opacity: opacityA, y: reduceMotion ? "-11vh" : titleY }}
                        className={`${styles.beat} ${styles.openingBeat}`}
                    >
                        <p className={styles.eyebrow}>
                            RECRUTAMENTO DE CONSTRUÇÃO CIVIL
                        </p>
                        <h1
                            className={`${styles.title} ${styles.sceneTitle}`}
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
                    animate={{ y: reduceMotion ? 0 : 8 }}
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
