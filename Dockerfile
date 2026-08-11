# Build Stage 1
FROM node:24-alpine AS build

WORKDIR /app

RUN corepack enable

# Copiar package.json e lock file
COPY package*.json pnpm-lock.yaml* yarn.lock* ./

# Instalar as dependências
RUN pnpm i

# Copiar código do projeto
COPY . ./

# Build do projeto
RUN pnpm run build

# Build Stage 2
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copia apenas o resultado do build do estágio anterior (independente de node_modules)
COPY --from=build /app/.output ./.output

# Expoe a porta padrão
EXPOSE 3000

# Inicializa o servidor Nitro integrado do Nuxt 3
CMD ["node", ".output/server/index.mjs"]