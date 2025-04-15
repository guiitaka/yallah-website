/**
 * Script para testar a conexão com o Cloudinary
 */

// Importar dependências
const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary com credenciais
cloudinary.config({
    cloud_name: 'dqbytwump',
    api_key: '269638673457278',
    api_secret: '_LWJ6dsuG27ID7bSHsRJCuWcCpg',
});

// Testar conexão com ping
cloudinary.api.ping((error, result) => {
    if (error) {
        console.error('❌ Erro ao conectar com o Cloudinary:', error);
        console.log('\n🔍 Verifique:');
        console.log('1. Se as credenciais estão corretas');
        console.log('2. Se você tem conexão com a internet');
        console.log('3. Se a conta do Cloudinary está ativa');
        process.exit(1);
    } else {
        console.log('✅ Cloudinary conectado com sucesso!');
        console.log('📊 Informações da conta:');
        console.log(result);
        process.exit(0);
    }
}); 