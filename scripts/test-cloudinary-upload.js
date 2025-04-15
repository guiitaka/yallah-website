/**
 * Script para testar o upload de imagens no Cloudinary
 * 
 * Uso: node scripts/test-cloudinary-upload.js
 */

// Importar dependências
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configurar Cloudinary com credenciais
cloudinary.config({
    cloud_name: 'dqbytwump',
    api_key: '269638673457278',
    api_secret: '_LWJ6dsuG27ID7bSHsRJCuWcCpg',
});

// Caminho para um arquivo de teste (ou usar um demo)
const testImagePath = path.join(__dirname, '..', 'public', 'logo.png');
const usePublicImage = !fs.existsSync(testImagePath);
const uploadSource = usePublicImage
    ? 'https://images.pexels.com/photos/7511692/pexels-photo-7511692.jpeg' // Imagem de exemplo da internet
    : testImagePath;

// Função para teste
async function testUpload() {
    console.log('🔍 Testando conexão com Cloudinary...');

    try {
        // Testar conexão com ping
        await new Promise((resolve, reject) => {
            cloudinary.api.ping((error, result) => {
                if (error) {
                    reject(error);
                } else {
                    console.log('✅ Conexão com Cloudinary estabelecida!');
                    resolve(result);
                }
            });
        });

        console.log('🖼️ Testando upload de imagem...');
        console.log(`📁 Usando ${usePublicImage ? 'imagem pública' : 'logo local'} para teste`);

        // Fazer upload de teste
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                uploadSource,
                {
                    folder: 'yallah-test',
                    public_id: `test-upload-${Date.now()}`
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
        });

        console.log('✅ Upload concluído com sucesso!');
        console.log('📊 Informações da imagem:');
        console.log(`   - URL: ${result.secure_url}`);
        console.log(`   - Tamanho: ${result.bytes} bytes`);
        console.log(`   - Formato: ${result.format}`);
        console.log(`   - Dimensões: ${result.width}x${result.height} pixels`);

        // Testar transformações
        console.log('🔄 Testando transformações de imagem...');
        const transformedUrl = cloudinary.url(result.public_id, {
            width: 300,
            height: 200,
            crop: 'fill',
            quality: 'auto',
            fetch_format: 'auto'
        });

        console.log(`✅ URL com transformações: ${transformedUrl}`);

        // Limpar após o teste (opcional)
        /*
        console.log('🧹 Removendo imagem de teste...');
        await new Promise((resolve, reject) => {
          cloudinary.uploader.destroy(
            result.public_id,
            {},
            (error) => {
              if (error) reject(error);
              else resolve();
            }
          );
        });
        console.log('✅ Imagem de teste removida!');
        */

        console.log('🎉 Teste concluído com sucesso!');
        console.log('🔗 Você pode verificar a imagem em:');
        console.log(result.secure_url);
        console.log('\nSeu projeto está configurado corretamente com o Cloudinary! 👍');

    } catch (error) {
        console.error('❌ Erro durante o teste:', error);
        console.log('\n🔍 Verifique:');
        console.log('1. Se as credenciais estão corretas');
        console.log('2. Se você tem conexão com a internet');
        console.log('3. Se a conta do Cloudinary está ativa');
    }
}

// Executar o teste
testUpload(); 