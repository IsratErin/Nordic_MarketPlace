# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install all dependencies (needed to build TS)
COPY package*.json ./
RUN npm ci 

# Copy the rest of the application source code
COPY . .

# Build time database url for Prisma
ARG DATABASE_URL 
ENV DATABASE_URL=${DATABASE_URL}

# Generate Prisma client (required for DB access)
RUN npx prisma generate

# Compile TypeScript to dist/
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Set environment variables for production
ENV NODE_ENV=production

# Install ONLY production dependencies
RUN npm ci --omit=dev

# Copy runtime needs from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/src ./src



# Expose backend port 
EXPOSE 3000

# Healthcheck for container orchestration (optional)
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Run compiled JavaScript
CMD ["node", "dist/server.js"]

