'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Importa o tema 'snow'

// Carrega o ReactQuill dinamicamente para evitar problemas com SSR
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface EmailComposerProps {
    isOpen: boolean;
    onClose: () => void;
    recipientEmail: string;
    originalSenderName: string;
}

const EmailComposer: React.FC<EmailComposerProps> = ({ isOpen, onClose, recipientEmail, originalSenderName }) => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setSubject(`Re: Contato de ${originalSenderName}`);
            setBody('');
            setError(null);
            setSuccess(null);
        }
    }, [isOpen, originalSenderName]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        setError(null);
        setSuccess(null);

        const emailHtml = `
            <div style="font-family: sans-serif; font-size: 14px; color: #333;">
                ${body}
            </div>
        `;

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: recipientEmail,
                    subject: subject,
                    html: emailHtml,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || 'Falha ao enviar e-mail');
            }

            setSuccess('E-mail enviado com sucesso!');
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.';
            setError(`Erro: ${errorMessage}`);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl transform transition-all">
                <div className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-200 rounded-t-lg">
                    <h2 className="text-lg font-semibold text-gray-800">Responder</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-5 space-y-4">
                        <div className="flex items-center">
                            <label className="w-20 text-sm text-gray-500">Para:</label>
                            <span className="text-sm text-gray-800">{recipientEmail}</span>
                        </div>
                        <div>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Assunto"
                                className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-sm"
                                required
                            />
                        </div>
                        <div className="bg-white">
                            <ReactQuill
                                value={body}
                                onChange={setBody}
                                className="h-64 pb-10"
                                theme="snow"
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, false] }],
                                        ['bold', 'italic', 'underline', 'strike'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        ['link', 'image'],
                                        ['clean']
                                    ],
                                }}
                                placeholder="Escreva sua resposta..."
                            />
                        </div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg mt-2">
                        <button
                            type="submit"
                            disabled={isSending}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                            {isSending ? 'Enviando...' : 'Enviar'}
                        </button>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        {success && <p className="text-sm text-green-500">{success}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmailComposer; 