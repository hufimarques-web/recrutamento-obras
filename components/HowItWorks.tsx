"use client";

import { motion } from "framer-motion";
import { FileUp, SearchCheck, Building2, CheckCircle, ArrowRight } from "lucide-react";

const steps = [
    {
        number: "01",
        title: "1. Envia o teu currículo",
        desc: "Conta-nos quem és, a tua experiência, profissão, localização e disponibilidade.",
        icon: FileUp,
    },
    {
        number: "02",
        title: "2. Conhecemos o teu perfil",
        desc: "Analisamos a tua experiência e procuramos oportunidades compatíveis contigo.",
        icon: SearchCheck,
    },
    {
        number: "03",
        title: "3. Aproximamos-te de empresas",
        desc: "Quando existir uma oportunidade adequada, podemos entrar em contacto contigo e apresentar o teu perfil à empresa.",
        icon: Building2,
    },
    {
        number: "04",
        title: "4. A decisão é tua",
        desc: "Conheces as condições e decides se a oportunidade faz sentido para ti.",
        icon: CheckCircle,
    },
];

export default function HowItWorks() {
    const scrollToForm = (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById("candidatura");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section id="como-funciona" className="py-20 md:py-28 bg-white text-black relative">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <p className="text-xs uppercase tracking-[0.25em] text-[#b89568] font-bold mb-4">
                        Processo Simples
                    </p>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-gray-900 leading-tight">
                        O TEU PRÓXIMO TRABALHO PODE COMEÇAR AQUI.
                    </h2>
                    <div className="inline-block bg-amber-100 border border-amber-300 rounded-full px-5 py-2">
                        <p className="text-xs md:text-sm font-bold text-amber-900 uppercase tracking-wide">
                            Sem custos para o trabalhador.
                        </p>
                    </div>
                </div>

                {/* Steps Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="relative p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-black text-[#E0C097] flex items-center justify-center shadow-md">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-xs font-mono font-bold text-gray-400">
                                            PASSO {step.number}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <button
                        onClick={scrollToForm}
                        className="group inline-flex items-center gap-3 bg-black hover:bg-zinc-800 text-white font-bold text-sm md:text-base px-8 py-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
                    >
                        <span>QUERO CANDIDATAR-ME</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-[#E0C097]" />
                    </button>
                </div>
            </div>
        </section>
    );
}
