# HelpDesk — Front-End

Interface web da plataforma HelpDesk desenvolvida para o Desafio Técnico da Solutis.

A aplicação permite o gerenciamento de chamados, usuários e notificações, com acesso baseado no perfil do usuário.

## 🏗️ Arquitetura

O Front-End foi desenvolvido em React e se comunica com o Back-End exclusivamente através do API Gateway.

```text
React
  ↓
API Gateway
  ↓
┌──────────────┬───────────────┬────────────────────┐
│ User Service │ Ticket Service│ Notification       │
│              │               │ Service            │
└──────────────┴───────────────┴────────────────────┘
```

## 🛠️ Tecnologias

* React
* JavaScript
* Vite
* React Router
* Axios
* Docker
* Nginx

## 📋 Pré-requisitos

* Git
* Docker
* Docker Compose

Node.js e npm são necessários apenas para execução/desenvolvimento fora dos containers.

## 📁 Estrutura dos repositórios

Para executar a aplicação completa através do Docker Compose, os dois repositórios devem estar dentro da mesma pasta:

```text
HelpDesk/
├── Back-End/
└── Front-End/
```

O `docker-compose.yml` do Back-End realiza a construção do Front-End.

## ▶️ Execução

Clone os dois projetos:

```bash
git clone https://github.com/HelpDesk-Desafio-Solutis/Back-End.git
git clone https://github.com/HelpDesk-Desafio-Solutis/Front-End.git
```

Entre na pasta do Back-End:

```bash
cd Back-End
```

Suba todo o ambiente:

```bash
docker compose up --build
```

Para executar em segundo plano:

```bash
docker compose up --build -d
```

Após a inicialização, o Front-End estará disponível em:

```text
http://localhost:5173
```

O API Gateway estará disponível em:

```text
http://localhost:8089
```

## 💻 Funcionalidades

### Dashboard

* Quantidade total de chamados
* Chamados abertos
* Chamados em atendimento
* Chamados resolvidos
* Chamados críticos

### Chamados

* Listagem
* Pesquisa
* Filtros por status, prioridade e categoria
* Criação
* Visualização de detalhes
* Alteração de status
* Alteração de prioridade
* Atribuição de técnico
* Encerramento

### Usuários

* Listagem
* Criação
* Atualização
* Inativação

### Notificações

* Listagem de notificações
* Consulta dos eventos relacionados aos chamados

## 🔐 Autenticação

A aplicação utiliza autenticação baseada em **JWT**.

Os perfis disponíveis são:

* `CLIENT`
* `TECHNICIAN`
* `ADMIN`

As permissões de acesso são controladas pelo Back-End através do API Gateway.

## ⚙️ Configuração

A URL do Back-End é configurada através da variável de ambiente:

```text
VITE_API_URL=http://localhost:8089
```

## 🐳 Docker

O Front-End é construído em uma imagem Node.js e servido através do **Nginx**.

A construção é realizada pelo Docker Compose do Back-End.

Para encerrar os containers:

```bash
docker compose down
```

Para remover também os volumes dos bancos:

```bash
docker compose down -v
```