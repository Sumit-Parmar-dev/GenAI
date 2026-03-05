# Base stage for dependencies
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Build stage (if needed, e.g., for TS or Prisma)
FROM base AS build
COPY . .
RUN npx prisma generate

# Production stage
FROM node:20-alpine AS release
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/src ./src
COPY --from=build /app/prisma ./prisma

EXPOSE 5000
CMD ["npm", "start"]
