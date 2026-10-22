# 🚀 Orquestrador de Pedidos (Backend API)

<p align="left">

  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">

  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">

  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">

  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">

  <img src="https://img.shields.io/badge/BullMQ-FF1E1E?style=for-the-badge&logo=bullmq&logoColor=white" alt="BullMQ">

  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">

</p>

API desenvolvida em NestJS e TypeScript para um teste de `desenvolvedor backend pleno`.
Propósito: orquestração de pedidos, projetada com foco em resiliência, consistência de dados, prevenção de duplicidade (idempotência) e suporte a processamento assíncrono.

URL do teste: https://github.com/buzzmates/desafio-backend-pleno

---

## 🛠️ Tecnologias Utilizadas

* **NestJS** (Framework Node.js progressivo)
* **TypeScript** (ES Modules)
* **TypeORM** (ORM para persistência de dados)
* **SQLite** (Banco de dados relacional leve baseado em arquivo)
* **Class-Validator / Class-Transformer** (Validação rigorosa de DTOs)
* **BullMQ & Redis** (Gerenciamento de filas e processamento assíncrono)

---

## 📋 Arquitetura e Decisões de Design

1. **Idempotência Rigorosa:** 

   O sistema valida chaves únicas de transação (`idempotency_key` e `order_id`) antes de persistir novos registros. Caso um webhook seja disparado múltiplas vezes pela plataforma de origem, a API identifica o registro pré-existente e evita duplicações ou efeitos colaterais indesejados.



2. **Modelagem de Dados Relacional (TypeORM):**

   * Tabela `orders`: Armazena o cabeçalho do pedido, dados do cliente, moeda, valor total e status do ciclo de vida.

   * Tabela `order_items`: Armazena os itens individuais vinculados via chave estrangeira (`@ManyToOne` com exclusão em cascata).

   * Utilização de SQLite para persistência leve em arquivo (`database.sqlite`), ideal para ambientes locais e homologação rápida.



3. **Validação de Entrada:**

   Implementação de DTOs fortemente tipados utilizando `class-validator` e `class-transformer` na camada de borda (Controllers), garantindo que payloads malformados ou incompletos sejam rejeitados instantaneamente com `400 Bad Request`.

---



## ⚙️ Pré-requisitos e Instalação

### Pré-requisitos

* **Node.js** (Versão 18.x ou superior recomendada)

* **npm** (Gerenciador de pacotes padrão)


### Passo a Passo para Configuração Local

1. **Navegue até a pasta do projeto:**

   ```bash

   cd orquestrador-pedidos

   ```

2. **Instale as dependências do projeto:**

   ```bash

   npm install

   ```

3. **Inicie a aplicação em modo de desenvolvimento (com hot-reload):**

   ```bash

   npm run start:dev

   ```

A aplicação estará acessível por padrão em: `http://localhost:3000`

---

## 📌 Guia de Uso e Endpoints da API



### 1. Receber Webhook de Pedido (Criar Pedido)

Endpoint responsável por recepcionar os dados de um novo pedido externo, validar regras de negócio, calcular totais e garantir a idempotência.



* **Método:** `POST`

* **Rota:** `/webhooks/orders`

* **Headers:** `Content-Type: application/json`


**Payload de Exemplo (JSON):**

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

**Exemplo de uso via Httpie:**

```bash

http POST localhost:3000/webhooks/orders \

  order_id="ext-123" \

  customer:='{"name": "Ana Silva", "email": "ana@example.com"}' \

  items:='[{"sku": "SKU-PROD-01", "qty": 2, "unit_price": 50.00}]' \

  currency="USD" \

  idempotency_key="uuid-or-hash-123"

```
---



### 2. Listar Todos os Pedidos

Permite a listagem geral dos pedidos salvos na base de dados, com suporte a filtros opcionais por status.



* **Método:** `GET`

* **Rota:** `/orders`

* **Query Params Opcionais:** `?status=RECEIVED`



**Exemplo de uso via Httpie:**

```bash

http GET localhost:3000/orders

```

---


### 3. Consultar Pedido Específico por ID

Retorna os detalhes completos de um pedido específico, incluindo o relacionamento populado com todos os itens associados.

* **Método:** `GET`

* **Rota:** `/orders/:id`

* *Nota: Aceita tanto o UUID interno gerado pelo banco quanto o `order_id` externo.*



**Exemplo de uso via Httpie:**

```bash

http GET localhost:3000/orders/ext-123

```

---

## 🔄 Ciclo de Vida dos Pedidos

Os pedidos transitam pelos seguintes estados operacionais dentro do orquestrador:

1. **`RECEIVED`**: O pedido chegou via webhook, passou pelas validações estruturais, foi verificado quanto à idempotência e gravado com sucesso no banco de dados.

2. **`PROCESSING`**: O pedido foi capturado pelo worker de mensageria para envio ou processamento integrado com serviços externos.

3. **`COMPLETED`**: O fluxo assíncrono externo foi finalizado com sucesso.

4. **`FAILED`**: Ocorreram falhas críticas após esgotar as tentativas de reprocessamento (Retry/Backoff).

---

## 🛠️ Solução de Problemas (Troubleshooting)


* **Erro 500 (EntityMetadataNotFoundError):** Certifique-se de que o arquivo `app.module.ts` possui a propriedade `autoLoadEntities: true` configurada no `TypeOrmModule.forRoot` e que as entidades estão devidamente injetadas via `TypeOrmModule.forFeature` no módulo correspondente.

* **Conflito de Portas:** Se a porta `3000` estiver em uso por outro processo corporativo, altere a porta de execução no arquivo `src/main.ts` através do método `app.listen(PORTA)`.

## 👨‍💻 Autor

Desenvolvido por **Rafael Cordeiro de Almeida dos Santos**.<br>

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rafael-cordeiro-de-almeida-dos-santos/)



