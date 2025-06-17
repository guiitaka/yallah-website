# Documentação de Requisitos de Produto (PRD) - Yallah

Este documento serve como um manual técnico detalhado da aplicação Yallah, projetado para permitir que um desenvolvedor compreenda a arquitetura, a lógica e o funcionamento do sistema.

## 1. Visão Geral e Objetivo do Projeto

O projeto Yallah é uma plataforma web moderna para listagem e aluguel de imóveis, possivelmente por temporada. O objetivo central da aplicação é conectar proprietários de imóveis a potenciais locatários através de uma interface rica, rápida e segura.

O sistema resolve o problema de encontrar e gerenciar aluguéis de forma eficiente, oferecendo uma plataforma com busca detalhada, visualização de propriedades em mapa, e um painel administrativo para gerenciamento dos imóveis. A aplicação parece ser destinada tanto aos administradores/proprietários que gerenciam as listagens quanto aos usuários finais (viajantes/locatários) que buscam por acomodações.

Uma característica arquitetural notável é a estrutura **multi-tenant**, sugerida pela pasta `tenant/`, indicando que a plataforma pode ser projetada para servir múltiplos "inquilinos" ou "franquias", cada um com seu próprio conjunto de imóveis e configurações, mas dentro da mesma instância da aplicação.

## 2. Arquitetura do Sistema

A aplicação é construída sobre uma arquitetura de **Cliente-Servidor**, onde o frontend e o backend estão acoplados dentro de um **monorepo** gerenciado pelo framework **Next.js**.

*   **Frontend**: Desenvolvido em **React** com **TypeScript**, utilizando o framework **Next.js (v14)** com o App Router. Ele é responsável por toda a interface do usuário. A arquitetura de rotas é **adaptativa**, servindo componentes e layouts diferentes para dispositivos móveis e desktop (`mobile/` e `(desktop)/` folders), otimizando a experiência do usuário em cada plataforma.
*   **Backend (API)**: O backend é implementado através das **API Routes** do Next.js, localizadas em `src/app/api/`. Essas rotas lidam com a lógica de negócio, autenticação, e comunicação com os serviços externos.
*   **Banco de Dados e Serviços (BaaS)**: O projeto adota uma abordagem híbrida, utilizando múltiplos provedores de Backend-as-a-Service:
    *   **Supabase**: Atua como o serviço principal, fornecendo o banco de dados **PostgreSQL** para os dados primários (como imóveis e usuários), autenticação e possivelmente armazenamento de arquivos.
    *   **Firebase**: Utilizado para funcionalidades específicas. A presença do `firebase-admin` e scripts de deploy sugere seu uso para regras de segurança, tarefas em background (Cloud Functions) ou talvez um banco de dados em tempo real (Firestore/Realtime DB) para recursos específicos.
*   **Serviços Externos**:
    *   **Cloudinary**: Para gerenciamento, otimização e entrega de mídias (imagens/vídeos dos imóveis).
    *   **Mapbox**: Para funcionalidades de mapa e geolocalização.
    *   **Nodemailer**: Para o envio de e-mails transacionais.
*   **Deployment**: A aplicação é hospedada e implantada na plataforma **Vercel**.

## 3. Tecnologias, Linguagens e Ferramentas

**Linguagens de Programação:**
*   **TypeScript**: Linguagem principal para o frontend e backend.
*   **JavaScript**: Utilizado em alguns arquivos de configuração e scripts.
*   **SQL**: Utilizada para interagir com o banco de dados PostgreSQL do Supabase.

**Frameworks e Bibliotecas:**
*   **Next.js (v14)**: Framework principal para a aplicação (React).
*   **React (v18)**: Biblioteca para construção da interface de usuário.
*   **Tailwind CSS**: Framework de estilização CSS.
*   **Shadcn-UI**: Coleção de componentes de UI, construída sobre Radix UI e Tailwind CSS.
*   **NextAuth.js (v4)**: Biblioteca para gerenciamento de autenticação.
*   **Framer Motion**: Para animações complexas da interface.
*   **Swiper / Embla Carousel**: Para carrosséis e sliders de imagens.
*   **React Quill**: Editor de Rich Text para campos como a descrição do imóvel.
*   **Lucide Icons, Phosphor Icons, Tabler Icons**: Bibliotecas de ícones.

