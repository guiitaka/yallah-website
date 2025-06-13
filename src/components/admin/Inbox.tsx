'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Archive, Trash, MailOpen, Inbox as InboxIcon, Reply, Users, Building, Phone, MapPin } from 'lucide-react';
import EmailComposer from './EmailComposer';

// Atualiza o tipo Message para incluir os novos campos
export type Message = {
    id: string;
    created_at: string;
    first_name: string;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    message: string | null;
    is_read: boolean;
    category: string | null;
    property_type: string | null;
    property_address: string | null;
    property_value: number | null;
    daily_rate: number | null;
    current_platform: string | null;
    furnishing_state: string | null;
};

const categories = [
    { name: 'Todos', value: 'all' },
    { name: 'Prospecções', value: 'Prospecções' },
    { name: 'Possíveis Clientes', value: 'Possíveis Clientes' },
    { name: 'Contatos', value: 'Contatos' },
];

const Inbox = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');
    const messagesPerPage = 15;

    const fetchMessages = async (pageNum: number, category: string) => {
        setLoading(true);
        const from = (pageNum - 1) * messagesPerPage;
        const to = from + messagesPerPage - 1;

        let query = supabase
            .from('contact_messages')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (category !== 'all') {
            query = query.eq('category', category);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching messages:', error);
            setError('Falha ao carregar mensagens.');
            setMessages([]);
        } else {
            const newMessages = data as Message[];
            setMessages(prev => pageNum === 1 ? newMessages : [...prev, ...newMessages]);
            if (newMessages.length < messagesPerPage || (count && messages.length + newMessages.length >= count)) {
                setHasMore(false);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        setMessages([]); // Limpa as mensagens ao trocar de categoria
        setPage(1);
        setHasMore(true);
        setSelectedMessage(null);
        fetchMessages(1, activeCategory);
    }, [activeCategory]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchMessages(nextPage, activeCategory);
    };

    const handleSelectMessage = async (message: Message) => {
        setSelectedMessage(message);
        if (!message.is_read) {
            const { error } = await supabase
                .from('contact_messages')
                .update({ is_read: true })
                .eq('id', message.id);

            if (error) {
                console.error('Error updating message status:', error);
            } else {
                setMessages(messages.map(m => m.id === message.id ? { ...m, is_read: true } : m));
            }
        }
    };

    const handleDelete = async (messageId: string) => {
        const { error } = await supabase
            .from('contact_messages')
            .delete()
            .eq('id', messageId);

        if (error) {
            console.error('Error deleting message:', error);
            setError('Falha ao excluir mensagem.');
        } else {
            setMessages(messages.filter(m => m.id !== messageId));
            if (selectedMessage && selectedMessage.id === messageId) {
                setSelectedMessage(null);
            }
        }
    };

    const handleMarkAsUnread = async (messageId: string) => {
        const { error } = await supabase
            .from('contact_messages')
            .update({ is_read: false })
            .eq('id', messageId);

        if (error) {
            console.error('Error marking as unread:', error);
        } else {
            setMessages(messages.map(m => m.id === messageId ? { ...m, is_read: false } : m));
            if (selectedMessage && selectedMessage.id === messageId) {
                setSelectedMessage({ ...selectedMessage, is_read: false });
            }
        }
    };

    const handleReply = () => {
        if (selectedMessage) {
            setIsComposerOpen(true);
        }
    };

    // Helper para formatar moeda
    const formatCurrency = (value: number | null) => {
        if (value === null || typeof value === 'undefined') return 'N/A';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    if (loading && page === 1) {
        return <div className="text-center p-8 text-gray-500">Carregando...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    return (
        <div className="flex h-[calc(100vh-150px)] text-black bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Message List */}
            <div className={`w-full md:w-2/5 border-r border-gray-200 bg-gray-50 flex flex-col ${selectedMessage ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Caixa de Entrada</h2>
                </div>
                {/* Category Tabs */}
                <div className="p-2 border-b border-gray-200">
                    <div className="flex space-x-2">
                        {categories.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => setActiveCategory(cat.value)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeCategory === cat.value
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-y-auto flex-grow">
                    {messages.length === 0 && !loading ? (
                        <div className="p-5 text-center text-gray-500 flex flex-col items-center justify-center h-full">
                            <InboxIcon className="mx-auto h-16 w-16 text-gray-400" />
                            <p className="mt-2 text-lg">Nenhuma mensagem nesta categoria.</p>
                        </div>
                    ) : (
                        <ul>
                            {messages.map(msg => (
                                <li
                                    key={msg.id}
                                    onClick={() => handleSelectMessage(msg)}
                                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${selectedMessage?.id === msg.id ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <p className={`font-bold ${!msg.is_read ? 'text-gray-900' : 'text-gray-600'}`}>{`${msg.first_name} ${msg.last_name || ''}`}</p>
                                        {!msg.is_read && <span className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-1.5 ml-2"></span>}
                                    </div>
                                    <p className="text-sm text-gray-500 truncate mt-1">{msg.message || 'Novo Lead'}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">{msg.category || 'Geral'}</span>
                                        <p className="text-xs text-right text-gray-400">
                                            {format(new Date(msg.created_at), "d MMM, HH:mm", { locale: ptBR })}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    {hasMore && !loading && (
                        <div className="p-4 text-center">
                            <button onClick={handleLoadMore} className="text-sm text-blue-500 hover:underline">
                                Carregar mais
                            </button>
                        </div>
                    )}
                    {loading && messages.length > 0 && <div className="text-center p-4 text-gray-500">Carregando...</div>}
                </div>
            </div>

            {/* Message Detail */}
            <div className={`w-full md:w-3/5 bg-white overflow-y-auto ${selectedMessage ? 'block' : 'hidden md:block'}`}>
                {selectedMessage ? (
                    <div className="h-full flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-lg text-gray-600">
                                    {selectedMessage.first_name?.charAt(0) || ''}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{`${selectedMessage.first_name} ${selectedMessage.last_name || ''}`}</h3>
                                    <p className="text-sm text-gray-500">{selectedMessage.email || ''}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                                <span className="text-xs">
                                    {format(new Date(selectedMessage.created_at), "d 'de' MMMM 'de' yyyy, 'às' HH:mm", { locale: ptBR })}
                                </span>
                                <button onClick={() => handleMarkAsUnread(selectedMessage.id)} title="Marcar como não lida" className="hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100">
                                    <MailOpen size={18} />
                                </button>
                                <button onClick={handleReply} title="Responder" className="hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100">
                                    <Reply size={18} />
                                </button>
                                <button onClick={() => handleDelete(selectedMessage.id)} title="Excluir" className="hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100">
                                    <Trash size={18} />
                                </button>
                            </div>
                        </div>
                        {/* Body */}
                        <div className="p-6 overflow-y-auto flex-grow space-y-6">
                            {/* Informações do Contato */}
                            <div className="pb-6 border-b border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-500 mb-4">Contato</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4">
                                        <Users size={18} className="text-gray-400" />
                                        <span className="text-gray-700">{`${selectedMessage.first_name} ${selectedMessage.last_name || ''}`}</span>
                                    </div>
                                    {selectedMessage.email && (
                                        <div className="flex items-center gap-4">
                                            <MailOpen size={18} className="text-gray-400" />
                                            <span className="text-gray-700">{selectedMessage.email}</span>
                                        </div>
                                    )}
                                    {selectedMessage.phone && (
                                        <div className="flex items-center gap-4">
                                            <Phone size={18} className="text-gray-400" />
                                            <span className="text-gray-700">{selectedMessage.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Detalhes do Imóvel (se aplicável) */}
                            {selectedMessage.category === 'Possíveis Clientes' && (
                                <div className="pb-6 border-b border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-500 mb-4 flex items-center gap-2">
                                        <MapPin size={16} />
                                        Detalhes do Imóvel
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <strong>Endereço do imóvel:</strong>
                                            {(selectedMessage.property_address || 'Não informado').split(',').map((part, index) => (
                                                <span key={index} className="block">{part.trim()}</span>
                                            ))}
                                        </div>
                                        <p><strong>Tipo:</strong> {selectedMessage.property_type || 'Não informado'}</p>
                                        <p><strong>Valor Estimado:</strong> {formatCurrency(selectedMessage.property_value)}</p>
                                        <p><strong>Diária Desejada:</strong> {formatCurrency(selectedMessage.daily_rate)}</p>
                                        <p><strong>Plataformas Atuais:</strong> {selectedMessage.current_platform || 'Nenhuma'}</p>
                                        <p><strong>Mobília:</strong> {selectedMessage.furnishing_state || 'Não informado'}</p>
                                    </div>
                                </div>
                            )}

                            {/* Mensagem Principal */}
                            {selectedMessage.message && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 mb-2">Mensagem</h4>
                                    <p className="text-base text-gray-800 whitespace-pre-wrap leading-relaxed">
                                        {selectedMessage.message}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-white">
                        <InboxIcon size={64} />
                        <p className="mt-4 text-lg">Selecione uma mensagem para ler</p>
                    </div>
                )}
            </div>
            {selectedMessage && selectedMessage.email && (
                <EmailComposer
                    isOpen={isComposerOpen}
                    onClose={() => setIsComposerOpen(false)}
                    recipientEmail={selectedMessage.email}
                    originalSenderName={`${selectedMessage.first_name} ${selectedMessage.last_name || ''}`}
                />
            )}
        </div>
    );
};

export default Inbox;