FROM mcr.microsoft.com/playwright:v1.49.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN mkdir -p outputs

EXPOSE 3001
CMD ["node", "dist/index.js"]
