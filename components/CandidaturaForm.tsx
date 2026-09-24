"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, FileCheck, AlertCircle, X, ShieldAlert, ArrowRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
    nome: string;
    telefone: string;
    email: string;
    localidade: string;
    profissao: string;
    experiencia: string;
    cartaConducao: string;
    transporteProprio: string;
    disponibilidade: string;
    consentimento: boolean;
}

interface FormErrors {
    nome?: string;
    telefone?: string;
    email?: string;
    localidade?: string;
    profissao?: string;
    experiencia?: string;
    cartaConducao?: string;
    transporteProprio?: string;
    disponibilidade?: string;
    curriculo?: string;
    consentimento?: string;
}

export default function CandidaturaForm({ embedded = false }: { embedded?: boolean }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const submissionKey = useRef<string>("");
    const sendingRef = useRef(false);
    const privacyTriggerRef = useRef<HTMLButtonElement>(null);
    
    const [formData, setFormData] = useState<FormData>({
        nome: "",
        telefone: "",
        email: "",
        localidade: "",
        profissao: "",
        experiencia: "",
        cartaConducao: "",
        transporteProprio: "",
        disponibilidade: "",
        consentimento: false,
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submissionStatus, setSubmissionStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [reference, setReference] = useState("");
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    // Escape key listener for Privacy Modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && showPrivacyModal) {
                setShowPrivacyModal(false);
                privacyTriggerRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showPrivacyModal]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        submissionKey.current = "";
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        submissionKey.current = "";
        setFileError(null);
        setErrors(prev => ({ ...prev, curriculo: undefined }));

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const allowedTypes = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ];
            const allowedExtensions = [".pdf", ".doc", ".docx"];
            const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

            if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) {
                setFileError("Formato de ficheiro inválido. Por favor envie PDF, DOC ou DOCX.");
                setSelectedFile(null);
                return;
            }

            const maxSizeInBytes = 10 * 1024 * 1024;
            if (file.size > maxSizeInBytes) {
                setFileError("O ficheiro excede o tamanho máximo de 10MB.");
                setSelectedFile(null);
                return;
            }

            setSelectedFile(file);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        submissionKey.current = "";
        setFileError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!formData.nome.trim()) {
            newErrors.nome = "Por favor preencha o seu nome.";
        }

        const phoneDigits = formData.telefone.replace(/\D/g, "");
        if (!formData.telefone.trim()) {
            newErrors.telefone = "Por favor preencha o seu telefone.";
        } else if (phoneDigits.length < 9) {
            newErrors.telefone = "Por favor introduza um número de telefone válido (mínimo 9 dígitos).";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Por favor preencha o seu email.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Por favor introduza um email válido.";
        }

        if (!formData.localidade.trim()) {
            newErrors.localidade = "Por favor preencha a sua localidade.";
        }
        if (!formData.profissao) {
            newErrors.profissao = "Por favor selecione a sua profissão.";
        }
        if (!formData.experiencia) {
            newErrors.experiencia = "Por favor selecione os anos de experiência.";
        }
        if (!formData.cartaConducao) {
            newErrors.cartaConducao = "Por favor selecione se tem carta de condução.";
        }
        if (!formData.transporteProprio) {
            newErrors.transporteProprio = "Por favor selecione se tem transporte próprio.";
        }
        if (!formData.disponibilidade) {
            newErrors.disponibilidade = "Por favor selecione a sua disponibilidade.";
        }
        if (!formData.consentimento) {
            newErrors.consentimento = "É necessário autorizar o tratamento dos dados.";
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (sendingRef.current || submissionStatus === "success") return;

        // Freshly computed errors for current submit attempt
        const validationErrors = validateForm();
        setErrors(validationErrors);

        const errorKeys = Object.keys(validationErrors);
        if (errorKeys.length > 0) {
            const firstErrorField = errorKeys[0];
            if (firstErrorField === "cartaConducao") {
                document.getElementById("cartaConducao-sim")?.focus();
            } else if (firstErrorField === "transporteProprio") {
                document.getElementById("transporteProprio-sim")?.focus();
            } else if (firstErrorField === "disponibilidade") {
                document.getElementById("disponibilidade-imediata")?.focus();
            } else {
                const element = document.getElementById(firstErrorField);
                element?.focus();
            }
            return;
        }

        if (fileError) { setErrors(previous => ({...previous, curriculo: fileError})); return; }
        sendingRef.current = true;
        setSubmissionStatus("sending");
        setSubmissionMessage("");
        if (!submissionKey.current) submissionKey.current = crypto.randomUUID();
        const payload = new window.FormData();
        Object.entries(formData).forEach(([key,value]) => payload.append(key,String(value)));
        if (selectedFile) payload.append("curriculo",selectedFile);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 45000);
        try {
            const response = await fetch("/api/candidaturas",{method:"POST",body:payload,headers:{"Idempotency-Key":submissionKey.current},signal:controller.signal});
            const result = await response.json();
            if (!response.ok) {
                if (response.status === 409) submissionKey.current = "";
                throw new Error(result.error || "Não foi possível enviar. Tenta novamente.");
            }
            setReference(result.reference);
            setSubmissionStatus("success");
        } catch (error) {
            setSubmissionStatus("error");
            setSubmissionMessage(error instanceof Error && error.name !== "AbortError" ? error.message : "Não conseguimos confirmar o envio. Tenta novamente; a candidatura não será duplicada.");
        } finally { clearTimeout(timeout); sendingRef.current = false; }

    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + " KB";
        }
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    return (
        <section id="candidatura" className={`py-20 md:py-28 text-white relative scroll-mt-4 ${embedded ? "bg-transparent" : "bg-[#050505] border-t border-zinc-800"}`}>
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-10" style={embedded ? { textShadow: "0 2px 14px rgba(0,0,0,0.85)" } : undefined}>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#E0C097] font-bold mb-4">
                        Candidatura Rápida
                    </p>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
                        O TEU FUTURO TAMBÉM SE CONSTRÓI.
                    </h2>
                    <p className="text-gray-300 text-base md:text-lg font-light max-w-2xl mx-auto">
                        Preenche o formulário e junta-te à nossa rede de profissionais da construção.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-zinc-900/90 backdrop-blur-xl p-6 md:p-10 rounded-3xl border border-zinc-800 shadow-2xl relative">
                    {/* Discrete Preview Notice */}
                    <div className="mb-8 p-3.5 rounded-2xl bg-zinc-800/80 border border-zinc-700/80 flex items-center gap-3 text-zinc-300 text-xs md:text-sm font-medium">
                        <Info className="w-4 h-4 text-[#E0C097] flex-shrink-0" />
                        <span>Candidatura gratuita. Os teus dados serão utilizados para efeitos de recrutamento.</span>
                    </div>

                    <form onSubmit={handleSubmit} noValidate><fieldset disabled={submissionStatus === "sending" || submissionStatus === "success"} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nome */}
                            <div>
                                <label htmlFor="nome" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                                    Nome <span className="text-amber-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    aria-invalid={!!errors.nome}
                                    aria-describedby={errors.nome ? "nome-error" : undefined}
                                    placeholder="O teu nome completo"
                                    className={`w-full px-4 py-3.5 rounded-xl bg-zinc-800/90 border ${errors.nome ? 'border-red-500 ring-1 ring-red-500/50' : 'border-zinc-700/80 focus:border-[#E0C097]'} text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#E0C097]/20 transition-all text-sm`}
                                />
                                {errors.nome && (
                                    <span id="nome-error" aria-live="polite" className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                                        <AlertCircle className="w-3.5 h-3.5" /> {errors.nome}
                                    </span>
                                )}
                            </div>

                            {/* Telefone */}
                            <div>
                                <label htmlFor="telefone" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                                    Telefone <span className="text-amber-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="telefone"
                                    name="telefone"
                                    value={formData.telefone}
                                    onChange={handleInputChange}
                                    aria-invalid={!!errors.telefone}
                                    aria-describedby={errors.telefone ? "telefone-error" : undefined}
                                    placeholder="Ex: 912 345 678"
                                    className={`w-full px-4 py-3.5 rounded-xl bg-zinc-800/90 border ${errors.telefone ? 'border-red-500 ring-1 ring-red-500/50' : 'border-zinc-700/80 focus:border-[#E0C097]'} text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#E0C097]/20 transition-all text-sm`}
                                />
                                {errors.telefone && (
                                    <span id="telefone-error" aria-live="polite" className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                                        <AlertCircle className="w-3.5 h-3.5" /> {errors.telefone}
                                    </span>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                                    Email <span className="text-amber-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    aria-invalid={!!errors.email}
                                    aria-describedby={errors.email ? "email-error" : undefined}
                                    placeholder="exemplo@email.com"
                                    className={`w-full px-4 py-3.5 rounded-xl bg-zinc-800/90 border ${errors.email ? 'border-red-500 ring-1 ring-red-500/50' : 'border-zinc-700/80 focus:border-[#E0C097]'} text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#E0C097]/20 transition-all text-sm`}
                                />
                                {errors.email && (
                                    <span id="email-error" aria-live="polite" className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                                        <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                                    </span>
                                )}
                            </div>

                            {/* Localidade */}
                            <div>
                                <label htmlFor="localidade" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                                    Localidade <span className="text-amber-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="localidade"
                                    name="localidade"
                                    value={formData.localidade}
                                    onChange={handleInputChange}
                                    aria-invalid={!!errors.localidade}
                                    aria-describedby={errors.localidade ? "localidade-error" : undefined}
                                    placeholder="Cidade ou concelho de residência"
                                    className={`w-full px-4 py-3.5 rounded-xl bg-zinc-800/90 border ${errors.localidade ? 'border-red-500 ring-1 ring-red-500/50' : 'border-zinc-700/80 focus:border-[#E0C097]'} text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#E0C097]/20 transition-all text-sm`}
                                />
                                {errors.localidade && (
                                    <span id="localidade-error" aria-live="polite" className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                                        <AlertCircle className="w-3.5 h-3.5" /> {errors.localidade}
                                    </span>
                                )}
                            </div>

                            {/* Profissão / Especialidade (Select) */}
                            <div>
                                <label htmlFor="profissao" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                                    Profissão / Especialidade <span className="text-amber-500">*</span>
                                </label>
                                <select
                                    id="profissao"
                                    name="profissao"
                                    value={formData.profissao}
                                    onChange={handleInputChange}
                                    aria-invalid={!!errors.profissao}
                                    aria-describedby={errors.profissao ? "profissao-error" : undefined}
                                    className={`w-full px-4 py-3.5 rounded-xl bg-zinc-800/90 border ${errors.profissao ? 'border-red-500 ring-1 ring-red-500/50' : 'border-zinc-700/80 focus:border-[#E0C097]'} text-white focus:outline-none focus:ring-2 focus:ring-[#E0C097]/20 transition-all text-sm cursor-pointer`}
                                >
                                    <option value="" disabled>Seleciona a tua especialidade...</option>
                                    <option value="Pedreiro">Pedreiro</option>
                                    <option value="Carpinteiro">Carpinteiro</option>
                                    <option value="Eletricista">Eletricista</option>
                                    <option value="Canalizador">Canalizador</option>
                                    <option value="Pintor">Pintor</option>
                                    <option value="Ladrilhador">Ladrilhador</option>
                                    <option value="Soldador">Soldador</option>
                                    <option value="Operador de máquinas">Operador de máquinas</option>
                                    <option value="Servente">Servente</option>
                                    <option value="Encarregado">Encarregado</option>
                                    <option value="Outra">Outra</option>
                                </select>
                                {errors.profissao && (
                                    <span id="profissao-error" aria-live="polite" className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                                        <AlertCircle className="w-3.5 h-3.5" /> {errors.profissao}
                                    </span>
                                )}
                            </div>

                            {/* Anos de experiência (Select) */}
                            <div>
                                <label htmlFor="experiencia" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                                    Anos de experiência <span className="text-amber-500">*</span>
                                </label>
                                <select
                                    id="experiencia"
                                    name="experiencia"
                                    value={formData.experiencia}
                                    onChange={handleInputChange}
                                    aria-invalid={!!errors.experiencia}
                                    aria-describedby={errors.experiencia ? "experiencia-error" : undefined}
                                    className={`w-full px-4 py-3.5 rounded-xl bg-zinc-800/90 border ${errors.experiencia ? 'border-red-500 ring-1 ring-red-500/50' : 'border-zinc-700/80 focus:border-[#E0C097]'} text-white focus:outline-none focus:ring-2 focus:ring-[#E0C097]/20 transition-all text-sm cursor-pointer`}
                                >
                                    <option value="" disabled>Seleciona os anos de experiência...</option>
                                    <option value="Menos de 1 ano">Menos de 1 ano</option>
                                    <option value="1 a 3 anos">1 a 3 anos</option>
                                    <option value="3 a 5 anos">3 a 5 anos</option>
                                    <option value="5 a 10 anos">5 a 10 anos</option>
                                    <option value="Mais de 10 anos">Mais de 10 anos</option>
                                </select>
                                {errors.experiencia && (
                                    <span id="experiencia-error" aria-live="polite" className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                                        <AlertCircle className="w-3.5 h-3.5" /> {errors.experiencia}
                                    </span>
                                )}
                            </div>

                            {/* Tens carta de condução? (Radio Group Fieldset/Legend) */}
                            <fieldset className="border-0 p-0 m-0">
                                <legend className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2.5">
                                    Tens carta de condução? <span className="text-amber-500">*</span>
                                </legend>
                                <div className="flex items-center gap-4 py-1">
                                    <label htmlFor="cartaConducao-sim" className="flex items-center gap-2 cursor-pointer text-sm font-medium text-zinc-200">
                                        <input
                                            type="radio"
                                            id="cartaConducao-sim"
                                            name="cartaConducao"
                                            value="Sim"
                                            checked={formData.cartaConducao === "Sim"}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 accent-[#E0C097] cursor-pointer"
                                        />
                                        <span>Sim</span>
                                    </label>
                                    <label htmlFor="cartaConducao-nao" className="flex items-center gap-2 cursor-pointer text-sm font-medium text-zinc-200">
                                        <input
                                            type="radio"
                                            id="cartaConducao-nao"
                                            name="cartaConducao"
                                            value="Não"
                                            checked={formData.cartaConducao === "Não"}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 accent-[#E0C097] cursor-pointer"
                                        />
                                        <span>Não</span>
                                    </label>
                                </div>
                                {errors.cartaConducao && (
                                    <span id="cartaConducao-error" aria-live="polite" className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                                        <AlertCircle className="w-3.5 h-3.5" /> {errors.cartaConducao}
                                    </span>
                                )}
                            </fieldset>

                            {/* Tens transporte próprio? (Radio Group Fieldset/Legend) */}
                            <fieldset className="border-0 p-0 m-0">
                                <legend className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2.5">
                                    Tens transporte próprio? <span className="text-amber-500">*</span>
                                </legend>
                                <div className="flex items-center gap-4 py-1">
                                    <label htmlFor="transporteProprio-sim" className="flex items-center gap-2 cursor-pointer text-sm font-medium text-zinc-200">
                                        <input
                                            type="radio"
                                            id="transporteProprio-sim"
                                            name="transporteProprio"
                                            value="Sim"
                                            checked={formData.transporteProprio === "Sim"}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 accent-[#E0C097] cursor-pointer"
                                        />
                                        <span>Sim</span>
                                    </label>
                                    <label htmlFor="transporteProprio-nao" className="flex items-center gap-2 cursor-pointer text-sm font-medium text-zinc-200">
                                        <input
                                            type="radio"
                                            id="transporteProprio-nao"
                                            name="transporteProprio"
                                            value="Não"
                                            checked={formData.transporteProprio === "Não"}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 accent-[#E0C097] cursor-pointer"
                                        />
                                        <span>Não</span>
                                    </label>
                                </div>
                                {errors.transporteProprio && (
                                    <span id="transporteProprio-error" aria-live="polite" className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                                        <AlertCircle className="w-3.5 h-3.5" /> {errors.transporteProprio}
                                    </span>
                                )}
                            </fieldset>

                            {/* Disponibilidade (Radio Group Fieldset/Legend - Full Width) */}
                            <fieldset className="border-0 p-0 m-0 md:col-span-2">
                                <legend className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2.5">
                                    Disponibilidade <span className="text-amber-500">*</span>
                                </legend>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
                                    <label htmlFor="disponibilidade-imediata" className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-800/70 border border-zinc-700/60 hover:border-[#E0C097]/40 cursor-pointer text-sm font-medium text-zinc-200 transition-colors">
                                        <input
                                            type="radio"
                                            id="disponibilidade-imediata"
                                            name="disponibilidade"
                                            value="Imediata"
                                            checked={formData.disponibilidade === "Imediata"}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 accent-[#E0C097] cursor-pointer flex-shrink-0"
                                        />
                                        <span>Imediata</span>
                                    </label>

                                    <label htmlFor="disponibilidade-15dias" className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-800/70 border border-zinc-700/60 hover:border-[#E0C097]/40 cursor-pointer text-sm font-medium text-zinc-200 transition-colors">
                                        <input
                                            type="radio"
                                            id="disponibilidade-15dias"
                                            name="disponibilidade"
                                            value="Até 15 dias"
                                            checked={formData.disponibilidade === "Até 15 dias"}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 accent-[#E0C097] cursor-pointer flex-shrink-0"
                                        />
                                        <span>Até 15 dias</span>
                                    </label>

                                    <label htmlFor="disponibilidade-30dias" className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-800/70 border border-zinc-700/60 hover:border-[#E0C097]/40 cursor-pointer text-sm font-medium text-zinc-200 transition-colors">
                                        <input
                                            type="radio"
                                            id="disponibilidade-30dias"
                                            name="disponibilidade"
                                            value="Até 30 dias"
                                            checked={formData.disponibilidade === "Até 30 dias"}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 accent-[#E0C097] cursor-pointer flex-shrink-0"
                                        />
                                        <span>Até 30 dias</span>
                                    </label>

                                    <label htmlFor="disponibilidade-empregado" className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-800/70 border border-zinc-700/60 hover:border-[#E0C097]/40 cursor-pointer text-sm font-medium text-zinc-200 transition-colors">
                                        <input
                                            type="radio"
                                            id="disponibilidade-empregado"
                                            name="disponibilidade"
                                            value="Estou empregado, mas procuro novas oportunidades"
                                            checked={formData.disponibilidade === "Estou empregado, mas procuro novas oportunidades"}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 accent-[#E0C097] cursor-pointer flex-shrink-0"
                                        />
                                        <span>Estou empregado, mas procuro novas oportunidades</span>
                                    </label>
                                </div>
                                {errors.disponibilidade && (
                                    <span id="disponibilidade-error" aria-live="polite" className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                                        <AlertCircle className="w-3.5 h-3.5" /> {errors.disponibilidade}
                                    </span>
                                )}
                            </fieldset>

                            {/* File Upload Section */}
                            <div className="md:col-span-2">
                                <label htmlFor="curriculo-file" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                                    Currículo
                                </label>
                                
                                <input
                                    type="file"
                                    id="curriculo-file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    className="hidden"
                                />

                                {!selectedFile ? (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-6 px-4 rounded-2xl border-2 border-dashed border-zinc-700 hover:border-[#E0C097] bg-zinc-800/50 hover:bg-zinc-800 transition-all flex flex-col items-center justify-center cursor-pointer group"
                                    >
                                        <Upload className="w-8 h-8 text-zinc-400 group-hover:text-[#E0C097] mb-2 transition-colors" />
                                        <span className="text-sm font-bold text-white group-hover:text-[#E0C097] transition-colors">
                                            + ADICIONAR CURRÍCULO
                                        </span>
                                        <span className="text-xs text-zinc-400 mt-1">
                                            Formatos aceites: PDF, DOC, DOCX (Máx. 10MB)
                                        </span>
                                    </button>
                                ) : (
                                    <div className="p-4 rounded-2xl bg-zinc-800 border border-[#E0C097]/40 flex items-center justify-between">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 rounded-xl bg-[#E0C097]/20 text-[#E0C097] flex items-center justify-center flex-shrink-0">
                                                <FileCheck className="w-5 h-5" />
                                            </div>
                                            <div className="truncate">
                                                <p className="text-sm font-bold text-white truncate">
                                                    {selectedFile.name}
                                                </p>
                                                <p className="text-xs text-zinc-400">
                                                    {formatFileSize(selectedFile.size)}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveFile}
                                            className="p-2 rounded-lg bg-zinc-700 hover:bg-red-900/50 text-zinc-300 hover:text-red-300 transition-colors cursor-pointer ml-3 flex-shrink-0"
                                            aria-label="Remover ficheiro do currículo"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}

                                {fileError && (
                                    <span aria-live="polite" className="text-xs text-red-400 mt-2 flex items-center gap-1 font-medium">
                                        <AlertCircle className="w-3.5 h-3.5" /> {fileError}
                                    </span>
                                )}
                            </div>

                            {/* Consent Checkbox (NEVER PRE-CHECKED) */}
                            <div className="md:col-span-2 pt-2">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        id="consentimento"
                                        name="consentimento"
                                        checked={formData.consentimento}
                                        onChange={handleInputChange}
                                        aria-invalid={!!errors.consentimento}
                                        aria-describedby={errors.consentimento ? "consentimento-error" : undefined}
                                        className="mt-1 w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-amber-500/20 focus:ring-offset-0 cursor-pointer accent-[#E0C097]"
                                    />
                                    <span className="text-xs text-zinc-300 leading-relaxed font-normal">
                                        Autorizo o tratamento dos meus dados para efeitos de recrutamento e apresentação do meu perfil a potenciais empregadores, nos termos da{" "}
                                        <button
                                            ref={privacyTriggerRef}
                                            type="button"
                                            onClick={() => setShowPrivacyModal(true)}
                                            className="text-[#E0C097] underline hover:text-amber-200 cursor-pointer font-medium"
                                        >
                                            Política de Privacidade
                                        </button>. <span className="text-amber-500">*</span>
                                    </span>
                                </label>
                                {errors.consentimento && (
                                    <span id="consentimento-error" aria-live="polite" className="text-xs text-red-400 mt-2 flex items-center gap-1 font-medium">
                                        <AlertCircle className="w-3.5 h-3.5" /> {errors.consentimento}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Submission Notice / Submission Unavailable Banner */}
                        <AnimatePresence>
                            {(submissionStatus === "error" || submissionStatus === "success") && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    aria-live="assertive"
                                    className={`p-5 rounded-2xl border text-sm leading-relaxed flex items-start gap-3 shadow-lg ${submissionStatus === "success" ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-200" : "bg-amber-950/80 border-amber-500/50 text-amber-200"}`}
                                >
                                    <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-sm md:text-base">
                                            {submissionStatus === "success" ? `Candidatura recebida com sucesso. Referência: ${reference}. Podemos contactar-te quando surgir uma oportunidade adequada.` : submissionMessage}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <div className="pt-4 text-center">
                            <button
                                type="submit"
                                disabled={submissionStatus === "sending" || submissionStatus === "success"}
                                aria-busy={submissionStatus === "sending"}
                                className="group w-full md:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#E0C097] to-[#b89568] hover:from-[#eed0a7] hover:to-[#cfa372] text-black font-extrabold text-sm md:text-base px-10 py-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 cursor-pointer uppercase tracking-wider"
                            >
                                <span>{submissionStatus === "sending" ? "A ENVIAR…" : submissionStatus === "success" ? "CANDIDATURA RECEBIDA" : "QUERO RECEBER OPORTUNIDADES"}</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-xs text-zinc-400 mt-3 font-medium">
                                Candidatura gratuita • Sem compromisso
                            </p>
                        </div>
                    </fieldset></form>
                </div>
            </div>

            {/* Privacy Policy Pending Accessible Modal */}
            <AnimatePresence>
                {showPrivacyModal && (
                    <div 
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="privacy-modal-title"
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative"
                        >
                            <button
                                onClick={() => {
                                    setShowPrivacyModal(false);
                                    privacyTriggerRef.current?.focus();
                                }}
                                className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                                aria-label="Fechar declaração de privacidade"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h3 id="privacy-modal-title" className="text-xl font-bold text-white mb-4">
                                Declaração de Privacidade
                            </h3>
                            <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                                Ao candidatares-te, os contactos, o perfil profissional, a disponibilidade e o currículo que facultares são guardados para gerir a candidatura e contactar-te sobre oportunidades. O acesso está reservado à equipa de recrutamento. O teu consentimento e a data da candidatura ficam registados. A apresentação do perfil a potenciais empregadores destina-se exclusivamente ao processo de recrutamento.
                            </p>
                            <button
                                onClick={() => {
                                    setShowPrivacyModal(false);
                                    privacyTriggerRef.current?.focus();
                                }}
                                className="w-full py-3 bg-[#E0C097] hover:bg-amber-200 text-black font-bold text-sm rounded-xl transition-colors cursor-pointer"
                            >
                                Compreendido
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
