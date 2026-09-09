FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

RUN apt-get update && apt-get install -y xvfb

COPY package*.json ./

RUN npm install dotenv

RUN npm install

COPY . .

CMD ["sh", "-c", "npx playwright test"]