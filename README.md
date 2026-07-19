# Meu Saldo

Sistema web de gerenciamento financeiro pessoal desenvolvido como trabalho final da disciplina **CSI606-2026-01 — Sistemas Web 1**, da **Universidade Federal de Ouro Preto — UFOP**.

**Discente:** Patrick Peres Nicolini

---

## Sobre o projeto

O **Meu Saldo** é uma aplicação web criada para auxiliar usuários no controle de suas finanças pessoais.

O sistema permite cadastrar, editar, excluir e acompanhar receitas e despesas, além de organizar movimentações por tags, configurar lançamentos recorrentes, consultar históricos e visualizar indicadores financeiros em gráficos e resumos.

A aplicação foi desenvolvida com uma arquitetura separada entre front-end e back-end. O front-end é responsável pela interface e pela experiência do usuário, enquanto o back-end gerencia autenticação, regras de negócio, persistência dos dados e comunicação com o banco de dados.

O projeto possui suporte a temas claro e escuro, interface responsiva para desktop e dispositivos móveis, autenticação tradicional e login com Google.

---

## Principais funcionalidades

### Autenticação e usuários

- Cadastro de usuários;
- Login com e-mail e senha;
- Login e cadastro com conta Google;
- Autenticação utilizando JWT;
- Recuperação e alteração de senha;
- Visualização e edição do perfil;
- Exclusão da própria conta;
- Controle de acesso por tipo de usuário;
- Área administrativa para gerenciamento de usuários;
- Ativação e desativação de contas;
- Paginação da lista de usuários.

### Dashboard financeiro

- Exibição do saldo do período;
- Total de receitas;
- Total de despesas;
- Quantidade de movimentações;
- Volume financeiro movimentado;
- Indicadores de saúde financeira;
- Taxa de economia;
- Comprometimento da renda;
- Gráfico de fluxo de caixa;
- Gráfico de evolução do saldo;
- Resumo das movimentações recentes;
- Filtros por mês, ano e todo o período;
- Atualização manual das informações;
- Exportação dos dados para CSV.

### Receitas e despesas

- Cadastro de receitas;
- Cadastro de despesas;
- Edição de movimentações;
- Exclusão de movimentações;
- Pesquisa por descrição;
- Filtros por período;
- Organização por tags;
- Visualização em tabela no desktop;
- Visualização em cards no mobile;
- Paginação dos resultados;
- Formatação monetária em real;
- Atualização automática dos dados após alterações.

### Movimentações recorrentes

- Cadastro de receitas recorrentes;
- Cadastro de despesas recorrentes;
- Definição do dia da ocorrência;
- Definição da data inicial;
- Definição opcional da data final;
- Configuração do intervalo entre ocorrências;
- Ativação e desativação de recorrências;
- Edição de regras recorrentes;
- Exclusão de recorrências;
- Visualização da próxima ocorrência;
- Contagem das movimentações geradas;
- Identificação visual de receitas e despesas recorrentes;
- Manutenção dos lançamentos já gerados após a exclusão da regra.

### Histórico financeiro

- Consulta de todas as movimentações;
- Filtros por mês e ano;
- Visualização de todo o período;
- Resumo mensal;
- Seleção de um mês para consulta detalhada;
- Indicadores de receitas, despesas e saldo;
- Identificação de movimentações recorrentes;
- Gráficos baseados nos dados reais do usuário;
- Paginação das movimentações;
- Exportação dos resultados filtrados.

### Tags

- Criação de tags;
- Definição de nome e cor;
- Edição de tags;
- Exclusão de tags;
- Associação de múltiplas tags às movimentações;
- Exibição adaptativa das tags de acordo com o espaço disponível;
- Filtros financeiros por tag.

### Interface e experiência do usuário

- Interface responsiva;
- Suporte para desktop, tablet e mobile;
- Tema claro e escuro;
- Menu lateral recolhível;
- Navegação protegida por autenticação;
- Rotas exclusivas para administradores;
- Feedback visual de carregamento;
- Mensagens de sucesso e erro;
- Estados vazios;
- Diálogos de confirmação;
- Animações e transições suaves;
- Componentes reutilizáveis;
- Acessibilidade em botões, formulários, menus e diálogos.

---

## Tecnologias utilizadas

### Front-end