**Banco de Dados e ORM/ODM:**
*   **Supabase (PostgreSQL)**: Banco de dados relacional principal. A interação é feita através da biblioteca cliente `supabase-js`.
*   **Firebase (Firestore/Realtime Database)**: Potencialmente utilizado como banco de dados NoSQL para casos de uso específicos.

**Ferramentas de Desenvolvimento:**
*   **Vercel**: Plataforma de build e deployment.
*   **ESLint**: Linter para garantir a qualidade e o padrão do código.
*   **pnpm/npm/yarn**: Gerenciador de pacotes Node.js (conforme `package-lock.json`).

## 4. Estrutura e Funcionamento do Banco de Dados

O banco de dados principal é o PostgreSQL gerenciado pelo Supabase. A entidade central do sistema é o **imóvel** (`property`).

**Tabela: `properties` (inferido)**
*   **Finalidade**: Armazena todas as informações sobre os imóveis listados na plataforma.

**Campos Principais:**
*   `id` (PK): Identificador único do imóvel.
*   `title` (TEXT): Título principal do imóvel.
*   `description` (TEXT): Descrição detalhada, formatada com Rich Text.
*   `type` (TEXT): Tipo de imóvel (ex: "Apartamento", "Cobertura").
*   `location` (JSONB/TEXT): Endereço e coordenadas geográficas do imóvel.
*   `status` (TEXT): Status atual (ex: "Disponível", "Alugado").
*   `price` (NUMERIC): Preço por noite.
*   `bedrooms` (INTEGER): Número de quartos.
*   `bathrooms` (INTEGER): Número de banheiros.
*   `beds` (INTEGER): Número de camas.
*   `guests` (INTEGER): Capacidade máxima de hóspedes.
*   `area` (NUMERIC): Área do imóvel em m².
*   `featured` (BOOLEAN): Flag para indicar se o imóvel é um destaque.
*   `whatWeOffer` (TEXT): Descrição das comodidades.
*   `whatYouShouldKnow` (TEXT): Regras e informações importantes.
*   `serviceFee` (NUMERIC): Taxa de serviço.
*   `discountSettings` (JSONB): Configurações de descontos.
*   `tenant_id` (FK, inferido): Chave estrangeira que referencia a qual "inquilino" o imóvel pertence, fundamental para a arquitetura multi-tenant.

**Relacionamentos:**
*   A tabela `properties` deve se relacionar com uma tabela `tenants` (para multi-tenancy) e uma tabela `users` ou `profiles` (para associar um proprietário).
*   Também deve haver relacionamentos com tabelas de `bookings` (reservas) e `reviews` (avaliações).

## 5. Recursos e Lógica de Negócio

**Autenticação:**
*   O fluxo de autenticação é gerenciado pelo **NextAuth.js**.
*   A rota `src/app/api/auth/[...nextauth]/route.ts` centraliza a lógica de login, logout e gerenciamento de sessão.
*   O `middleware.ts` na raiz do `src/` intercepta requisições para proteger rotas. Rotas como `/admin` e `/tenant` são provavelmente privadas e exigem que o usuário esteja autenticado para acessá-las.
*   A integração com Provedores do Supabase dentro do NextAuth é provável, permitindo que o NextAuth gerencie a sessão do frontend enquanto o Supabase gerencia o usuário no backend.

**Listagem e Visualização de Imóveis:**
*   Os usuários podem visualizar todos os imóveis ou apenas os que estão em destaque.
*   Os componentes `AllProperties.tsx` e `FeaturedProperties.tsx` são responsáveis por buscar os dados do backend e renderizar as listas de imóveis.
*   Por segurança, o endereço completo (`location`) de um imóvel só é revelado ao usuário após a confirmação de uma reserva. O frontend exibe apenas informações parciais, como bairro e cidade.

