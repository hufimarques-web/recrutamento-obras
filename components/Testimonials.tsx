"use client"; // Updated locations

import { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
    {
        id: 1,
        name: "Ana Silva",
        location: "Esgueira",
        title: "A Precisão do Detalhe",
        text: "A transformação da nossa cozinha superou todas as expectativas. O nível de detalhe no acabamento é impressionante. Cada canto foi pensado para funcionalidade sem sacrificar a beleza.",
        rating: 5,
        image: "/testimonial-ana.jpg",
        alignment: "right"
    },
    {
        id: 2,
        name: "Carlos Ferreira",
        location: "Barrocas",
        title: "Visão Minimalista",
        text: "Profissionalismo do início ao fim. A equipa entendeu perfeitamente a nossa visão de luxo minimalista. Transformaram um espaço datado numa obra de arte moderna.",
        rating: 5,
        image: "/testimonial-carlos.jpg",
        alignment: "left"
    },
    {
        id: 3,
        name: "Mariana Costa",
        location: "Aradas",
        title: "O Coração da Casa",
        text: "Os materiais selecionados são de altíssima qualidade. O nosso espaço gourmet é agora o coração da casa, onde recebemos amigos e família com orgulho.",
        rating: 5,
        image: "/testimonial-mariana.jpg",
        alignment: "right"
    },
];

function TestimonialCard({ t, i, progress }: { t: typeof testimonials[0], i: number, progress: MotionValue<number> }) {
    // Range for this specific card's animation based on total scroll progress
    const start = i * 0.3;
    const end = start + 0.3;

    const opacity = useTransform(progress, [start, start + 0.05, end - 0.01, end], [0.3, 1, 1, 0.3]);
    const scale = useTransform(progress, [start, start + 0.05, end - 0.01, end], [0.95, 1, 1, 0.95]);

    const isRightAligned = t.alignment === "right";

    return (
        <div className="relative mb-20 md:mb-32">
            {/* Center Dot Indicator */}
            <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-gray-900 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block" />

            <div className="container mx-auto px-6">
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${isRightAligned ? 'md:text-right' : ''}`}>

                    {/* Image Side */}
                    <div className={`relative ${isRightAligned ? 'md:order-2' : 'md:order-1'}`}>
                        <div className="sticky top-32">
                            <motion.div
                                style={{ opacity, scale }}
                                className="relative overflow-hidden rounded-2xl w-full bg-gray-50 shadow-2xl"
                            >
                                <Image
                                    src={t.image}
                                    alt={t.name}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="w-full h-auto transition-transform duration-700 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/10"></div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Text Side */}
                    <div className={`relative ${isRightAligned ? 'md:order-1' : 'md:order-2'}`}>
                        <div className="sticky top-32">
                            <motion.div
                                style={{ opacity, scale }}
                                className="space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-100 shadow-sm"
                            >
                                <div className={`flex gap-1 mb-4 text-[#E0C097] ${isRightAligned ? 'justify-end' : 'justify-start'}`}>
                                    {[...Array(t.rating)].map((_, idx) => (
                                        <Star key={idx} size={18} fill="currentColor" />
                                    ))}
                                </div>
                                <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-gray-900 mb-2">
                                    {t.title}
                                </h3>
                                <p className="text-gray-500 text-xs uppercase tracking-[0.2em] mb-6 font-semibold">
                                    {t.location}
                                </p>
                                <p className="text-lg md:text-xl leading-relaxed text-gray-700 font-light">
                                    "{t.text}"
                                </p>
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <h4 className="font-bold text-lg text-gray-900">{t.name}</h4>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default function Testimonials() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <section ref={containerRef} id="projetos" className="relative py-20 bg-white">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />

            {/* Intro Header */}
            <div className="relative z-10 container mx-auto px-6 mb-24 text-center">
                <h2 className="text-4xl md:text-6xl font-black tracking-wider mb-6 text-gray-900">
                    HISTÓRIAS REAIS
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                    Cada projeto é uma jornada única. Aqui estão algumas das transformações que realizamos.
                </p>
            </div>

            <div className="relative">
                {/* Vertical Line Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2 hidden md:block" />

                {testimonials.map((t, i) => (
                    <TestimonialCard key={t.id} t={t} i={i} progress={scrollYProgress} />
                ))}
            </div>

            {/* Padding at bottom for clean exit */}
            <div className="h-32" />
        </section>
    );
}
