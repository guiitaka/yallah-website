/**
 * Script para implantação de regras do Firebase
 * 
 * Use: node deploy-firebase-rules.js
 * Requisitos: Firebase CLI instalado e autenticado
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Caminhos para os arquivos temporários de regras
const firestoreRulesPath = path.join(__dirname, 'firestore.rules');
const storageRulesPath = path.join(__dirname, 'storage.rules');

// Carregar as regras do arquivo JSON
const rulesFile = path.join(__dirname, 'firebase.rules.json');
let rules;

try {
    const rulesContent = fs.readFileSync(rulesFile, 'utf8');
    rules = JSON.parse(rulesContent);
    console.log('✅ Regras carregadas com sucesso do arquivo JSON');
} catch (error) {
    console.error('❌ Erro ao carregar regras:', error);
    process.exit(1);
}

// Função para executar comandos
const runCommand = (command) => {
    return new Promise((resolve, reject) => {
        console.log(`⚙️ Executando: ${command}`);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Erro: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                console.warn(`⚠️ Aviso: ${stderr}`);
            }
            console.log(`📋 Saída: ${stdout}`);
            resolve(stdout);
        });
    });
};

// Função principal de implantação
const deployRules = async () => {
    try {
        // Criar arquivo temporário para regras do Firestore
        if (rules.firestore && rules.firestore.rules) {
            fs.writeFileSync(firestoreRulesPath, rules.firestore.rules);
            console.log('✅ Arquivo temporário de regras do Firestore criado');
        }

        // Criar arquivo temporário para regras do Storage
        if (rules.storage && rules.storage.rules) {
            fs.writeFileSync(storageRulesPath, rules.storage.rules);
            console.log('✅ Arquivo temporário de regras do Storage criado');
        }

        // Implantar regras do Firestore
        if (fs.existsSync(firestoreRulesPath)) {
            await runCommand(`firebase deploy --only firestore:rules`);
            console.log('✅ Regras do Firestore implantadas com sucesso');
        }

        // Implantar regras do Storage
        if (fs.existsSync(storageRulesPath)) {
            await runCommand(`firebase deploy --only storage:rules`);
            console.log('✅ Regras do Storage implantadas com sucesso');
        }

        console.log('🎉 Todas as regras foram implantadas com sucesso!');
    } catch (error) {
        console.error('❌ Erro durante a implantação:', error);
    } finally {
        // Limpar arquivos temporários
        if (fs.existsSync(firestoreRulesPath)) {
            fs.unlinkSync(firestoreRulesPath);
        }
        if (fs.existsSync(storageRulesPath)) {
            fs.unlinkSync(storageRulesPath);
        }
        console.log('🧹 Arquivos temporários removidos');
    }
};

// Executar o script
deployRules(); 