| Tecnologia | Utilização |
| --- | --- |
| React | Construção da interface por componentes |
| Vite | Ambiente de desenvolvimento e geração do build |
| JavaScript | Linguagem utilizada no front-end |
| Tailwind CSS | Estilização e responsividade |
| React Router | Navegação entre páginas e proteção de rotas |
| TanStack React Query | Consultas, cache e sincronização dos dados da API |
| Axios | Comunicação HTTP com o back-end |
| React Hook Form | Gerenciamento dos formulários |
| Motion | Animações e transições |
| Recharts | Construção dos gráficos financeiros |
| Radix UI | Componentes acessíveis de menu, popover e diálogo |
| Lucide React | Ícones da interface |
| React Icons | Ícones complementares |

### Back-end

| Tecnologia | Utilização |
| --- | --- |
| Node.js | Ambiente de execução do servidor |
| Express | Criação da API REST |
| JavaScript com ES Modules | Linguagem e organização dos módulos |
| Prisma ORM | Acesso, modelagem e persistência dos dados |
| JWT | Autenticação e proteção das rotas |
| Google Auth Library | Validação do login com Google |
| CORS | Controle de acesso entre front-end e back-end |
| Bcrypt | Proteção das senhas dos usuários |

### Banco de dados e infraestrutura

| Tecnologia | Utilização |
| --- | --- |
| PostgreSQL | Armazenamento dos dados da aplicação |
| Prisma Migrate | Gerenciamento das alterações do banco |
| Vercel | Hospedagem do front-end e da API |
| Git e GitHub | Versionamento e armazenamento do código |

---

## Arquitetura do projeto

O projeto está dividido em duas aplicações principais:

```text
meu-saldo/
├── frontend/
├── backend/
└── README.md
```

O front-end e o back-end possuem responsabilidades separadas e se comunicam por meio de uma API REST.

---

## Estrutura do front-end

A estrutura do front-end utiliza uma organização baseada em páginas, funcionalidades e componentes reutilizáveis.

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── auth/
│   │   ├── feedback/
│   │   ├── layout/
│   │   └── ui/
│   ├── contexts/
│   ├── features/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── history/
│   │   ├── profile/
│   │   ├── tags/
│   │   └── transactions/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Expenses/
│   │   ├── History/
│   │   ├── Income/
│   │   ├── Login/
│   │   ├── Profile/
│   │   └── Users/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── vercel.json
```

### Components

A pasta `components` contém componentes compartilhados por diferentes páginas, como:

- Botões;
- Campos de entrada;
- Selects;
- Modais;
- Menus;
- Badges;
- Cards;
- Snackbars;
- Cabeçalhos;
- Containers;
- Sidebar;
- Barra superior.

### Features

A pasta `features` organiza as funcionalidades específicas do sistema.

Cada funcionalidade pode possuir seus próprios:

- Componentes;
- Serviços de API;
- Hooks;
- Consultas do React Query;
- Formatadores;
- Validações;
- Utilitários.

Essa separação evita que regras específicas de uma funcionalidade sejam espalhadas por todo o projeto.

### Pages

A pasta `pages` contém as páginas completas acessadas pelas rotas da aplicação.

As páginas utilizam os componentes e recursos disponibilizados pelas pastas `components` e `features`.

### Services

A pasta `services` contém a configuração do Axios e os serviços responsáveis pela comunicação com a API.

Também é responsável por adicionar o token JWT às requisições autenticadas.

### Contexts e hooks

Os contextos e hooks armazenam comportamentos globais, como:

- Usuário autenticado;
- Login e logout;
- Tema da aplicação;
- Permissões;
- Estado dos filtros;
- Acesso aos dados compartilhados.

### React Query

O TanStack React Query é utilizado para:

- Buscar informações da API;
- Armazenar resultados em cache;
- Controlar carregamento e erros;
- Atualizar automaticamente as páginas;
- Invalidar consultas após cadastros, edições e exclusões;
- Evitar a exibição de dados de uma conta em outra conta.

---

## Estrutura do back-end

O back-end utiliza Node.js, Express e Prisma, seguindo uma separação entre rotas, controladores, serviços e persistência.

```text
backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── package.json
└── vercel.json
```

### Routes

As rotas definem os endpoints disponíveis na API, por exemplo:

```text
/api/auth
/api/users
/api/transactions
/api/recurring-transactions
/api/tags
/api/dashboard
/api/history
```

As rotas recebem a requisição e encaminham o processamento para os controladores correspondentes.

### Controllers

Os controladores são responsáveis por:

- Receber os dados da requisição;
- Validar os parâmetros básicos;
- Acionar os serviços;
- Definir o status HTTP;
- Retornar a resposta da API.

### Services

A camada de serviços contém as principais regras de negócio do sistema, como:

- Cadastro e autenticação;
- Login com Google;
- Criação de receitas e despesas;
- Processamento das recorrências;
- Cálculo de saldos e indicadores;
- Geração do histórico;
- Exportação para CSV;
- Gerenciamento dos usuários.

### Middlewares

Os middlewares são utilizados para:

- Validar o token JWT;
- Verificar usuários autenticados;
- Restringir rotas administrativas;
- Tratar erros;
- Validar dados;
- Configurar o CORS.

### Prisma

O Prisma é responsável pela comunicação com o banco de dados.

O arquivo `schema.prisma` contém os modelos, relacionamentos e restrições utilizados pelo sistema.

Entre as principais entidades estão:

- Usuário;
- Movimentação;
- Recorrência;
- Tag;
- Relacionamento entre movimentações e tags.

As migrations registram as alterações realizadas na estrutura do banco de dados.

### App e servidor

O arquivo `app.js` configura:

- Express;
- CORS;
- Leitura de JSON;
- Rotas;
- Middlewares;
- Tratamento de erros.

O arquivo `server.js` é utilizado para iniciar o servidor no ambiente local.

Em produção, a aplicação Express pode ser exportada diretamente pelo `app.js` para execução em uma plataforma serverless.

---

## Regras gerais do sistema

Cada usuário possui acesso somente às próprias informações financeiras.

Todas as consultas, movimentações, recorrências e tags são relacionadas ao usuário autenticado. O token JWT enviado nas requisições identifica a conta que está realizando a operação.

As movimentações são divididas em:

```text
INCOME  → Receita
EXPENSE → Despesa
```

Os valores financeiros são armazenados em centavos para evitar problemas de precisão durante cálculos monetários.

Exemplo:

```text
R$ 125,90 → 12590 centavos
```

As recorrências não geram todos os lançamentos antecipadamente. Cada movimentação é criada quando a data configurada para a ocorrência é alcançada.

---

## Instalação

### Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- Node.js;
- npm;
- PostgreSQL;
- Git.

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
cd meu-saldo
```

