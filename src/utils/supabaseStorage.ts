import { supabase } from './supabaseClient';

export async function uploadImageToSupabase(file: File, propertyId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${propertyId}/${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage.from('property-images').upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
    });
    if (error) throw error;
    // Gerar URL pública
    const { data: publicUrlData } = supabase.storage.from('property-images').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
}

export async function uploadMultipleImagesToSupabase(files: File[], propertyId: string, onProgress?: (progress: number, urls: string[]) => void): Promise<string[]> {
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
        const url = await uploadImageToSupabase(files[i], propertyId);
        urls.push(url);
        if (onProgress) onProgress(Math.round(((i + 1) / files.length) * 100), urls);
    }
    return urls;
} 