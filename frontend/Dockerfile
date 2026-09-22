# Build
FROM node:20-slim AS build

# Copy source
WORKDIR /app
COPY . ./

# Install dependencies and build
RUN npm install
RUN npm run build

# Deploy using Caddy to host static files
FROM caddy:2.11.4-alpine

RUN apk add --no-cache ca-certificates curl

# Copy Angular build output
COPY --from=build /app/dist/nr-bcws-datamart-app-ui /srv

# Configure Caddy
COPY Caddyfile /etc/caddy/Caddyfile
RUN caddy fmt /etc/caddy/Caddyfile

# Boilerplate
EXPOSE 3000 3001

HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3001/health

# Non-root user
USER 1001