'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Check } from '@phosphor-icons/react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        service: 'proprietario', // Default selected service
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isHighlighted, setIsHighlighted] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Função para verificar se o hash da URL aponta para este formulário
        const checkHash = () => {
            if (window.location.hash === '#contact-form') {
                setIsHighlighted(true);
                setTimeout(() => setIsHighlighted(false), 1500);
            }
        };

        // Observer para detectar quando o formulário entra na viewport
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && window.location.hash === '#contact-form') {
                    setIsHighlighted(true);
                    setTimeout(() => setIsHighlighted(false), 1500);
                }
            },
            { threshold: 0.1 }
        );

        if (formRef.current) {
            observer.observe(formRef.current);
        }

        // Verificar o hash na carga inicial
        checkHash();

        // Listener para mudanças de hash
        window.addEventListener('hashchange', checkHash);

        return () => {
            if (formRef.current) {
                observer.unobserve(formRef.current);
            }
            window.removeEventListener('hashchange', checkHash);
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Aqui seria a lógica de envio do formulário para o backend
            // Por enquanto, vamos apenas simular um delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Sucesso
            setSubmitted(true);

            // Reset do formulário após 5 segundos
            setTimeout(() => {
                setSubmitted(false);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: '',
                    service: 'proprietario',
                });
            }, 5000);
        } catch (err) {
            setError('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact-form" className="w-full bg-gray-50 py-16 md:py-24 scroll-mt-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto" ref={formRef}>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Envie sua mensagem
                        </h2>
                        <p className="text-gray-600">
                            Nossa equipe está pronta para responder suas dúvidas e ajudar com o que você precisar.
                        </p>
                    </div>

                    {submitted ? (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check size={32} weight="bold" className="text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Mensagem enviada com sucesso!</h3>
                            <p className="text-gray-600 mb-4">
                                Obrigado por entrar em contato. Nossa equipe responderá o mais breve possível.
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className={`bg-white p-6 md:p-8 rounded-xl shadow-sm border transition-all duration-500 ${isHighlighted
                                    ? 'border-[#8BADA4] shadow-lg shadow-[#8BADA4]/20 transform scale-[1.01]'
                                    : 'border-gray-100'
                                }`}
                        >
                            {error && (
                                <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Tipo de serviço */}
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Estou interessado em:
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        <label className={`
                      flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors
                      ${formData.service === 'proprietario'
                                                ? 'bg-[#8BADA4]/10 border-[#8BADA4] text-[#5E8780]'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}
                    `}>
                                            <input
                                                type="radio"
                                                name="service"
                                                value="proprietario"
                                                checked={formData.service === 'proprietario'}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.service === 'proprietario'
                                                ? 'border-[#8BADA4]'
                                                : 'border-gray-400'
                                                }`}>
                                                {formData.service === 'proprietario' && (
                                                    <span className="w-2 h-2 rounded-full bg-[#8BADA4]"></span>
                                                )}
                                            </span>
                                            Sou proprietário
                                        </label>

                                        <label className={`
                      flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors
                      ${formData.service === 'hospede'
                                                ? 'bg-[#8BADA4]/10 border-[#8BADA4] text-[#5E8780]'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}
                    `}>
                                            <input
                                                type="radio"
                                                name="service"
                                                value="hospede"
                                                checked={formData.service === 'hospede'}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.service === 'hospede'
                                                ? 'border-[#8BADA4]'
                                                : 'border-gray-400'
                                                }`}>
                                                {formData.service === 'hospede' && (
                                                    <span className="w-2 h-2 rounded-full bg-[#8BADA4]"></span>
                                                )}
                                            </span>
                                            Sou hóspede
                                        </label>

                                        <label className={`
                      flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors
                      ${formData.service === 'outro'
                                                ? 'bg-[#8BADA4]/10 border-[#8BADA4] text-[#5E8780]'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}
                    `}>
                                            <input
                                                type="radio"
                                                name="service"
                                                value="outro"
                                                checked={formData.service === 'outro'}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.service === 'outro'
                                                ? 'border-[#8BADA4]'
                                                : 'border-gray-400'
                                                }`}>
                                                {formData.service === 'outro' && (
                                                    <span className="w-2 h-2 rounded-full bg-[#8BADA4]"></span>
                                                )}
                                            </span>
                                            Outro assunto
                                        </label>
                                    </div>
                                </div>

                                {/* Nome */}
                                <div>
                                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                                        Nome completo*
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8BADA4] focus:ring focus:ring-[#8BADA4]/20 transition-colors outline-none"
                                        placeholder="Seu nome"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                        Email*
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8BADA4] focus:ring focus:ring-[#8BADA4]/20 transition-colors outline-none"
                                        placeholder="seu.email@exemplo.com"
                                    />
                                </div>

                                {/* Telefone */}
                                <div>
                                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                                        Telefone
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8BADA4] focus:ring focus:ring-[#8BADA4]/20 transition-colors outline-none"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>

                                {/* Assunto */}
                                <div>
                                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                                        Assunto*
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8BADA4] focus:ring focus:ring-[#8BADA4]/20 transition-colors outline-none"
                                        placeholder="Assunto da sua mensagem"
                                    />
                                </div>

                                {/* Mensagem */}
                                <div className="md:col-span-2">
                                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                                        Mensagem*
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8BADA4] focus:ring focus:ring-[#8BADA4]/20 transition-colors outline-none resize-none"
                                        placeholder="Digite sua mensagem aqui..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`
                    inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-medium text-white
                    ${isSubmitting
                                            ? 'bg-[#8BADA4]/70 cursor-not-allowed'
                                            : 'bg-[#8BADA4] hover:bg-[#7a9a94] transition-colors'}
                  `}
                                >
                                    {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
                                    <ArrowRight size={20} weight="bold" />
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 text-center text-gray-500 text-sm">
                        * Campos obrigatórios
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm; 