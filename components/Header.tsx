"use client";

import { useEffect, useState } from "react";
import { Menu, FileText, UserCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Header() {
    const [isVisible, setIsVisible] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            // Always keep header responsive to scrolling
            setIsVisible(true);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleScrollToCandidatura = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsMenuOpen(false);
        const candidaturaSection = document.getElementById('candidatura');
        if (candidaturaSection) {
            candidaturaSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleScrollToSection = (id: string) => {
        setIsMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[9999] px-4 md:px-6 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="container mx-auto flex items-start justify-end">
                {/* Floating Menu Wrapper */}
                <div className="relative mt-2 md:mt-4 flex flex-col items-end">
                    {/* Floating Menu Pill */}
                    <div className="relative z-50 rounded-full p-[2px] overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 animate-spin bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#000000_50%,#E2E8F0_100%)] opacity-100" style={{ animationDuration: '3s' }} />
                        <div className="relative flex items-center gap-2 md:gap-3 bg-white rounded-full px-2 py-2 md:pl-5 backdrop-blur-3xl">
                            <button 
                                onClick={handleScrollToCandidatura} 
                                className="hidden md:flex items-center gap-2 px-4 py-2 bg-black hover:bg-[#333] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-transform active:scale-95 cursor-pointer shadow-md"
                            >
                                <UserCheck className="w-4 h-4 text-[#E0C097]" />
                                <span>Candidatar</span>
                            </button>

                            <button 
                                onClick={handleScrollToCandidatura} 
                                aria-label="Enviar currículo"
                                className="md:hidden p-2.5 bg-black hover:bg-[#333] rounded-full transition-colors cursor-pointer relative z-10 active:scale-95 border-none"
                            >
                                <FileText className="w-4 h-4 text-white" />
                            </button>

                            <div className="hidden md:block h-6 w-[1px] bg-gray-200 mx-1"></div>

                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 px-2 md:pr-4 group relative z-10 cursor-pointer"
                                aria-label="Abrir menu de navegação"
                            >
                                <span className={`hidden md:block font-semibold text-xs uppercase tracking-wider transition-colors ${isMenuOpen ? 'text-[#E0C097]' : 'text-black group-hover:text-[#E0C097]'}`}>
                                    {isMenuOpen ? 'Fechar' : 'Menu'}
                                </span>
                                <Menu className={`w-6 h-6 transition-colors ${isMenuOpen ? 'text-[#E0C097]' : 'text-black group-hover:text-[#E0C097]'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute top-full right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-40"
                            >
                                <div className="flex flex-col py-2">
                                    <button
                                        onClick={() => handleScrollToSection('inicio')}
                                        className="text-left px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 hover:text-[#E0C097] transition-colors"
                                    >
                                        Início
                                    </button>
                                    <button
                                        onClick={() => handleScrollToSection('sobre')}
                                        className="text-left px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 hover:text-[#E0C097] transition-colors"
                                    >
                                        Porquê Nós
                                    </button>
                                    <button
                                        onClick={() => handleScrollToSection('profissoes')}
                                        className="text-left px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 hover:text-[#E0C097] transition-colors"
                                    >
                                        Profissões
                                    </button>
                                    <button
                                        onClick={() => handleScrollToSection('como-funciona')}
                                        className="text-left px-5 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 hover:text-[#E0C097] transition-colors"
                                    >
                                        Como Funciona
                                    </button>
                                    <button
                                        onClick={() => handleScrollToSection('candidatura')}
                                        className="text-left px-5 py-3 text-sm font-bold text-black hover:bg-amber-50 hover:text-amber-700 transition-colors border-t border-gray-100 mt-1"
                                    >
                                        Formulário Candidatura →
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    );
}
