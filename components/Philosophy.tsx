"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";

const checkpoints = [
    { title: "Candidatura gratuita", desc: "Sem taxas nem comissões para o trabalhador." },
    { title: "Empresas à procura de profissionais", desc: "Empresas que estão à procura de trabalhadores." },
    { title: "Oportunidades de acordo com o teu perfil", desc: "Vagas compatíveis com a tua experiência e localização." },
    { title: "Acompanhamento durante o processo", desc: "Apoio e transparência em todas as fases da candidatura." },
];

export default function Philosophy() {
    const scrollToForm = (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById("candidatura");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section id="sobre" className="py-20 md:py-28 bg-gray-50 text-black overflow-hidden relative">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left side - Eyebrow, Heading, and Illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-xs uppercase tracking-[0.2em] text-[#b89568] font-bold mb-4">
                            Recrutamento Direto
                        </p>

                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-8 text-gray-900">
                            TU SABES TRABALHAR.
                            <br />
                            <span className="relative inline-block font-extrabold text-black">
                                NÓS AJUDAMOS-TE
                                <svg
                                    className="absolute -bottom-2 left-0 w-full h-4 overflow-visible"
                                    viewBox="0 0 200 12"
                                    preserveAspectRatio="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <motion.path
                                        d="M0 8 Q50 2, 100 6 T200 8"
                                        stroke="#E0C097"
                                        strokeWidth="3"
                                        fill="none"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                                        viewport={{ once: true }}
                                    />
                                </svg>
                            </span>
                            <br />
                            A ENCONTRAR QUEM PRECISA DE TI.
                        </h2>

                        <div className="w-full relative rounded-3xl overflow-hidden shadow-xl bg-gray-900/5 p-4 md:p-6 border border-gray-200/80">
                            <Image
                                src="/philosophy-illustration.png"
                                alt="Construção e Recrutamento"
                                width={600}
                                height={600}
                                className="w-full h-auto object-cover rounded-2xl mix-blend-multiply opacity-90"
                            />
                        </div>
                    </motion.div>

                    {/* Right side - Text and Checkpoints */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="flex flex-col justify-center"
                    >
                        <p className="text-gray-700 mb-8 text-base md:text-lg leading-relaxed font-medium">
                            Encontrar uma boa oportunidade na construção não devia depender de conhecer a pessoa certa. Criámos uma rede que aproxima profissionais da construção de empresas que estão realmente à procura de trabalhadores.
                        </p>
                        <p className="text-gray-600 mb-10 text-base md:text-lg leading-relaxed">
                            Dizes-nos o que sabes fazer, onde estás e que tipo de trabalho procuras. Nós tratamos de aproximar o teu perfil das oportunidades certas.
                        </p>

                        <div className="space-y-4 mb-10">
                            {checkpoints.map((cp, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100 hover:border-amber-200 transition-colors"
                                >
                                    <CheckCircle2 className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">
                                            {cp.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {cp.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div>
                            <button
                                onClick={scrollToForm}
                                className="group inline-flex items-center gap-3 bg-black hover:bg-zinc-800 text-white font-bold text-sm md:text-base px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
                            >
                                <span>ENVIAR O MEU CURRÍCULO</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-[#E0C097]" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
