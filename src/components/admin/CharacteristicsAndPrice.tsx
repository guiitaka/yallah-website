import { BedDouble, Bath, Square, UserCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

interface CharacteristicsAndPriceProps {
    formData: {
        price: number;
        bedrooms: number;
        bathrooms: number;
        beds: number;
        guests: number;
        featured: boolean;
    };
    handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CharacteristicsAndPrice({
    formData,
    handleFormChange,
    handleCheckboxChange
}: CharacteristicsAndPriceProps) {

    return (
        <div>
            <h4 className="font-medium text-gray-700 mb-4">Características e Preço</h4>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço por Noite (R$) *
                </label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        R$
                    </span>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleFormChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BADA4]"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quartos
                    </label>
                    <div className="relative">
                        <BedDouble className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="number"
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={handleFormChange}
                            className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                            min="0"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Banheiros
                    </label>
                    <div className="relative">
                        <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="number"
                            name="bathrooms"
                            value={formData.bathrooms}
                            onChange={handleFormChange}
                            className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                            min="0"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Camas
                    </label>
                    <div className="relative">
                        <BedDouble className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="number"
                            name="beds"
                            value={formData.beds}
                            onChange={handleFormChange}
                            className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                            min="0"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hóspedes
                    </label>
                    <div className="relative">
                        <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="number"
                            name="guests"
                            value={formData.guests}
                            onChange={handleFormChange}
                            className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                            min="0"
                        />
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-[#8BADA4] focus:ring-[#8BADA4] border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                        Destacar este imóvel na plataforma
                    </label>
                </div>
            </div>
        </div>
    );
} 