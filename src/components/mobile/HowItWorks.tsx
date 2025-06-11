'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, House, Building, Building2, Warehouse } from 'lucide-react';
import MapboxSearch from '../MapboxSearch';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { supabase } from '@/utils/supabaseClient';

interface HowItWorksProps {
    showCTA?: boolean;
}

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

const StepOne: React.FC<{
    formData: FormData;
    onInputChange: (field: string, value: string) => void;
}> = ({ formData, onInputChange }) => (
    <div className="w-full px-6">
        {/* Logo */}
        <div className="flex justify-center -mt-4 mb-6">
            <div className="relative w-[180px] h-[56px]">
                <Image
                    src="/logo-yallah-nobg.png"
                    alt="Yallah"
                    fill
                    sizes="180px"
                    priority
                    className="object-contain brightness-0 invert"
                />
            </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl leading-tight font-normal text-white text-center mb-8">
            Cadastre seu imóvel na Yallah
        </h3>

        {/* Form Fields */}
        <div className="space-y-4">
            <div>
                <input
                    type="text"
                    placeholder="Nome"
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 !text-white !placeholder-white/60 rounded-full focus:outline-none focus:ring-0 focus:border-white/40 text-base transition-colors"
                    onChange={(e) => onInputChange('nome', e.target.value)}
                    value={formData.nome || ''}
                />
            </div>
            <div>
                <input
                    type="email"
                    placeholder="E-mail"
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 !text-white !placeholder-white/60 rounded-full focus:outline-none focus:ring-0 focus:border-white/40 text-base transition-colors"
                    onChange={(e) => onInputChange('email', e.target.value)}
                    value={formData.email || ''}
                    required
                />
            </div>
            <div>
                <PhoneInput
                    country={'br'}
                    value={formData.telefone || ''}
                    onChange={(phone) => onInputChange('telefone', phone)}
                    inputClass="!w-full !px-6 !py-4 !bg-transparent !text-white !border-0 !text-base"
                    containerClass="!bg-white/10 !rounded-full !border !border-white/20 hover:!border-white/40 transition-colors"
                    buttonClass="!hidden"
                    disableDropdown={true}
                    countryCodeEditable={false}
                    placeholder="Telefone"
                    masks={{ br: '(..) .....-....' }}
                    onlyCountries={['br']}
                />
            </div>
        </div>
    </div>
);

