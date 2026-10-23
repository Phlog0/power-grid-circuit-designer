FROM node:24-slim AS base
RUN npm i -g pnpm

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
ENV PNPM_ONLY_BUILT_DEPENDENCIES=""
RUN pnpm install

FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build
RUN pnpm prune --prod

EXPOSE 80

# # frontend/Dockerfile
# FROM node:22-slim AS builder

# WORKDIR /app

# # Копируем package.json
# COPY package*.json ./
# RUN npm ci

# # Копируем исходники
# COPY . .

# # Собираем с правильным base path
# RUN npm run build

# # Второй этап - nginx для отдачи статики
# FROM nginx:alpine

# # Копируем собранные файлы
# COPY --from=builder /app/dist /usr/share/nginx/html



# CMD ["nginx", "-g", "daemon off;"]