"use client";

import { motion } from "framer-motion";
import { Hammer, Wrench, Zap, Pipette, Paintbrush, Grid, Flame, HardHat, UserCheck, ShieldCheck, ArrowRight } from "lucide-react";

const professions = [
    { name: "Pedreiros", icon: HardHat },
    { name: "Carpinteiros", icon: Hammer },
    { name: "Eletricistas", icon: Zap },
    { name: "Canalizadores", icon: Pipette },
    { name: "Pintores", icon: Paintbrush },
    { name: "Ladrilhadores", icon: Grid },
    { name: "Soldadores", icon: Flame },
    { name: "Operadores de máquinas", icon: Wrench },
    { name: "Serventes", icon: UserCheck },
    { name: "Encarregados", icon: ShieldCheck },
];

export default function Professions() {
    const scrollToForm = (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById("candidatura");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section id="profissoes" className="py-20 md:py-28 bg-[#0a0a0a] text-white relative border-t border-zinc-800">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <p className="text-xs uppercase tracking-[0.25em] text-[#E0C097] font-bold mb-4">
                        Perfis Procurados
                    </p>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-white leading-tight">
                        A CONSTRUÇÃO PRECISA DE PESSOAS COMO TU.
                    </h2>
                    <p className="text-lg md:text-xl text-zinc-400 font-light">
                        Se sabes trabalhar, queremos conhecer-te.
                    </p>
                </div>

                {/* Professions Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 mb-16">
                    {professions.map((p, idx) => {
                        const Icon = p.icon;
                        return (
                            <motion.div
                                key={p.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                viewport={{ once: true }}
                                className="group p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-[#E0C097]/50 hover:bg-zinc-800/90 transition-all duration-300 flex flex-col items-center text-center shadow-lg"
                            >
                                <div className="w-12 h-12 rounded-xl bg-zinc-800 group-hover:bg-[#E0C097] group-hover:text-black text-[#E0C097] flex items-center justify-center mb-4 transition-colors duration-300">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-sm md:text-base font-bold text-zinc-100 group-hover:text-white transition-colors">
                                    {p.name}
                                </h3>
                            </motion.div>
                        );
                    })}

                    {/* Extra badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="col-span-2 sm:col-span-3 md:col-span-5 p-6 rounded-2xl bg-gradient-to-r from-amber-900/20 via-zinc-900 to-amber-900/20 border border-amber-500/30 text-center"
                    >
                        <p className="text-base md:text-lg font-semibold text-amber-200">
                            E muitos outros profissionais.
                        </p>
                    </motion.div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <button
                        onClick={scrollToForm}
                        className="group inline-flex items-center gap-3 bg-[#E0C097] hover:bg-[#ebd0ad] text-black font-bold text-sm md:text-base px-8 py-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
                    >
                        <span>FAZER CANDIDATURA</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
}
