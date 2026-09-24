"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
    const scrollToForm = (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById("candidatura");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="py-20 md:py-28 bg-gradient-to-b from-[#050505] to-[#0d0d0d] text-white text-center relative border-t border-zinc-800/80">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <p className="text-xs uppercase tracking-[0.25em] text-[#E0C097] font-bold mb-4">
                        O Teu Próximo Passo
                    </p>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white mb-6">
                        JÁ CONSTRUÍSTE MUITO PARA OS OUTROS.
                        <br />
                        <span className="text-[#E0C097]">AGORA CONSTRÓI ALGO PARA TI.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-zinc-300 font-light mb-10">
                        O próximo passo pode começar com uma candidatura.
                    </p>

                    <div>
                        <button
                            onClick={scrollToForm}
                            className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#E0C097] to-[#b89568] hover:from-[#eed0a7] hover:to-[#cfa372] text-black font-extrabold text-sm md:text-base px-10 py-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
                        >
                            <span>ENVIAR O MEU CURRÍCULO</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
