# DEVELOPMENT STAGE
# Separate dev stage allows hot-reloading and fast iteration

FROM node:20-alpine AS development
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5173

# --host 0.0.0.0 makes Vite accessible outside container, Without this we can't access from host machine
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# BUILD STAGE

FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# vite build compiles TypeScript and bundles for production and Creates optimized, minified static files in dist/
RUN npm run build

# PRODUCTION STAGE

FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port 80 is standard HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]