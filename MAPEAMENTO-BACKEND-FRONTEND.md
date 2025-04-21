# Mapeamento DE-PARA entre Backend e Frontend

Este documento descreve o mapeamento entre os campos do formulário de cadastro de imóveis no painel administrativo (backend) e os campos exibidos no frontend para os visitantes do site.

## Campos do Formulário Backend

### Informações Básicas
- **Título do Imóvel** (`title`): Nome/título principal do imóvel
- **Descrição** (`description`): Descrição detalhada do imóvel
- **Tipo de Imóvel** (`type`): Categoria do imóvel (Apartamento, Casa, Cobertura, etc.)
- **Localização** (`location`): Endereço completo do imóvel
- **Status** (`status`): Estado atual do imóvel (Disponível, Alugado, Em Manutenção)

### Características e Preço
- **Preço por Noite** (`price`): Valor cobrado por noite
- **Quartos** (`bedrooms`): Número de quartos
- **Banheiros** (`bathrooms`): Número de banheiros
- **Camas** (`beds`): Número de camas
- **Hóspedes** (`guests`): Número máximo de hóspedes
- **Área** (`area`): Tamanho do imóvel em m²
- **Destacar na plataforma** (`featured`): Se o imóvel deve ser exibido como destaque

### Campos Adicionais
- **O que oferecemos** (`whatWeOffer`): Descrição das comodidades e diferenciais
- **O que você deve saber** (`whatYouShouldKnow`): Informações importantes sobre regras e restrições
- **Taxa de serviço** (`serviceFee`): Taxa de serviço cobrada
- **Configurações de Desconto** (`discountSettings`): Detalhes sobre descontos aplicáveis

## Mapeamento DE-PARA

| Campo Backend | Campo Frontend | Localização no Frontend | Observações |
|---------------|----------------|------------------------|------------|
| `title` | Título do imóvel | Topo do card e página de detalhes | - |
| `description` | Texto em "Nosso imóvel" | Aba "Descrição" na página de detalhes | Anteriormente estava aparecendo como uma tag. CORRIGIDO. |
| `type` | Tag de tipo | Tags abaixo do título | Estava faltando e não era exibido. ADICIONADO. |
| `location` | Localização do imóvel | Tags e seção de localização | Apenas parte do endereço é exibida por segurança |
| `price` | Preço por noite | Card e detalhes do imóvel | - |
| `bedrooms` | Número de quartos | Card e detalhes do imóvel | - |
| `bathrooms` | Número de banheiros | Card e detalhes do imóvel | - |
| `beds` | Número de camas | Card e features do imóvel | - |
| `guests` | Número de hóspedes | Card e features do imóvel | - |
| `featured` | Tag de destaque | Tag "Destaque" no card | - |
| `whatWeOffer` | Texto em "O que oferecemos" | Aba "O que oferecemos" | - |
| `whatYouShouldKnow` | Texto em "O que você deve saber" | Aba "O que você deve saber" | - |
| `serviceFee` | Taxa de serviço | Seção de preços no detalhe | - |

## Principais Problemas Corrigidos

1. **Descrição do Imóvel**: A descrição detalhada inserida no backend não estava sendo corretamente exibida na seção "Nosso imóvel" no frontend. Em vez disso, um texto genérico era exibido.
   - **Solução**: Modificamos os componentes `AllProperties.tsx` e `FeaturedProperties.tsx` para exibir o campo `description` se existir, e mostrar o texto padrão apenas como fallback.

2. **Tipo do Imóvel como Tag**: O tipo de imóvel definido no backend (como "Cobertura") não estava sendo exibido como uma tag no frontend.
   - **Solução**: Garantimos que a tag de tipo seja exibida nos componentes `AllProperties.tsx` e `FeaturedProperties.tsx`.

3. **Descrição exibida como Tag**: A descrição estava sendo incorretamente exibida como uma tag.
   - **Solução**: Adicionamos uma verificação para evitar exibir a descrição como tag quando ela for igual ao campo `details`.

## Recomendações Adicionais

1. Ao preencher o formulário no backend, certifique-se de usar o campo descrição para informações detalhadas sobre o imóvel, que serão exibidas na seção "Nosso imóvel".

2. O campo tipo de imóvel é importante para a categorização e deve ser sempre preenchido, pois agora é exibido como tag no frontend.

3. A localização completa não é exibida no frontend por motivos de segurança, apenas o bairro e a cidade são mostrados. O endereço completo só é disponibilizado após a reserva. 