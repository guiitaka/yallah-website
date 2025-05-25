'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic para ReactQuill
import { X, ArrowLeft, ArrowRight, UploadCloud, Star, ArrowUp, ArrowDown, Trash2, Clock, Shield, Calendar, Wifi, Tv, ChefHat, ParkingCircle, Umbrella, Snowflake, Thermometer, Coffee, Fan, Droplet, ShieldAlert, Trees, Flame, Dumbbell, Shirt, Utensils, Container, Microwave, Sofa, Wrench, Cable, Bike, BellRing, Dog, Lamp, Wind, Baby, Mountain, Warehouse, Zap, Lock, Home, MapPin, Check, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox'; // Importar Checkbox
import MapboxSearch from '@/components/MapboxSearch';

import 'react-quill/dist/quill.snow.css'; // CSS para ReactQuill

// ReactQuill importado dinamicamente
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface FormDataImage {
    id: string;
    url: string;
}

interface FormData {
    id: string;
    title: string;
    description: string;
    type: string;
    location: string;
    coordinates: { lat: number; lng: number } | null;
    price: number;
    bedrooms: number;
    bathrooms: number;
    beds: number;
    guests: number;
    area: number;
    status: 'available' | 'rented' | 'maintenance';
    featured: boolean;
    images: FormDataImage[];
    amenities: string[]; // Embora não diretamente na Etapa 4, faz parte do formData global
    categorizedAmenities: { [key: string]: string[] };
    houseRules: { checkIn: string; checkOut: string; maxGuests: number; additionalRules: string[]; };
    safety: { hasCoAlarm: boolean; hasSmokeAlarm: boolean; hasCameras: boolean; };
    cancellationPolicy: string;
    rating: { value: number; count: number; };
    whatWeOffer: string;
    // whatYouShouldKnow: string; // Campo antigo, substituído por RichText e Sections
    whatYouShouldKnowRichText: string;
    serviceFee: number;
    discountSettings: {
        amount: number;
        type: 'percentage' | 'fixed';
        minNights: number;
        validFrom: string;
        validTo: string;
    };
    whatYouShouldKnowSections: {
        houseRules: string[];
        safetyProperty: string[];
        cancellationPolicy: string[];
    };
    whatYouShouldKnowDynamic: { // Usado por dynamicInputValues mas parte do formData conceitual
        checkInTime?: string;
        checkOutTime?: string;
        maxGuests?: number;
        quietHours?: string;
    };
}

interface NewPropertyStepperModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveAttempt: () => Promise<boolean>;
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>; // Para atualizações complexas
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    propertyTypes: string[];
    handleLocationSelect: (locationData: { address: string; coordinates: [number, number] }) => void;
    handleImageUpload: () => void;
    handleRemoveImage: (index: number) => void;
    moveFormImageUp: (index: number) => void;
    moveFormImageDown: (index: number) => void;
    moveFormImageToFirst: (index: number) => void;
    // Props para "O que você deve saber" (Toggles)
    handleWYSLCheckboxChange: (item: string, checked: boolean, sectionKey: 'houseRules' | 'safetyProperty' | 'cancellationPolicy') => void;
    dynamicInputValues: Record<string, string>;
    setDynamicInputValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    HOUSE_RULES_ITEMS: string[];
    SAFETY_PROPERTY_ITEMS: string[];
    CANCELLATION_POLICY_ITEMS: string[];
    getPlaceholderDetails: (rule: string) => { placeholder: string; placeholderKey: string; base: string; inputType: string; } | null;
    // Novas props para amenities
    AMENITIES_BY_CATEGORY: { category: string; items: string[]; }[];
    handleAmenityToggle: (amenity: string, isChecked: boolean) => void;
    getAmenityIcon: (amenity: string) => JSX.Element;
}

const STEPS = [
    { id: 1, name: 'Informações Básicas' },
    { id: 2, name: 'Localização' },
    { id: 3, name: 'Imagens' },
    { id: 4, name: 'Informações Extras' },
];

