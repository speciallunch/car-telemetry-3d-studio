FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . .
# Install dependencies fresh to ensure all symlinks are correct
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm --filter @ct/db prisma:generate

# Build @ct/db package
RUN pnpm --filter @ct/db build

# Build API
RUN pnpm --filter api build


# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy the entire workspace structure to maintain pnpm workspace links
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy @ct/db package
COPY --from=builder /app/packages/db ./packages/db

# Copy API app
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

USER nestjs

EXPOSE 3000

CMD ["node", "apps/api/dist/main"]

