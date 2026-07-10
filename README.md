# Flown

Este é um projeto com Frontend + Backend integrados, usando o Nuxtjs.

## Setup

Instalar as dependências

```bash
pnpm install
```

## Development Server

Inicie o servidor em `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Para fazer o build para produção

```bash
pnpm build
```

Build local de preview

```bash
pnpm preview
```

---

## Bibliotecas

### Frontend

Para o frontend é usado apenas o Nuxt e [Nuxt UI](https://ui.nuxt.com/), com todos os componentes disponíveis a partir da versão 4.

### Backend

- Módulo oficial do Supabase para a conexão com Supabase [@nuxtjs/supabase](https://nuxt.com/modules/supabase)
- Módulo oficial [nuxt-cron](https://nuxt-cron.hywax.space/guide/getting-started.html) para envio das mensagens de forma automáticas a cada X tempo