const NewPropertyStepperModal: React.FC<NewPropertyStepperModalProps> = ({
    isOpen,
    onClose,
    onSaveAttempt,
    formData,
    setFormData, // Nova prop
    handleChange,
    propertyTypes,
    handleLocationSelect,
    handleImageUpload,
    handleRemoveImage,
    moveFormImageUp,
    moveFormImageDown,
    moveFormImageToFirst,
    handleWYSLCheckboxChange,
    dynamicInputValues,
    setDynamicInputValues,
    HOUSE_RULES_ITEMS,
    SAFETY_PROPERTY_ITEMS,
    CANCELLATION_POLICY_ITEMS,
    getPlaceholderDetails,
    AMENITIES_BY_CATEGORY,
    handleAmenityToggle,
    getAmenityIcon
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [amenitiesDropdownOpenInStepper, setAmenitiesDropdownOpenInStepper] = useState(false);
    const amenitiesDropdownRefStepper = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setCurrentStep(1); // Reset to first step when modal opens
        }
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (amenitiesDropdownRefStepper.current && !amenitiesDropdownRefStepper.current.contains(event.target as Node)) {
                setAmenitiesDropdownOpenInStepper(false);
            }
        }
        if (amenitiesDropdownOpenInStepper) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [amenitiesDropdownOpenInStepper]);

    if (!isOpen) return null;

    const handleNext = () => {
        setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título do Imóvel *</label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Ex: Apartamento moderno com vista para o mar"
                                className="w-full"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Descreva os detalhes do seu imóvel..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8BADA4] sm:text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Imóvel *</label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8BADA4] sm:text-sm"
                                >
                                    <option value="">Selecione um tipo</option>
                                    {propertyTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8BADA4] sm:text-sm"
                                >
                                    <option value="available">Disponível</option>
                                    <option value="rented">Alugado</option>
                                    <option value="maintenance">Em Manutenção</option>
                                </select>
                            </div>
                        </div>

                        <h4 className="text-md font-semibold text-gray-800 pt-2 border-t mt-4 mb-0">Características e Preço</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Preço por Noite (R$) *</label>
                                <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="250" className="w-full" required />
                            </div>
                            <div>
                                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">Quartos</label>
                                <Input id="bedrooms" name="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} placeholder="2" className="w-full" />
                            </div>
                            <div>
                                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">Banheiros</label>
                                <Input id="bathrooms" name="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} placeholder="1" className="w-full" />
                            </div>
                            <div>
                                <label htmlFor="beds" className="block text-sm font-medium text-gray-700 mb-1">Camas</label>
                                <Input id="beds" name="beds" type="number" value={formData.beds} onChange={handleChange} placeholder="3" className="w-full" />
                            </div>
                            <div>
                                <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">Hóspedes</label>
                                <Input id="guests" name="guests" type="number" value={formData.guests} onChange={handleChange} placeholder="4" className="w-full" />
                            </div>
                            <div>
                                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
                                <Input id="area" name="area" type="number" value={formData.area} onChange={handleChange} placeholder="70" className="w-full" />
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Localização *</label>
                            <MapboxSearch
                                initialValue={formData.location}
                                onLocationSelect={handleLocationSelect}
                            />
                            {formData.coordinates && (
                                <p className="mt-2 text-xs text-gray-500">
                                    Latitude: {formData.coordinates.lat.toFixed(6)}, Longitude: {formData.coordinates.lng.toFixed(6)}
                                </p>
                            )}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Imagens do Imóvel</label>
                            <button
                                type="button"
                                onClick={handleImageUpload}
                                className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                            >
                                <UploadCloud size={20} className="mr-2" />
                                Adicionar Imagens
                            </button>
                        </div>

                        {formData.images && formData.images.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Prévia e Ordem das Imagens:</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {formData.images.map((img, index) => (
                                        <div key={img.id || `img-${index}`} className="relative group aspect-video bg-gray-100 rounded-md overflow-hidden shadow">
                                            <Image
                                                src={img.url}
                                                alt={`Imagem ${index + 1}`}
                                                layout="fill"
                                                objectFit="cover"
                                                className="group-hover:opacity-75 transition-opacity"
                                            />
                                            <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                                                #{index + 1}
                                            </div>
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex flex-col items-center justify-center p-1 space-y-1">
                                                <div className="flex space-x-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => moveFormImageToFirst(index)}
                                                        disabled={index === 0}
                                                        className="p-1.5 bg-white/80 hover:bg-white text-yellow-500 rounded-full shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Mover para primeiro"
                                                    >
                                                        <Star size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => moveFormImageUp(index)}
                                                        disabled={index === 0}
                                                        className="p-1.5 bg-white/80 hover:bg-white text-gray-700 rounded-full shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Mover para cima"
                                                    >
                                                        <ArrowUp size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => moveFormImageDown(index)}
                                                        disabled={index === formData.images.length - 1}
                                                        className="p-1.5 bg-white/80 hover:bg-white text-gray-700 rounded-full shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Mover para baixo"
                                                    >
                                                        <ArrowDown size={14} />
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow"
                                                    title="Remover Imagem"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 4: // INFORMAÇÕES EXTRAS
                // Log para depuração do formData na Etapa 4
                console.log('[Stepper Etapa 4] formData no início do render:', JSON.stringify(formData, null, 2));
                console.log('[Stepper Etapa 4] dynamicInputValues no início do render:', JSON.stringify(dynamicInputValues, null, 2));

                return (
                    <div className="space-y-8">
                        {/* Avaliação */}
                        <div>
                            <h4 className="text-md font-semibold text-gray-800 mb-3">Avaliação</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="ratingValue" className="block text-sm font-medium text-gray-700 mb-1">Valor (0-5)</label>
                                    <Input
                                        id="ratingValue"
                                        name="rating.value"
                                        type="number"
                                        value={formData.rating.value}
                                        onChange={(e) => setFormData(prev => ({ ...prev, rating: { ...prev.rating, value: parseFloat(e.target.value) || 0 } }))}
                                        min="0" max="5" step="0.1"
                                        className="w-full"
                                        placeholder="Ex: 4.5"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="ratingCount" className="block text-sm font-medium text-gray-700 mb-1">Nº de Avaliações</label>
                                    <Input
                                        id="ratingCount"
                                        name="rating.count"
                                        type="number"
                                        value={formData.rating.count}
                                        onChange={(e) => setFormData(prev => ({ ...prev, rating: { ...prev.rating, count: parseInt(e.target.value) || 0 } }))}
                                        min="0"
                                        className="w-full"
                                        placeholder="Ex: 42"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Taxa de Serviço */}
                        <div>
                            <label htmlFor="serviceFee" className="block text-sm font-medium text-gray-700 mb-1">Taxa de Serviço (R$)</label>
                            <Input
                                id="serviceFee"
                                name="serviceFee"
                                type="number"
                                value={formData.serviceFee}
                                onChange={handleChange} // Pode usar o handleChange geral se o nome for simples
                                min="0" step="0.01"
                                className="w-full"
                                placeholder="Ex: 35"
                            />
                        </div>

                        {/* Descontos */}
                        <div>
                            <h4 className="text-md font-semibold text-gray-800 mb-3">Configurações de Desconto</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div>
                                    <label htmlFor="discountAmount" className="block text-sm font-medium text-gray-700 mb-1">Valor do Desconto</label>
                                    <Input
                                        id="discountAmount"
                                        name="discountSettings.amount"
                                        type="number"
                                        value={formData.discountSettings.amount}
                                        onChange={(e) => setFormData(prev => ({ ...prev, discountSettings: { ...prev.discountSettings, amount: parseFloat(e.target.value) || 0 } }))}
                                        min="0"
                                        className="w-full"
                                        placeholder="Ex: 50"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="discountType" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Desconto</label>
                                    <select
                                        id="discountType"
                                        name="discountSettings.type"
                                        value={formData.discountSettings.type}
                                        onChange={(e) => setFormData(prev => ({ ...prev, discountSettings: { ...prev.discountSettings, type: e.target.value as 'percentage' | 'fixed' } }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8BADA4] sm:text-sm"
                                    >
                                        <option value="fixed">Valor Fixo (R$)</option>
                                        <option value="percentage">Percentual (%)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="discountMinNights" className="block text-sm font-medium text-gray-700 mb-1">Mín. de Noites</label>
                                    <Input
                                        id="discountMinNights"
                                        name="discountSettings.minNights"
                                        type="number"
                                        value={formData.discountSettings.minNights}
                                        onChange={(e) => setFormData(prev => ({ ...prev, discountSettings: { ...prev.discountSettings, minNights: parseInt(e.target.value) || 0 } }))}
                                        min="0"
                                        className="w-full"
                                        placeholder="Ex: 3"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="discountValidFrom" className="block text-sm font-medium text-gray-700 mb-1">Válido De</label>
                                    <Input
                                        id="discountValidFrom"
                                        name="discountSettings.validFrom"
                                        type="date"
                                        value={formData.discountSettings.validFrom}
                                        onChange={(e) => setFormData(prev => ({ ...prev, discountSettings: { ...prev.discountSettings, validFrom: e.target.value } }))}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="discountValidTo" className="block text-sm font-medium text-gray-700 mb-1">Válido Até</label>
                                    <Input
                                        id="discountValidTo"
                                        name="discountSettings.validTo"
                                        type="date"
                                        value={formData.discountSettings.validTo}
                                        onChange={(e) => setFormData(prev => ({ ...prev, discountSettings: { ...prev.discountSettings, validTo: e.target.value } }))}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* O que oferecemos - AGORA COMO DROPDOWN DE AMENITIES */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">O que oferecemos (Comodidades)</label>
                            <div className="relative" ref={amenitiesDropdownRefStepper}>
                                <button
                                    type="button"
                                    className="w-full flex flex-wrap items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#8BADA4] text-left min-h-[44px]"
                                    onClick={() => setAmenitiesDropdownOpenInStepper((open) => !open)}
                                    aria-haspopup="listbox"
                                    aria-expanded={amenitiesDropdownOpenInStepper}
                                >
                                    {formData.amenities.length === 0 ? (
                                        <span className="text-gray-400">Selecione as comodidades...</span>
                                    ) : (
                                        <div className="flex flex-wrap gap-1">
                                            {formData.amenities.map((amenity) => (
                                                <span key={amenity} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-700">
                                                    {getAmenityIcon(amenity)}
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <ChevronDown className={`ml-auto w-4 h-4 transition-transform ${amenitiesDropdownOpenInStepper ? 'rotate-180' : ''}`} />
                                </button>
                                {amenitiesDropdownOpenInStepper && (
                                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg p-3 max-h-60 overflow-y-auto animate-fade-in">
                                        {formData.amenities.length > 0 && (
                                            <button
                                                type="button"
                                                className="mb-2 text-xs text-[#8BADA4] hover:underline focus:outline-none"
                                                onClick={() => formData.amenities.forEach(amenity => handleAmenityToggle(amenity, false))} // Limpa todas
                                            >
                                                Limpar comodidades
                                            </button>
                                        )}
                                        {AMENITIES_BY_CATEGORY.map(({ category, items }) => (
                                            <div key={category} className="mb-2">
                                                <div className="font-semibold text-xs text-gray-500 mb-1 uppercase tracking-wide">{category}</div>
                                                <ul className="space-y-0.5">
                                                    {items.map((amenity) => (
                                                        <li key={amenity}>
                                                            <label className="flex items-center space-x-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-50">
                                                                <Checkbox
                                                                    id={`stepper-amenity-${amenity}`}
                                                                    checked={formData.amenities.includes(amenity)}
                                                                    onCheckedChange={(checkedState) => {
                                                                        handleAmenityToggle(amenity, !!checkedState);
                                                                    }}
                                                                    className="form-checkbox h-4 w-4 text-[#8BADA4] border-gray-300 rounded"
                                                                />
                                                                {getAmenityIcon(amenity)}
                                                                <span className="text-sm text-gray-700">{amenity}</span>
                                                            </label>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* O que você deve saber (Toggles) */}
                        <div>
                            <h4 className="text-md font-semibold text-gray-800 mb-3">O que você deve saber (Toggles)</h4>
                            <div className="space-y-4">
                                {/* Regras da Casa */}
                                <div className="p-3 border rounded-md">
                                    <h5 className="font-semibold text-gray-700 mb-2">Regras da Casa</h5>
                                    {HOUSE_RULES_ITEMS.map((ruleItem) => {
                                        const isChecked = formData.whatYouShouldKnowSections.houseRules.includes(ruleItem);
                                        const placeholderDetails = getPlaceholderDetails ? getPlaceholderDetails(ruleItem) : null;
                                        return (
                                            <div key={ruleItem} className="mb-2 p-2 border-b last:border-b-0">
                                                <div className="flex items-start">
                                                    {/* Comente o Checkbox original */}
                                                    {/*
                                                    <Checkbox
                                                        id={`hr-${ruleItem}`}
                                                        key={`hr-checkbox-${ruleItem}-${isChecked}`}
                                                        checked={Boolean(isChecked)}
                                                        onCheckedChange={(checkedStateFromCheckbox) => {
                                                            handleWYSLCheckboxChange(ruleItem, Boolean(checkedStateFromCheckbox), 'houseRules');
                                                        }}
                                                        className="mt-1 mr-2"
                                                    />
                                                    */}

                                                    {/* Adicione um input HTML padrão */}
                                                    <input
                                                        type="checkbox"
                                                        id={`hr-html-${ruleItem}`}
                                                        checked={isChecked} // A mesma lógica para 'checked'
                                                        onChange={(e) => {
                                                            // A mesma lógica para 'onChange', adaptada para o evento do input HTML
                                                            handleWYSLCheckboxChange(ruleItem, e.target.checked, 'houseRules');
                                                        }}
                                                        className="mt-1 mr-2 form-checkbox h-4 w-4 text-[#8BADA4] border-gray-300 rounded focus:ring-[#8BADA4]" // Adicionando classes para melhor visualização
                                                    />

                                                    <label htmlFor={`hr-html-${ruleItem}`} className="text-sm text-gray-700 flex-grow">
                                                        {placeholderDetails ? placeholderDetails.base : ruleItem}
                                                    </label>
                                                </div>
                                                {isChecked && placeholderDetails && (
                                                    <div className="mt-1 pl-6">
                                                        <Input
                                                            type={placeholderDetails.inputType}
                                                            placeholder={placeholderDetails.placeholderKey}
                                                            value={dynamicInputValues[ruleItem] || ''}
                                                            onChange={(e) => setDynamicInputValues(prev => ({ ...prev, [ruleItem]: e.target.value }))}
                                                            className="w-full md:w-1/2 h-8 text-sm"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Segurança e Propriedade */}
                                <div className="p-3 border rounded-md">
                                    <h5 className="font-semibold text-gray-700 mb-2">Segurança e Propriedade</h5>
                                    {SAFETY_PROPERTY_ITEMS.map(item => {
                                        const isChecked = formData.whatYouShouldKnowSections.safetyProperty.includes(item);
                                        return (
                                            <div key={item} className="flex items-center mb-1 p-1">
                                                {/* Comente o Checkbox original */}
                                                {/*
                                                <Checkbox
                                                    id={`safety-${item}`}
                                                    key={`safety-checkbox-${item}-${isChecked}`}
                                                    checked={Boolean(isChecked)}
                                                    onCheckedChange={(checkedStateFromCheckbox) => {
                                                        handleWYSLCheckboxChange(item, Boolean(checkedStateFromCheckbox), 'safetyProperty');
                                                    }}
                                                    className="mr-2"
                                                />
                                                */}

                                                {/* Adicione um input HTML padrão */}
                                                <input
                                                    type="checkbox"
                                                    id={`safety-html-${item}`}
                                                    checked={isChecked}
                                                    onChange={(e) => {
                                                        handleWYSLCheckboxChange(item, e.target.checked, 'safetyProperty');
                                                    }}
                                                    className="mr-2 form-checkbox h-4 w-4 text-[#8BADA4] border-gray-300 rounded focus:ring-[#8BADA4]"
                                                />
                                                <Shield size={16} className="mr-2 text-gray-600" />
                                                <label htmlFor={`safety-html-${item}`} className="text-sm text-gray-700">{item}</label>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Política de Cancelamento */}
                                <div className="p-3 border rounded-md">
                                    <h5 className="font-semibold text-gray-700 mb-2">Política de Cancelamento</h5>
                                    {CANCELLATION_POLICY_ITEMS.map(policy => {
                                        const isChecked = formData.whatYouShouldKnowSections.cancellationPolicy.includes(policy);
                                        return (
                                            <div key={policy} className="flex items-center mb-1 p-1">
                                                {/* Comente o Checkbox original */}
                                                {/*
                                                <Checkbox
                                                    id={`cancel-${policy}`}
                                                    key={`cancel-checkbox-${policy}-${isChecked}`}
                                                    checked={Boolean(isChecked)}
                                                    onCheckedChange={(checkedStateFromCheckbox) => {
                                                        handleWYSLCheckboxChange(policy, Boolean(checkedStateFromCheckbox), 'cancellationPolicy');
                                                    }}
                                                    className="mr-2"
                                                />
                                                */}

                                                {/* Adicione um input HTML padrão */}
                                                <input
                                                    type="checkbox"
                                                    id={`cancel-html-${policy}`}
                                                    checked={isChecked}
                                                    onChange={(e) => {
                                                        handleWYSLCheckboxChange(policy, e.target.checked, 'cancellationPolicy');
                                                    }}
                                                    className="mr-2 form-checkbox h-4 w-4 text-[#8BADA4] border-gray-300 rounded focus:ring-[#8BADA4]"
                                                />
                                                <Calendar size={16} className="mr-2 text-gray-600" />
                                                <label htmlFor={`cancel-html-${policy}`} className="text-sm text-gray-700">{policy}</label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* O que você deve saber (Editor Rico) */}
                        <div>
                            <label htmlFor="whatYouShouldKnowRichText" className="block text-sm font-medium text-gray-700 mb-1">Informações Adicionais (Editor Rico)</label>
                            <div className="text-xs text-gray-500 mb-2">
                                Use este editor para adicionar informações personalizadas e formatadas que aparecerão na aba "O que você deve saber" do frontend.
                            </div>
                            <div className="border border-gray-300 rounded-md overflow-hidden min-h-[200px]">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.whatYouShouldKnowRichText}
                                    onChange={(content) => setFormData(prev => ({ ...prev, whatYouShouldKnowRichText: content }))}
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, false] }],
                                            ['bold', 'italic', 'underline'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            ['link'],
                                            ['clean']
                                        ],
                                    }}
                                    className="bg-white"
                                />
                            </div>
                        </div>

                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl transform transition-all">
                {/* Cabeçalho do Modal */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">Adicionar Novo Imóvel</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Indicador de Etapas */}
                <div className="px-6 py-5 flex justify-center items-center space-x-4 border-b border-gray-200">
                    {STEPS.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div
                                className="flex flex-col items-center cursor-pointer"
                                onClick={() => setCurrentStep(step.id)}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium 
                    ${currentStep >= step.id ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                                >
                                    {step.id}
                                </div>
                                <p className={`mt-1 text-xs ${currentStep >= step.id ? 'text-orange-500' : 'text-gray-500'}`}>
                                    {step.name}
                                </p>
                            </div>
                            {index < STEPS.length - 1 && (
                                <div className={`flex-1 h-px ${currentStep > step.id + 0.5 ? 'bg-orange-500' : 'bg-gray-200'} self-start mt-4`}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Conteúdo da Etapa */}
                <div className="px-6 py-8 min-h-[600px] max-h-[calc(100vh-220px)] overflow-y-auto">
                    {renderStepContent()}
                </div>

                {/* Rodapé com Navegação */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                    <div>
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 1 || isSaving}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            Voltar
                        </button>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Botão Salvar (antigo Concluir Cadastro) - agora visível em todas as etapas */}
                        <button
                            onClick={async () => {
                                setIsSaving(true);
                                const success = await onSaveAttempt();
                                setIsSaving(false);
                                if (success) {
                                    onClose(); // Fecha o modal após salvar com sucesso
                                }
                            }}
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 disabled:opacity-50"
                        >
                            {isSaving ? 'Salvando...' : 'Salvar'}
                        </button>

                        {/* Botão Próximo - visível se não for a última etapa */}
                        {currentStep < STEPS.length && (
                            <button
                                onClick={handleNext} // Ação de avançar para a próxima etapa
                                disabled={isSaving} // Desabilitado enquanto estiver salvando
                                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 flex items-center disabled:opacity-50"
                            >
                                Próximo
                                <ArrowRight size={16} className="ml-2" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewPropertyStepperModal; 