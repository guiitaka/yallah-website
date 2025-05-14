import * as admin from 'firebase-admin';

// Configuração de fallback, usar apenas em desenvolvimento
const FALLBACK_CONFIG = {
    projectId: 'yallah-login',
    clientEmail: 'firebase-adminsdk-fbsvc@yallah-login.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDGHT9wa+C1B2eU\nFqwxfUsyVcIz1yrQX97DRTYUXKJRPEXl/NYT+u7Yi3ToQ4Q1k2QH3PF2ACrhzgOY\ngGCJR8Caxr2dVLStGOaQvSAOjuVJS1BUzm7aZpCZBpjM/bJfNRZmGb1bVpJU+5Zd\nnvSxfpCMVAVlJcGoY5fEWv4pnT7QhBEaWDPUN9F8oxQha7kMB0/0HT9U5GMs/bI1\noaAwgKZBbRzEPPYGEMR0Bai0hWroP/uBuAYKdKLWRqOcomg1Q7EQlisQZi73Yqzt\n3wYOVYl8Bgmu08XgdYpZaLxrxmNlsHLpcrSt/zYq8B4mssWDnihXW5at/wJg6Psd\n90lrcbE/AgMBAAECggEADSgFE1H+rAGatcwO/FcIkYZTbWjlEs3DDS8BSTc2SknD\n5I2L/pYD8C/MADP3ntfeZTfyywt2IuUGT8V6uQh2+HBT8ujx+gAffk4o8lPiqHbk\nFfWtiTsVcCwZepzVuxqF6xrbfH99G+qnO363sOUpnpVifwCTtzsslCFszoD+77mE\n2MIOQKtsw4fCigR6CM5N8xJ25oJcj5sIbUFRe76MSgQTsbKTFbk4AiiVs52TMsBu\nmU/apgwjKw35JBEl8nk0lXOhH25pOGtW3PyVi+SlDcytuMaWpHwRxj0I3dXSnVv4\nWm4iwRHQqamn4yPwqCuO4YjFKMngc3878p32yCZPFQKBgQDxcFtL0qzcNM/i+s4i\nP9dIPcrRUOYqROF0NPfrV8MD57cAybUIPzicbj4FbtrM1RPZisOSEJE87ttl9c/5\nSp2lm8atZP88NW5PUnw2jEWJ4ZiDhwrbSM04mxCEA1DUAkj7Byu/Oey9TEmBW+jL\nUogS7zarRFLtS+rV5RxW/Km6mwKBgQDSD/1gT8tIeeFnLnUd8UYrzmoT2BjTMmLi\neDPnHZRUcpxGPsR3/Tx2XrPLODgnBWGFku6cyMZ5h3kcdFidEwe+V5fcd1zpCuEu\n37hEIeNlOuXwk1nHRBRg3LKkX1IsGNpfepr232W1z1QpZZPYILOiJqDGp+SngWEx\noeBEN4/sLQKBgQC/11ETnGCx0Fzms/aajDOZOVAwpaFdMMIbvgLIQ0G3lqR4wc1Q\nsjtfQNGTK5Q7cYuGLZZcN0HQMtKt33XTVZCSCIcDO976jlIKQTZleWu/tTukNudP\nejdmpP+ohaHx86bdn8MI/RO5DibR3J/K/tcUhHLh/zYNS2dbceLk03phxQKBgQCS\nDBXw6Wl/mWWytGUvDTnpaRjtdRhFdkm0BTio3jLrx8eJO0ij2Ag6kDtW9l5sGtyj\n3vVRQnJjumHk+6tEgh+nIgVuffq1+B951IerrxgHoLyP2BLabSXx9l+p0rAyApGJ\nQpgNPmLb1itAoOP6pzndahfsJnzeTSDDPjXLmAnTfQKBgHvUU6Nm2LtbQ3xIY6fo\nBHczgrg/5Prxy5WlzExi0+8wPrPKa/P48nHGCMpmBIMPVkN5Joz0ZkOPEKK548Ix\nqx4H2bMsg23R5pq5we9/K02dqVPNZ+OEpbYmA8Og1LL4WNWlq3bi0BXnIkLbTlKJ\nHYN3g6ghfiU2EFp+vqW21F2H\n-----END PRIVATE KEY-----\n',
};

// Determina se estamos em ambiente de produção
const isProd = process.env.NODE_ENV === 'production';

function getFirebaseAdminConfig() {
    try {
        // Obter as variáveis de configuração das variáveis de ambiente
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';

        // Logs detalhados para diagnóstico
        console.log('Ambiente:', process.env.NODE_ENV);
        console.log('Variáveis Firebase disponíveis:', {
            projectId: projectId ? 'definido' : 'indefinido',
            clientEmail: clientEmail ? 'definido' : 'indefinido',
            privateKey: privateKey ? `definido (${privateKey.length} caracteres)` : 'indefinido',
        });

        // Em produção, verificar se todas as variáveis necessárias estão definidas
        if (isProd && (!projectId || !clientEmail || !privateKey || privateKey.length === 0)) {
            throw new Error('Variáveis de ambiente do Firebase não estão configuradas na Vercel');
        }

        // Usar fallback apenas em desenvolvimento
        if (!isProd && (!projectId || !clientEmail || !privateKey || privateKey.length === 0)) {
            console.warn('Usando configuração de fallback para Firebase Admin em ambiente de desenvolvimento');
            return {
                credential: admin.credential.cert(FALLBACK_CONFIG)
            };
        }

        // Processar a chave privada se estiver definida
        if (privateKey) {
            // Remover aspas extras se estiverem presentes
            if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
                privateKey = privateKey.slice(1, -1);
            }

            // Substituir literais \n por quebras de linha reais
            if (privateKey.includes('\\n')) {
                privateKey = privateKey.replace(/\\n/g, '\n');
            }
        } else {
            // Em produção, isso nunca deveria acontecer por causa da verificação anterior
            throw new Error('Firebase private key não definida');
        }

        console.log('Iniciando Firebase Admin com:', {
            projectId,
            clientEmail,
            privateKeyLength: privateKey.length,
            privateKeyStart: privateKey.substring(0, 20) + '...'
        });

        return {
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            })
        };
    } catch (error: any) {
        console.error('Erro de configuração Firebase Admin:', error);

        // Se estamos em desenvolvimento, podemos usar fallback para testes
        if (!isProd) {
            console.warn('Erro ao configurar Firebase Admin, usando fallback para desenvolvimento');
            return {
                credential: admin.credential.cert(FALLBACK_CONFIG)
            };
        }

        throw error;
    }
}

// Inicializar Firebase Admin apenas uma vez
if (!admin.apps.length) {
    try {
        admin.initializeApp(getFirebaseAdminConfig());
        console.log('Firebase Admin inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar Firebase Admin:', error);
        throw error;
    }
}

export const auth = admin.auth();
export const db = admin.firestore();
export const storage = admin.storage(); 