---

## Executando o back-end

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente em um arquivo `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/meu_saldo"

JWT_SECRET="sua-chave-secreta"
JWT_EXPIRES_IN="7d"

GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"

FRONTEND_URL="http://localhost:5173"

PORT=3000
```

Gere o Prisma Client:

```bash
npx prisma generate
```

Execute as migrations:

```bash
npx prisma migrate dev
```

Inicie o servidor:

```bash
npm run dev
```

O back-end ficará disponível, normalmente, em:

```text
http://localhost:3000
```

---

## Executando o front-end

Em outro terminal, entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env`:

```env
VITE_API_URL="http://localhost:3000/api"
VITE_GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
```

Inicie o projeto:

```bash
npm run dev
```

O front-end ficará disponível, normalmente, em:

```text
http://localhost:5173
```

---

## Scripts principais

### Front-end

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Back-end

```bash
npm run dev
npm start
npx prisma generate
npx prisma migrate dev
npx prisma migrate deploy
```

---

## Autenticação com Google

Para utilizar o login com Google, é necessário criar uma credencial OAuth do tipo **Aplicativo da Web** no Google Cloud Console.

O mesmo Client ID deve ser configurado no front-end e no back-end:

```env
VITE_GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_ID="..."
```

Também é necessário cadastrar as origens autorizadas, por exemplo:

```text
http://localhost:5173
https://seu-frontend.vercel.app
```

O front-end envia a credencial retornada pelo Google para a API. O back-end valida essa credencial e utiliza o campo `sub` como identificador único da conta Google.

---

## Deploy

A aplicação pode ser publicada utilizando dois projetos separados na Vercel:

```text
Projeto 1 → frontend
Projeto 2 → backend
```

No projeto do front-end, deve ser configurada a variável:

```env
VITE_API_URL="https://seu-backend.vercel.app/api"
```

No projeto do back-end:

```env
FRONTEND_URL="https://seu-frontend.vercel.app"
DATABASE_URL="..."
JWT_SECRET="..."
GOOGLE_CLIENT_ID="..."
```

Após alterar variáveis de ambiente, é necessário realizar um novo deploy para que os valores sejam aplicados.

---

## Objetivo acadêmico

O desenvolvimento do **Meu Saldo** tem como objetivo aplicar os conhecimentos adquiridos na disciplina de Sistemas Web, incluindo:

- Desenvolvimento de interfaces com React;
- Construção de APIs REST;
- Autenticação e autorização;
- Persistência em banco de dados;
- Comunicação entre front-end e back-end;
- Validação de formulários;
- Responsividade;
- Organização de código;
- Controle de versão;
- Publicação de aplicações web.

O projeto busca demonstrar a construção de uma aplicação completa, desde a interface do usuário até as regras de negócio e o armazenamento dos dados.
