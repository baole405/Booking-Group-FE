# ===========================================
# 🐳 MULTI-STAGE DOCKER BUILD
# ===========================================
# Enterprise-grade Docker setup with Doppler integration

# Stage 1: Base Dependencies
FROM node:20-alpine AS base
WORKDIR /app

# Install Doppler CLI for secrets management
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub \
  && echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories \
  && apk add doppler

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Stage 2: Dependencies Installation
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/fe-react-web/package.json ./apps/fe-react-web/
COPY apps/mock/package.json ./apps/mock/

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile --production=false

# Stage 3: Build with Doppler Secrets
FROM deps AS builder
ARG DOPPLER_TOKEN
ENV DOPPLER_TOKEN=$DOPPLER_TOKEN

# Copy source code
COPY . .

# Build with Doppler environment injection
RUN echo "Building with Doppler secrets..." \
  && doppler run --token="$DOPPLER_TOKEN" -- pnpm nx build fe-react-web --prod

# Stage 4: Production Runtime
FROM nginx:alpine AS production

# Copy built files
COPY --from=builder /app/dist/apps/fe-react-web /usr/share/nginx/html

# Copy optimized nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Security: Run as non-root user
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nextjs -u 1001 \
  && chown -R nextjs:nodejs /usr/share/nginx/html

USER nextjs

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
