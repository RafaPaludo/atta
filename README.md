# 📋 Atta - Sistema de Reuniões com Lembretes Automáticos

Aplicação completa (Frontend + Backend) construída com Nuxt.js para gerenciar reuniões, enviar lembretes automáticos via WhatsApp e manter o histórico de encaminhamentos.

## 🚀 Tecnologias

- **Framework:** Nuxt.js 4
- **UI:** Nuxt UI (componentes prontos e estilizados)
- **Autenticação e Banco de Dados:** Supabase (módulo `@nuxtjs/supabase`)
- **Agendamento:** `nuxt-cron` para tarefas periódicas
- **Mensageria:** `whatsapp-web.js` para envio de mensagens via WhatsApp

---

## 📦 Pré-requisitos

- Node.js 22+ (recomendado: 24)
- pnpm
- Docker e Docker Compose (opcional, para rodar com containers)
- Conta no Supabase (para autenticação e banco de dados)
- Conta no Resend ou outro SMTP (para envio de e-mails)

---

## ⚙️ Configuração do Ambiente

1. Copie o arquivo de exemplo de variáveis de ambiente:

```bash
cp .env.example .env
```

2. Preencha as variáveis necessárias no .env:

```bash
SUPABASE_URL=<sua_url_supabase>
SUPABASE_PUBLISHABLE_KEY=<sua_chave_publica_supabase>
WHATSAPP_PROVIDER=whatsapp-web
CONFIG_DONT_SENT_REMINDERS_ENABLED=true  # em desenvolvimento, para não enviar mensagens acidentalmente
```

---

## Rodando Localmente (sem Docker)

### Instalar as dependências

```bash
pnpm install
```

### Iniciar servidor de desenvolvimento

```bash
pnpm dev
```

Acesse http://localhost:3000

### Build para produção

```bash
pnpm build
```

### Preview do build local

```bash
pnpm preview
```


---


## 🐳 Rodando com Docker

### Usando Docker Compose (recomendado)

1. Certifique-se de que o arquivo .env está configurado corretamente.

2. Build e inicie os containers:

```bash
docker compose up -d
```

3. Acesse http://localhost:3000

4. Para parar os containers:

```bash
docker-compose down
```

### Usando Docker apenas (sem Compose)

1. Build da imagem:

```bash
docker build -t atta-app .
```

2. Execute o container:

```bash
docker run -p 3000:3000 --env-file .env atta-app
```

---

📂 Estrutura do Projeto (Resumo)

```bash
app/                    # Frontend (páginas, componentes, composables)
server/                 # Backend (API, cron, integrações)
  ├── api/              # Endpoints da API
  ├── cron/             # Tarefas agendadas (lembretes)
  ├── integrations/     # Integrações com serviços externos (WhatsApp, etc.)
  ├── services/         # Serviços de banco, repositórios
  └── utils/            # Utilitários
docs/                   # Documentação das telas e decisões
public/                 # Arquivos estáticos
```

---

## 🔄 Fluxos Principais

- Agendamento de Reunião: Criação de reunião, definição de participantes e pautas.

- Lembretes Automáticos: Um cron executa a cada minuto, verifica lembretes pendentes e envia mensagens via WhatsApp para os participantes.

- Recuperação de Senha: Fluxo completo com envio de e-mail via Resend (SMTP configurável).

- Encaminhamentos: Registro e acompanhamento de itens de ação das reuniões.

---

## 📌 Comandos Úteis

| Comando | Descrição |
| ------- | --------- |
| pnpm dev | Inicia o servidor em modo desenvolvimento |
| pnpm build | Gera o build de produção |
| pnpm preview | Faz preview do build local |
| pnpm lint | Roda o linter (ESLint) |

---

## 🧪 CI/CD
O projeto está configurado com GitHub Actions para:

- Rodar lint e testes automáticos a cada commit no repositório principal.

- O deploy é feito automaticamente pela Vercel na branch main.

---