**Gerenciamento de Imóveis (Painel Admin/Tenant):**
*   Existe uma área administrativa (`/admin`) e/ou uma área por tenant (`/tenant/:id/`) onde os proprietários/gerentes podem criar, editar e gerenciar seus imóveis.
*   O formulário de cadastro contém os campos detalhados na seção 4.

**Multi-Tenancy:**
*   A aplicação parece isolar dados por "inquilino". Um usuário logado provavelmente pertence a um *tenant* específico e só pode visualizar e gerenciar os imóveis associados a ele. A lógica para isso deve estar presente no backend, filtrando todas as queries ao banco de dados pelo `tenant_id` do usuário autenticado.

## 6. Fluxo de Dados e API

A comunicação entre o frontend e o backend ocorre principalmente através das API Routes do Next.js.

**Endpoints Importantes:**
*   `POST /api/auth/callback/credentials`: Endpoint do NextAuth para processar o login com e-mail/senha.
*   `GET /api/auth/session`: Retorna os dados da sessão do usuário logado.
*   `POST /api/send-email`: Endpoint para o envio de e-mails. Espera um corpo com destinatário, assunto e conteúdo.
*   `GET /api/cloudinary/...`: Endpoints para interagir com o Cloudinary, por exemplo, para obter uma assinatura para upload seguro de imagens diretamente do cliente.

**Fluxo de Requisição Típica (Visualizar Imóveis):**
1.  O usuário acessa a página de listagem de imóveis no navegador.
2.  O componente React (ex: `AllProperties.tsx`) é renderizado no servidor (Server-Side Rendering) ou no cliente.
3.  Dentro do componente, uma função (provavelmente um Server Action do Next.js 14 ou uma função que usa `fetch`) é chamada para buscar os dados dos imóveis. Essa função pode chamar internamente o cliente `supabase-js`.
4.  A chamada ao Supabase executa uma query SQL: `SELECT * FROM properties WHERE status = 'Disponível'`. Se for multi-tenant, a query será `...WHERE tenant_id = 'current_tenant_id'`.
5.  O Supabase retorna os dados do banco de dados em formato JSON.
6.  O Next.js passa esses dados como props para o componente React.
7.  O React renderiza a lista de imóveis na tela, preenchendo os cards com título, preço, fotos (servidas pelo Cloudinary), etc.

## 7. Configuração do Ambiente

Guia para um novo desenvolvedor configurar o ambiente de desenvolvimento localmente.

**Passos para Instalação:**
1.  Clone o repositório do projeto.
2.  Instale as dependências com `npm install` (ou o gerenciador de pacotes do projeto).
3.  Crie um arquivo `.env.local` na raiz do projeto, copiando o conteúdo de um possível `.env.example`.
4.  Preencha as variáveis de ambiente no arquivo `.env.local`.
5.  Inicie o servidor de desenvolvimento com `npm run dev`.

**Variáveis de Ambiente (`.env.local`):**
Abaixo está uma lista de variáveis de ambiente necessárias, inferidas a partir das dependências e da estrutura do projeto.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL= # URL do seu projeto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Chave anônima (pública) do seu projeto Supabase
SUPABASE_SERVICE_ROLE_KEY= # Chave de serviço (secreta) para operações de backend

# NextAuth
NEXTAUTH_URL=http://localhost:3000 # URL base da sua aplicação
NEXTAUTH_SECRET= # Um segredo forte para assinar os JWTs, gerado aleatoriamente

# Firebase (se aplicável para o Admin SDK)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME= # Nome da sua cloud no Cloudinary
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Nodemailer (Exemplo com Gmail, pode variar)
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=
EMAIL_FROM= # E-mail que aparecerá como remetente

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN= # Token de acesso público do Mapbox
``` 