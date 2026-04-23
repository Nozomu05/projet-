# ── Stage 1: install production dependencies ─────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# ── Stage 2: final image ──────────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY package*.json ./
RUN mkdir -p uploads && chown node:node uploads
EXPOSE 3000
USER node
CMD ["node", "src/index.js"]
