# Plano de Implementação - Integração Firebase para Yallah

## Visão Geral

Este plano descreve os passos necessários para integrar completamente o Firebase (Firestore e Storage) à plataforma Yallah, permitindo o armazenamento e sincronização dos dados de imóveis entre o painel administrativo e o frontend.

## Pré-requisitos

- Node.js e npm instalados
- Conta Firebase configurada
- Projeto já configurado com Firebase Authentication

## Passo 1: Instalação de Dependências

Execute o seguinte comando para instalar as dependências necessárias:

```bash
npm install uuid @types/uuid
```

## Passo 2: Implementação dos Serviços Firebase

### 2.1. Atualizar a configuração do Firebase

O arquivo `src/utils/firebase.ts` já foi atualizado para incluir o Firebase Storage e as referências de coleção. 

### 2.2. Implementar o serviço de propriedades

O arquivo `src/services/propertyService.ts` contém todas as funções necessárias para interagir com o Firestore e o Storage:
- Salvar propriedades
- Atualizar propriedades
- Excluir propriedades
- Consultar propriedades
- Upload de imagens
- Gerenciamento de imagens

### 2.3. Implementar o hook personalizado 

O arquivo `src/hooks/useProperties.ts` fornece um hook React que facilita o uso dos dados do Firebase nos componentes, incluindo suporte para atualizações em tempo real.

## Passo 3: Atualização do Painel Administrativo

### 3.1. Modificar o cadastro de imóveis

No arquivo `src/app/admin/dashboard/properties/page.tsx`:

1. Importe os serviços de propriedade:
   ```tsx
   import { 
       saveProperty, 
       updateProperty, 
       deleteProperty, 
       fetchProperties, 
       uploadMultiplePropertyImages 
   } from '@/services/propertyService';
   ```

2. Adicione estados para controlar o carregamento e progresso do upload:
   ```tsx
   const [loadingProperties, setLoadingProperties] = useState<boolean>(true);
   const [imageUploadProgress, setImageUploadProgress] = useState<number>(0);
   const [isUploadingImages, setIsUploadingImages] = useState<boolean>(false);
   ```

3. Adicione a função para carregar propriedades do Firebase:
   ```tsx
   useEffect(() => {
       if (!loading && user) {
           loadPropertiesFromFirebase();
       }
   }, [loading, user]);

   const loadPropertiesFromFirebase = async () => {
       try {
           setLoadingProperties(true);
           const propertiesData = await fetchProperties();
           
           if (propertiesData.length === 0) {
               setProperties(sampleProperties);
           } else {
               setProperties(propertiesData);
           }
       } catch (error) {
           console.error('Erro ao carregar propriedades:', error);
           setProperties(sampleProperties);
       } finally {
           setLoadingProperties(false);
       }
   };
   ```

4. Substitua as funções de adicionar, atualizar e excluir propriedades pelas versões que utilizam o Firebase.

## Passo 4: Atualização do Frontend

### 4.1. Opção 1: Atualizar os componentes existentes

Modifique os componentes existentes para utilizar o hook `useProperties`:

```tsx
import { useProperties } from '@/hooks/useProperties';

export default function ExistingComponent() {
    const { properties, loading, error } = useProperties({
        realtime: true,
        sortBy: 'updatedAt',
        sortDirection: 'desc'
    });
    
    // Adapte o restante do componente para usar os dados do properties
    // ...
}
```

### 4.2. Opção 2: Usar o novo componente PropertiesList

Alternativamente, você pode usar o componente `PropertiesList` que já está configurado para usar o Firebase:

```tsx
import PropertiesList from '@/components/home/PropertiesList';

export default function SomePageComponent() {
    return (
        <div>
            <h1>Nossos Imóveis</h1>
            <PropertiesList />
        </div>
    );
}
```

## Passo 5: Configuração das Regras de Segurança

### 5.1. Implantar regras de segurança

1. Execute o script de implantação das regras:
   ```bash
   node deploy-firebase-rules.js
   ```

2. Verifique no Console do Firebase se as regras foram aplicadas corretamente.

## Passo 6: Teste e Validação

### 6.1. Teste no painel administrativo

1. Acesse o painel administrativo e teste:
   - Adicionar um novo imóvel
   - Editar um imóvel existente
   - Excluir um imóvel
   - Fazer upload de imagens

2. Verifique no Console do Firebase se os dados estão sendo salvos corretamente.

### 6.2. Teste no frontend

1. Acesse o frontend e verifique se:
   - Os imóveis são exibidos corretamente
   - As imagens são carregadas
   - As atualizações em tempo real funcionam

## Passo 7: Monitoramento e Otimização

### 7.1. Configurar monitoramento

1. Ative o Firebase Performance Monitoring
2. Configure alertas para operações lentas
3. Monitore o uso do Storage para controlar custos

### 7.2. Otimização de performance

1. Implemente paginação para grandes conjuntos de dados
2. Configure caching adequado para imagens frequentemente acessadas
3. Otimize as consultas Firestore com índices apropriados

## Considerações Finais

