FROM node:26-slim AS base
RUN npm i -g pnpm@11.22.0

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
RUN pnpm install --no-frozen-lockfile


FROM base AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules/ ./node_modules/
COPY --from=dependencies /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=dependencies /app/apps/server/package.json ./apps/server/

COPY apps/server/ ./apps/server/
COPY apps/server/dictionaries/ ./apps/server/dictionaries/
COPY apps/server/prisma/ ./apps/server/prisma/
RUN pnpm --filter PGCD-server prisma:generate
RUN pnpm --filter PGCD-server build
RUN pnpm --filter PGCD-server --prod --legacy deploy ./isolated/

FROM base AS deploy
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/isolated/node_modules/ ./node_modules/
COPY --from=build /app/isolated/dist/ ./dist/
COPY --from=build /app/isolated/prisma/ ./prisma/
# COPY --from=build /app/isolated/.env ./
COPY --from=build /app/isolated/dictionaries/ ./dictionaries/
CMD ["node", "dist/main.js"]


FROM base AS migrations
WORKDIR /app
COPY --from=build /app/isolated/prisma/ ./apps/server/prisma/
COPY --from=build /app/isolated/package.json ./apps/server
COPY --from=build /app/isolated/prisma.config.* ./apps/server/
COPY --from=dependencies /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile
CMD ["pnpm", "--filter", "PGCD-server",  "prisma:deploy"]

# docker run --env-file .env.docker -p 3000:3000 --name nest-app-container nestjs-app-image
# docker run -it --entrypoint bash nestjs-app-image
# docker build -t nestjs-app-image .

