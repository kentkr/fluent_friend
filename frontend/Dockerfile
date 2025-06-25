# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /frontend

ARG VITE_MODE

# Install deps and build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --mode $VITE_MODE

# --- Stage 2: Serve with Caddy (tiny final image) ---
FROM caddy:2.7.6-alpine

# Copy built files
COPY --from=builder /frontend/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile

# Expose default Caddy HTTP port
EXPOSE 80

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
