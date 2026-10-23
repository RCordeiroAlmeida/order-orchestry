# 🚀 Order Orchestrator (Backend API)

<p align="left">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
  <img src="https://img.shields.io/badge/BullMQ-FF1E1E?style=for-the-badge&logo=bullmq&logoColor=white" alt="BullMQ">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
</p>

API developed in NestJS and TypeScript for a `senior backend developer` test.
Purpose: order orchestration, designed with a focus on resilience, data consistency, duplicate prevention (idempotency), external data enrichment, and support for asynchronous processing.

Test URL: https://github.com/buzzmates/desafio-backend-pleno

---

## 🛠️ Technologies Used

* **NestJS** (Progressive Node.js framework)
* **TypeScript** (ES Modules)
* **TypeORM** (ORM for data persistence)
* **SQLite** (Lightweight file-based relational database)
* **Class-Validator / Class-Transformer** (Strict DTO validation)
* **Bull & Redis** (Queue management and asynchronous processing)
* **Docker** (Containerization for Redis server)

---

## 📋 Architecture and Design Decisions

1. **Strict Idempotency:**
   The system validates unique transaction keys (`idempotency_key` and `order_id`) before persisting new records. If a webhook is triggered multiple times by the source platform, the API identifies the pre-existing record and prevents duplicates or unwanted side effects.

2. **Asynchronous Processing, Retry Strategy & DLQ (Dead Letter Queue):**
   * **Message Queues:** Incoming orders are queued instantly via Bull and processed asynchronously by dedicated workers.
   * **Automatic Retry with Exponential Backoff:** If external integrations (such as currency conversion services) fail, the worker automatically re-enqueues the job up to 3 attempts, applying an exponential backoff delay between retries.
   * **Dead Letter Queue (DLQ / Failure Handling):** If all retry attempts are exhausted, the system catches the definitive failure, updates the order status to `FAILED_ENRICHMENT`, and prevents further erroneous loops while keeping an audit trail.

3. **External Data Enrichment:**
   During asynchronous processing, the worker queries an external exchange rate API (AwesomeAPI) to calculate and convert the order's total amount into BRL, saving both the exchange rate (`exchange_rate`) and the final converted amount (`converted_amount`).

4. **Relational Data Modeling (TypeORM):**
   * `orders` table: Stores the order header, customer data, currency, exchange rates, total amounts, and lifecycle status.
   * `order_items` table: Stores individual items linked via a foreign key (`@ManyToOne` with cascade deletion).

---

## ⚙️ Prerequisites and Installation

### Prerequisites

* **Node.js** (Version 18.x or higher recommended)
* **Docker** (Required to run the Redis server)
* **npm** (Standard package manager)

---

### 🐳 Running Redis via Docker

To run the messaging broker locally, spin up a Redis container using the following command in your terminal:

```bash
docker run -d --name redis-orquestrador -p 6379:6379 redis:alpine
```

To verify that the container is running properly:
```bash
docker ps
```

---

### Local Setup Steps

1. **Navigate to the project folder:**
   ```bash
   cd orquestrador-pedidos
   ```

2. **Install the project dependencies:**
   ```bash
   npm install
   ```

3. **Start the application in development mode (with hot reload):**
   ```bash
   npm run start:dev
   ```

The application will be available by default at: `http://localhost:3000`

---

## 📌 Usage Guide and API Endpoints

### 1. Receive Order Webhook (Create Order)
Endpoint responsible for receiving data from a new external order, validating business rules, calculating totals, and ensuring idempotency.

* **Method:** `POST`
* **Route:** `/webhooks/orders`
* **Headers:** `Content-Type: application/json`

**Example Payload (JSON):**
```json
{
  "order_id": "ext-123",
  "customer": {
    "name": "Ana Silva",
    "email": "ana@example.com"
  },
  "items": [
    {
      "sku": "SKU-PROD-01",
      "qty": 2,
      "unit_price": 50.00
    }
  ],
  "currency": "USD",
  "idempotency_key": "uuid-or-hash-123"
}
```

**Example usage via Httpie:**
```bash
http POST localhost:3000/webhooks/orders \
  order_id="ext-123" \
  customer:='{"name": "Ana Silva", "email": "ana@example.com"}' \
  items:='[{"sku": "SKU-PROD-01", "qty": 2, "unit_price": 50.00}]' \
  currency="USD" \
  idempotency_key="uuid-or-hash-123"
```

---

### 2. List All Orders
Allows listing all orders saved in the database, with optional filters by status.

* **Method:** `GET`
* **Route:** `/orders`
* **Optional Query Params:** `?status=RECEIVED`

**Example usage via Httpie:**
```bash
http GET localhost:3000/orders
```

---

### 3. Retrieve a Specific Order by ID
Returns the full details of a specific order, including exchange rates, converted values, and all associated items.

* **Method:** `GET`
* **Route:** `/orders/:id`

**Example usage via Httpie:**
```bash
http GET localhost:3000/orders/ext-123
```

---

### 4. Queue Metrics & Monitoring
Retrieves active queue metrics (waiting, active, completed, failed counts).

* **Method:** `GET`
* **Route:** `/queue/metrics`

---

## 🔄 Order Lifecycle

Orders move through the following operational states within the orchestrator:

1. **`RECEIVED`**: The order arrived via webhook, passed structural validation, was checked for idempotency, and was successfully stored in the database.

2. **`PROCESSING`**: The order was picked up by the asynchronous worker for external data enrichment and currency conversion.

3. **`COMPLETED`**: The asynchronous processing and external enrichment completed successfully.

4. **`FAILED_ENRICHMENT`**: Critical failures occurred after exhausting all 3 retry/backoff attempts, moving the job into the failure handling / Dead Letter Queue state for auditing.

---

## 🛠️ Troubleshooting

* **Redis Connection Error:** Ensure that your Docker container is up and running (`docker start redis-orquestrador`) and listening on port `6379`.
* **Database Reset:** If you need to clear the SQLite database, simply delete the `database.sqlite` file in the root directory, and TypeORM will regenerate it cleanly on startup.

## 👨‍💻 Author

Developed by **Rafael Cordeiro de Almeida dos Santos**.<br>

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rafael-cordeiro-de-almeida-dos-santos/)