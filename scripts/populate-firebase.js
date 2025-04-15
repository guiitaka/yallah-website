/**
 * Script para popular o Firebase com dados de exemplo
 * 
 * Uso: node scripts/populate-firebase.js
 * Requisitos: Firebase Admin SDK
 */

// Importar Firebase Admin
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Inicializar o app do Firebase Admin
try {
    const serviceAccount = require('../firebase-admin-key.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin inicializado com sucesso!');
} catch (error) {
    console.error('❌ Erro ao inicializar Firebase Admin:', error);
    console.log('Por favor, coloque o arquivo firebase-admin-key.json na raiz do projeto.');
    console.log('Você pode obter esse arquivo no Console do Firebase > Configurações do Projeto > Contas de serviço > Gerar nova chave privada');
    process.exit(1);
}

// Referência ao Firestore
const db = admin.firestore();

// URLs de exemplo do Cloudinary (substituir pelas imagens reais quando disponíveis)
const cloudinaryBaseUrl = 'https://res.cloudinary.com/dqbytwump/image/upload';
const sampleImageUrls = [
    `${cloudinaryBaseUrl}/v1693482761/properties/sample-apartment-1.jpg`,
    `${cloudinaryBaseUrl}/v1693482761/properties/sample-house-1.jpg`,
    `${cloudinaryBaseUrl}/v1693482761/properties/sample-studio-1.jpg`,
    `${cloudinaryBaseUrl}/v1693482761/properties/sample-flat-1.jpg`,
    `${cloudinaryBaseUrl}/v1693482761/properties/sample-penthouse-1.jpg`,
];

// Dados de exemplo (mesmos dados do sampleProperties.ts)
const sampleProperties = [
    {
        title: 'Apartamento de luxo com vista panorâmica',
        price: 350,
        location: 'Brooklin, São Paulo',
        type: 'Apartamento',
        bedrooms: 2,
        bathrooms: 2,
        beds: 2,
        guests: 4,
        area: 120,
        status: 'available',
        images: [sampleImageUrls[0]],
        featured: true,
        description: 'Luxuoso apartamento com vista panorâmica da cidade, totalmente mobiliado e decorado.',
        amenities: ['Wi-Fi', 'TV', 'Ar condicionado', 'Cozinha completa'],
        houseRules: {
            checkIn: '15:00',
            checkOut: '11:00',
            maxGuests: 4,
            additionalRules: ['Não é permitido festas', 'Não é permitido fumar']
        },
        safety: {
            hasCoAlarm: true,
            hasSmokeAlarm: true,
            hasCameras: false
        },
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now()
    },
    {
        title: 'Casa espaçosa com jardim',
        price: 500,
        location: 'Vila Mariana, São Paulo',
        type: 'Casa',
        bedrooms: 3,
        bathrooms: 2,
        beds: 3,
        guests: 6,
        area: 200,
        status: 'available',
        images: [sampleImageUrls[1]],
        featured: false,
        description: 'Casa espaçosa com jardim privativo, perfeita para famílias.',
        amenities: ['Wi-Fi', 'TV', 'Jardim', 'Churrasqueira'],
        houseRules: {
            checkIn: '14:00',
            checkOut: '12:00',
            maxGuests: 6,
            additionalRules: ['Pets são permitidos', 'Não é permitido fumar dentro da casa']
        },
        safety: {
            hasCoAlarm: false,
            hasSmokeAlarm: true,
            hasCameras: true
        },
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now()
    },
    {
        title: 'Studio moderno no centro',
        price: 280,
        location: 'Centro, São Paulo',
        type: 'Studio',
        bedrooms: 1,
        bathrooms: 1,
        beds: 1,
        guests: 2,
        area: 60,
        status: 'available',
        images: [sampleImageUrls[2]],
        featured: true,
        description: 'Studio moderno e compacto, localizado no coração da cidade.',
        amenities: ['Wi-Fi', 'TV', 'Cozinha compacta'],
        houseRules: {
            checkIn: '15:00',
            checkOut: '11:00',
            maxGuests: 2,
            additionalRules: ['Não é permitido festas', 'Silêncio após 22h']
        },
        safety: {
            hasCoAlarm: true,
            hasSmokeAlarm: true,
            hasCameras: false
        },
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now()
    },
    {
        title: 'Flat com serviços integrados',
        price: 320,
        location: 'Pinheiros, São Paulo',
        type: 'Flat',
        bedrooms: 1,
        bathrooms: 1,
        beds: 1,
        guests: 2,
        area: 70,
        status: 'available',
        images: [sampleImageUrls[3]],
        featured: false,
        description: 'Flat moderno com serviços de hotel inclusos.',
        amenities: ['Wi-Fi', 'TV', 'Serviço de quarto', 'Academia'],
        houseRules: {
            checkIn: '14:00',
            checkOut: '12:00',
            maxGuests: 2,
            additionalRules: ['Café da manhã incluso', 'Serviço de limpeza diário']
        },
        safety: {
            hasCoAlarm: true,
            hasSmokeAlarm: true,
            hasCameras: true
        },
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now()
    },
    {
        title: 'Cobertura com terraço',
        price: 650,
        location: 'Moema, São Paulo',
        type: 'Cobertura',
        bedrooms: 3,
        bathrooms: 3,
        beds: 3,
        guests: 6,
        area: 230,
        status: 'available',
        images: [sampleImageUrls[4]],
        featured: true,
        description: 'Luxuosa cobertura duplex com terraço panorâmico e piscina privativa.',
        amenities: ['Wi-Fi', 'TV', 'Piscina privativa', 'Churrasqueira'],
        houseRules: {
            checkIn: '15:00',
            checkOut: '11:00',
            maxGuests: 6,
            additionalRules: ['Não é permitido festas', 'Adequado para famílias']
        },
        safety: {
            hasCoAlarm: true,
            hasSmokeAlarm: true,
            hasCameras: false
        },
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now()
    }
];

// Função para verificar se já existem dados
const checkExistingData = async () => {
    try {
        const propertiesRef = db.collection('properties');
        const snapshot = await propertiesRef.get();

        if (!snapshot.empty) {
            console.log(`ℹ️ Existem ${snapshot.size} propriedades já cadastradas no Firebase.`);

            const answer = await askQuestion('Deseja prosseguir e adicionar mais propriedades? (s/n): ');

            if (answer.toLowerCase() !== 's') {
                console.log('🛑 Operação cancelada pelo usuário.');
                process.exit(0);
            }
        } else {
            console.log('ℹ️ Não existem propriedades cadastradas no Firebase.');
        }
    } catch (error) {
        console.error('❌ Erro ao verificar dados existentes:', error);
        process.exit(1);
    }
};

// Função auxiliar para perguntas
function askQuestion(question) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        readline.question(question, (answer) => {
            readline.close();
            resolve(answer);
        });
    });
}

// Função para adicionar as propriedades
const addProperties = async () => {
    const propertiesRef = db.collection('properties');
    const batch = db.batch();

    console.log(`🔄 Adicionando ${sampleProperties.length} propriedades...`);

    for (const property of sampleProperties) {
        const docRef = propertiesRef.doc();
        batch.set(docRef, property);
        console.log(`✅ Preparada propriedade: ${property.title}`);
    }

    try {
        await batch.commit();
        console.log('🎉 Todas as propriedades foram adicionadas com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao adicionar propriedades:', error);
    }
};

// Função principal
const main = async () => {
    try {
        await checkExistingData();
        await addProperties();

        console.log('✨ Script finalizado com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro durante a execução do script:', error);
        process.exit(1);
    }
};

// Executar o script
main(); 