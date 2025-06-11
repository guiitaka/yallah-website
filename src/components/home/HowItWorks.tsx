'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { House, Building, Building2, Warehouse } from 'lucide-react';
import MapboxSearch from '../MapboxSearch';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { supabase } from '@/utils/supabaseClient';

interface HowItWorksProps {
    showCTA?: boolean;
}

// Tipos para os dados do formulário
interface FormData {
    nome?: string;
    email?: string;
    telefone?: string;
    tipoImovel?: string;
    valorEstimado?: number;
    endereco?: string;
    coordinates?: [number, number];
    valorDiaria?: number;
    plataformas?: string[];
    mobilia?: string;
}

// Componente da primeira etapa
const StepOne: React.FC<{
    formData: FormData;
    onInputChange: (field: string, value: string) => void;
}> = ({ formData, onInputChange }) => (
    <div className="w-full max-w-[400px] mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-12">
            <div className="relative w-[240px] h-[75px]">
                <Image
                    src="/logo-yallah-nobg-footer.png"
                    alt="Yallah"
                    fill
                    sizes="240px"
                    className="object-contain brightness-0 invert"
                />
            </div>
        </div>

        {/* Title */}
        <h3 className="text-[32px] leading-tight font-normal text-center mb-12 text-white">
            Cadastre seu imóvel na Yallah
        </h3>

        {/* Form Fields */}
        <div className="space-y-4">
            <div>
                <input
                    type="text"
                    placeholder="Nome"
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-full focus:outline-none focus:ring-0 focus:border-white/40 text-base transition-colors name-input-force-white-text"
                    onChange={(e) => onInputChange('nome', e.target.value)}
                    value={formData.nome || ''}
                />
            </div>
            <div>
                <input
                    type="email"
                    placeholder="E-mail"
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-full focus:outline-none focus:ring-0 focus:border-white/40 text-base transition-colors name-input-force-white-text"
                    onChange={(e) => onInputChange('email', e.target.value)}
                    value={formData.email || ''}
                />
            </div>
            <div>
                <PhoneInput
                    country={'br'}
                    value={formData.telefone || ''}
                    onChange={(phone) => onInputChange('telefone', phone)}
                    inputProps={{
                        style: { color: 'white' }
                    }}
                    inputClass="!w-full !px-6 !py-4 !bg-transparent !text-white !border-0 !text-base"
                    containerClass="!bg-white/10 !rounded-full !border !border-white/20 hover:!border-white/40 transition-colors phone-input-force-white-text"
                    buttonClass="!hidden"
                    disableDropdown={true}
                    countryCodeEditable={false}
                    placeholder="Telefone"
                    masks={{ br: '(..) .....-....' }}
                    onlyCountries={['br']}
                />
            </div>
        </div>
        <style jsx>{`
          /* For the actual input element's text */
          :global(.phone-input-force-white-text input.form-control),
          :global(.phone-input-force-white-text input) {
            color: white !important;
            -webkit-text-fill-color: white !important; /* For WebKit browsers */
          }
          /* For the placeholder text */
          :global(.phone-input-force-white-text input.form-control)::placeholder,
          :global(.phone-input-force-white-text input)::placeholder {
            color: rgba(255, 255, 255, 0.6) !important;
            -webkit-text-fill-color: rgba(255, 255, 255, 0.6) !important; /* For WebKit browsers */
          }
          
          /* For the country dial code (e.g., +55) */
          :global(.phone-input-force-white-text .dial-code) {
            color: white !important;
          }
          /* In case the container for the selected flag itself has a color property affecting the dial code */
          :global(.phone-input-force-white-text .selected-flag) {
             color: white !important; /* This might affect more than just text, but prioritizes white text */
          }

          /* Force styles for the Name input */
          :global(.name-input-force-white-text) {
            color: white !important;
            -webkit-text-fill-color: white !important;
          }
          :global(.name-input-force-white-text)::placeholder {
            color: rgba(255, 255, 255, 0.6) !important;
            -webkit-text-fill-color: rgba(255, 255, 255, 0.6) !important;
          }
        `}</style>
    </div>
);

