'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Check } from '@phosphor-icons/react';
import { supabase } from '@/utils/supabaseClient';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
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
            // Prepara a mensagem para incluir o tipo de serviço/interesse
            const messageWithService = `Interesse: ${formData.service}\n\n${formData.message}`;

            const { error } = await supabase.from('contact_messages').insert({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                message: messageWithService, // Mensagem atualizada
                category: 'Contatos', // Categoria fixa para este formulário
            });

            if (error) {
                throw error;
            }

            // Sucesso
            setSubmitted(true);

            // Reset do formulário após 5 segundos
            setTimeout(() => {
                setSubmitted(false);
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    message: '',
                    service: 'proprietario',
                });
            }, 5000);
        } catch (err) {
            console.error('Error submitting form:', err);
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
                                    <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                                        Nome*
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8BADA4] focus:ring focus:ring-[#8BADA4]/20 transition-colors outline-none"
                                        placeholder="Seu nome"
                                    />
                                </div>

                                {/* Sobrenome */}
                                <div>
                                    <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                                        Sobrenome*
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8BADA4] focus:ring focus:ring-[#8BADA4]/20 transition-colors outline-none"
                                        placeholder="Seu sobrenome"
                                    />
                                </div>

                                {/* Email */}
                                <div className="md:col-span-2">
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
                                <div className="md:col-span-2">
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
                                        placeholder="(XX) XXXXX-XXXX"
                                    />
                                </div>

                                {/* Mensagem */}
                                <div className="md:col-span-2">
                                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                                        Sua mensagem*
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8BADA4] focus:ring focus:ring-[#8BADA4]/20 transition-colors outline-none"
                                        placeholder="Descreva sua necessidade..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full md:w-auto bg-[#8BADA4] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#7A9A8D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8BADA4] transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed group"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Enviando...
                                        </div>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            Enviar Mensagem
                                            <ArrowRight size={20} weight="bold" className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
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