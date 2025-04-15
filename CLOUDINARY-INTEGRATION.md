# Integração com Cloudinary no Yallah 🏙️

Este documento explica como a integração com Cloudinary foi implementada no projeto Yallah para armazenamento de imagens.

## Credenciais e Configuração

Configuramos o Cloudinary com as seguintes credenciais:

- **Cloud Name:** dqbytwump
- **API Key:** 269638673457278
- **API Secret:** _LWJ6dsuG27ID7bSHsRJCuWcCpg

Estas credenciais estão configuradas no arquivo `src/utils/cloudinary.ts`.

## Arquivos Modificados

1. **`src/utils/cloudinary.ts`**: Configuração e funções para interagir com o Cloudinary
2. **`src/utils/firebase.ts`**: Removemos referências ao Firebase Storage
3. **`src/services/propertyService.ts`**: Atualizamos para usar Cloudinary em vez de Firebase Storage
4. **`scripts/populate-firebase.js`**: Atualizamos para usar URLs do Cloudinary

## Como Funciona

### Upload de Imagens

As imagens são enviadas diretamente para o Cloudinary usando o SDK e a API de upload:

```typescript
// Exemplo de upload
const imageUrl = await uploadImage(file, 'properties/123/images');
```

Os arquivos são organizados em pastas por propriedade (e.g., `properties/{propertyId}/images`).

### Formato das URLs

As URLs do Cloudinary seguem este formato:
```
https://res.cloudinary.com/dqbytwump/image/upload/v1234567890/properties/1234567890-image.jpg
```

### Transformações de Imagem

Pode-se adicionar parâmetros à URL para transformar imagens automaticamente:

- **Redimensionar**: `/w_300,h_200/`
- **Cortar**: `/c_fill,w_300,h_200/`
- **Qualidade**: `/q_auto/`
- **Formato**: `/f_auto/`

## Como Usar

### 1. Upload de Imagem

```typescript
import { uploadImage } from '@/utils/cloudinary';

// Em um componente React
const handleFileUpload = async (file) => {
  try {
    const imageUrl = await uploadImage(file, `properties/${propertyId}/images`);
    console.log('Imagem carregada:', imageUrl);
    // Salvar URL no estado ou enviar para API
  } catch (error) {
    console.error('Erro no upload:', error);
  }
};
```

### 2. Excluir Imagem

```typescript
import { deleteImage } from '@/utils/cloudinary';

const handleDeleteImage = async (imageUrl) => {
  try {
    await deleteImage(imageUrl);
    console.log('Imagem excluída com sucesso');
  } catch (error) {
    console.error('Erro ao excluir imagem:', error);
  }
};
```

### 3. Exibir Imagem Otimizada

```jsx
// Em um componente React
<img 
  src={`${imageUrl.replace('/upload/', '/upload/w_500,c_scale/')}`} 
  alt="Descrição da imagem" 
/>
```

## Vantagens do Cloudinary

1. **CDN Global**: Carregamento rápido em qualquer lugar
2. **Transformações Automáticas**: Redimensionamento, corte, e otimização
3. **Quota Gratuita Generosa**: 25GB de armazenamento e 25GB de transferência mensal
4. **Sem Servidor**: Não precisa de backend para upload

## Manutenção

Para atualizar as credenciais ou configurações do Cloudinary, edite o arquivo `src/utils/cloudinary.ts`.

## Solução de Problemas

- **Erro de CORS**: Certifique-se de que a origem do site está na lista de origens permitidas no painel do Cloudinary
- **Falhas de Upload**: Verifique as restrições de tamanho (máximo 10MB por arquivo no plano gratuito)
- **Falhas de Exclusão**: Assegure-se de que a URL é válida e o formato de extração de public_id está correto 