Esta implementação permite que:
- Os dados dos imóveis sejam armazenados de forma segura no Firebase
- As imagens sejam enviadas ao Storage e otimizadas para acesso rápido
- O frontend se mantenha sincronizado em tempo real com as alterações feitas no backend
- O sistema seja escalável para lidar com um número crescente de propriedades

A integração foi projetada para manter a estrutura visual atual e minimizar alterações na experiência do usuário, focando apenas na camada de dados e comunicação com o Firebase.

## DE-PARA: Mapeamento de Campos Backend → Frontend

Este documento detalha o mapeamento dos campos do formulário de administração para os componentes do frontend, garantindo que os dados inseridos no painel administrativo sejam corretamente exibidos no catálogo de imóveis.

### Campos Básicos

| Backend (Admin) | Frontend (Cliente) | Status | Descrição |
|----------------|-------------------|--------|-----------|
| `title` | Título principal do imóvel | ✅ | Ex: "Estúdio com decoração vintage" |
| `description` | Seção "Nosso imóvel" | ✅ | Descrição completa do imóvel |
| `type` | Exibido como parte das especificações | ✅ | Ex: "Studio", "Apartamento", etc. |
| `location` | Endereço formatado | ✅ | Formato: "Vila Madalena, São Paulo" |
| `coordinates` | Posição no mapa | ✅ | Usado para exibir localização no mapa |
| `price` | Preço por noite | ✅ | Exibido como "R$ X / noite" |
| `bedrooms` | Parte das especificações | ✅ | Exibido como "X quartos" |
| `bathrooms` | Parte das especificações | ✅ | Exibido como "X banheiros" |
| `beds` | Parte das especificações | ✅ | Exibido como "X camas" |
| `guests` | Parte das especificações | ✅ | Exibido como "X hóspedes" |
| `area` | Parte das especificações | ✅ | Exibido como "X m²" |
| `status` | Indicador de disponibilidade | ✅ | Controla se o imóvel aparece como disponível |
| `featured` | Badge de "Destaque" | ✅ | Exibe badge verde no card quando ativado |
| `images` | Galeria de fotos | ✅ | Carrossel de imagens na visualização do imóvel |

### Campos Adicionados

| Backend (Admin) | Frontend (Cliente) | Status | Descrição |
|----------------|-------------------|--------|-----------|
| `rating.value` | Avaliação (estrelas) | ✅ | Valor numérico de 0 a 5 |
| `rating.count` | Contagem de avaliações | ✅ | Exibido como "(X)" junto à avaliação |
| `whatWeOffer` | Aba "O que oferecemos" | ✅ | Conteúdo da aba específica no detalhe do imóvel |
| `whatYouShouldKnow` | Aba "O que você deve saber" | ✅ | Conteúdo da aba específica no detalhe do imóvel |
| `serviceFee` | Taxa de serviço | ✅ | Exibido como "Taxa de serviço: R$ X" no resumo de preços |
| `discountSettings.amount` | Desconto | ✅ | Exibido como "-R$ X" no resumo de preços |
| `discountSettings.type` | Tipo de desconto | ✅ | Determina se o desconto é fixo ou percentual |
| `discountSettings.minNights` | Mínimo de noites | ✅ | Controla quando o desconto é aplicável |
| `discountSettings.validFrom` | Início da validade | ✅ | Data de início da promoção |
| `discountSettings.validTo` | Fim da validade | ✅ | Data de término da promoção |

### Outras Propriedades

| Backend (Admin) | Frontend (Cliente) | Status | Descrição |
|----------------|-------------------|--------|-----------|
| `amenities` | Lista de comodidades | ✅ | Ícones e textos na seção "O que oferecemos" |
| `houseRules` | Regras da casa | ✅ | Exibido na aba "O que você deve saber" |
| `safety` | Informações de segurança | ✅ | Exibido na aba "O que você deve saber" |
| `cancellationPolicy` | Política de cancelamento | ✅ | Exibido na aba "O que você deve saber" |

## Processo de Sincronização

1. Ao adicionar/editar um imóvel no painel administrativo, todos os campos do formulário são salvos no banco de dados Firebase
2. O frontend busca esses dados e os exibe nos componentes apropriados
3. Os campos específicos do frontend (`whatWeOffer`, `whatYouShouldKnow`, etc.) garantem que o conteúdo seja exibido nas abas corretas
4. O sistema de preços usa `price`, `serviceFee` e `discountSettings` para calcular o valor total

## Notas de Implementação

- Certifique-se de que todos os campos obrigatórios estejam preenchidos antes de salvar um imóvel
- Os campos de avaliação (`rating`) devem ser preenchidos manualmente, pois não há sistema de avaliação automática implementado ainda
- Para imagens, recomenda-se upload de imagens com proporção 16:9 e resolução mínima de 1200×800px
- O campo `status` controla a visibilidade do imóvel no frontend - apenas imóveis com status "available" são exibidos na busca

## Validações

- `price`, `bedrooms`, `bathrooms`, `guests` e `area` devem ser valores numéricos positivos
- `rating.value` deve estar entre 0 e 5
- `discountSettings.amount` deve ser um valor numérico positivo
- Datas em `discountSettings.validFrom` e `discountSettings.validTo` devem seguir o formato YYYY-MM-DD 