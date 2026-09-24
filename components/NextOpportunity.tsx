"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

const reasons = [
    "Talvez queiras ganhar melhor.",
    "Talvez procures trabalhar mais perto de casa.",
    "Talvez a obra onde estás esteja a terminar.",
    "Ou talvez simplesmente sintas que chegou a altura de mudar.",
];

export default function NextOpportunity() {
    const scrollToForm = (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById("candidatura");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="py-20 md:py-28 bg-gray-900 text-white relative">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <p className="text-xs uppercase tracking-[0.25em] text-[#E0C097] font-bold mb-4">
                            Nova Etapa
                        </p>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white mb-8">
                            NÃO PROCURES APENAS O PRÓXIMO TRABALHO.
                            <br />
                            <span className="text-[#E0C097]">PROCURA A PRÓXIMA OPORTUNIDADE.</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        {reasons.map((reason, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center gap-4"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#E0C097]/20 text-[#E0C097] flex items-center justify-center flex-shrink-0">
                                    <Check className="w-5 h-5" />
                                </div>
                                <p className="text-base md:text-lg font-medium text-zinc-100">
                                    {reason}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center bg-zinc-800/50 p-8 rounded-3xl border border-zinc-700/50 mb-12"
                    >
                        <p className="text-base md:text-xl text-zinc-300 leading-relaxed font-light">
                            Não precisas de decidir tudo hoje. Começa por nos dizer quem és e o que sabes fazer. Quando surgir uma oportunidade adequada ao teu perfil, podemos falar contigo.
                        </p>
                    </motion.div>

                    <div className="text-center">
                        <button
                            onClick={scrollToForm}
                            className="group inline-flex items-center gap-3 bg-[#E0C097] hover:bg-[#ebd0ad] text-black font-bold text-sm md:text-base px-8 py-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
                        >
                            <span>ENVIAR CURRÍCULO GRATUITAMENTE</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
