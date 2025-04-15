# Firebase Integration for Yallah Platform

Este documento explica como foi implementada a integração do Firebase (Firestore e Storage) no projeto Yallah, permitindo o armazenamento dos dados de imóveis e imagens no Firebase e a sincronização em tempo real entre o painel administrativo e o frontend.

## Estrutura de Arquivos Implementada

- `src/utils/firebase.ts`: Configuração básica do Firebase, incluindo Firestore e Storage
- `src/services/propertyService.ts`: Serviços para operações CRUD com propriedades no Firebase
- `src/hooks/useProperties.ts`: Hook React para carregar e sincronizar dados do Firebase em tempo real
- `src/components/home/PropertiesList.tsx`: Componente de exemplo que utiliza o hook para exibir propriedades
- `firebase.rules.json`: Regras de segurança para Firestore e Storage

## Configuração Inicial

1. A configuração do Firebase já está presente no projeto, utilizando o arquivo `src/utils/firebase.ts`
2. Foi adicionado o suporte ao Firebase Storage para armazenamento de imagens
3. As regras de segurança foram configuradas para permitir leitura pública, mas restringir escrita a usuários autenticados com privilégios de administrador

## Como Usar a Integração

### No Painel Administrativo

O painel administrativo (`src/app/admin/dashboard/properties/page.tsx`) foi atualizado para:

1. Salvar automaticamente os dados dos imóveis no Firebase Firestore ao cadastrar
2. Enviar imagens para o Firebase Storage e salvar as URLs geradas
3. Carregar imóveis do Firebase ao iniciar e manter sincronizado

Principais funções implementadas:
- `handleAddProperty`: Adiciona um novo imóvel no Firebase
- `handleUpdateProperty`: Atualiza um imóvel existente
- `handleDeleteProperty`: Remove um imóvel e suas imagens
- `loadPropertiesFromFirebase`: Carrega os imóveis do Firebase

### No Frontend (Catálogo de Imóveis)

Para o frontend, foi criado um hook personalizado (`useProperties`) que:

1. Carrega dados do Firebase Firestore
2. Configura listeners para atualizações em tempo real
3. Permite filtrar e ordenar propriedades

Exemplo de uso do hook:
```tsx
const { properties, loading, error } = useProperties({
  realtime: true,
  sortBy: 'updatedAt',
  sortDirection: 'desc'
});
```

Foi criado um componente de exemplo (`PropertiesList.tsx`) que demonstra como utilizar o hook para exibir os imóveis.

## Estrutura de Dados no Firebase

### Firestore

A coleção `properties` armazena todos os imóveis com a seguinte estrutura:

```
properties/
  {propertyId}/
    title: string
    description: string
    type: string
    location: string
    price: number
    bedrooms: number
    bathrooms: number
    beds: number
    guests: number
    area: number
    status: 'available' | 'rented' | 'maintenance'
    featured: boolean
    images: string[] (URLs para o Storage)
    amenities: string[]
    categorizedAmenities: { [category: string]: string[] }
    houseRules: {
      checkIn: string
      checkOut: string
      maxGuests: number
      additionalRules: string[]
    }
    safety: {
      hasCoAlarm: boolean
      hasSmokeAlarm: boolean
      hasCameras: boolean
    }
    cancellationPolicy: string
    createdAt: timestamp
    updatedAt: timestamp
```

### Storage

As imagens dos imóveis são armazenadas no Firebase Storage seguindo a estrutura:

```
properties/
  {propertyId}/
    images/
      {uniqueId}.jpg
```

## Segurança e Boas Práticas

1. **Regras de Segurança**: Configuradas para permitir leitura pública dos imóveis, mas restringir escrita a administradores
2. **Controle de Acesso**: Verificação de autenticação antes de operações de escrita
3. **Otimização de Imagens**: As imagens são processadas antes do upload para garantir melhor performance
4. **Listeners Eficientes**: Os listeners são configurados de forma eficiente e desconectados quando não necessários
5. **Tratamento de Erros**: Implementação robusta de tratamento de erros em todas as operações Firebase

## Implantação na Vercel

A integração é totalmente compatível com a implantação na Vercel. O Firebase SDK é inicializado no lado do cliente para evitar problemas com SSR (Server-Side Rendering).

## Próximos Passos

1. Implementar paginação para melhorar performance com grandes volumes de dados
2. Adicionar busca textual avançada usando Firebase Extensions ou Algolia
3. Configurar cache para otimizar o carregamento de imagens frequentemente acessadas
4. Implementar analytics para monitorar o desempenho e uso da plataforma

## Solução de Problemas

Se encontrar problemas com a integração do Firebase:

1. Verifique se as credenciais do Firebase estão corretas
2. Confirme que as regras de segurança estão configuradas adequadamente
3. Verifique os logs de erro no console do navegador
4. Certifique-se de que a biblioteca uuid está instalada (`npm install uuid @types/uuid`)

Para qualquer dúvida adicional, consulte a documentação oficial do Firebase ou entre em contato com o desenvolvedor. 