// Componente da segunda etapa
const StepTwo: React.FC<{
    formData: FormData;
    onSelect: (tipo: string) => void;
}> = ({ formData, onSelect }) => (
    <div className="w-full max-w-[600px] mx-auto">
        <h3 className="text-[32px] leading-tight font-normal text-white text-center mb-8">
            Que tipo de imóvel você tem?
        </h3>

        {/* Property Type Grid */}
        <div className="grid grid-cols-2 gap-4 mb-12">
            {[
                { icon: House, label: 'Casa', value: 'casa' },
                { icon: Building, label: 'Apartamento', value: 'apartamento' },
                { icon: Building2, label: 'Condomínio', value: 'condominio' },
                { icon: Warehouse, label: 'Comercial', value: 'comercial' },
            ].map(({ icon: Icon, label, value }) => (
                <button
                    key={value}
                    onClick={() => onSelect(value)}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${formData.tipoImovel === value
                        ? 'border-white bg-white/10'
                        : 'border-white/20 hover:border-white/40'
                        }`}
                >
                    <Icon className="w-8 h-8 text-white mb-2" />
                    <span className="text-white font-medium">{label}</span>
                </button>
            ))}
        </div>
    </div>
);

// Componente da terceira etapa
const StepThree: React.FC<{
    formData: FormData;
    onInputChange: (field: string, value: string | number) => void;
    onLocationSelect: (location: { address: string; coordinates: [number, number] }) => void;
}> = ({ formData, onInputChange, onLocationSelect }) => {
    const formatCurrency = (value: string | number) => {
        // Se for string, converte para número removendo formatação
        if (typeof value === 'string') {
            const numericValue = value.replace(/\D/g, '');
            value = numericValue ? Number(numericValue) : 0;
        }

        // Formata o número como moeda
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0
        });

        return formatter.format(value);
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        const numericValue = rawValue ? Number(rawValue) : 0;
        onInputChange('valorEstimado', numericValue);
    };

    return (
        <div className="w-full max-w-[600px] mx-auto flex flex-col items-center justify-center h-full">
            <h3 className="text-[32px] leading-tight font-normal text-white text-center mb-8">
                Quanto vale seu imóvel?
            </h3>
            <div className="text-center">
                <div className="relative group cursor-pointer mb-12">
                    <input
                        type="text"
                        value={formatCurrency(formData.valorEstimado || 200000)}
                        onChange={handleValueChange}
                        className="w-[300px] text-[32px] text-center bg-transparent text-white/80 focus:outline-none focus:ring-0 cursor-pointer price-input-force-white-text"
                    />
                    <div className="absolute -bottom-0.5 left-0 right-0 h-px bg-white/20 group-hover:bg-white/40 transition-colors" />
                </div>
            </div>

            {/* Slider */}
            <div className="w-[300px]">
                <input
                    type="range"
                    min="100000"
                    max="10000000"
                    step="50000"
                    value={formData.valorEstimado || 200000}
                    onChange={(e) => onInputChange('valorEstimado', Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
                <div className="flex justify-between mt-2 text-sm text-white/40">
                    <span>R$ 100 mil</span>
                    <span>R$ 10 milhões</span>
                </div>
            </div>
            <style jsx>{`
              :global(.price-input-force-white-text) {
                color: white !important;
                -webkit-text-fill-color: white !important; /* For WebKit browsers */
              }
            `}</style>
        </div>
    );
};

// Componente da quarta etapa
const StepFour: React.FC<{
    formData: FormData;
    onInputChange: (field: string, value: number) => void;
}> = ({ formData, onInputChange }) => {
    const formatCurrency = (value: string) => {
        // Remove todos os caracteres não numéricos
        const numericValue = value.replace(/\D/g, '');

        // Se não houver valor, retorna vazio
        if (!numericValue) return '';

        // Converte para número
        const numberValue = Number(numericValue);

        // Formata o número como moeda
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numberValue / 100);
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        const numericValue = rawValue ? Number(rawValue) / 100 : 0;
        onInputChange('valorDiaria', numericValue);
    };

    return (
        <div className="w-full max-w-[600px] mx-auto flex flex-col items-center justify-center h-full">
            <h3 className="text-[32px] leading-tight font-normal text-white text-center mb-8">
                Qual o valor da diária do seu imóvel que você quer cobrar?
            </h3>
            <div className="flex items-center justify-center gap-4">
                <span className="text-[48px] font-light text-white">R$</span>
                <div className="relative">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={formData.valorDiaria ? formatCurrency(String(formData.valorDiaria * 100)) : ''}
                        onChange={handleValueChange}
                        className="w-[300px] text-[48px] px-4 py-2 bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-xl focus:outline-none focus:ring-0 focus:border-white/40 text-center font-light daily-rate-input-force-white-text"
                        placeholder="0,00"
                    />
                </div>
            </div>
            <style jsx>{`
              :global(.daily-rate-input-force-white-text) {
                color: white !important;
                -webkit-text-fill-color: white !important; /* For WebKit browsers */
              }
              :global(.daily-rate-input-force-white-text)::placeholder {
                color: rgba(255, 255, 255, 0.6) !important;
                -webkit-text-fill-color: rgba(255, 255, 255, 0.6) !important; /* For WebKit browsers */
              }
            `}</style>
        </div>
    );
};

// Componente da quinta etapa
const StepFive: React.FC<{
    formData: FormData;
    onInputChange: (field: string, value: string[]) => void;
}> = ({ formData, onInputChange }) => {
    const [animatingButton, setAnimatingButton] = useState<string | null>(null);

    const handlePlatformToggle = (platform: string) => {
        const currentPlatforms = formData.plataformas || [];
        let newPlatforms: string[];

        if (platform === 'nenhuma') {
            newPlatforms = currentPlatforms.includes('nenhuma') ? [] : ['nenhuma'];
        } else {
            newPlatforms = currentPlatforms.filter(p => p !== 'nenhuma');

            if (currentPlatforms.includes(platform)) {
                newPlatforms = newPlatforms.filter(p => p !== platform);
            } else {
                newPlatforms.push(platform);
            }
        }

        onInputChange('plataformas', newPlatforms);
    };

    const handleButtonClick = (platform: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        setAnimatingButton(platform);
        setTimeout(() => setAnimatingButton(null), 800); // Reset after animation duration
        handlePlatformToggle(platform);
    };

    const isSelected = (platform: string) => {
        return (formData.plataformas || []).includes(platform);
    };

    return (
        <div className="w-full max-w-[600px] mx-auto flex flex-col items-center justify-center h-full">
            <h3 className="text-[32px] leading-tight font-normal text-white text-center mb-8">
                O imóvel está atualmente em alguma plataforma de aluguel por temporada? Se sim, qual?
            </h3>

            {/* Platform Cards */}
            <div className="grid grid-cols-3 gap-6 mb-6">
                <button
                    onClick={handleButtonClick('airbnb')}
                    type="button"
                    className="flex flex-col items-center gap-2 relative platform-button"
                >
                    <div className={`relative w-28 h-28 rounded-full transition-all overflow-hidden ${isSelected('airbnb')
                        ? 'ring-2 ring-white bg-white shadow-lg'
                        : 'bg-white/10'
                        }`}>
                        <Image
                            src="/airbnb.png"
                            alt="Airbnb"
                            fill
                            sizes="112px"
                            className="object-contain p-5"
                        />
                        {/* Particles Container */}
                        <div className={`particles-container ${animatingButton === 'airbnb' ? 'animate' : ''}`}>
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className={`particle particle-${i + 1}`} />
                            ))}
                        </div>
                    </div>
                    <span className="text-white font-medium">Airbnb</span>
                </button>

                <button
                    onClick={handleButtonClick('booking')}
                    type="button"
                    className="flex flex-col items-center gap-2 relative platform-button"
                >
                    <div className={`relative w-28 h-28 rounded-full transition-all overflow-hidden ${isSelected('booking')
                        ? 'ring-2 ring-white bg-white shadow-lg'
                        : 'bg-white/10'
                        }`}>
                        <Image
                            src="/booking.png"
                            alt="Booking.com"
                            fill
                            sizes="112px"
                            className="object-contain p-5"
                        />
                        {/* Particles Container */}
                        <div className={`particles-container ${animatingButton === 'booking' ? 'animate' : ''}`}>
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className={`particle particle-${i + 1}`} />
                            ))}
                        </div>
                    </div>
                    <span className="text-white font-medium">Booking.com</span>
                </button>

                <button
                    onClick={handleButtonClick('outros')}
                    type="button"
                    className="flex flex-col items-center gap-2 relative platform-button"
                >
                    <div className={`relative w-28 h-28 rounded-full transition-all overflow-hidden ${isSelected('outros')
                        ? 'ring-2 ring-white bg-white shadow-lg'
                        : 'bg-white/10'
                        }`}>
                        <Image
                            src="/others.png"
                            alt="Outros"
                            fill
                            sizes="112px"
                            className="object-contain p-5"
                        />
                        {/* Particles Container */}
                        <div className={`particles-container ${animatingButton === 'outros' ? 'animate' : ''}`}>
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className={`particle particle-${i + 1}`} />
                            ))}
                        </div>
                    </div>
                    <span className="text-white font-medium">Outros</span>
                </button>
            </div>

            {/* None Button */}
            <div className="flex justify-center w-full">
                <button
                    onClick={handleButtonClick('nenhuma')}
                    type="button"
                    className={`px-8 py-3 rounded-full border-2 transition-all ${isSelected('nenhuma')
                        ? 'border-white bg-white text-[#8BADA4]'
                        : 'border-white/20 text-white hover:border-white/40'
                        }`}
                >
                    Nenhuma
                </button>
            </div>

            <style jsx>{`
                .platform-button {
                    perspective: 1000px;
                }

                .particles-container {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    opacity: 0;
                }

                .particles-container.animate .particle {
                    animation-play-state: running !important;
                }

                .particle {
                    position: absolute;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    opacity: 0;
                    pointer-events: none;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }

                ${[...Array(20)].map((_, i) => `
                    .particle-${i + 1} {
                        background: hsl(${Math.random() * 360}, 70%, 65%);
                        animation: particle-animation-${i + 1} 0.8s ease-out;
                        animation-play-state: paused;
                    }

                    @keyframes particle-animation-${i + 1} {
                        0% {
                            opacity: 0;
                            transform: translate(-50%, -50%);
                        }
                        20% {
                            opacity: 1;
                        }
                        100% {
                            opacity: 0;
                            transform: translate(
                                ${(Math.random() - 0.5) * 200}px,
                                ${(Math.random() - 0.5) * 200}px
                            );
                        }
                    }
                `).join('\n')}
            `}</style>
        </div>
    );
};

// Componente da sexta etapa
const StepSix: React.FC<{
    formData: FormData;
    onInputChange: (field: string, value: string) => void;
}> = ({ formData, onInputChange }) => {
    const [animatingButton, setAnimatingButton] = useState<string | null>(null);

    const handleButtonClick = (option: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        setAnimatingButton(option);
        setTimeout(() => setAnimatingButton(null), 800);
        onInputChange('mobilia', option);
    };

    const isSelected = (option: string) => {
        return formData.mobilia === option;
    };

    return (
        <div className="w-full max-w-[600px] mx-auto flex flex-col items-center justify-center h-full">
            <h3 className="text-[32px] leading-tight font-normal text-white text-center mb-8">
                Seu imóvel está mobiliado e equipado para locação?
            </h3>

            {/* Option Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                {['completo', 'essencial', 'ajuda'].map((option) => (
                    <button
                        key={option}
                        onClick={handleButtonClick(option)}
                        type="button"
                        className="flex flex-col items-center gap-2 relative platform-button"
                    >
                        <div className={`relative w-full aspect-[3/4] rounded-2xl transition-all overflow-hidden ${isSelected(option)
                            ? 'ring-2 ring-white bg-white/10 shadow-lg'
                            : 'bg-white/10'
                            }`}>
                            <Image
                                src={`/illustrations/${option === 'completo'
                                    ? 'fully-furnished'
                                    : option === 'essencial'
                                        ? 'basic-furnished'
                                        : 'need-help'
                                    }.png`}
                                alt={
                                    option === 'completo'
                                        ? 'Totalmente mobiliado'
                                        : option === 'essencial'
                                            ? 'Parcialmente mobiliado'
                                            : 'Preciso de ajuda'
                                }
                                fill
                                sizes="(max-width: 600px) 33vw, 200px"
                                className="object-cover"
                            />
                            {/* Particles Container */}
                            <div className={`particles-container ${animatingButton === option ? 'animate' : ''}`}>
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className={`particle particle-${i + 1}`} />
                                ))}
                            </div>
                        </div>
                        <div className="text-center px-1">
                            <p className="text-white font-medium text-sm">
                                {option === 'completo'
                                    ? 'Meu imóvel está totalmente pronto para locação'
                                    : option === 'essencial'
                                        ? 'Meu imóvel fornece apenas o essencial'
                                        : 'Gostaria que a Yallah me ajudasse a preparar o meu imóvel'}
                            </p>
                            {option === 'completo' && (
                                <p className="text-white/60 text-xs mt-0.5">
                                    Mobiliado, completo, tem tudo o que precisa
                                </p>
                            )}
                            {option === 'essencial' && (
                                <p className="text-white/60 text-xs mt-0.5">
                                    Tenho apenas o essencial, como fogão, geladeira, e cama
                                </p>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            <style jsx>{`
                .platform-button {
                    perspective: 1000px;
                }

                .particles-container {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    opacity: 0;
                }

                .particles-container.animate .particle {
                    animation-play-state: running !important;
                }

                .particle {
                    position: absolute;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    opacity: 0;
                    pointer-events: none;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }

                ${[...Array(20)].map((_, i) => `
                    .particle-${i + 1} {
                        background: hsl(${Math.random() * 360}, 70%, 65%);
                        animation: particle-animation-${i + 1} 0.8s ease-out;
                        animation-play-state: paused;
                    }

                    @keyframes particle-animation-${i + 1} {
                        0% {
                            opacity: 0;
                            transform: translate(-50%, -50%);
                        }
                        20% {
                            opacity: 1;
                        }
                        100% {
                            opacity: 0;
                            transform: translate(
                                ${(Math.random() - 0.5) * 200}px,
                                ${(Math.random() - 0.5) * 200}px
                            );
                        }
                    }
                `).join('\n')}
            `}</style>
        </div>
    );
};

// Componente de sucesso
const SuccessMessage: React.FC = () => (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#8BADA4] text-white z-[1]">
        <h2 className="text-[48px] font-light text-center mb-8">
            Obrigado, nossa equipe entrará em contato!
        </h2>
    </div>
);

export default function HowItWorks({ showCTA = true }: HowItWorksProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [showThankYou, setShowThankYou] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        valorEstimado: 200000,
        valorDiaria: 0,
        plataformas: []
    });

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return !!formData.nome && !!formData.email && emailRegex.test(formData.email) && (formData.telefone?.length ?? 0) > 10;
            case 2:
                return !!formData.tipoImovel;
            case 3:
                return !!formData.endereco && !!formData.valorEstimado;
            case 4:
                return formData.valorDiaria !== undefined && formData.valorDiaria > 0;
            case 5:
                return formData.plataformas !== undefined && formData.plataformas.length > 0;
            case 6:
                return !!formData.mobilia;
            default:
                return false;
        }
    };

    // Função para enviar os dados para o Supabase
    const handleSubmit = async (finalFormData: FormData) => {
        setIsSubmitting(true);
        const submissionData = {
            first_name: finalFormData.nome,
            email: finalFormData.email,
            phone: finalFormData.telefone,
            category: 'Possíveis Clientes', // Categoria do formulário
            property_type: finalFormData.tipoImovel,
            property_address: finalFormData.endereco,
            property_value: finalFormData.valorEstimado,
            daily_rate: finalFormData.valorDiaria,
            current_platform: finalFormData.plataformas?.join(', '), // Converte array para string
            furnishing_state: finalFormData.mobilia,
            // Outros campos podem ser deixados como nulos se não aplicável
            // e.g., last_name, message, is_read não são deste formulário
        };

        const { error } = await supabase.from('contact_messages').insert([submissionData]);

        if (error) {
            console.error('Erro ao salvar no Supabase:', error);
            // Opcional: Adicionar feedback de erro para o usuário
        } else {
            // Se o envio for bem-sucedido, mostra a mensagem de agradecimento
            setShowThankYou(true);
        }
        setIsSubmitting(false);
    };

    const handleInputChange = (field: string, value: string | number | string[]) => {
        const updatedFormData = { ...formData, [field]: value };
        setFormData(updatedFormData);

        // Se estiver no último step e uma opção for selecionada, submete o formulário
        if (currentStep === 6 && field === 'mobilia') {
            handleSubmit(updatedFormData);
        }
    };

    const handleLocationSelect = (location: { address: string; coordinates: [number, number] }) => {
        setFormData(prev => ({
            ...prev,
            endereco: location.address,
            coordinates: location.coordinates
        }));
    };

    const handleNext = () => {
        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handlePropertyTypeSelect = (tipo: string) => {
        setFormData(prev => ({ ...prev, tipoImovel: tipo }));
    };

    return (
        <div className="bg-white px-4 md:px-8 pt-16 md:pt-16 pb-1">
            <div className="relative w-full h-[700px] md:h-[600px] overflow-hidden rounded-3xl bg-white shadow-lg z-[1]">
                {/* Thank You Overlay */}
                {showThankYou && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            duration: 0.8,
                        }}
                        className="absolute inset-0 z-50 overflow-hidden"
                    >
                        {/* Video with overlay */}
                        <div className="relative w-full h-full">
                            <video
                                autoPlay
                                muted
                                playsInline
                                loop
                                className="absolute inset-0 w-full h-full object-cover"
                                src="/videos/agradecimento-contato.mp4"
                            />
                            <div className="absolute inset-0 bg-black/30" />
                        </div>

                        {/* Chat Container */}
                        <div className="absolute left-0 top-0 w-1/2 h-full p-8">
                            <div className="relative h-full flex flex-col">
                                {/* Chat Bubbles */}
                                <div className="flex flex-col space-y-4">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                        className="flex"
                                    >
                                        <div className="inline-block bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-lg">
                                            <p className="text-gray-800 whitespace-nowrap text-lg">Olá! Recebemos seu cadastro! 👋</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.5, duration: 0.5 }}
                                        className="flex"
                                    >
                                        <div className="inline-block bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-lg">
                                            <p className="text-gray-800 whitespace-nowrap text-lg">Vamos analisar suas informações.</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 2.5, duration: 0.5 }}
                                        className="flex"
                                    >
                                        <div className="inline-block bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-lg">
                                            <p className="text-gray-800 whitespace-nowrap text-lg">Em breve entraremos em contato! 🏠✨</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 3.5, duration: 0.5 }}
                                        className="flex justify-end"
                                    >
                                        <div className="inline-block bg-[#8BADA4] rounded-2xl rounded-br-none px-4 py-3 shadow-lg">
                                            <p className="text-white whitespace-nowrap text-lg">Ótimo! Aguardo o contato! 😊</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 4.5, duration: 0.5 }}
                                        className="flex"
                                    >
                                        <div className="inline-block bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-lg">
                                            <p className="text-gray-800 whitespace-nowrap text-lg">Até breve! 🤝</p>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Thank You Message - Now at bottom left */}
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 5.5,
                                        ease: "easeOut"
                                    }}
                                    className="absolute bottom-0 left-0"
                                >
                                    <motion.p
                                        className="text-white text-[32px] font-playfair font-semibold"
                                        style={{ lineHeight: 1.2 }}
                                    >
                                        Obrigado, nossa equipe<br />entrará em contato 😉
                                    </motion.p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="h-full grid grid-cols-1 md:grid-cols-2">
                    {/* Form Container - Left side */}
                    <div className="h-full bg-[#8BADA4] p-8 flex flex-col">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col h-full"
                            >
                                {/* Progress Steps - Fixed at top */}
                                {currentStep > 1 && (
                                    <div className="mb-8">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            {[1, 2, 3, 4, 5, 6].map((step) => (
                                                <div
                                                    key={step}
                                                    className={`h-1 w-12 rounded-full ${step === currentStep ? 'bg-white' : 'bg-white/20'}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-white/60 text-sm text-center">{currentStep} de 6</p>
                                    </div>
                                )}

                                {currentStep === 1 ? (
                                    <div className="flex flex-col h-full">
                                        {/* Content */}
                                        <div className="flex-1 overflow-y-auto scrollbar-hide">
                                            <StepOne
                                                formData={formData}
                                                onInputChange={handleInputChange}
                                            />
                                        </div>

                                        {/* Navigation Buttons */}
                                        <div className="flex items-center justify-center gap-4 mt-6">
                                            <button
                                                onClick={handleNext}
                                                disabled={!validateStep(1)}
                                                className="w-[400px] flex items-center justify-center bg-white text-[#8BADA4] rounded-full px-6 py-4 font-medium transition-colors text-base disabled:bg-white/50 disabled:cursor-not-allowed"
                                            >
                                                Continuar
                                            </button>
                                        </div>
                                    </div>
                                ) : currentStep === 2 ? (
                                    <div className="flex flex-col h-full">
                                        {/* Content - Fills available space */}
                                        <div className="flex-1 overflow-y-auto scrollbar-hide">
                                            <StepTwo
                                                formData={formData}
                                                onSelect={handlePropertyTypeSelect}
                                            />
                                        </div>

                                        {/* Navigation Buttons - Fixed at bottom */}
                                        <div className="flex items-center justify-between gap-4 mt-6">
                                            <button
                                                onClick={handleBack}
                                                className="flex-1 px-6 py-4 border-2 border-white/20 text-white rounded-full hover:bg-white/10 transition-colors"
                                            >
                                                Voltar
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                disabled={!validateStep(2)}
                                                className="flex-1 px-6 py-4 bg-white text-[#8BADA4] rounded-full hover:bg-white/90 transition-colors disabled:bg-white/50 disabled:cursor-not-allowed"
                                            >
                                                Continuar
                                            </button>
                                        </div>
                                    </div>
                                ) : currentStep === 3 ? (
                                    <div className="flex flex-col h-full">
                                        {/* Content */}
                                        <div className="flex-1 overflow-y-auto scrollbar-hide">
                                            <StepThree
                                                formData={formData}
                                                onInputChange={handleInputChange}
                                                onLocationSelect={handleLocationSelect}
                                            />
                                        </div>

                                        {/* Navigation Buttons */}
                                        <div className="flex items-center justify-between gap-4 mt-6">
                                            <button
                                                onClick={handleBack}
                                                className="flex-1 px-6 py-4 border-2 border-white/20 text-white rounded-full hover:bg-white/10 transition-colors"
                                            >
                                                Voltar
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                disabled={!validateStep(3)}
                                                className="flex-1 px-6 py-4 bg-white text-[#8BADA4] rounded-full hover:bg-white/90 transition-colors disabled:bg-white/50 disabled:cursor-not-allowed"
                                            >
                                                Continuar
                                            </button>
                                        </div>
                                    </div>
                                ) : currentStep === 4 ? (
                                    <div className="flex flex-col h-full">
                                        {/* Content */}
                                        <div className="flex-1 overflow-y-auto scrollbar-hide">
                                            <StepFour
                                                formData={formData}
                                                onInputChange={handleInputChange}
                                            />
                                        </div>

                                        {/* Navigation Buttons */}
                                        <div className="flex items-center justify-between gap-4 mt-6">
                                            <button
                                                onClick={handleBack}
                                                className="flex-1 px-6 py-4 border-2 border-white/20 text-white rounded-full hover:bg-white/10 transition-colors"
                                            >
                                                Voltar
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                disabled={!validateStep(4)}
                                                className="flex-1 px-6 py-4 bg-white text-[#8BADA4] rounded-full hover:bg-white/90 transition-colors disabled:bg-white/50 disabled:cursor-not-allowed"
                                            >
                                                Continuar
                                            </button>
                                        </div>
                                    </div>
                                ) : currentStep === 5 ? (
                                    <div className="flex flex-col h-full">
                                        {/* Content */}
                                        <div className="flex-1 overflow-y-auto scrollbar-hide">
                                            <StepFive
                                                formData={formData}
                                                onInputChange={handleInputChange}
                                            />
                                        </div>

                                        {/* Navigation Buttons */}
                                        <div className="flex items-center justify-between gap-4 mt-6">
                                            <button
                                                onClick={handleBack}
                                                className="flex-1 px-6 py-4 border-2 border-white/20 text-white rounded-full hover:bg-white/10 transition-colors"
                                            >
                                                Voltar
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                disabled={!validateStep(5)}
                                                className="flex-1 px-6 py-4 bg-white text-[#8BADA4] rounded-full hover:bg-white/90 transition-colors disabled:bg-white/50 disabled:cursor-not-allowed"
                                            >
                                                Continuar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col h-full">
                                        {/* Content */}
                                        <div className="flex-1 overflow-y-auto scrollbar-hide">
                                            <StepSix
                                                formData={formData}
                                                onInputChange={handleInputChange}
                                            />
                                        </div>

                                        {/* Navigation Buttons */}
                                        <div className="flex items-center justify-between gap-4 mt-6">
                                            <button
                                                onClick={handleBack}
                                                className="flex-1 px-6 py-4 border-2 border-white/20 text-white rounded-full hover:bg-white/10 transition-colors"
                                            >
                                                Voltar
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                disabled={!validateStep(6)}
                                                className="flex-1 px-6 py-4 bg-white text-[#8BADA4] rounded-full hover:bg-white/90 transition-colors disabled:bg-white/50 disabled:cursor-not-allowed"
                                            >
                                                Continuar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Image/Map Container - Right side */}
                    <div className="relative h-full bg-[#F5F5F5] overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                {currentStep === 3 ? (
                                    <MapboxSearch onLocationSelect={handleLocationSelect} initialValue={formData.endereco} variant="light" />
                                ) : (
                                    <Image
                                        src={currentStep === 1
                                            ? "/illustrations/property-management.png"
                                            : currentStep === 2
                                                ? "/illustrations/property-types.png"
                                                : currentStep === 4
                                                    ? "/illustrations/step-4.png"
                                                    : currentStep === 5
                                                        ? "/illustrations/step-5.png"
                                                        : "/illustrations/step-6.png"}
                                        alt="Ilustração"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover"
                                        priority
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}