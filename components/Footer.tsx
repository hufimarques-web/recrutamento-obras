import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-[#0a0a0a] text-white py-14 border-t border-zinc-900">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                    {/* Brand Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-3 text-white uppercase tracking-wider">
                            Recrutamento de Construção
                        </h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Plataforma de aproximação de profissionais qualificados a oportunidades de emprego na construção civil.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-sm font-bold mb-3 text-zinc-300 uppercase tracking-wider">
                            Navegação
                        </h3>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li>
                                <Link href="#inicio" className="hover:text-[#E0C097] transition-colors">
                                    Início
                                </Link>
                            </li>
                            <li>
                                <Link href="#sobre" className="hover:text-[#E0C097] transition-colors">
                                    Porquê Nós
                                </Link>
                            </li>
                            <li>
                                <Link href="#profissoes" className="hover:text-[#E0C097] transition-colors">
                                    Profissões Procuradas
                                </Link>
                            </li>
                            <li>
                                <Link href="#como-funciona" className="hover:text-[#E0C097] transition-colors">
                                    Como Funciona
                                </Link>
                            </li>
                            <li>
                                <Link href="#candidatura" className="hover:text-[#E0C097] transition-colors font-medium">
                                    Formulário de Candidatura
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Information */}
                    <div>
                        <h3 className="text-sm font-bold mb-3 text-zinc-300 uppercase tracking-wider">
                            Informação
                        </h3>
                        <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                            Candidatura gratuita • Sem compromisso
                        </p>
                    </div>
                </div>

                {/* Bottom Copyright */}
                <div className="border-t border-zinc-800/60 pt-6 text-center text-zinc-500 text-xs">
                    <p>&copy; {new Date().getFullYear()} Recrutamento de Construção. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
