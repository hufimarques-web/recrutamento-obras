"use client";

import { motion } from "framer-motion";
import { Sparkles, Layers, ShieldCheck, Sun, Building } from "lucide-react";

const experiencePoints = [
    {
        title: "Estão nas paredes que levantaste.",
        icon: Layers,
    },
    {
        title: "Nos acabamentos que deixaste perfeitos.",
        icon: Sparkles,
    },
    {
        title: "Nos problemas que aprendeste a resolver.",
        icon: ShieldCheck,
    },
    {
        title: "Nas manhãs em que começaste antes de muita gente acordar.",
        icon: Sun,
    },
    {
        title: "Nas obras que hoje fazem parte das cidades onde vivemos.",
        icon: Building,
    },
];

export default function ExperienceValue() {
    return (
        <section className="py-20 md:py-28 bg-[#050505] text-white relative overflow-hidden border-t border-zinc-800">
            {/* Ambient Background Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <p className="text-xs uppercase tracking-[0.25em] text-[#E0C097] font-bold mb-4">
                        A Tua Trajetória
                    </p>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-8 text-white leading-tight">
                        ANOS DE EXPERIÊNCIA NÃO CABEM NUMA FOLHA DE PAPEL.
                    </h2>
                </div>

                {/* Grid of Statements */}
                <div className="max-w-4xl mx-auto space-y-4 mb-16">
                    {experiencePoints.map((pt, idx) => {
                        const Icon = pt.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 md:p-8 rounded-2xl bg-zinc-900/60 backdrop-blur-md border border-zinc-800 hover:border-[#E0C097]/40 transition-colors flex items-center gap-6"
                            >
                                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-[#E0C097] flex-shrink-0">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <p className="text-base md:text-xl font-medium text-zinc-200">
                                    {pt.title}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Conclusion Callout */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center p-8 md:p-12 rounded-3xl bg-gradient-to-b from-zinc-900 to-black border border-[#E0C097]/30 shadow-2xl"
                >
                    <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                        O teu trabalho tem valor.
                    </p>
                    <p className="text-base md:text-lg text-zinc-300 font-light mt-3 leading-relaxed">
                        E queremos ajudar-te a encontrar empresas que estejam à procura daquilo que sabes fazer.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
