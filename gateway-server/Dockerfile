FROM node:lts-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --silent # Install all dependencies
COPY . .
RUN npx prisma generate

FROM node:lts-alpine AS production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . . 
EXPOSE 3000
USER node
CMD ["npm", "start"]