const StepTwo: React.FC<{
    formData: FormData;
    onSelect: (tipo: string) => void;
}> = ({ formData, onSelect }) => (
    <div className="w-full px-6">
        <h3 className="text-2xl leading-tight font-normal text-white text-center mb-6">
            Que tipo de imóvel você tem?
        </h3>

        {/* Property Type Grid */}
        <div className="grid grid-cols-2 gap-4">
            {[
                { icon: House, label: 'Casa', value: 'casa' },
                { icon: Building, label: 'Apartamento', value: 'apartamento' },
                { icon: Building2, label: 'Condomínio', value: 'condominio' },
                { icon: Warehouse, label: 'Comercial', value: 'comercial' },
            ].map(({ icon: Icon, label, value }) => (
                <button
                    key={value}
                    onClick={() => onSelect(value)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.tipoImovel === value
                        ? 'border-white bg-white/10'
                        : 'border-white/20 hover:border-white/40'
                        }`}
                >
                    <Icon className="w-8 h-8 text-white mb-2" />
                    <span className="text-white text-sm font-medium">{label}</span>
                </button>
            ))}
        </div>
    </div>
);

const StepThree: React.FC<{
    formData: FormData;
    onInputChange: (field: string, value: string | number) => void;
    onLocationSelect: (location: { address: string; coordinates: [number, number] }) => void;
}> = ({ formData, onInputChange, onLocationSelect }) => {
    const formatCurrency = (value: string | number) => {
        if (typeof value === 'string') {
            const numericValue = value.replace(/\D/g, '');
            value = numericValue ? Number(numericValue) : 0;
        }

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
        <div className="w-full px-6">
            {/* Property Value Section */}
            <div className="mb-8">
                <h3 className="text-2xl leading-tight font-normal text-white text-center mb-6">
                    Quanto vale seu imóvel?
                </h3>
                <div className="text-center">
                    <div className="relative group cursor-pointer mb-8">
                        <input
                            type="text"
                            value={formatCurrency(formData.valorEstimado || 200000)}
                            onChange={handleValueChange}
                            className="w-full text-3xl text-center bg-transparent !text-white/80 focus:outline-none focus:ring-0 cursor-pointer"
                        />
                        <div className="absolute -bottom-0.5 left-0 right-0 h-px bg-white/20 group-hover:bg-white/40 transition-colors" />
                    </div>
                </div>

                {/* Slider */}
                <div className="w-full">
                    <input
                        type="range"
                        min="100000"
                        max="10000000"
                        step="50000"
                        value={formData.valorEstimado || 200000}
                        onChange={(e) => onInputChange('valorEstimado', Number(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />
                    <div className="flex justify-between mt-3 text-base text-white font-medium">
                        <span>R$ 100 mil</span>
                        <span>R$ 10 milhões</span>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div>
                <h3 className="text-2xl leading-tight font-normal text-white text-center mb-6">
                    Onde está localizado?
                </h3>
                <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
                    <MapboxSearch
                        onLocationSelect={onLocationSelect}
                        initialValue={formData.endereco || ''}
                        variant="light"
                    />
                </div>
            </div>
        </div>
    );
};

const StepFour: React.FC<{
    formData: FormData;
    onInputChange: (field: string, value: number) => void;
}> = ({ formData, onInputChange }) => {
    const formatCurrency = (value: string) => {
        const numericValue = value.replace(/\D/g, '');
        if (!numericValue) return '';
        const numberValue = Number(numericValue);
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
        <div className="w-full px-6">
            <h3 className="text-2xl leading-tight font-normal text-white text-center mb-6">
                Qual o valor da diária do seu imóvel?
            </h3>
            <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-light text-white">R$</span>
                <div className="relative flex-1">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={formData.valorDiaria ? formatCurrency(String(formData.valorDiaria * 100)) : ''}
                        onChange={handleValueChange}
                        className="w-full text-3xl px-3 py-2 bg-white/10 border border-white/20 !text-white !placeholder-white/60 rounded-xl focus:outline-none focus:ring-0 focus:border-white/40 text-center font-light"
                        placeholder="0,00"
                    />
                </div>
            </div>
        </div>
    );
};

const StepFive: React.FC<{
    formData: FormData;
    onInputChange: (field: string, value: any) => void;
    onComplete: () => void;
}> = ({ formData, onInputChange, onComplete }) => {
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
                newPlatforms = [...newPlatforms, platform];
            }
        }

        onInputChange('plataformas', newPlatforms);

        // Após selecionar uma plataforma, avança para a mensagem de sucesso
        setTimeout(onComplete, 500);
    };

    return (
        <div className="px-6">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                Seu imóvel já está em alguma plataforma?
            </h2>
            <div className="grid grid-cols-1 gap-4">
                {platforms.map((platform) => {
                    const isSelected = formData.plataformas?.includes(platform.id);
                    const isAnimating = animatingButton === platform.id;

                    return (
                        <button
                            key={platform.id}
                            onClick={() => {
                                setAnimatingButton(platform.id);
                                handlePlatformToggle(platform.id);
                            }}
                            className={`relative flex items-center justify-center gap-4 w-full px-6 py-4 rounded-xl backdrop-blur-sm bg-white/5 border border-white/20 transition-all ${isSelected
                                ? 'bg-white/20'
                                : 'hover:bg-white/10'
                                } ${isAnimating ? 'scale-95' : ''}`}
                        >
                            <Image
                                src={platform.icon}
                                alt={platform.label}
                                width={48}
                                height={48}
                                className={platform.id === 'nenhuma' ? '' : ''}
                            />
                            <span className="text-lg font-medium text-white">
                                {platform.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const StepSix: React.FC<{
    formData: FormData;
    onInputChange: (field: string, value: string) => void;
    onComplete: () => void;
}> = ({ formData, onInputChange, onComplete }) => {
    const [animatingButton, setAnimatingButton] = useState<string | null>(null);

    const handleSelect = (option: string) => {
        setAnimatingButton(option);
        onInputChange('mobilia', option);
        onComplete();
    };

    return (
        <div className="w-full px-6">
            <h3 className="text-2xl leading-tight font-normal text-white text-center mb-6">
                Seu imóvel está mobiliado?
            </h3>
            <div className="grid grid-cols-1 gap-4">
                {[
                    {
                        id: 'sim',
                        label: 'Meu imóvel está totalmente pronto para locação',
                        description: 'Mobiliado, completo, tem tudo o que precisa',
                        image: '/illustrations/fully-furnished.png'
                    },
                    {
                        id: 'parcial',
                        label: 'Meu imóvel fornece apenas o essencial',
                        description: 'Tenho apenas o essencial, como fogão, geladeira, e cama',
                        image: '/illustrations/basic-furnished.png'
                    },
                    {
                        id: 'nao',
                        label: 'Gostaria que a Yallah me ajudasse a preparar o meu imóvel',
                        description: '',
                        image: '/illustrations/need-help.png'
                    }
                ].map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleSelect(option.id)}
                        className={`relative flex items-center gap-4 w-full px-6 py-4 rounded-xl backdrop-blur-sm bg-white/5 border border-white/20 transition-all ${formData.mobilia === option.id
                            ? 'bg-white/20'
                            : 'hover:bg-white/10'
                            } ${animatingButton === option.id ? 'scale-95' : ''}`}
                    >
                        <div className="flex-none w-24 h-24 relative rounded-lg overflow-hidden">
                            <Image
                                src={option.image}
                                alt={option.label}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex-1 text-left">
                            <h4 className="text-lg font-medium text-white mb-1">
                                {option.label}
                            </h4>
                            <p className="text-sm text-white/70">
                                {option.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

const SuccessMessage: React.FC = () => {
    return (
        <div className="absolute inset-0 z-50 overflow-hidden">
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
            <div className="absolute left-0 top-0 w-full h-full p-4">
                <div className="relative h-full flex flex-col">
                    {/* Chat Bubbles */}
                    <div className="flex flex-col space-y-3 max-w-[50%]">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="flex"
                        >
                            <div className="inline-block bg-white rounded-2xl rounded-bl-none px-3 py-2 shadow-lg">
                                <p className="text-gray-800 text-base">Olá! 👋</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5, duration: 0.5 }}
                            className="flex"
                        >
                            <div className="inline-block bg-white rounded-2xl rounded-bl-none px-3 py-2 shadow-lg">
                                <p className="text-gray-800 text-base">Recebemos seu cadastro!</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2.5, duration: 0.5 }}
                            className="flex"
                        >
                            <div className="inline-block bg-white rounded-2xl rounded-bl-none px-3 py-2 shadow-lg">
                                <p className="text-gray-800 text-base">Em breve entraremos em contato! 🏠</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 3.5, duration: 0.5 }}
                            className="flex justify-end"
                        >
                            <div className="inline-block bg-[#8BADA4] rounded-2xl rounded-br-none px-3 py-2 shadow-lg">
                                <p className="text-white text-base">Ótimo! 😊</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 4.5, duration: 0.5 }}
                            className="flex"
                        >
                            <div className="inline-block bg-white rounded-2xl rounded-bl-none px-3 py-2 shadow-lg">
                                <p className="text-gray-800 text-base">Até breve! 🤝</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Thank You Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.6,
                            delay: 5.5,
                            ease: "easeOut"
                        }}
                        className="absolute bottom-8 left-4"
                    >
                        <motion.p
                            className="text-white text-2xl font-playfair font-semibold"
                            style={{ lineHeight: 1.2 }}
                        >
                            Obrigado, nossa equipe<br />entrará em contato 😉
                        </motion.p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const ErrorMessage: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
    <div className="w-full px-6 flex flex-col items-center justify-center text-center h-full">
        <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="bg-red-500/20 p-6 rounded-full mb-6"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </motion.div>
        <h3 className="text-2xl font-semibold text-white mb-2">Ops! Algo deu errado.</h3>
        <p className="text-white/80 mb-6">
            Não foi possível enviar sua solicitação. Por favor, tente novamente.
        </p>
        <button
            onClick={onRetry}
            className="bg-white/20 text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/30 transition-colors"
        >
            Tentar Novamente
        </button>
    </div>
);

const platforms = [
    {
        id: 'airbnb',
        label: 'Airbnb',
        icon: '/airbnb.png',
    },
    {
        id: 'booking',
        label: 'Booking',
        icon: '/booking.png',
    },
    {
        id: 'nenhuma',
        label: 'Nenhuma',
        icon: '/others.png',
    }
];

export default function HowItWorks({ showCTA = true }: HowItWorksProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        valorEstimado: 200000,
        valorDiaria: 0,
        plataformas: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLocationSelect = (location: { address: string; coordinates: [number, number] }) => {
        setFormData(prev => ({
            ...prev,
            endereco: location.address,
            coordinates: location.coordinates
        }));
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                return !!formData.nome && !!formData.email && !!formData.telefone && formData.telefone.length > 10;
            case 2:
                return !!formData.tipoImovel;
            case 3:
                return !!formData.valorEstimado && !!formData.endereco;
            case 4:
                return typeof formData.valorDiaria === 'number' && formData.valorDiaria >= 0;
            case 5:
                return !!formData.plataformas && formData.plataformas.length > 0;
            case 6:
                return !!formData.mobilia;
            default:
                return true; // Default to true for steps without validation
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 7));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        // A validação final acontece aqui, antes de enviar.
        if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4) || !validateStep(5) || !formData.mobilia) {
            // Se algo estiver faltando (improvável devido à trava dos botões), não submete.
            // Poderíamos adicionar uma mensagem de erro aqui se necessário.
            console.error("Validação final falhou. Dados incompletos:", formData);
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');
        setCurrentStep(7);

        const [firstName, ...lastNameParts] = (formData.nome || "").split(" ");
        const lastName = lastNameParts.join(" ");

        const messageData = {
            first_name: firstName,
            last_name: lastName,
            email: formData.email,
            phone: formData.telefone,
            category: 'Possíveis Clientes',
            property_type: formData.tipoImovel,
            property_address: formData.endereco,
            property_value: formData.valorEstimado,
            daily_rate: formData.valorDiaria,
            current_platform: formData.plataformas?.join(', '),
            furnishing_state: formData.mobilia,
            message: `Novo lead de "Possíveis Clientes" (Mobile):
            - Tipo de Imóvel: ${formData.tipoImovel}
            - Endereço: ${formData.endereco}
            - Valor Estimado: ${formData.valorEstimado}
            - Diária Desejada: ${formData.valorDiaria}
            - Plataformas: ${formData.plataformas?.join(', ')}
            - Mobília: ${formData.mobilia}`
        };

        const { error } = await supabase.from('contact_messages').insert([messageData]);

        if (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        } else {
            setSubmitStatus('success');
        }
        setIsSubmitting(false);
    };

    const handleComplete = () => {
        // Agora o handleComplete chama diretamente o handleSubmit.
        // A lógica de `setTimeout` foi removida para simplificar.
        handleSubmit();
    };

    // Mapeamento das imagens de fundo para cada etapa
    const backgroundImages: Record<number, string> = {
        1: '/illustrations/property-management.png',
        2: '/illustrations/property-types.png',
        3: '/illustrations/property-value.png',
        4: '/illustrations/step-4.png',
        5: '/illustrations/step-5.png',
        6: '/illustrations/step-6.png',
    };

    const totalSteps = 7;

    return (
        <div className="relative flex flex-col min-h-[550px] bg-white">
            {/* Navigation Dots */}
            {currentStep < 7 && (
                <div className="relative z-[5] flex justify-center gap-3 pt-4 px-4">
                    {Array.from({ length: 6 }, (_, i) => (
                        <div
                            key={i + 1}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentStep === i + 1
                                ? 'bg-white scale-100'
                                : currentStep > i + 1
                                    ? 'bg-white/60 scale-75'
                                    : 'bg-white/20 scale-75'
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Background Image */}
            {currentStep < 7 && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={backgroundImages[currentStep]}
                        alt="Background"
                        fill
                        priority
                        className="object-cover"
                        quality={90}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>
            )}

            {/* Content */}
            <div className={`relative z-[5] flex-1 flex items-center justify-center ${currentStep === 7 ? 'h-[calc(100vh-84px)]' : 'py-6'}`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full"
                    >
                        {currentStep === 1 && (
                            <StepOne formData={formData} onInputChange={handleInputChange} />
                        )}
                        {currentStep === 2 && (
                            <StepTwo formData={formData} onSelect={(tipo) => handleInputChange('tipoImovel', tipo)} />
                        )}
                        {currentStep === 3 && (
                            <StepThree
                                formData={formData}
                                onInputChange={handleInputChange}
                                onLocationSelect={handleLocationSelect}
                            />
                        )}
                        {currentStep === 4 && (
                            <StepFour formData={formData} onInputChange={(field, value) => handleInputChange(field, value)} />
                        )}
                        {currentStep === 5 && (
                            <StepFive
                                formData={formData}
                                onInputChange={handleInputChange}
                                onComplete={() => setCurrentStep(6)}
                            />
                        )}
                        {currentStep === 6 && (
                            <StepSix
                                formData={formData}
                                onInputChange={handleInputChange}
                                onComplete={handleComplete}
                            />
                        )}
                        {currentStep === 7 && submitStatus === 'success' && <SuccessMessage />}
                        {currentStep === 7 && submitStatus === 'error' && <ErrorMessage onRetry={handleSubmit} />}
                        {currentStep === 7 && isSubmitting && (
                            <div className="flex justify-center items-center h-full">
                                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            {currentStep < 7 && (
                <div className="relative z-[5] sticky bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-t from-black/50 to-transparent">
                    {currentStep > 1 && currentStep < 7 && (
                        <button
                            onClick={prevStep}
                            className="flex items-center gap-2 text-white hover:text-white transition-colors px-6 py-2.5 rounded-full border border-white/20 backdrop-blur-sm bg-white/5"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    {currentStep < 6 && (
                        <button
                            onClick={nextStep}
                            className={`flex items-center gap-2 text-white transition-colors px-6 py-2.5 rounded-full border border-white/20 backdrop-blur-sm bg-white/5 hover:bg-white/10 ${currentStep === 1 ? 'w-full justify-center' : 'ml-auto'} disabled:opacity-50 disabled:cursor-not-allowed`}
                            disabled={!validateStep(currentStep)}
                        >
                            <ArrowRight size={20} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
} 