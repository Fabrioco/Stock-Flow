# StockFlow API

Backend de estudo, no formato de um marketplace reduzido: vendedores cadastram produtos, compradores fazem pedidos, e o projeto existe para treinar **controle de concorrência em estoque**, filas, autenticação, testes, Docker e observabilidade — os pilares mais cobrados em vagas fullstack júnior/pleno no Brasil.

Só backend. Sem frontend, sem tempo real, sem multi-tenant — de propósito, para manter o escopo pequeno e terminável.

## O problema central

> Dois `POST /orders` chegam ao mesmo milissegundo para o último produto em estoque. Sem tratamento, os dois passam e o estoque fica negativo.

Resolver isso — com lock pessimista (`SELECT FOR UPDATE`) ou controle otimista (campo `version`) — é o núcleo do aprendizado deste projeto.

## Stack

- **API:** NestJS, TypeScript, Prisma 8 (ORM em contrato, PSL), PostgreSQL
- **Cache/Filas:** Redis, BullMQ
- **Auth:** JWT (access + refresh token), Argon2
- **Testes:** Vitest (unitário/integração), Playwright (E2E)
- **Observabilidade:** Pino, Sentry
- **Infra:** Docker Compose, GitHub Actions

## Estrutura

```
stockflow/
├── apps/
│   └── api/          # NestJS: auth, products, orders
├── docker-compose.yml # Postgres + Redis
├── .env.example
└── package.json       # npm workspaces
```

Monorepo com **npm Workspaces**: um `node_modules` e um `package-lock.json` na raiz, cobrindo `apps/*`.

## Como rodar

### 1. Subir a infraestrutura
```bash
docker compose up -d
docker compose ps   # os dois devem aparecer "healthy"
```

### 2. Instalar dependências (na raiz)
```bash
npm install
```

### 3. Configurar o ambiente
```bash
cp .env.example apps/api/.env
```
Edite `apps/api/.env` se necessário. Valor padrão, combinando com o `docker-compose.yml`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/stockflow"
REDIS_HOST="localhost"
REDIS_PORT="6379"
```

### 4. Aplicar o contrato do Prisma ao banco
```bash
cd apps/api
npx prisma contract emit
npx prisma db init
npx prisma db verify
```

### 5. Rodar a API
```bash
npm run start:dev -w apps/api
```

## Comandos úteis

| Comando | O que faz |
|---|---|
| `npm run start:dev -w apps/api` | Sobe a API em modo watch |
| `npx vitest run` (dentro de `apps/api`) | Roda os testes unitários/integração |
| `npx playwright test` (dentro de `apps/api`) | Roda os testes E2E |
| `npx prisma migration plan` | Gera uma migração ao mudar o contrato |
| `npx prisma db migrate --yes` | Aplica as migrações pendentes |
| `docker exec -it stockflow-postgres psql -U postgres -d stockflow` | Abre o psql interativo |

## Modelo de dados

`User` (BUYER/SELLER) → `Product` → `Order` → `OrderItem`. Contrato completo em `apps/api/src/prisma/contract.prisma`.

## Rotas

```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh

POST   /products              (role SELLER)
GET    /products
GET    /products/:id
PATCH  /products/:id           (role SELLER, dono do produto)

POST   /orders                 ← onde mora o problema de concorrência
GET    /orders/me
GET    /orders/:id
POST   /orders/:id/cancel
```

## Arquitetura

Mesmo padrão do projeto LiveOps: camadas **domain → application → infrastructure → presentation**, com Repository Pattern e injeção de dependência. O domínio não conhece Nest nem Prisma.

## Decisões em aberto

- [ ] Lock pessimista (`SELECT FOR UPDATE`) ou controle otimista (`version`) para o estoque
- [ ] Endereço/entrega ainda não modelado

## Roadmap de estudo

1. Setup + Auth
2. Products (com cache no `GET /products`)
3. **Orders com concorrência** — o núcleo do projeto
4. Filas: e-mail de confirmação + expiração de pedido não pago (15 min)
5. Testes: unitário no caso de uso de concorrência, E2E no fluxo completo
6. Docker, CI/CD, observabilidade