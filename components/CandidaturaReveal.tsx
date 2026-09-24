"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import CandidaturaForm from "./CandidaturaForm";

export default function CandidaturaReveal() {
    const stageRef = useRef<HTMLElement>(null);
    const reducedMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: stageRef,
        offset: ["start end", "start start"],
    });
    const frame = useTransform(
        scrollYProgress,
        [0, 0.45, 1],
        ["inset(22% 20% 12% 20%)", "inset(22% 20% 12% 20%)", "inset(0% 0% 0% 0%)"]
    );

    return (
        <section ref={stageRef} aria-label="Candidatura à rede de profissionais" className="relative bg-white">
            {/* The original white frame opens onto the blurred construction image.
                Only the decorative background is clipped: the form stays usable
                through anchors, keyboard navigation and at any viewport height. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="sticky top-0 h-[100svh] overflow-hidden">
                    <motion.div
                        className="absolute inset-0 overflow-hidden bg-zinc-800"
                        style={{ clipPath: reducedMotion ? "inset(0)" : frame }}
                    >
                        <div className="absolute -inset-3 bg-[url('/cta-construction.png')] bg-cover bg-center blur-[4px]" />
                        <div className="absolute inset-0 bg-black/45" />
                    </motion.div>
                </div>
            </div>

            {!reducedMotion && <div aria-hidden="true" className="relative h-[65svh] md:h-[80svh]" />}
            <div className="relative">
                <CandidaturaForm embedded />
            </div>
        </section>
    );
}
