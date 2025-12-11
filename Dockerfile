FROM oven/bun:1.3.4

WORKDIR /usr/src/app

COPY package.json bun.lockb* ./

RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev"]
