-> API
-> DB
-> Docker
-> rabbitmq
-> worker

# Orders Service

The aim of the project is to create an order API that will handle order requests send by a customer.
The customer will be able to send an order resquest, to get all orders and to get a specified order.

The process of creating can take a while, we can imagine that we need to send the order to a third party to validate it, or send an email to the customer to confirm the order. All of this process can take a while and we don't want to wait for the response of the third party to send the response to the customer. So we will use a worker to handle the process of creating an order and send the response to the customer. To handle the queue of the worker we will use rabbitmq.

# Run the project

To run the project you will need [docker](https://docs.docker.com/engine/) on your computer.
You have to run the following command to run the project:

```bash
docker-compose build
docker-compose up
```

If the rabbitmq container is not up when the worker container is up, the worker and the api will not be able to connect to the rabbitmq container.
To fix the porblem we have put a sleep of 10 seconds in the index.ts file of the worker and of the api. You can change the time of the sleep if you want.

# Architecture

The project is composed of 4 containers:

- **api** a nodejs container that will handle the requests of the customer using express
- **worker** a nodejs container that will handle the queue of rabbitmq
- **rabbitmq** a rabbitmq container
- **mongo** a mongoDB container

When the customer send a post request to the api, the api will save the order in the mongoDB database and send a message to the queue of rabbitmq.
The worker will consume the queue and will send the order to the third party to validate it (in our project it is only a timeout). When the worker will receive the response of the third party, it will then update the order in the mongoDB.

# API

The API is a REST API that will handle the requests of the customer. The API will be able to create an order, get all orders and get a specified order.
It is written in express and use a mongoDB database.

## Endpoints

---

### Create an order

**POST /orders**

#### BODY

```json
{
  "email": "mail@mail.com"
}
```

#### RESPONSE

```json
{
  "_id": "5f9b9c9b9c9c9c9c9c9c9c9c",
  "email": "mail@mail.com",
  "status": "pending"
}
```

---

### Get all orders

**GET /orders**

#### RESPONSE

```json
[
  {
    "_id": "5f9b9c9b9c9c9c9c9c9c9c9c",
    "email": "mail@mail.com",
    "status": "pending"
  },
  {
    "_id": "5f9b9c9b9c9c9c9c9c9c9c9c",
    "email": "mail@mail.com",
    "status": "pending"
  }
]
```

---

### Get a specified order

**GET /orders/:id**

#### RESPONSE

```json
{
  "_id": "5f9b9c9b9c9c9c9c9c9c9c9c",
  "email": "mail@mail.com",
  "status": "pending"
}
```

# Test the project

To locally test the project you can use [postman](https://www.postman.com/) or [insomnia](https://insomnia.rest/).

You can send those curl requests to test the project:

```bash
curl --location --request POST 'http://localhost:3000/orders' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"test@mail.com"
}'
```

```bash
curl --location --request GET 'http://localhost:3000/orders'
```

```bash
curl --location --request GET 'http://localhost:3000/orders/${id}'
```
