'use client'

import React, { useState } from 'react'
import { supabase } from '@/utils/supabaseClient';
import { Check, ArrowRight } from '@phosphor-icons/react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { error } = await supabase.from('contact_messages').insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        category: 'Prospecções',
      });

      if (error) throw error;

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
        });
      }, 5000);

    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Ocorreu um erro ao enviar sua mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="w-full px-4 md:px-6 py-16 md:py-32 bg-gradient-to-br from-[#8BADA4] to-[#405A53]">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20">
          {/* Right side - Title content */}
          <div className="col-span-1 flex flex-col justify-center text-center md:text-left order-first md:order-last">
            <div className="space-y-4">
              <h1 className="text-[36px] md:text-[48pt] font-black text-white font-raleway leading-tight">
                Vamos conversar<br />
                <span className="whitespace-nowrap">sobre seu imóvel?</span>
              </h1>
              <p className="text-white/80 text-lg md:text-xl mt-4 md:mt-8">
                Nossa equipe está pronta para te ajudar a maximizar o potencial do seu imóvel.
              </p>
            </div>
          </div>

          {/* Left side - Form */}
          <div className="col-span-1 bg-white rounded-[20px] md:rounded-[32px] p-6 md:p-12 shadow-xl order-last md:order-first">

            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={32} weight="bold" className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Mensagem enviada!</h3>
                <p className="text-gray-600">
                  Obrigado por entrar em contato. Responderemos em breve.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-light text-[#405A53] mb-2">Entre em Contato</h2>
                <p className="text-gray-500 mb-6 md:mb-8">Estamos aqui para ajudar você</p>

                {error && (
                  <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Nome"
                        required
                        className="w-full px-4 md:px-6 py-3 md:py-4 bg-gray-50 rounded-xl md:rounded-2xl border border-gray-100 focus:outline-none focus:border-[#8BADA4] focus:ring-2 focus:ring-[#8BADA4]/20 transition-all"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Sobrenome"
                        required
                        className="w-full px-4 md:px-6 py-3 md:py-4 bg-gray-50 rounded-xl md:rounded-2xl border border-gray-100 focus:outline-none focus:border-[#8BADA4] focus:ring-2 focus:ring-[#8BADA4]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      required
                      className="w-full px-4 md:px-6 py-3 md:py-4 bg-gray-50 rounded-xl md:rounded-2xl border border-gray-100 focus:outline-none focus:border-[#8BADA4] focus:ring-2 focus:ring-[#8BADA4]/20 transition-all"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Telefone"
                      className="w-full px-4 md:px-6 py-3 md:py-4 bg-gray-50 rounded-xl md:rounded-2xl border border-gray-100 focus:outline-none focus:border-[#8BADA4] focus:ring-2 focus:ring-[#8BADA4]/20 transition-all"
                    />
                  </div>

                  <div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Descreva sua necessidade"
                      rows={4}
                      required
                      className="w-full px-4 md:px-6 py-3 md:py-4 bg-gray-50 rounded-xl md:rounded-2xl border border-gray-100 focus:outline-none focus:border-[#8BADA4] focus:ring-2 focus:ring-[#8BADA4]/20 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 md:py-4 bg-[#8BADA4] text-white rounded-xl md:rounded-2xl hover:bg-[#8BADA4]/90 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center group"
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      'Enviar Mensagem'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css?family=Raleway:900&display=swap");

        .font-raleway {
          font-family: "Raleway", sans-serif;
        }
      `}</style>
    </div>
  )
} 