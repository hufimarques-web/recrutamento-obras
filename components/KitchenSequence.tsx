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
    const finalForegroundRef = useRef<HTMLCanvasElement>(null);
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

    const frameIndex = useTransform(smoothProgress, [0, 0.24, 0.76, 1], [0, 0, FRAME_COUNT - 1, FRAME_COUNT - 1]);

    // Opacity transforms: opacityA starts at 1 immediately on page load
    // Hold the opening frame while the heading moves behind its real island outline.
    const opacityA = useTransform(smoothProgress, [0, 0.14, 0.23], [1, 1, 0]);
    const titleY = useTransform(smoothProgress, [0, 0.23], ["-9vh", "26vh"]);
    const sceneScale = useTransform(smoothProgress, [0, 0.24, 0.76, 1], [1.04, 1.10, 1.10, 1.16]);
    const foregroundOpacity = useTransform(smoothProgress, (v) => v < 0.24 ? 1 : 0);
    const opacityB = useTransform(smoothProgress, [0.24, 0.28, 0.46, 0.50], [0, 1, 1, 0]);
    const opacityC = useTransform(smoothProgress, [0.50, 0.54, 0.72, 0.76], [0, 1, 1, 0]);
    const opacityD = useTransform(smoothProgress, [0.76, 0.80, 0.98, 1.0], [0, 1, 1, 1]);

    const readabilityOpacity = useTransform(smoothProgress, [0.20, 0.28, 0.70, 0.76], [0, 1, 1, 0]);
    const finalForegroundOpacity = useTransform(smoothProgress, (v) => v >= 0.76 ? 1 : 0);
    const finalTitleY = useTransform(smoothProgress, [0.76, 0.82, 1], ["-11vh", "-11vh", "26vh"]);
    const finalTextOpacity = useTransform(smoothProgress, [0.76, 0.80, 0.97, 1], [0, 1, 1, 0]);

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
        const finalForeground = finalForegroundRef.current;
        const firstImage = images[0];
        if (!canvas || !foreground || !finalForeground || !firstImage) return;
        const ctx = canvas.getContext("2d");
        const foregroundCtx = foreground.getContext("2d");
        const finalCtx = finalForeground.getContext("2d");
        if (!ctx || !foregroundCtx || !finalCtx) return;

        const width = firstImage.naturalWidth;
        const height = firstImage.naturalHeight;
        canvas.width = foreground.width = finalForeground.width = width;
        canvas.height = foreground.height = finalForeground.height = height;

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

        // The last photograph is held for the closing parallax, so its island
        // can occlude the heading without drifting against the renovation frames.
        const finalIsland = new Path2D(mobile
            ? "M0 850 L95 811 L343 811 L346 726 L352 726 L354 811 L496 811 Q533 795 586 811 L616 812 L714 861 L714 1162 L0 1162 Z"
            : "M464 728 L602 688 L627 688 L629 682 Q675 678 724 683 L729 692 L735 692 L735 675 L750 675 L750 693 L931 693 L931 582 L938 580 L942 696 L1256 696 L1257 664 Q1303 657 1351 666 L1366 695 L1417 693 L1537 728 L1537 1047 L464 1047 Z");
        finalCtx.save();
        finalCtx.scale(width / (mobile ? 720 : 1920), height / (mobile ? 1280 : 1080));
        finalCtx.clip(finalIsland);
        finalCtx.drawImage(images[images.length - 1], 0, 0, mobile ? 720 : 1920, mobile ? 1280 : 1080);
        finalCtx.restore();

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
                        className={`${styles.sceneImage} object-cover scale-[1.04] md:hidden`}
                        priority
                    />
                    <NextImage
                        src="/sequence/ezgif-frame-001.jpg"
                        alt="Hero Desktop"
                        fill
                        className={`${styles.sceneImage} object-cover scale-[1.04] hidden md:block`}
                        priority
                    />
                </div>

                <motion.canvas
                    ref={canvasRef}
                    aria-hidden="true"
                    style={{ scale: reduceMotion ? 1.04 : sceneScale }}
                    className={`${styles.sceneImage} w-full h-full object-cover relative z-0`}
                />
                <motion.canvas
                    ref={foregroundRef}
                    aria-hidden="true"
                    style={{ scale: reduceMotion ? 1.04 : sceneScale, opacity: foregroundOpacity }}
                    className={`${styles.sceneImage} absolute inset-0 w-full h-full object-cover z-30 pointer-events-none`}
                />

                <motion.canvas
                    ref={finalForegroundRef}
                    aria-hidden="true"
                    style={{ scale: reduceMotion ? 1.04 : sceneScale, opacity: finalForegroundOpacity }}
                    className={`${styles.sceneImage} absolute inset-0 w-full h-full object-cover z-30 pointer-events-none`}
                />

                <motion.div
                    aria-hidden="true"
                    style={{ opacity: readabilityOpacity }}
                    className={styles.readabilityBackdrop}
                />

                {/* Scrollytelling Overlays */}
                <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-center items-center">
                    {/* Beat A (Primary H1) */}
                    <motion.div
                        style={{ opacity: opacityA, y: reduceMotion ? "-9vh" : titleY }}
                        className={`${styles.beat} ${styles.openingBeat}`}
                    >
                        <h1 className={`${styles.title} ${styles.sceneTitle}`}>
                            Constrói o teu futuro.
                        </h1>
                        <p className={styles.openingSubtitle}>
                            Novas oportunidades na construção.
                        </p>
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
                        style={{ opacity: finalTextOpacity, y: reduceMotion ? "-11vh" : finalTitleY }}
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
                    </motion.div>
                </div>

                <motion.div
                    style={{ opacity: opacityD, pointerEvents: pointerEventsD }}
                    className={styles.finalCta}
                >
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
                </motion.div>

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
