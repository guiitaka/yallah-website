'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Mail, Lock } from 'lucide-react';

interface LoginFormProps {
    onSubmit: (event: React.FormEvent<HTMLFormElement>, username: string, password: string) => void;
}

interface VideoBackgroundProps {
    videoUrl: string;
}

interface FormInputProps {
    icon: React.ReactNode;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    required?: boolean;
}

// Helper function for dynamic greeting
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
};

// FormInput Component
const FormInput: React.FC<FormInputProps> = ({ icon, type, placeholder, value, onChange, name, required }) => {
    return (
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {icon}
            </div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
                required={required}
                className="w-full pl-10 pr-3 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#8BADA4]/80 focus:ring-1 focus:ring-[#8BADA4]/80 transition-colors"
            />
        </div>
    );
};

// VideoBackground Component
const VideoBackground: React.FC<VideoBackgroundProps> = ({ videoUrl }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.error("Video autoplay failed:", error);
            });
        }
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <video
                ref={videoRef}
                className="absolute inset-0 min-w-full min-h-full object-cover w-auto h-auto"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src={videoUrl} type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
            </video>
        </div>
    );
};

// Main LoginForm Component
const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const greeting = getGreeting(); // Get dynamic greeting

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSuccess(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        onSubmit(e, username, password);
        setIsSubmitting(false);
        setIsSuccess(false);
    };

    return (
        <div className="py-20 px-16 rounded-2xl bg-white shadow-2xl w-full max-w-2xl">
            <div className="mb-10 text-center">
                <h2 className="text-4xl font-bold mb-3 relative group text-gray-800">
                    {greeting}, Yallah
                </h2>
                <p className="text-gray-600 flex flex-col items-center space-y-1 text-sm">
                    <span className="relative group cursor-default">
                        <span className="relative inline-block">
                            Acesso restrito à administradores
                        </span>
                    </span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <FormInput
                    icon={<Mail className="text-gray-500" size={20} />}
                    type="text"
                    placeholder="Nome de usuário"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <FormInput
                    icon={<Lock className="text-gray-500" size={20} />}
                    type="password"
                    placeholder="Senha"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-lg ${isSuccess
                        ? 'animate-success'
                        : 'bg-[#8BADA4] hover:bg-[#7A9C90]'
                        } text-white font-semibold text-lg transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#8BADA4] focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-[#8BADA4]/30 hover:shadow-[#8BADA4]/50`}
                >
                    {isSubmitting ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
};

const LoginYallah = {
    LoginForm,
    VideoBackground
};

export default LoginYallah; 