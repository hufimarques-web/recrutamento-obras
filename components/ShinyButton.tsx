"use client";

import React, { useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";

export default function ShinyButton() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                const rect = parent.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;
            }
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let animationFrameId: number;
        let time = 0;

        const render = () => {
            time += 0.03;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const x = canvas.width / 2;
            const y = canvas.height / 2;
            
            const gradient = ctx.createLinearGradient(
                x + Math.cos(time) * x, y + Math.sin(time) * y,
                x - Math.cos(time) * x, y - Math.sin(time) * y
            );
            
            gradient.addColorStop(0, "rgba(224, 192, 151, 0.1)");
            gradient.addColorStop(0.3, "rgba(224, 192, 151, 0.4)");
            gradient.addColorStop(0.5, "rgba(224, 192, 151, 1)"); // Gold
            gradient.addColorStop(0.7, "rgba(224, 192, 151, 0.4)");
            gradient.addColorStop(1, "rgba(224, 192, 151, 0.1)");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <button className="group transition-transform duration-300 hover:scale-105 active:scale-95 border-none outline-none cursor-pointer">
            <div className="rounded-full">
                <div className="relative" style={{ borderRadius: "9999px", padding: "2px" }}>
                    <div className="absolute inset-0 z-0 overflow-hidden" style={{ borderRadius: "9999px", opacity: 1 }}>
                        <div data-paper-shader="" style={{ width: "100%", height: "100%" }}>
                            <canvas ref={canvasRef} className="w-full h-full block rounded-full"></canvas>
                        </div>
                    </div>
                    <div className="relative z-10" style={{ borderRadius: "9997px" }}>
                        <div className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-900 shadow-xl border border-white/5">
                            <span className="text-sm font-bold transition-colors text-zinc-200 uppercase tracking-widest pl-2">
                                PEDIR ORÇAMENTO GRÁTIS
                            </span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all duration-300 text-zinc-200 ml-2" />
                        </div>
                    </div>
                </div>
            </div>
        </button>
    );
}
